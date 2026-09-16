import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Handshake,
  ListOrdered,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PageShell } from '@/components/ui/PageShell';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { SponsorSlot } from '@/components/sponsors/SponsorSlot';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';
import { SITE } from '@/lib/site';
import { platformStats } from '@/lib/platform-stats';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import {
  SPONSOR_SLOT_CATALOG,
  getActiveSponsor,
  type SponsorSlotId,
} from '@/lib/sponsors';

export const metadata = seoRoutes.partnerships();

const fit = [
  'Evidence-supported education around cell-health, nutrition, biomarkers, and supplement quality.',
  'Research communication or data visualization projects that help consumers understand mechanisms and uncertainty.',
  'Category education for brands that can tolerate transparent evidence grading and clear disclosures.',
  'Technology or lab collaborations that improve user comprehension without selling personal health data.',
];

const boundaries = [
  'No paid evidence-tier upgrades.',
  'No silent sponsored recommendations.',
  'No sponsor control over scientific methodology, stack scoring, buyer-guide criteria, or citations.',
  'No sale of user-entered stack, lab, or health-interest data.',
];

const conversationStarters = [
  'Educational sponsorships with unmistakable labeling',
  'Evidence visualization or research translation collaborations',
  'Product-category buyer education with COA and label-literacy standards',
  'Lab, biomarker, or technology integrations reviewed through privacy and evidence constraints',
];

/**
 * The eight-minute path a serious reviewer should walk. Every stop is a live
 * page; none of the copy here invents a grade, a dose, or a PMID.
 */
const reviewWalkthrough = [
  {
    n: '01',
    title: 'Home',
    href: '/',
    why: 'The thesis: evidence-graded longevity without hype. If the first screen does not feel independent, stop.',
  },
  {
    n: '02',
    title: 'Library',
    href: '/library',
    why: 'The product. Every intervention is graded A–C from human evidence, not from a sponsor brief.',
  },
  {
    n: '03',
    title: 'Evidence table',
    href: '/library/evidence',
    why: 'The index of the library — sortable, derived from the same registries the deep-dives publish.',
  },
  {
    n: '04',
    title: 'A Tier A deep-dive (GlyNAC)',
    href: '/library/compounds/glynac',
    why: 'What a full evidence module looks like: trials, dose, uncertainty, PMIDs. This is the standard a placement sits beside, not inside.',
  },
  {
    n: '05',
    title: 'Methodology',
    href: '/trust/methodology',
    why: 'How a grade is assigned, and what would change one. Commercial relationships are not on that list.',
  },
  {
    n: '06',
    title: 'Sponsorship principles',
    href: '/trust/sponsorship',
    why: 'The wall: what money can fund, and what it cannot buy.',
  },
] as const;

const slotIds = Object.keys(SPONSOR_SLOT_CATALOG) as SponsorSlotId[];

function buildSchemas() {
  return [
    buildArticleSchema({
      title: 'Partner With TNiC',
      description:
        'Partnership principles for brands, research organizations, and health technology teams interested in responsible cell-health education.',
      path: '/partnerships',
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Partnerships', path: '/partnerships' },
    ]),
  ];
}

export default function PartnershipsPage() {
  return (
    <SubPageLayout>
      <PageShell>
        <StructuredData schemas={buildSchemas()} />
      <PageHeader
        icon={Handshake}
        eyebrow="Partnerships"
        title="Partner With TNiC"
        description="TNiC is open to selective collaborations with organizations that respect scientific nuance, user trust, and clear commercial disclosure."
        theme="cyan"
        align="left"
        context={{
          what: 'A disclosed placement beside an independent evidence library — never inside a grade.',
          why: 'Serious brands need a partner that will not look like pay-to-win. That wall is the product.',
          next: 'Walk the six review stops, then send a concise note.',
        }}
      />

      {/* Platform by the numbers — real scale + rigor a sponsor is evaluating,
          derived live from the published registries (never hand-set). */}
      <section aria-labelledby="platform-numbers" className="mb-8">
        <p id="platform-numbers" className="text-label mb-4 text-muted-foreground">
          The platform, by the numbers
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {platformStats.map((stat) => (
            <div key={stat.label} className="card-elevated rounded-xl p-4">
              <p className="font-display text-3xl font-medium leading-none text-accent-cyan">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{stat.label}</p>
              <p className="text-caption mt-0.5 text-muted-foreground">{stat.sublabel}</p>
            </div>
          ))}
        </div>
        <p className="text-caption mt-3 text-muted-foreground">
          Every compound, pathway, and hallmark is graded A–C by strength of human evidence, with
          traceable PubMed citations — the editorial standard sponsors are evaluated against, not exempt from.
        </p>
      </section>

      <section aria-labelledby="review-path" className="mb-8">
        <div className="mb-5 flex items-start gap-3">
          <ListOrdered className="mt-1 h-5 w-5 shrink-0 text-accent-cyan" aria-hidden="true" />
          <div>
            <h2 id="review-path" className="heading-section">
              Eight-minute review path
            </h2>
            <p className="mt-2 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">
              Send a reviewer here, then these six stops, in order. Each page is live. None of them
              are a pitch deck.
            </p>
          </div>
        </div>
        <ol className="grid gap-3 md:grid-cols-2">
          {reviewWalkthrough.map((stop) => (
            <li key={stop.href} className="glass rounded-xl p-5">
              <p className="font-mono text-xs uppercase tracking-wide text-accent-cyan">{stop.n}</p>
              <Link
                href={stop.href}
                className="focus-ring mt-2 inline-flex items-center gap-2 rounded text-sm font-semibold text-foreground hover:text-accent-cyan"
              >
                {stop.title}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stop.why}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="inventory" className="mb-8">
        <h2 id="inventory" className="heading-section mb-2">
          Labeled inventory
        </h2>
        <p className="mb-4 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">
          Four surfaces. Empty slots render nothing — no vacant ad boxes, no layout shift.
          A filled slot is marked Sponsored and links to the published principles.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {slotIds.map((id) => {
            const slot = SPONSOR_SLOT_CATALOG[id];
            const sold = getActiveSponsor(id);
            return (
              <article key={id} className="card-elevated rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{slot.label}</p>
                    <p className="text-caption text-muted-foreground">{slot.surface}</p>
                  </div>
                  <p
                    className={
                      sold
                        ? 'text-caption shrink-0 rounded-full bg-accent-amber/15 px-2 py-1 text-accent-amber'
                        : 'text-caption shrink-0 rounded-full bg-accent-emerald/15 px-2 py-1 text-accent-emerald'
                    }
                  >
                    {sold ? `Live · ${sold.name}` : 'Open'}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{slot.intent}</p>
                <Link
                  href={slot.href}
                  className="focus-ring mt-3 inline-flex items-center gap-2 rounded text-sm font-semibold text-accent-cyan hover:underline"
                >
                  View surface
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="gradient-border p-6 md:p-8">
          <div className="flex items-start gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-accent-cyan shrink-0 mt-1" aria-hidden="true" />
            <div>
              <p className="text-label text-accent-cyan mb-2">What TNiC is building</p>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                TNiC is a cell-health and nutrition intelligence product for advanced consumers who want to
                understand compounds, pathways, evidence quality, biomarkers, and stack relationships before they buy
                or change a protocol. It is educational, local-first, and explicitly not a clinic or medical provider.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fit.map((item) => (
              <div key={item} className="glass rounded-xl p-4">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald mb-2" aria-hidden="true" />
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-accent-emerald/25 bg-accent-emerald/5 p-6">
          <ShieldCheck className="w-6 h-6 text-accent-emerald mb-4" aria-hidden="true" />
          <p className="text-label text-accent-emerald mb-2">Non-negotiables</p>
          <ul className="space-y-3">
            {boundaries.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-accent-emerald shrink-0">-</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/trust/sponsorship"
            className="focus-ring mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan hover:underline rounded"
          >
            Read sponsorship principles <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <Building2 className="w-5 h-5 text-accent-violet mb-3" aria-hidden="true" />
          <p className="text-label mb-3">Good-fit conversations</p>
          <ul className="space-y-2">
            {conversationStarters.map((item) => (
              <li key={item} className="text-sm text-muted-foreground leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="text-label mb-3">Start a serious conversation</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Use a concise note: organization, proposed collaboration, what audience value it creates, and any
            compliance constraints your team needs TNiC to understand. This page is the public brief — send it as the
            first link.
          </p>
          <a
            href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent('[TNiC partnerships] Collaboration inquiry')}`}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl tnic-button-accent px-5 py-3 text-sm"
          >
            Partnership inquiries <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Live sponsor placement — renders only when inventory is sold. */}
      <SponsorSlot slot="partnerships" className="mt-8" />
      <PageConnections cluster={clusterFrom('about', '/partnerships')} accent="cyan" id="about-connections" />
      </PageShell>
    </SubPageLayout>
  );
}
