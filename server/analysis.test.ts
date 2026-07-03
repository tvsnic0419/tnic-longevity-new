import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "## Synergy Analysis\n\nNMN and Resveratrol work together to activate sirtuins...\n\n## Potential Interactions\n\nNo significant negative interactions.\n\n## Pathway Coverage\n\nCovers 4 of 12 hallmarks.",
        },
      },
    ],
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("analysis.analyzeStack", () => {
  it("returns an analysis string for valid supplement IDs", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analysis.analyzeStack({
      supplementIds: ["nmn", "resveratrol"],
    });

    expect(result).toHaveProperty("analysis");
    expect(typeof result.analysis).toBe("string");
    expect(result.analysis.length).toBeGreaterThan(0);
  });

  it("throws an error for fewer than 2 supplements", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.analysis.analyzeStack({ supplementIds: ["nmn"] })
    ).rejects.toThrow();
  });

  it("handles empty supplement IDs gracefully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.analysis.analyzeStack({ supplementIds: [] })
    ).rejects.toThrow();
  });
});
