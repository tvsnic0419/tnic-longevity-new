'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, BookOpen } from 'lucide-react';
import { eliteInterventions } from '@/lib/elite-interventions';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { RevealItem } from '@/components/ui/RevealItem';

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

function EliteCard({ intervention }: { intervention: (typeof eliteInterventions)[number] }) {
  const { pick, compoundName, pathway, mechanismLine, evidence, studyCount, dose, hallmarks } =
    intervention;
  const brandShort = pick.brand.split(' ')[0];

  return (
    <div className="elite-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card/70 to-card/25 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent-emerald/50 hover:shadow-[0_24px_70px_-24px_rgba(16,185,129,0.4)]">
      {/* top-edge light catch */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-accent-emerald/40 to-transparent opacity-70"
      />

      {/* Product image band — layered ambience: emerald glow + dot-grid + hover shine */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-border/50">
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
        <span className="absolute left-3 top-3 z-10">
          <EvidenceTag tier={evidence} size="sm" href="/trust/methodology" />
        </span>
        <span className="absolute right-4 top-2 z-10 font-display text-3xl leading-none text-[var(--color-text-faint)] tabular-nums">
          {String(intervention.rank).padStart(2, '0')}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-label mb-1 text-accent-cyan">{pathway}</p>
        <h3 className="font-display mb-1.5 text-2xl font-medium tracking-tight text-foreground">{compoundName}</h3>
        <p className="mb-4 text-[0.9375rem] leading-relaxed text-[var(--color-text-secondary)] antialiased">{mechanismLine}</p>

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

        {/* Evidence + dose micro-facts — framed and high-contrast so the
            supporting data reads as crisp instrument readout, not fine print. */}
        <dl className="mb-5 grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg border border-border/60 bg-white/[0.025] px-3.5 py-3">
          <div>
            <dt className="mb-0.5 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground">Human studies cited</dt>
            <dd className="tnic-tabular font-mono text-base font-semibold text-foreground">{studyCount}</dd>
          </div>
          <div>
            <dt className="mb-0.5 font-mono text-micro font-semibold uppercase tracking-[0.12em] text-muted-foreground">Studied dose</dt>
            <dd className="text-sm font-semibold text-foreground">{dose}</dd>
          </div>
        </dl>

        {/* Verified pick */}
        <div className="mt-auto">
          <p className="text-label mb-1 text-accent-emerald">Verified pick</p>
          <p className="mb-3 text-sm font-medium text-foreground">
            {pick.brand} — <span className="text-[var(--color-text-secondary)]">{pick.productName}</span>
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={intervention.goHref}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="focus-ring group/buy inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent-emerald/12 px-4 py-2.5 text-sm font-semibold text-accent-emerald transition-colors hover:bg-accent-emerald/20"
              aria-label={`Buy ${pick.productName} from ${pick.brand} — opens manufacturer site`}
            >
              Buy on {brandShort}
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover/buy:-translate-y-0.5 group-hover/buy:translate-x-0.5" aria-hidden="true" />
            </a>
            <Link
              href={intervention.libraryHref}
              className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/70 px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
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

  const chipClass = (on: boolean) =>
    [
      'focus-ring interactive rounded-full border px-3.5 py-1.5 font-mono text-micro font-semibold uppercase tracking-[0.12em] transition-all',
      on
        ? 'border-accent-emerald bg-accent-emerald/10 text-accent-emerald'
        : 'border-border/70 bg-card/40 text-muted-foreground hover:border-foreground/40 hover:text-foreground',
    ].join(' ');

  return (
    <>
      <div
        role="group"
        aria-label="Filter elite interventions by hallmark"
        className="mb-8 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={active === 'all'}
          onClick={() => setActive('all')}
          className={chipClass(active === 'all')}
        >
          All
        </button>
        {chips.map((h) => (
          <button
            key={h}
            type="button"
            aria-pressed={active === h}
            onClick={() => setActive(h)}
            className={chipClass(active === h)}
          >
            {hallmarkLabels[h] ?? h}
          </button>
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
