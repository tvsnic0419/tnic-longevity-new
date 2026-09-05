import Link from 'next/link';
import { compoundModules } from '@/lib/library-modules';
import { evidenceTagDefinitions } from '@/lib/trust';
import type { EvidenceTier } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// EvidenceTierSpectrum — an "evidence landscape" glance for the library hub.
// A proportional segmented bar showing how the graded compound library breaks
// down across Tier A / B / C, so a first-time visitor sees the shape of the
// evidence base (mostly emerging, a solid clinical core, a small preclinical
// tail) before scrolling a single card.
//
// REAL DATA ONLY — counts are derived live from `compoundModules` (the same
// population COMPOUND_COUNT reports and the hero stat rail shows), so the
// segments always sum to the published compound count and can never drift.
// Tier labels/colors come from the canonical `evidenceTagDefinitions`.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT: Record<string, string> = {
  emerald: 'var(--accent-emerald)',
  cyan: 'var(--accent-cyan)',
  amber: 'var(--accent-amber)',
  violet: 'var(--accent-violet)',
  rose: 'var(--accent-rose)',
};

const ORDER: EvidenceTier[] = ['A', 'B', 'C'];

export function EvidenceTierSpectrum() {
  const total = compoundModules.length;
  const tiers = ORDER.map((tier) => {
    const def = evidenceTagDefinitions[tier];
    const count = compoundModules.filter((m) => m.evidenceTier === tier).length;
    return {
      tier,
      count,
      pct: total ? (count / total) * 100 : 0,
      short: def.short,
      description: def.description,
      color: ACCENT[def.color] ?? 'var(--accent-cyan)',
    };
  }).filter((t) => t.count > 0);

  if (total === 0) return null;

  return (
    <section
      className="premium-card p-5 sm:p-7"
      style={{ ['--card-accent' as string]: 'var(--accent-emerald)' }}
      aria-label={`Evidence landscape: ${total} graded compounds — ${tiers
        .map((t) => `${t.count} Tier ${t.tier}`)
        .join(', ')}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-label text-[var(--color-text-faint)]">Evidence landscape</p>
          <h2 className="heading-card mt-1 text-foreground">
            {total} compounds, graded by evidence strength
          </h2>
        </div>
        <Link
          href="/trust/methodology"
          className="focus-ring text-micro font-mono text-[var(--accent-cyan)] hover:underline"
        >
          How we grade →
        </Link>
      </div>

      {/* Proportional stacked spectrum bar */}
      <div
        className="mt-5 flex h-9 w-full overflow-hidden rounded-xl bg-[var(--color-bg-muted)]"
        role="presentation"
      >
        {tiers.map((t) => (
          <div
            key={t.tier}
            className="flex items-center justify-center overflow-hidden"
            style={{
              width: `${t.pct}%`,
              background: `color-mix(in srgb, ${t.color} 22%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t.color} 45%, transparent)`,
            }}
          >
            <span
              className="font-mono text-micro font-semibold tabular-nums"
              style={{ color: t.color }}
            >
              {t.pct >= 9 ? `${t.tier} · ${t.count}` : t.tier}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.tier} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }}
            />
            <div>
              <dt className="text-body-sm font-semibold" style={{ color: t.color }}>
                Tier {t.tier} · {t.short}
                <span className="ml-1.5 font-mono text-micro font-normal text-[var(--color-text-faint)]">
                  {t.count}
                </span>
              </dt>
              <dd className="mt-0.5 text-micro leading-relaxed text-[var(--color-text-muted)]">
                {t.description}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
