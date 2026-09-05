import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { CinematicHubHero } from '@/components/viz/CinematicHubHero';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { bestForGoals, rankCompoundsForGoal } from '@/lib/best-for';
import { GoalCoverageGrid } from '@/components/best/GoalCoverageGrid';
import { signatureHue } from '@/components/viz/tokens';

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

  // Derived from the goal registry so the rail always matches what's listed.
  const compoundsRanked = new Set(bestForGoals.flatMap((g) => g.boost)).size;
  const hallmarksMapped = new Set(bestForGoals.flatMap((g) => g.hallmarkIds)).size;

  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={[itemListSchema, breadcrumbSchema]} />
      <CinematicHubHero
        hue="emerald"
        kicker="Evidence-ranked"
        title={<>What do you want to <em>improve</em>?</>}
        lead="Nine goals — energy, sleep, longevity, cognition, metabolic health and more — each resolved to the compounds with the strongest human evidence for it, not the loudest marketing."
        stats={[
          { value: String(bestForGoals.length), label: 'Goals covered' },
          { value: String(compoundsRanked), label: 'Compounds ranked', href: '/library/compounds' },
          { value: String(hallmarksMapped), label: 'Hallmarks mapped', href: '/hallmarks' },
        ]}
        primary={{ href: '/nico', label: 'Take the questionnaire' }}
        secondary={{ href: '/library', label: 'Browse the library' }}
      />
      <div className="container-page py-10 md:py-14">
        <PageHeader
          icon={Target}
          eyebrow="Evidence-ranked"
          title="Best supplements, by goal"
          description="Start from what you want to improve. Each guide ranks the evidence-graded compounds that act on that goal's mechanisms — by strength of human evidence, not marketing — with doses, citations, and a hand-off into a personalized stack."
          theme="emerald"
        />

        <div className="mx-auto mb-8 max-w-5xl">
          <GoalCoverageGrid />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {bestForGoals.map((g, i) => {
            const top = rankCompoundsForGoal(g, 3);
            const [r, gr, b] = signatureHue(g.slug);
            const accent = `rgb(${r}, ${gr}, ${b})`;
            return (
              <Link
                key={g.slug}
                href={`/best/${g.slug}`}
                style={{ ['--card-accent' as string]: accent }}
                className="premium-card focus-ring group p-5 flex flex-col"
              >
                {/* Ghost index + goal accent — the grid reads as a color-coded
                    set of intents, matching the site's instrument-card idiom. */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                  <span
                    className="font-display text-3xl font-medium leading-none tabular-nums"
                    style={{ color: `color-mix(in srgb, ${accent} 42%, transparent)` }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="font-display text-xl font-medium tracking-tight text-foreground transition-colors group-hover:[color:var(--card-accent)] mb-2">
                  {g.title}
                </h2>
                {/* Top picks as evidence-graded rows — each carries its tier
                    bar-meter so the goal grid reads as graded, not a plain list.
                    EvidenceTag renders without an href here (no nested anchors
                    inside the card's own Link). */}
                <div className="mb-4 flex-1">
                  <p className="text-micro font-mono uppercase tracking-wider text-muted-foreground mb-2">Top picks</p>
                  <ul className="flex flex-col gap-1.5">
                    {top.map((p) => (
                      <li key={p.compound.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm text-foreground/85 truncate">{p.compound.name.replace(/\s*\(.*\)$/, '')}</span>
                        <EvidenceTag tier={p.compound.evidence} size="sm" showTooltip={false} className="shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold [color:var(--card-accent)]">
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
