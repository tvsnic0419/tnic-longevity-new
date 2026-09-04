import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import type { Metadata } from 'next';
import { StructuredData } from '@/components/seo/StructuredData';
import { PageHeader } from '@/components/ui/PageHeader';
import { HeadToHeadCompare } from '@/components/library/HeadToHeadCompare';
import { HeadToHeadPicker } from '@/components/library/HeadToHeadPicker';
import { buildBreadcrumbSchema, buildPageMetadata } from '@/lib/seo';
import {
  DEFAULT_PAIR,
  buildHeadToHead,
  comparableCompounds,
  isComparableId,
} from '@/lib/head-to-head';

// The tool accepts ~3,200 possible pairings via ?a=&b=. Every one of those is a
// real, shareable, server-rendered address — but only the base URL is
// canonical, so the parameterized variants never become thin doorway pages in
// the index. buildPageMetadata canonicalizes to the `path` it is given.
const BASE_PATH = '/library/compare/head-to-head';

type SearchParams = Promise<{ a?: string; b?: string }>;

/** Resolve requested ids, falling back to the default pair on anything invalid. */
function resolvePair(a?: string, b?: string): { a: string; b: string } {
  const validA = a && isComparableId(a) ? a : DEFAULT_PAIR.a;
  const validB = b && isComparableId(b) && b !== validA ? b : null;
  if (validB) return { a: validA, b: validB };
  // Keep the two sides distinct even when the request collides.
  const fallbackB = validA === DEFAULT_PAIR.b ? DEFAULT_PAIR.a : DEFAULT_PAIR.b;
  return { a: validA, b: fallbackB };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const requested = await searchParams;
  const { a, b } = resolvePair(requested.a, requested.b);
  const result = buildHeadToHead(a, b);
  const names = result ? `${result.a.compound.name} vs ${result.b.compound.name}` : 'Any two compounds';

  return buildPageMetadata({
    title: `Compare ${names} — Head-to-Head Evidence`,
    description:
      `Weigh ${names} side by side on six derived evidence dimensions, hallmark coverage, studied dose, and published bioavailability. Free-form comparison across every evidence-graded compound in the TNiC library.`,
    path: BASE_PATH,
    keywords: ['compare longevity supplements', 'supplement comparison tool', 'evidence comparison'],
  });
}

export default async function HeadToHeadPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { a, b } = resolvePair(params.a, params.b);
  const result = buildHeadToHead(a, b);
  const options = comparableCompounds();

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Library', path: '/library' },
      { name: 'Comparisons', path: '/library/compare' },
      { name: 'Head-to-Head', path: BASE_PATH },
    ]),
  ];

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <StructuredData schemas={schemas} />
      <div className="container-page">
        <Link
          href="/library/compare"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-cyan mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Comparisons
        </Link>

        <PageHeader
          icon={Scale}
          eyebrow="Library · Evidence Tools"
          title="Head-to-Head"
          description={`Pick any two of the ${options.length} evidence-graded compounds and weigh them against each other — six derived evidence dimensions, hallmark overlap, studied dose, and published bioavailability. Where the data can't support a call, it says so instead of guessing.`}
          theme="cyan"
          align="left"
        />

        <div className="mt-6">
          <HeadToHeadPicker options={options} a={a} b={b} />
        </div>

        {result ? (
          <HeadToHeadCompare result={result} />
        ) : (
          <p className="premium-card p-6 mt-8 text-body-sm text-muted-foreground">
            Those two compounds can&apos;t be compared. Pick a different pair above.
          </p>
        )}
      </div>
    </div>
  );
}
