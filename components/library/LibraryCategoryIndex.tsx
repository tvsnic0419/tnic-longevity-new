import Link from 'next/link';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import {
  getModulesByCategory,
  libraryCategoryMeta,
  type LibraryModuleCategory,
} from '@/lib/library-modules';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PageHeader } from '@/components/ui/PageHeader';
import { CompoundLibraryGrid } from '@/components/library/CompoundLibraryGrid';

/**
 * Dedicated landing page for a single library category (compounds, synergies,
 * lifestyle, guides). Gives every category a real, crawlable index URL instead
 * of a soft-404, and — for /library/compounds — a permanent home listing all of
 * the compound deep-dives so none of them can quietly fall off the site.
 *
 * The module list itself is server-rendered (crawlable, no client JS needed to
 * see all 55 titles); CompoundLibraryGrid layers search/filter/molecule-thumbnail
 * browsing on top as a client island that reads plain useState, not
 * useSearchParams, so it never forces this route out of server rendering.
 */
export function LibraryCategoryIndex({ category }: { category: LibraryModuleCategory }) {
  const meta = libraryCategoryMeta[category];
  const modules = getModulesByCategory(category);

  const tierCounts = modules.reduce<Record<string, number>>((acc, m) => {
    acc[m.evidenceTier] = (acc[m.evidenceTier] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <div className="container-page">
        <Link
          href="/library#content-modules"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <PageHeader
          icon={FlaskConical}
          eyebrow="Content Modules"
          title={meta.label}
          description={meta.description}
          theme="emerald"
        />

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{modules.length} entries</span>
          {(['A', 'B', 'C'] as const).map((tier) =>
            tierCounts[tier] ? (
              <span key={tier} className="inline-flex items-center gap-1.5">
                <EvidenceTag tier={tier} size="sm" />
                <span>{tierCounts[tier]}</span>
              </span>
            ) : null,
          )}
        </div>

        <CompoundLibraryGrid modules={modules} />
      </div>
    </div>
  );
}
