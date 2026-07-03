import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { SUPPLEMENTS, AGING_HALLMARKS, SYNERGY_PAIRS } from "@shared/supplements";
import { getDb } from "./db";
import { waitlist } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  supplements: router({
    list: publicProcedure.query(() => {
      return SUPPLEMENTS;
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => {
        return SUPPLEMENTS.find((s) => s.slug === input.slug) || null;
      }),
  }),

  pathways: router({
    list: publicProcedure.query(() => {
      return AGING_HALLMARKS;
    }),
  }),

  synergies: router({
    list: publicProcedure.query(() => {
      return SYNERGY_PAIRS;
    }),
  }),

  waitlist: router({
    join: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }
        try {
          await db.insert(waitlist).values({ email: input.email });
          return { success: true, message: "You're on the list. We'll notify you when the feature launches." };
        } catch (err: any) {
          if (err?.code === "ER_DUP_ENTRY") {
            return { success: true, message: "You're already on the list. We'll notify you when the feature launches." };
          }
          throw err;
        }
      }),
  }),

  analysis: router({
    analyzeStack: publicProcedure
      .input(z.object({ supplementIds: z.array(z.string()).min(2).max(15) }))
      .mutation(async ({ input }) => {
        const selected = SUPPLEMENTS.filter((s) => input.supplementIds.includes(s.id));
        
        if (selected.length < 2) {
          throw new Error("Please select at least 2 supplements");
        }

        // Build context about the selected supplements
        const supplementContext = selected.map((s) => {
          const hallmarks = AGING_HALLMARKS.filter((h) => h.supplements.includes(s.id));
          return `- ${s.name} (Tier ${s.tier}): ${s.mechanism} | Targets: ${s.primaryTarget} | Pathways: ${s.pathways.join(", ")} | Hallmarks: ${hallmarks.map(h => h.name).join(", ")}`;
        }).join("\n");

        // Find relevant synergies
        const relevantSynergies = SYNERGY_PAIRS.filter((sp) =>
          sp.compounds.some((c) =>
            selected.some((s) => s.name.includes(c) || s.synergies.some((syn) => c.includes(syn)))
          )
        );

        const synergyContext = relevantSynergies.length > 0
          ? relevantSynergies.map((sp) => `- ${sp.compounds.join(" + ")}: ${sp.reason} (${sp.pathway})`).join("\n")
          : "No pre-mapped synergies found for this exact combination.";

        // Calculate pathway coverage
        const coveredHallmarks = new Set<string>();
        selected.forEach((s) => {
          AGING_HALLMARKS.forEach((h) => {
            if (h.supplements.includes(s.id)) {
              coveredHallmarks.add(h.name);
            }
          });
        });

        const systemPrompt = `You are a longevity science expert analyzing supplement stacks. You provide evidence-based analysis grounded in published research. You are direct, scientific, and avoid marketing language. Structure your response with clear markdown headings.`;

        const userPrompt = `Analyze this supplement stack for a user interested in longevity and anti-aging:

## Selected Supplements:
${supplementContext}

## Known Synergies in This Stack:
${synergyContext}

## Aging Hallmark Coverage:
This stack covers ${coveredHallmarks.size} of 12 hallmarks: ${Array.from(coveredHallmarks).join(", ")}
Uncovered hallmarks: ${AGING_HALLMARKS.filter(h => !coveredHallmarks.has(h.name)).map(h => h.name).join(", ") || "None — full coverage"}

Please provide:
1. **Synergy Analysis** — How these compounds interact and amplify each other's effects
2. **Potential Interactions & Warnings** — Any timing conflicts, absorption competition, or contraindications
3. **Pathway Coverage Assessment** — How well this stack addresses the hallmarks of aging, and any gaps
4. **Optimization Suggestions** — 1-2 compounds that could fill gaps or strengthen the stack
5. **Timing Protocol** — Suggested daily timing for optimal absorption and synergy

Keep the analysis concise, evidence-based, and actionable. Cite specific mechanisms, not vague claims.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const analysis: string = typeof rawContent === "string" ? rawContent : "Analysis could not be generated. Please try again.";

        return { analysis };
      }),
  }),
});

export type AppRouter = typeof appRouter;
