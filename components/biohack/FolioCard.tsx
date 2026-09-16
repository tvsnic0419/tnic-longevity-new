import Link from 'next/link';
import { MONOGRAPH_TIERS, type FolioCard as FolioCardData } from '@/lib/bio-bible';

/**
 * A disclosed folio card. Border-only pills, hairline dividers, no drop shadow
 * — the editorial register, not a product tile. Every clinical string rendered
 * here is an extraction; `source` is surfaced in the markup so the provenance
 * travels with the claim rather than living only in the data file.
 */
export function FolioCard({ card }: { card: FolioCardData }) {
  const tierName = MONOGRAPH_TIERS.find((t) => t.n === card.tier)?.name ?? 'Unfiled';

  return (
    <article className="premium-card flex flex-col gap-5 p-6 break-inside-avoid sm:p-8">
      <header className="flex items-start justify-between gap-4">
        <span className="font-mono text-2xl leading-none text-text-faint tabular-nums">
          {String(card.n).padStart(2, '0')}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="text-label rounded-full border border-border-strong px-2.5 py-1 text-text-muted">
            Tier {card.tier} · {tierName}
          </span>
          <span
            className="text-label rounded-full border border-border-strong px-2.5 py-1 text-text-muted"
            aria-label={`Evidence tier ${card.evidenceTier}`}
          >
            Evidence {card.evidenceTier}
          </span>
        </div>
      </header>

      <div className="space-y-3">
        <h3 className="font-display text-[1.75rem] leading-[1.1] text-text-primary">{card.name}</h3>
        <p className="font-mono text-xs leading-relaxed tracking-wide text-text-muted">
          <span className="text-text-faint">NODE · </span>
          {card.node}
        </p>
        <p className="font-mono text-xs leading-relaxed tracking-wide text-text-muted">
          <span className="text-text-faint">DOSE · </span>
          {card.dose}
        </p>
      </div>

      <p className="text-body-sm leading-[1.65] text-text-muted">{card.mechanism}</p>

      <footer className="mt-auto space-y-4 border-t border-border-subtle pt-5">
        <p className="font-mono text-[0.625rem] leading-relaxed tracking-wide text-text-faint">
          <span className="uppercase">Provenance · </span>
          {card.source}
        </p>
        <Link
          href={`/library/compounds/${card.librarySlug}`}
          className="focus-ring link-underline inline-flex text-sm text-text-secondary"
        >
          Inspect the full evidence module →
        </Link>
      </footer>
    </article>
  );
}
