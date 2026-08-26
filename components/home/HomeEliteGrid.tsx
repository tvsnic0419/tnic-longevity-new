'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ChevronDown } from 'lucide-react';
import { ExternalAction } from '@/components/ui/ExternalAction';
import { eliteInterventions } from '@/lib/elite-interventions';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { evidenceTagDefinitions } from '@/lib/trust';
import { RevealItem } from '@/components/ui/RevealItem';
import { SelectableChip } from '@/components/ui/SelectableChip';

/**
 * The elite-interventions grid with a hallmark filter (section 03 of the
 * homepage). A client island so the "filter by hallmark" chips work without a
 * round-trip — but the default state is `all`, so the server-rendered HTML
 * still contains every card and every internal link (crawlers see the full
 * grid, filtering is progressive enhancement on top).
 *
 * The chip set is DERIVED from the hallmarks actually present on the elite
 * interventions — never a hardcoded list — so a chip can only appear when at
 * least one elite compound acts on that hallmark.
 */

const hallmarkLabels: Record<string, string> = {
  mito: 'Mitochondria',
  genomic: 'DNA integrity',
  epigenetic: 'Epigenetics',
  telomeres: 'Telomeres',
  proteostasis: 'Proteostasis',
  autophagy: 'Autophagy',
  senescence: 'Senescence',
  stem: 'Stem cells',
  communication: 'Cell signalling',
  inflammation: 'Inflammation',
  dysbiosis: 'Microbiome',
  nutrient: 'Nutrient sensing',
};

// Preferred chip order (mirrors the hallmark-of-aging reading order used across
// the site). Only those present on the elite set actually render.
const CHIP_ORDER = [
  'mito',
  'inflammation',
  'genomic',
  'epigenetic',
  'proteostasis',
  'senescence',
  'autophagy',
  'nutrient',
  'communication',
  'telomeres',
  'stem',
  'dysbiosis',
];

/** "Clinical" / "Emerging" / "Preclinical" — the tier's own authored descriptor. */
const tierShort = (tier: keyof typeof evidenceTagDefinitions) => evidenceTagDefinitions[tier].short;

function EliteCard({ intervention }: { intervention: (typeof eliteInterventions)[number] }) {
  const { pick, compoundName, pathway, mechanismLine, evidence, studyCount, dose, hallmarks } =
    intervention;
  const brandShort = pick.brand.split(' ')[0];

  // Mobile shows a compact preview: the decision layer (rank, tier, name,
  // mechanism, the three facts) is always on the surface, and the product
  // specifics open on one tap. Desktop renders everything, always — `sm:hidden`
  // / `sm:block` do the switching, so the server HTML still carries the full
  // card and every internal link for crawlers.
  const [open, setOpen] = useState(false);
  const detailId = `elite-detail-${intervention.compoundId}`;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card/70 to-card/25 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent-emerald/50 hover:shadow-[0_24px_70px_-24px_rgba(16,185,129,0.4)]">
      {/* top-edge light catch */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-accent-emerald/40 to-transparent opacity-70"
      />

      {/* Product image band — layered ambience: emerald glow + dot-grid + hover shine */}
      <div
        className={`relative h-44 items-center justify-center overflow-hidden border-b border-border/50 sm:flex ${open ? 'flex' : 'hidden'}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_120%,rgba(16,185,129,0.16),transparent_60%)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(150,170,220,0.14)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(80%_70%_at_50%_50%,#000,transparent)] [-webkit-mask-image:radial-gradient(80%_70%_at_50%_50%,#000,transparent)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[115%] group-hover:opacity-100"
        />
        <Image
          src={pick.imageSrc}
          alt={`${pick.brand} ${pick.productName}`}
          width={150}
          height={150}
          className="relative max-h-32 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.07]"
          unoptimized={pick.imageSrc.endsWith('.svg')}
        />
        {/* Desktop only. On mobile these live in the header row below, which is
            always visible — showing them here too would print the rank and the
            tier twice once the drawer opens. */}
        <span className="absolute left-3 top-3 z-10 hidden sm:inline-flex">
          <EvidenceTag tier={evidence} size="sm" href="/trust/methodology" />
        </span>
        <span className="absolute right-4 top-2 z-10 hidden font-display text-3xl leading-none text-[var(--color-text-faint)] tabular-nums sm:block">
          {String(intervention.rank).padStart(2, '0')}
        </span>
      </div>

      {/* ── Header zone — rank, tier, mechanism label, compound name ──
          On mobile the rank and tier move up here, since the image band they
          normally sit on is collapsed. */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center gap-2 sm:hidden">
          <span className="font-display text-2xl leading-none text-[var(--color-text-faint)] tabular-nums">
            {String(intervention.rank).padStart(2, '0')}
          </span>
          <EvidenceTag tier={evidence} size="sm" href="/trust/methodology" />
        </div>
        <p className="text-label mb-1 text-accent-cyan">{pathway}</p>
        <h3 className="font-display mb-1.5 text-2xl font-medium tracking-tight text-foreground">{compoundName}</h3>
        {/* Clamped: an uneven mechanism line used to stretch the whole grid row,
            so the fact tables below never lined up card to card. */}
        <p className="mb-4 line-clamp-2 min-h-[3.2em] text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)] antialiased">
          {mechanismLine}
        </p>

        {hallmarks.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {hallmarks.slice(0, 3).map((h) => (
              <span
                key={h}
                className="rounded border border-accent-cyan/20 bg-accent-cyan/[0.08] px-1.5 py-0.5 text-micro font-semibold text-accent-cyan"
              >
                {hallmarkLabels[h] ?? h}
              </span>
            ))}
          </div>
        )}

        {/* ── Decision zone — the three consistent facts ──
            Was two (studies, dose). Evidence strength was stranded up on the
            image band, so it wasn't part of the comparable triple and vanished
            entirely once the band collapsed on mobile. Three columns now, in
            the same order on every card. */}
        <dl className="mb-5 grid grid-cols-3 gap-x-3 rounded-lg border border-border/60 bg-white/[0.025] px-3.5 py-3">
          <div>
            <dt className="mb-0.5 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground">Evidence</dt>
            <dd className="text-sm font-semibold text-foreground">
              Tier {evidence} · {tierShort(evidence)}
            </dd>
          </div>
          <div>
            <dt className="mb-0.5 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground">Studies</dt>
            <dd className="tnic-tabular font-mono text-sm font-semibold text-foreground">{studyCount}</dd>
          </div>
          <div>
            <dt className="mb-0.5 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground">Studied dose</dt>
            <dd className="text-sm font-semibold text-foreground">{dose}</dd>
          </div>
        </dl>

        {/* Mobile-only disclosure for the product specifics. Desktop never sees
            this control; the zones below are simply always visible there. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={detailId}
          className="focus-ring interactive mb-3 inline-flex min-h-[var(--space-touch)] items-center justify-between gap-2 rounded-xl border border-border/70 px-4 text-sm font-semibold text-[var(--color-text-secondary)] hover:border-accent-emerald/40 hover:text-accent-emerald sm:hidden"
        >
          {open ? 'Hide the verified pick' : 'See the verified pick'}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {/* ── Recommendation + action zones ── */}
        <div id={detailId} className={`mt-auto sm:block ${open ? 'block' : 'hidden'}`}>
          <p className="text-label mb-1 text-accent-emerald">Verified pick</p>
          {/* Clamped for the same height reason as the mechanism line. */}
          <p className="mb-1.5 line-clamp-2 min-h-[2.9em] text-sm font-medium text-foreground">
            {pick.brand} — <span className="text-[var(--color-text-secondary)]">{pick.productName}</span>
          </p>
          {/* The "why this form" disclosure the card never showed. `whyThisPick`
              was already authored in lib/product-picks.ts and rendered only in
              the page's JSON-LD — nothing here is newly written. */}
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {pick.whyThisPick}
          </p>
          <div className="flex flex-col gap-2">
            <ExternalAction
              href={intervention.goHref}
              destination={`${pick.productName} from ${pick.brand}`}
            >
              Buy on {brandShort}
            </ExternalAction>
            <Link
              href={intervention.libraryHref}
              className="focus-ring inline-flex min-h-[var(--space-touch)] items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Read the evidence
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeEliteGrid() {
  const [active, setActive] = useState<string>('all');

  const chips = useMemo(() => {
    const present = new Set<string>();
    eliteInterventions.forEach((e) => e.hallmarks.forEach((h) => present.add(h)));
    const ordered = CHIP_ORDER.filter((h) => present.has(h));
    const extra = [...present].filter((h) => !CHIP_ORDER.includes(h));
    return [...ordered, ...extra];
  }, []);

  const filtered =
    active === 'all'
      ? eliteInterventions
      : eliteInterventions.filter((e) => e.hallmarks.includes(active));

  return (
    <>
      <div
        role="group"
        aria-label="Filter elite interventions by hallmark"
        className="chip-row mb-8"
      >
        <SelectableChip
          selected={active === 'all'}
          onSelect={() => setActive('all')}
          label="All"
        />
        {chips.map((h) => (
          <SelectableChip
            key={h}
            selected={active === h}
            onSelect={() => setActive(h)}
            label={hallmarkLabels[h] ?? h}
          />
        ))}
      </div>

      {/* Live count of the visible set, announced politely on filter change. */}
      <p
        aria-live="polite"
        className="mb-4 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground"
      >
        {active === 'all'
          ? `${eliteInterventions.length} elite interventions`
          : `Showing ${filtered.length} of ${eliteInterventions.length}`}
      </p>

      {/* Every card is always rendered (so the server HTML carries the full set
          and every internal link); the filter only toggles `hidden`. Nothing
          unmounts, so the one-time entrance reveal never re-fires when the
          visitor clicks between hallmark chips. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {eliteInterventions.map((intervention, i) => {
          const match = active === 'all' || intervention.hallmarks.includes(active);
          return (
            <RevealItem
              key={intervention.compoundId}
              index={i}
              className={`h-full ${match ? '' : 'hidden'}`}
            >
              <EliteCard intervention={intervention} />
            </RevealItem>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="premium-card mt-2 p-5 text-sm text-muted-foreground"
          style={{ '--card-accent': 'var(--accent-cyan)' } as CSSProperties}
        >
          No elite pick acts primarily on that hallmark yet.{' '}
          <button
            type="button"
            onClick={() => setActive('all')}
            className="focus-ring rounded font-semibold text-accent-cyan underline-offset-2 hover:underline"
          >
            Show all interventions
          </button>
          .
        </div>
      )}
    </>
  );
}
