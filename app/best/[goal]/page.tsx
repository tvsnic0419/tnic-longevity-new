import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles, FlaskConical, ScrollText, Dna, Trophy } from 'lucide-react';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { AnswerBox } from '@/components/ui/AnswerBox';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { BestLeaderboard } from '@/components/best/BestLeaderboard';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema, buildFaqPageSchema } from '@/lib/seo';
import { SITE } from '@/lib/site';
import {
  bestForGoals,
  getBestForGoal,
  getAllBestForSlugs,
  rankCompoundsForGoal,
  hallmarkTitlesFor,
} from '@/lib/best-for';

export function generateStaticParams() {
  return getAllBestForSlugs().map((goal) => ({ goal }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}): Promise<Metadata> {
  const { goal } = await params;
  const g = getBestForGoal(goal);
  if (!g) return { title: 'Not Found' };
  return buildPageMetadata({
    title: g.seoTitle,
    description: g.metaDescription,
    path: `/best/${g.slug}`,
    keywords: [
      `best supplements for ${g.slug}`,
      `${g.slug} supplements`,
      'evidence-graded supplements',
      'longevity supplements',
    ],
  });
}

export default async function BestForGoalPage({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal } = await params;
  const g = getBestForGoal(goal);
  if (!g) notFound();

  const picks = rankCompoundsForGoal(g);
  const leaderboardPicks = picks.map((p) => ({
    id: p.compound.id,
    name: p.compound.name,
    evidence: p.compound.evidence,
    pathway: p.compound.pathway,
    dose: p.compound.dose,
    timing: p.compound.timing,
    pmidCount: p.pmids.length,
  }));
  const hallmarks = hallmarkTitlesFor(g.hallmarkIds);
  const others = bestForGoals.filter((x) => x.slug !== g.slug);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: g.title,
    description: g.metaDescription,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: picks.length,
    itemListElement: picks.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.compound.name,
      url: `${SITE.url}/library/compounds/${p.compound.id}`,
    })),
  };
  const faqSchema = buildFaqPageSchema(g.faqs);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Best supplements by goal', path: '/best' },
    { name: g.title, path: `/best/${g.slug}` },
  ]);
  const schemas = [itemListSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <SubPageLayout hideContextBar>
      <StructuredData schemas={schemas} />
      <div className="container-page py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/best" className="hover:text-foreground transition-colors">Best by goal</Link>
            <span>/</span>
            <span className="text-accent-emerald">{g.title}</span>
          </nav>

          <PageHeader
            icon={FlaskConical}
            eyebrow="Evidence-ranked"
            title={g.title}
            description={g.intro}
            theme="emerald"
            align="left"
          />

          {/* Answer-first: name the top-ranked pick above the fold, derived
              from the deterministic ranking (no hand-picking, no new claims) —
              so the citable answer leads for readers and AI answer engines. */}
          {picks.length > 0 && (
            <AnswerBox
              icon={Trophy}
              label="The top pick"
              className="mb-6"
            >
              The top-ranked pick here is{' '}
              <strong className="font-semibold text-foreground">{picks[0].compound.name}</strong>{' '}
              <EvidenceTag tier={picks[0].compound.evidence} size="sm" className="align-middle" />
              {' — '}
              {picks[0].compound.pathway}.
              {picks.slice(1, 3).length > 0 && (
                <>
                  {' '}Next best-evidenced:{' '}
                  {picks.slice(1, 3).map((p) => p.compound.name).join(' and ')}.
                </>
              )}
            </AnswerBox>
          )}

          {/* How we rank — honesty note */}
          <div className="premium-card mb-8 p-4">
            <div className="flex items-start gap-3">
              <ScrollText className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ranked by strength of human evidence (Tier A &gt; B &gt; C) and mechanistic fit — computed from the
                compound registry, not hand-picked. Every entry links to its full evidence deep-dive with PubMed
                citations. Educational only, not medical advice.
              </p>
            </div>
          </div>

          {/* Ranked list — premium leaderboard with per-rank accent and a
              one-tap add-to-protocol action (see BestLeaderboard). */}
          <BestLeaderboard picks={leaderboardPicks} />

          {/* The mechanisms behind this goal */}
          {hallmarks.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <Dna className="w-4 h-4 text-accent-violet" aria-hidden="true" />
                <h2 className="text-sm font-bold text-foreground">The aging mechanisms behind this goal</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {hallmarks.map((h) => (
                  <Link
                    key={h.id}
                    href={`/library/${h.slug}`}
                    className="focus-ring interactive text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:border-accent-violet/40 transition-colors"
                  >
                    {h.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Personalized CTA */}
          <section className="rounded-2xl border border-accent-emerald/25 bg-accent-emerald/5 p-6 mb-12 text-center">
            <Sparkles className="w-8 h-8 text-accent-emerald mx-auto mb-3" aria-hidden="true" />
            <h2 className="text-lg font-bold text-foreground mb-2">Want a stack built for you, not a list?</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              The NICO Starter Questionnaire turns your goals, lifestyle, and safety profile into a personalized,
              evidence-graded stack — and loads it straight into Stack Builder.
            </p>
            <Link
              href="/nico"
              className="focus-ring inline-flex items-center gap-2 tnic-button-accent [--btn-accent:var(--accent-emerald)] px-6 py-3 rounded-xl text-sm"
            >
              Take the NICO Starter Questionnaire <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>

          {/* FAQ */}
          {g.faqs.length > 0 && (
            <section className="mb-12">
              <h2 className="text-lg font-bold text-foreground mb-4">Frequently asked</h2>
              <div className="space-y-4">
                {g.faqs.map((f) => (
                  <div key={f.question} className="premium-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-2">{f.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cross-links to sibling goals */}
          <section>
            <h2 className="text-sm font-bold text-foreground mb-3">Best supplements for other goals</h2>
            <div className="flex flex-wrap gap-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/best/${o.slug}`}
                  className="focus-ring interactive text-xs px-3 py-1.5 rounded-lg border border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:border-accent-emerald/40 transition-colors"
                >
                  {o.title.replace(/^Best (Supplements for |Longevity.*|Supplements to )/, '').trim() || o.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SubPageLayout>
  );
}
