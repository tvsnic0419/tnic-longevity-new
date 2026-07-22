import Link from 'next/link';
import { ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react';
import {
  getModulesByCategory,
  getModulePath,
  libraryCategoryMeta,
  type LibraryModuleCategory,
} from '@/lib/library-modules';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PageHeader } from '@/components/ui/PageHeader';

/**
 * Dedicated landing page for a single library category (compounds, synergies,
 * lifestyle, guides). Gives every category a real, crawlable index URL instead
 * of a soft-404, and — for /library/compounds — a permanent home listing all of
 * the compound deep-dives so none of them can quietly fall off the site.
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.slug}
              href={getModulePath(mod)}
              className="focus-ring interactive card-elevated p-5 flex flex-col h-full group"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <EvidenceTag tier={mod.evidenceTier} size="sm" />
                {mod.requiresDisclaimer && (
                  <span className="text-[10px] font-mono text-accent-amber">Rx</span>
                )}
              </div>
              <h2 className="heading-card mb-1 group-hover:text-accent-cyan transition-colors">
                {mod.title}
              </h2>
              <p className="text-xs text-muted-foreground mb-3">{mod.tagline}</p>
              <p className="text-body-sm flex-1">{mod.summary.slice(0, 120)}…</p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-accent-cyan group-hover:text-accent-emerald">
                Deep dive <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
