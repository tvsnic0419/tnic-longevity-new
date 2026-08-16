import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Waypoints, Dna, FlaskConical } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import {
  getAllPathwaySlugs,
  getPathwayBySlug,
  pathwayCategoryMeta,
} from '@/lib/pathways';
import { getHallmarkById } from '@/lib/hallmarks-library';
import { libraryModuleTitles } from '@/lib/breadcrumb-titles';
import type { ThemeAccent } from '@/lib/design-system';

export function generateStaticParams() {
  return getAllPathwaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathway = getPathwayBySlug(slug);
  if (!pathway) return { title: 'Not Found' };
  return buildPageMetadata({
    title: `${pathway.name} — Longevity Pathway`,
    description: pathway.summary,
    path: `/pathways/${slug}`,
    keywords: [pathway.name, ...pathway.aliases, 'longevity pathway', 'mechanism of aging'],
  });
}

export default async function PathwayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pathway = getPathwayBySlug(slug);
  if (!pathway) notFound();

  const meta = pathwayCategoryMeta[pathway.category];
  const theme = meta.theme as ThemeAccent;
  const accentVar = `var(--accent-${theme})`;
  const path = `/pathways/${slug}`;

  const hallmarks = pathway.hallmarkIds
    .map((id) => getHallmarkById(id))
    .filter((h): h is NonNullable<typeof h> => Boolean(h));
  const compounds = pathway.compoundSlugs
    .map((s) => ({ slug: s, title: libraryModuleTitles[`compounds/${s}`] ?? s }))
    .filter((c) => Boolean(c.title));

  const breadcrumbItems = [
    { name: 'Library', path: '/library' },
    { name: 'Pathways', path: '/pathways' },
    { name: pathway.name, path },
  ];

  return (
    <SubPageLayout>
      <StructuredData
        schemas={[
          buildArticleSchema({
            title: `${pathway.name} — Longevity Pathway`,
            description: pathway.summary,
            path,
            evidenceTier: 'A',
          }),
          buildBreadcrumbSchema(breadcrumbItems),
        ]}
      />
      <div
        className="min-h-screen canvas-scrim text-foreground pb-20 pt-6 md:pt-8"
        style={{ '--card-accent': accentVar } as CSSProperties}
      >
        <div className="container-page">
          <Link
            href="/pathways"
            className="focus-ring mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All pathways
          </Link>

          {/* Themed cinematic header — one accent family per pathway category */}
          <PageHeader
            icon={Waypoints}
            eyebrow={meta.label}
            title={pathway.name}
            description={pathway.summary}
            theme={theme}
            align="left"
            cinematic
          />

          {/* Pathway position — the "verb" between compounds (what you take) and
              hallmarks (what ages). A compact map of where this node sits. */}
          <div
            className="mb-10 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1.2fr_auto_1fr]"
            aria-hidden="true"
          >
            <FlowNode label="Compounds engage it" value={String(compounds.length)} sub="levers" accent="var(--accent-emerald)" />
            <FlowArrow />
            <FlowNode label={meta.label} value={pathway.name} sub="the pathway" accent={accentVar} emphasize />
            <FlowArrow />
            <FlowNode label="Hallmarks it moves" value={String(hallmarks.length)} sub="of 12" accent="var(--accent-violet)" />
          </div>

          <div className="mx-auto max-w-4xl">
            {/* Role */}
            <section className="premium-card mb-6 rounded-2xl p-6 md:p-7">
              <h2 className="text-label mb-3" style={{ color: accentVar }}>
                Role in aging
              </h2>
              <p className="text-body leading-relaxed">{pathway.role}</p>
            </section>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Hallmarks acted on */}
              {hallmarks.length > 0 && (
                <section className="premium-card rounded-2xl p-6">
                  <h2 className="text-label mb-4 inline-flex items-center gap-2 text-accent-violet">
                    <Dna className="h-3.5 w-3.5" aria-hidden="true" /> Hallmarks it acts on
                  </h2>
                  <ul className="flex flex-col gap-1">
                    {hallmarks.map((h) => (
                      <li key={h.slug}>
                        <Link
                          href={`/library/${h.slug}`}
                          className="focus-ring group flex items-center gap-2.5 rounded-lg px-2 py-2 text-body-sm text-muted-foreground transition hover:bg-white/[0.03] hover:text-foreground"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-violet/12 font-mono text-micro font-bold text-accent-violet">
                            {h.number}
                          </span>
                          <span className="flex-1">{h.title}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Compounds that engage it */}
              {compounds.length > 0 && (
                <section className="premium-card rounded-2xl p-6">
                  <h2 className="text-label mb-4 inline-flex items-center gap-2 text-accent-emerald">
                    <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /> Compounds that engage it
                  </h2>
                  <ul className="flex flex-col gap-1">
                    {compounds.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/library/compounds/${c.slug}`}
                          className="focus-ring group flex items-center gap-2.5 rounded-lg px-2 py-2 text-body-sm text-muted-foreground transition hover:bg-white/[0.03] hover:text-foreground"
                        >
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-emerald/12" aria-hidden="true">
                            <FlaskConical className="h-3 w-3 text-accent-emerald" />
                          </span>
                          <span className="flex-1">{c.title}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/insights"
                className="focus-ring interactive tnic-button-tonal inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm"
                style={{ '--btn-accent': accentVar } as CSSProperties}
              >
                See how the library connects <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/pathways"
                className="focus-ring interactive tnic-button-outline inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
              >
                All pathways
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}

/** A node in the compound → pathway → hallmark position strip. */
function FlowNode({
  label,
  value,
  sub,
  accent,
  emphasize = false,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-center rounded-2xl border px-4 py-4 text-center ${
        emphasize ? 'bg-card/60' : 'bg-card/30'
      }`}
      style={{
        borderColor: `color-mix(in srgb, ${accent} ${emphasize ? 40 : 20}%, var(--color-border-subtle))`,
        boxShadow: emphasize ? `0 0 32px -12px color-mix(in srgb, ${accent} 50%, transparent)` : undefined,
      }}
    >
      <span className="text-micro font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <span
        className={`mt-1 font-display leading-tight tracking-tight ${emphasize ? 'text-xl' : 'text-2xl font-semibold tabular-nums'}`}
        style={{ color: emphasize ? 'var(--color-text-primary)' : accent }}
      >
        {value}
      </span>
      <span className="text-micro text-faint">{sub}</span>
      {emphasize && (
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      )}
    </div>
  );
}

/** The connecting arrow between flow nodes (horizontal on desktop, vertical on mobile). */
function FlowArrow() {
  return (
    <div className="flex items-center justify-center text-muted-foreground">
      <ArrowRight className="h-4 w-4 rotate-90 sm:rotate-0" aria-hidden="true" />
    </div>
  );
}
