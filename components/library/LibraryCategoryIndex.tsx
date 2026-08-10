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
import { RevealItem } from '@/components/ui/RevealItem';
import { signatureHue } from '@/components/viz/tokens';

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
          {modules.map((mod, i) => {
            const [r, g, b] = signatureHue(mod.slug);
            const accent = `rgb(${r}, ${g}, ${b})`;
            return (
              <RevealItem key={mod.slug} index={i} className="h-full">
                <Link
                  href={getModulePath(mod)}
                  style={{ ['--card-accent' as string]: accent }}
                  className="premium-card focus-ring group h-full p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <EvidenceTag tier={mod.evidenceTier} size="sm" />
                    {mod.requiresDisclaimer && (
                      <span className="rounded border border-accent-amber/30 bg-accent-amber/10 px-1.5 py-0.5 text-micro font-mono font-semibold text-accent-amber">
                        Rx
                      </span>
                    )}
                  </div>
                  <h2 className="heading-card mb-1 flex items-center gap-2 transition-colors group-hover:[color:var(--card-accent)]">
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                    />
                    {mod.title}
                  </h2>
                  <p className="mb-3 text-xs text-muted-foreground">{mod.tagline}</p>
                  <p className="text-body-sm flex-1">{mod.summary.slice(0, 120)}…</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold [color:var(--card-accent)]">
                    Deep dive
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </div>
      </div>
    </div>
  );
}
