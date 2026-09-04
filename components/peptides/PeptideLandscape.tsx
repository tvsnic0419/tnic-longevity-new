import { peptideLibrary } from '@/lib/peptides-library';
import { getPeptideLegalStatusMeta } from '@/components/peptides/PeptideLegalBadge';
import type { PeptideLegalStatus, EvidenceTier } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// PeptideLandscape — an at-a-glance orientation panel for the peptides hub.
// Peptides are the category where legal status matters most, so the hub should
// state that landscape plainly before a single card: how the library splits by
// legal status, and by evidence tier. Derived entirely from `peptideLibrary`;
// legal labels/colors reuse the canonical PeptideLegalBadge metadata. No claim
// is added — it only aggregates what each card already declares. Server-safe.
// ─────────────────────────────────────────────────────────────────────────────

const LEGAL_ORDER: PeptideLegalStatus[] = [
  'fda-approved-rx',
  'compounding-restricted',
  'research-use-only',
];

const LEGAL_ACCENT: Record<PeptideLegalStatus, string> = {
  'fda-approved-rx': 'var(--accent-emerald)',
  'compounding-restricted': 'var(--accent-rose)',
  'research-use-only': 'var(--accent-amber)',
};

const TIER_ACCENT: Record<EvidenceTier, string> = {
  A: 'var(--accent-emerald)',
  B: 'var(--accent-cyan)',
  C: 'var(--accent-amber)',
};

export function PeptideLandscape({ className = '' }: { className?: string }) {
  const total = peptideLibrary.length;
  if (total === 0) return null;

  const legal = LEGAL_ORDER.map((status) => ({
    status,
    count: peptideLibrary.filter((p) => p.legalStatus === status).length,
    short: getPeptideLegalStatusMeta(status).short,
    color: LEGAL_ACCENT[status],
  })).filter((l) => l.count > 0);

  const tiers = (['A', 'B', 'C'] as EvidenceTier[])
    .map((tier) => ({
      tier,
      count: peptideLibrary.filter((p) => p.evidenceTier === tier).length,
      color: TIER_ACCENT[tier],
    }))
    .filter((t) => t.count > 0);

  return (
    <section
      className={`premium-card p-5 sm:p-7 ${className}`}
      style={{ ['--card-accent' as string]: 'var(--accent-amber)' }}
      aria-label={`Peptide landscape: ${total} peptides — ${legal
        .map((l) => `${l.count} ${l.short}`)
        .join(', ')}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-label text-[var(--color-text-faint)]">The peptide landscape</p>
          <h2 className="heading-card mt-1 text-foreground">
            {total} peptides, labeled plainly by legal status
          </h2>
        </div>
        <p className="max-w-xs text-micro leading-relaxed text-[var(--color-text-muted)]">
          Legal status is the first thing that matters here — stated up front, not buried.
        </p>
      </div>

      {/* Legal-status segmented bar */}
      <div className="mt-5 flex h-9 w-full overflow-hidden rounded-xl bg-[var(--color-bg-muted)]" role="presentation">
        {legal.map((l) => (
          <div
            key={l.status}
            className="flex items-center justify-center overflow-hidden"
            style={{
              width: `${(l.count / total) * 100}%`,
              background: `color-mix(in srgb, ${l.color} 22%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${l.color} 45%, transparent)`,
            }}
            title={`${l.short}: ${l.count}`}
          >
            <span className="font-mono text-micro font-semibold tabular-nums" style={{ color: l.color }}>
              {l.count}
            </span>
          </div>
        ))}
      </div>

      {/* Legal legend + tier split */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {legal.map((l) => (
            <li key={l.status} className="flex items-center gap-1.5 text-body-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}` }} />
              <span className="text-[var(--color-text-secondary)]">{l.short}</span>
              <span className="font-mono font-semibold" style={{ color: l.color }}>{l.count}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <span className="text-label text-[var(--color-text-faint)]">Evidence</span>
          {tiers.map((t) => (
            <span
              key={t.tier}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-micro font-semibold"
              style={{ color: t.color, borderColor: `color-mix(in srgb, ${t.color} 35%, transparent)` }}
            >
              {t.tier}<span className="text-[var(--color-text-faint)]">·</span>{t.count}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
