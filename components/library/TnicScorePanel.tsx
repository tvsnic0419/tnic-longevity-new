'use client';

import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';
import { LongevityGaugeArc } from '@/components/ui/LongevityGaugeArc';
import { computeTnicScore, scoreBand, type TnicScoreConfidence } from '@/lib/tnic-score';
import type { CSSProperties } from 'react';

// Canonical evidence-tier accent (A=emerald / B=cyan / C=amber — the mapping
// Mani unified sitewide). The score arc + card accent borrow it so the panel
// reads in the same colour language as the EvidenceBadge beside it.
const TIER_ACCENT: Record<'A' | 'B' | 'C', string> = {
  A: 'var(--tier-a)',
  B: 'var(--tier-b)',
  C: 'var(--tier-c)',
    D: 'var(--tier-d)',
};

const CONFIDENCE_META: Record<TnicScoreConfidence, { label: string; note: string }> = {
  high: { label: 'High confidence', note: 'Derived from the richest source (the LQ model).' },
  moderate: { label: 'Moderate confidence', note: 'Derived from the Compound Engine dataset.' },
  limited: { label: 'Limited data', note: 'Derived from the canonical library entry only.' },
};

/**
 * TNiC Score panel — surfaces the deterministic 0–100 composite from
 * `lib/tnic-score.ts` (previously computed but never rendered anywhere). Shows
 * the headline arc, the evidence tier, a data-completeness confidence flag, and
 * the transparent per-dimension breakdown with a methodology disclosure.
 *
 * Honesty invariant (per NOTES-COMPOUND-LIBRARY.md): `confidence` describes data
 * completeness, not clinical certainty, and the whole panel renders nothing when
 * no source can score the compound — a score is never fabricated to fill space.
 */
export function TnicScorePanel({ compoundId }: { compoundId: string }) {
  const [open, setOpen] = useState(false);
  const s = computeTnicScore(compoundId);
  if (s.score === null) return null;

  const accent = s.tier ? TIER_ACCENT[s.tier] : 'var(--accent-cyan)';
  const band = scoreBand(s.score);
  const bandLabel = band ? band.charAt(0).toUpperCase() + band.slice(1) : null;
  const conf = CONFIDENCE_META[s.confidence];
  const scored = s.dimensions.filter((d) => d.value !== null);

  return (
    <section
      className="premium-card p-6"
      style={{ ['--card-accent' as string]: accent } as CSSProperties}
      aria-label={`TNiC Score for ${s.compoundName}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-micro font-mono uppercase tracking-widest" style={{ color: accent }}>
          TNiC Score
        </p>
        {/* Confidence carries a text label + shape, never colour alone. */}
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-micro font-semibold"
          style={{
            color: accent,
            borderColor: `color-mix(in srgb, ${accent} 32%, transparent)`,
            background: `color-mix(in srgb, ${accent} 8%, transparent)`,
          }}
          title={conf.note}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
          {conf.label}
        </span>
      </div>

      <div className="mx-auto mt-2 max-w-[220px]" style={{ color: accent }}>
        <LongevityGaugeArc
          score={s.score}
          color={accent}
          label="TNiC SCORE"
          sublabel={bandLabel ? `${bandLabel} · ${s.tier ? `Tier ${s.tier}` : 'Ungraded'}` : undefined}
          size={200}
        />
      </div>

      {/* Transparent per-dimension breakdown — the same six dimensions on every
          scorecard; only those the source can actually support are shown. */}
      <div className="mt-3 space-y-2.5">
        {scored.map((d) => {
          const v = d.value as number;
          return (
            <div key={d.key}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-caption text-muted-foreground" title={d.note}>{d.label}</span>
                <span className="font-mono text-caption tabular-nums text-foreground/80">{Math.round(v)}</span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]"
                role="meter"
                aria-valuenow={Math.round(v)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${d.label}: ${Math.round(v)} out of 100`}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${v}%`, background: accent, opacity: 0.85 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Methodology disclosure — the score is derived, so its provenance is one
          click away, never hidden. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded text-micro font-medium text-muted-foreground hover:text-foreground"
        aria-expanded={open}
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
        How this is scored
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <p className="mt-2 text-caption leading-relaxed text-muted-foreground">
          {s.methodologyNote} A derived composite, not a health claim — <em>confidence</em> reflects data
          completeness, not clinical certainty.
        </p>
      )}
    </section>
  );
}
