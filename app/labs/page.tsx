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
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';
import { ContinueTrail } from '@/components/ui/WalkCard';

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
          { value: String(hallmarkLibrary.length), label: 'Hallmarks of aging', href: '/hallmarks' },
          { value: 'A–C', label: 'Evidence tiers', href: '/trust/methodology' },
        ]}
        primary={{ href: '/nico', label: 'Start with NICO' }}
        secondary={{ href: '/library', label: 'Explore library' }}
        figure={undefined as never}
      />
