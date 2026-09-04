import Link from 'next/link';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import type { EvidenceTier } from '@/lib/types';
import {
  COMPOUND_DB,
  DEFAULT_WEIGHTS,
  HALLMARKS,
  type Tier,
  type Weights,
} from '@/lib/compound-engine-data';

/**
 * Server-rendered reference companion to the (client-only) Compound
 * Intelligence Engine.
 *
 * The engine itself is an interactive `'use client'` instrument whose
 * substantive content — the scoring model and the full curated catalog — only
 * materializes after the visitor searches, stages, and switches tabs. That
 * left the route's initial HTML thin: crawlers and answer-engines saw the hero
 * and an empty engine shell, but not *what* the engine scores or *how*. This
 * component ships all of that as plain, static, server-rendered markup below
 * the interactive tool:
 *
 *   1. the five scoring axes and their real model weights (methodology),
 *   2. the complete curated compound catalog with evidence tier + deep-dive
 *      links (discoverable content + interlink coverage), and
 *   3. an honest methodology + provenance note.
 *
 * Every value is derived from `lib/compound-engine-data` — no number, tier, or
 * claim is authored here. Compounds without a resolved library deep-dive render
 * as plain text rather than a broken link.
 */

// Faithful descriptions of what each axis represents in the scoring model.
// These describe TNiC's own rule-based instrument (methodology copy) — the
// per-compound magnitudes they weigh all live in COMPOUND_DB.
const AXIS_META: Record<keyof Weights, { label: string; description: string }> = {
  evidence: {
    label: 'Evidence',
    description:
      'Strength of human evidence behind the compound — graded A (human RCT) through C (preclinical / mechanistic).',
  },
  effect: {
    label: 'Effect',
    description:
      'Typical magnitude of the observed or modeled effect on aging-relevant outcomes.',
  },
  breadth: {
    label: 'Breadth',
    description:
      'How many of the twelve hallmarks of aging the compound plausibly acts on.',
  },
  bioavail: {
    label: 'Bioavailability',
    description:
      'How well the compound is absorbed and reaches its target at practical oral doses.',
  },
  safety: {
    label: 'Safety',
    description:
      'Tolerability and interaction profile at the doses actually studied.',
  },
};

const AXIS_ORDER: (keyof Weights)[] = ['evidence', 'effect', 'breadth', 'bioavail', 'safety'];

const HALLMARK_LABEL = new Map(HALLMARKS.map((h) => [h.id, h.label] as const));

// Engine tiers are A–D; the site-wide EvidenceTag encodes A–C. D ("theoretical
// / in-vitro") is rendered as a plain text label so nothing is misreported.
const TIER_ORDER: Tier[] = ['A', 'B', 'C', 'D'];
const TIER_HEADING: Record<Tier, string> = {
  A: 'Tier A — human RCT, strong',
  B: 'Tier B — human trials, moderate',
  C: 'Tier C — preclinical + mechanistic',
  D: 'Tier D — theoretical / in-vitro',
};
const isBadgeTier = (t: Tier): t is EvidenceTier => t === 'A' || t === 'B' || t === 'C' || t === 'D';

export function EngineReference() {
  const catalog = [...COMPOUND_DB].sort((a, b) => a.name.localeCompare(b.name));
  const byTier = TIER_ORDER.map((tier) => ({
    tier,
    items: catalog.filter((c) => c.tier === tier),
  })).filter((group) => group.items.length > 0);

  return (
    <section
      aria-labelledby="engine-reference-heading"
      className="container-page py-14 md:py-20 border-t border-border"
    >
      {/* ── Scoring model ─────────────────────────────────────────────── */}
      <header className="max-w-2xl">
        <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground mb-2">
          How the engine scores
        </p>
        <h2
          id="engine-reference-heading"
          className="font-display text-2xl md:text-3xl font-medium tracking-tight text-foreground"
        >
          The scoring model, in full
        </h2>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">
          Every compound is scored on five weighted axes, then resolved across
          the twelve hallmarks of aging. The model is rule-based and
          transparent — not generative AI. Default weights are shown below and
          are adjustable in the interactive engine above.
        </p>
      </header>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AXIS_ORDER.map((axis) => {
          const meta = AXIS_META[axis];
          const pct = Math.round(DEFAULT_WEIGHTS[axis] * 100);
          return (
            <div key={axis} className="premium-card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="font-display text-lg font-medium text-foreground">
                  {meta.label}
                </dt>
                <span className="text-sm font-mono tabular-nums text-muted-foreground">
                  {pct}% <span className="text-micro uppercase tracking-wider">weight</span>
                </span>
              </div>
              <dd className="mt-2 text-sm text-muted-foreground">{meta.description}</dd>
            </div>
          );
        })}
      </dl>

      {/* ── Curated catalog ───────────────────────────────────────────── */}
      <div className="mt-14 md:mt-20">
        <header className="max-w-2xl">
          <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground mb-2">
            Curated catalog
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-foreground">
            {catalog.length} compounds the engine scores
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            This is the engine&rsquo;s curated scoring dataset — a deliberately
            focused subset of the full evidence-graded library. Each compound
            links to its library deep-dive where one is published.
          </p>
        </header>

        <div className="mt-8 space-y-10">
          {byTier.map(({ tier, items }) => (
            <div key={tier}>
              <h3 className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                {isBadgeTier(tier) ? (
                  <EvidenceTag tier={tier} size="sm" showTooltip={false} />
                ) : (
                  <span className="text-micro font-mono uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
                    Tier D
                  </span>
                )}
                <span>{TIER_HEADING[tier]}</span>
                <span className="text-muted-foreground font-normal">({items.length})</span>
              </h3>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => {
                  const inner = (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-display text-base font-medium text-foreground">
                          {c.name}
                        </span>
                        {isBadgeTier(c.tier) && (
                          <EvidenceTag tier={c.tier} size="sm" showTooltip={false} />
                        )}
                      </div>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {c.full} · {c.cls}
                      </span>
                      {c.hallmarks.length > 0 && (
                        <span className="mt-2 block text-micro text-muted-foreground/85">
                          Acts on:{' '}
                          {c.hallmarks
                            .map((h) => HALLMARK_LABEL.get(h) ?? h)
                            .join(', ')}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={c.id}>
                      {c.libraryHref ? (
                        <Link
                          href={c.libraryHref}
                          className="premium-card focus-ring group block p-4 h-full transition-colors"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className="premium-card block p-4 h-full">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Methodology / provenance note ─────────────────────────────── */}
      <p className="mt-14 max-w-2xl text-xs text-muted-foreground">
        Curated values reflect a point-in-time evidence review and should be
        re-verified against current literature. Scores are a transparent,
        rule-based synthesis — not medical advice. Follow each compound&rsquo;s
        library deep-dive and its PubMed links for primary sources.
      </p>
    </section>
  );
}
