import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Waypoints, Dna, FlaskConical } from 'lucide-react';
import { StructuredData } from '@/components/seo/StructuredData';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import {
  getAllPathwaySlugs,
  getPathwayBySlug,
  pathwayCategoryMeta,
} from '@/lib/pathways';
import { getHallmarkById } from '@/lib/hallmarks-library';
import { libraryModuleTitles } from '@/lib/breadcrumb-titles';

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

const themeAccent: Record<string, string> = {
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  emerald: 'text-accent-emerald',
  amber: 'text-accent-amber',
  rose: 'text-accent-rose',
};

export default async function PathwayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pathway = getPathwayBySlug(slug);
  if (!pathway) notFound();

  const meta = pathwayCategoryMeta[pathway.category];
  const accent = themeAccent[meta.theme] ?? 'text-accent-cyan';
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
      <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
        <div className="container-page max-w-4xl">
          <Link
            href="/pathways"
            className="focus-ring mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-accent-cyan"
          >
            <ArrowLeft className="h-4 w-4" /> All pathways
          </Link>

          {/* Header */}
          <div className="mb-10">
            <p className={`text-label mb-3 inline-flex items-center gap-2 ${accent}`}>
              <Waypoints className="h-3.5 w-3.5" aria-hidden="true" />
              {meta.label}
            </p>
            <h1 className="heading-page mb-4">{pathway.name}</h1>
            <p className="text-body max-w-2xl text-muted-foreground">{pathway.summary}</p>
          </div>

          {/* Role */}
          <section className="card-elevated mb-8 rounded-xl p-6">
            <h2 className="text-label mb-3 text-muted-foreground">Role in aging</h2>
            <p className="text-body leading-relaxed">{pathway.role}</p>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Hallmarks acted on */}
            {hallmarks.length > 0 && (
              <section className="card-elevated rounded-xl p-6">
                <h2 className="text-label mb-4 inline-flex items-center gap-2 text-accent-violet">
                  <Dna className="h-3.5 w-3.5" aria-hidden="true" /> Hallmarks it acts on
                </h2>
                <ul className="space-y-2">
                  {hallmarks.map((h) => (
                    <li key={h.slug}>
                      <Link
                        href={`/library/${h.slug}`}
                        className="focus-ring group inline-flex items-center gap-2 rounded text-sm text-muted-foreground transition hover:text-accent-cyan"
                      >
                        <span className="font-mono text-xs text-accent-violet">#{h.number}</span>
                        {h.title}
                        <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Compounds that engage it */}
            {compounds.length > 0 && (
              <section className="card-elevated rounded-xl p-6">
                <h2 className="text-label mb-4 inline-flex items-center gap-2 text-accent-emerald">
                  <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /> Compounds that engage it
                </h2>
                <ul className="space-y-2">
                  {compounds.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/library/compounds/${c.slug}`}
                        className="focus-ring group inline-flex items-center gap-2 rounded text-sm text-muted-foreground transition hover:text-accent-cyan"
                      >
                        {c.title}
                        <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
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
              href="/library/compounds"
              className="focus-ring interactive inline-flex items-center gap-2 rounded-xl bg-accent-cyan/10 px-5 py-3 text-sm font-semibold text-accent-cyan transition hover:bg-accent-cyan/20"
            >
              Browse the compound library <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/pathways"
              className="focus-ring interactive inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              All pathways
            </Link>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
