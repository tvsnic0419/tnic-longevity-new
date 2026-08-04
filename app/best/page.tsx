import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { bestForGoals, rankCompoundsForGoal } from '@/lib/best-for';

export const metadata: Metadata = buildPageMetadata({
  title: 'Best Supplements by Goal — Evidence-Ranked',
  description:
    'Pick your goal — energy, longevity, sleep, inflammation, cognition, muscle, biological age, metabolic, or immune health — and see the evidence-graded supplements that address it, ranked by strength of human evidence.',
  path: '/best',
  keywords: ['best supplements', 'supplements by goal', 'evidence-graded supplements', 'longevity supplements'],
});

export default function BestHubPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best supplements by goal',
    itemListElement: bestForGoals.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: `${SITE.url}/best/${g.slug}`,
    })),
  };
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Best supplements by goal', path: '/best' },
  ]);

  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={[itemListSchema, breadcrumbSchema]} />
      <div className="container-page py-10 md:py-14">
        <PageHeader
          icon={Target}
          eyebrow="Evidence-ranked"
          title="Best supplements, by goal"
          description="Start from what you want to improve. Each guide ranks the evidence-graded compounds that act on that goal's mechanisms — by strength of human evidence, not marketing — with doses, citations, and a hand-off into a personalized stack."
          theme="emerald"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {bestForGoals.map((g) => {
            const top = rankCompoundsForGoal(g, 3);
            return (
              <Link
                key={g.slug}
                href={`/best/${g.slug}`}
                className="focus-ring interactive group rounded-2xl border border-border/60 bg-card/40 p-5 flex flex-col hover:border-accent-emerald/40 transition-colors"
              >
                <h2 className="font-bold text-foreground group-hover:text-accent-emerald transition-colors mb-2">
                  {g.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                  Top picks: {top.map((p) => p.compound.name.replace(/\s*\(.*\)$/, '')).join(', ')}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-emerald">
                  See the ranking <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10 max-w-xl mx-auto">
          Rankings are computed from the compound registry by evidence tier and mechanistic fit. Educational only —
          not medical advice. Confirm any protocol with your physician.
        </p>
      </div>
    </SubPageLayout>
  );
}
