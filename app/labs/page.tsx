import { Suspense } from 'react';
import { FlaskConical } from 'lucide-react';
import { LabHub } from '@/components/labs/LabHub';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { getHubContext } from '@/lib/hub-context';
import { SectionSkeleton } from '@/components/ui/SectionSkeleton';
import { StructuredData } from '@/components/seo/StructuredData';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { seoRoutes } from '@/lib/seo-routes';
import { buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { biomarkers } from '@/lib/data';
import { COMPOUND_COUNT } from '@/lib/library-modules';
import { EntityChips } from '@/components/ui/EntityChips';
import { resolveCompounds } from '@/lib/entity-graph';

export const metadata = seoRoutes.labs();

function buildLabsSchemas() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TNiC Lab Hub — Local Biomarker Tracker',
    url: `${SITE.url}/labs`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Local-first biomarker tracker for longevity labs: log CBC, metabolic panel, lipids, HbA1c, hscrp, homocysteine, and longevity panels. Track trends over time with reference ranges mapped to optimal longevity targets — not just clinical normal.',
    featureList: [
      'Local-only lab result storage',
      'Longevity-optimized reference ranges',
      'Trend charts for key biomarkers',
      'PDF lab import (structured extraction)',
      'No account — data never leaves your device',
    ],
    isAccessibleForFree: true,
  };
  return [webApp, buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Lab Hub', path: '/labs' },
  ])];
}

export default function LabsPage() {
  // Derived from each biomarker's own `compounds` edge, dropping any that has
  // no deep-dive behind it, and any marker left with nothing to link.
  const biomarkerLinks = biomarkers
    .map((b) => ({ id: b.id, name: b.name, compounds: resolveCompounds(b.compounds) }))
    .filter((b) => b.compounds.length > 0);

  return (
    <>
      <StructuredData schemas={buildLabsSchemas()} />
      <CinematicHubHero
        hue="rose"
        kicker="Lab Hub"
        title={<>Your biology, <em>measured</em>.</>}
        lead="A local-first biomarker tracker with longevity-optimized reference ranges — log your labs, watch the trends, and map each marker to the interventions that move it. Your data never leaves your device."
        stats={[
          { value: String(biomarkers.length), label: 'Tracked biomarkers' },
          { value: String(COMPOUND_COUNT), label: 'Graded compounds', href: '/library/compounds' },
          { value: '12', label: 'Hallmarks of aging', href: '/hallmarks' },
          { value: 'A–C', label: 'Evidence tiers', href: '/trust/methodology' },
        ]}
        primary={{ href: '/nico', label: 'Find your personalized stack' }}
        secondary={{ href: '/library', label: 'Browse the library' }}
      />
      {/* Identity on the server, ahead of the client island — see the note in
          app/stacks/page.tsx and STYLE_GUIDE §14. LabHub calls
          useSearchParams(), so nothing inside its boundary reaches the initial
          HTML. */}
      <PageShell>
        <PageHeader
          icon={FlaskConical}
          eyebrow="Lab Analysis & Tracking Hub"
          title="Your Biomarkers. Your Data. Your Insights."
          description="Log lab results, visualize trends, map risks to the 12 Hallmarks of Aging, and get stack-aware recommendations — all processed locally in your browser."
          theme="rose"
          variant="handoff"
          context={getHubContext('labs')}
        />
        <Suspense fallback={<SectionSkeleton height="lg" />}>
          <LabHub />
        </Suspense>

        {/* The Lab Hub is a client island behind Suspense — deliberately, since
            it processes lab data locally in the browser — so this hub
            server-rendered five in-body links in total and a reader arriving
            from search saw a biomarker tracker that named no interventions.
            Each biomarker below carries its own `compounds` edge in the data;
            this renders that edge. Biomarkers have no page of their own, so
            they are group labels rather than links — naming a route that does
            not exist would be worse than naming none. */}
        <section aria-labelledby="labs-graph-heading" className="mt-14">
          <div className="premium-card p-5 md:p-7">
            <p className="text-label mb-2 text-accent-rose">From a marker to an intervention</p>
            <h2 id="labs-graph-heading" className="heading-section mb-2 text-xl md:text-2xl">
              What the library has studied against each biomarker.
            </h2>
            <p className="text-body-sm mb-6 max-w-3xl text-muted-foreground">
              A number on a panel is only useful if you can act on it. These are the compounds
              with a full evidence module behind them for each marker the hub tracks — read the
              evidence before changing anything.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {biomarkerLinks.map((b) => (
                <EntityChips key={b.id} label={b.name} entities={b.compounds} />
              ))}
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}