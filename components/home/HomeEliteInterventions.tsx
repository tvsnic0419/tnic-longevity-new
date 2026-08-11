import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ExternalLink, ShieldCheck, BookOpen } from 'lucide-react';
import { eliteInterventions, eliteTierCounts } from '@/lib/elite-interventions';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { RevealItem } from '@/components/ui/RevealItem';
import { CellularDivider } from '@/components/ui/CellularDivider';

/**
 * The homepage centrepiece: the elite-interventions showcase.
 *
 * Products first — but every card is anchored to real evidence. Each pulls its
 * brand + verified buy link from lib/product-picks.ts and its evidence tier,
 * pathway, dose, and PMID count from lib/data.ts (joined in
 * lib/elite-interventions.ts). Server-rendered so crawlers see real product
 * markup and real internal links to each evidence module.
 *
 * Two links per card, kept as sibling anchors (never nested):
 *   - buy   → /api/go/<id>  (affiliate redirect, rel="sponsored")
 *   - learn → /library/compounds/<id> (the graded evidence module)
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
          <EvidenceTag tier={evidence} size="sm" />
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

export function HomeEliteInterventions() {
  const tierA = eliteTierCounts.A ?? 0;

  return (
    <section
      id="elite-interventions"
      aria-labelledby="home-elite-heading"
      className="relative scroll-mt-24 border-t border-border/50 py-20 md:py-28"
    >
      <CellularDivider hue="var(--accent-emerald)" index="01" label="The interventions" />
      <div className="container-page">
        <RevealItem className="mb-10 max-w-3xl md:mb-14">
          <p className="text-label mb-3 text-accent-emerald">Elite interventions</p>
          <h2 id="home-elite-heading" className="heading-section mb-3">
            The compounds with the strongest human evidence — and where to buy them well.
          </h2>
          <div className="heading-accent-rule mb-4" aria-hidden="true" />
          <p className="text-body">
            {eliteInterventions.length} nutrients that act on the hallmarks of aging, each graded by
            the strength of human trials ({tierA} at Tier A), paired with one verified product that
            matches the dose and form used in the studies. Every card links to the full evidence.
          </p>
        </RevealItem>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eliteInterventions.map((intervention, i) => (
            <RevealItem key={intervention.compoundId} index={i} className="h-full">
              <EliteCard intervention={intervention} />
            </RevealItem>
          ))}
        </div>

        {/* Disclosure — required because this section leads with product buys */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-accent-amber/25 bg-accent-amber/[0.06] p-4 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-amber" aria-hidden="true" />
          <p className="leading-relaxed text-muted-foreground">
            <strong className="text-foreground">How to read this.</strong> TNiC doesn&apos;t sell or
            stock supplements. Picks link to the manufacturer and may carry an affiliate token — at
            no extra cost to you, and commission never influences which products are listed or their
            evidence tier. This is educational information, not medical advice; talk to a clinician
            before starting anything, and always request a Certificate of Analysis before you buy.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="focus-ring group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-emerald/12 px-5 py-3 text-sm font-semibold text-accent-emerald transition-colors hover:bg-accent-emerald/20"
          >
            See all recommended products
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/shop"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-5 py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-accent-amber/40 hover:text-accent-amber"
          >
            Verify a product before you buy
          </Link>
        </div>
      </div>
    </section>
  );
}
