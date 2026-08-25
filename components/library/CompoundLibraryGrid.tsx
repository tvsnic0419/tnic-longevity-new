'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X } from 'lucide-react';
import type { LibraryModule } from '@/lib/library-modules';
import { getModulePath } from '@/lib/library-modules';
import { hasGeometry } from '@/components/viz/molecule';
import { signatureHue } from '@/components/viz/tokens';
import { MoleculeStage } from '@/components/viz/MoleculeStage';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { hallmarks } from '@/lib/data/hallmarks';

type TierFilter = 'all' | 'A' | 'B' | 'C';
type BuildableFilter = 'all' | 'buildable' | 'library-only';

const HALLMARK_SHORT: Record<string, string> = {
  genomic: 'Genomic',
  telomeres: 'Telomeres',
  epigenetic: 'Epigenetic',
  proteostasis: 'Proteostasis',
  autophagy: 'Autophagy',
  mito: 'Mitochondrial',
  senescence: 'Senescence',
  stem: 'Stem Cells',
  communication: 'Intercellular',
  inflammation: 'Inflammation',
  dysbiosis: 'Dysbiosis',
  nutrient: 'Nutrient Sensing',
};

/**
 * Browsable, filterable index for a library category's modules. Search runs
 * client-side over data already sent with the page (no network round-trip),
 * and no useSearchParams is involved — filter state lives in plain useState
 * — so this stays a straightforward client island that doesn't force its
 * parent route to opt out of server rendering (see SubPageLayout/ContextBar
 * for the shape of that bug when a filter *does* need to read the URL).
 */
export function CompoundLibraryGrid({ modules }: { modules: LibraryModule[] }) {
  const [query, setQuery] = useState('');
  const [hallmark, setHallmark] = useState<string | null>(null);
  const [tier, setTier] = useState<TierFilter>('all');
  const [buildable, setBuildable] = useState<BuildableFilter>('all');

  const activeHallmarkIds = useMemo(
    () => new Set(modules.flatMap((m) => m.relatedHallmarkIds)),
    [modules],
  );
  const hallmarkOptions = hallmarks.filter((h) => activeHallmarkIds.has(h.id));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules.filter((m) => {
      if (q && !`${m.title} ${m.tagline} ${m.summary}`.toLowerCase().includes(q)) return false;
      if (hallmark && !m.relatedHallmarkIds.includes(hallmark)) return false;
      if (tier !== 'all' && m.evidenceTier !== tier) return false;
      if (buildable === 'buildable' && !m.compoundId) return false;
      if (buildable === 'library-only' && m.compoundId) return false;
      return true;
    });
  }, [modules, query, hallmark, tier, buildable]);

  const hasActiveFilter = query || hallmark || tier !== 'all' || buildable !== 'all';

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${modules.length} compounds by name or mechanism…`}
            className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2.5 text-sm focus-ring"
            aria-label="Search compounds"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden text-xs font-semibold">
            {(['all', 'A', 'B', 'C'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`focus-ring px-3 py-1.5 transition ${
                  tier === t ? 'bg-accent-cyan text-black' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'all' ? 'All tiers' : `Tier ${t}`}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border border-border overflow-hidden text-xs font-semibold">
            {([
              ['all', 'All'],
              ['buildable', 'Stack-buildable'],
              ['library-only', 'Library-only'],
            ] as const).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setBuildable(v)}
                className={`focus-ring px-3 py-1.5 transition ${
                  buildable === v ? 'bg-accent-violet text-white' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setHallmark(null);
                setTier('all');
                setBuildable('all');
              }}
              className="focus-ring inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent-rose transition"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {hallmarkOptions.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setHallmark(hallmark === h.id ? null : h.id)}
              className={`focus-ring rounded-full border px-2.5 py-1 text-caption font-medium transition ${
                hallmark === h.id
                  ? 'border-accent-emerald bg-accent-emerald/15 text-accent-emerald'
                  : 'border-border text-muted-foreground hover:border-accent-emerald/40 hover:text-foreground'
              }`}
            >
              {HALLMARK_SHORT[h.id] ?? h.title}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">
        {filtered.length} of {modules.length} shown
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No compounds match these filters.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mod) => {
            const geomId = mod.compoundId ?? mod.slug;
            const structured = hasGeometry(geomId);
            const hue = signatureHue(geomId);
            return (
              <Link
                key={mod.slug}
                href={getModulePath(mod)}
                className="focus-ring interactive card-elevated flex h-full flex-col overflow-hidden group"
              >
                <div className="relative aspect-[16/9] w-full bg-black/20">
                  <MoleculeStage
                    geometryId={structured ? geomId : undefined}
                    hue={hue}
                    interactive={false}
                    animate={false}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <EvidenceTag tier={mod.evidenceTier} size="sm" />
                    {mod.requiresDisclaimer ? (
                      <span className="text-micro font-mono text-accent-amber">Rx</span>
                    ) : mod.compoundId ? (
                      <span className="text-micro font-mono text-accent-cyan">Stack-buildable</span>
                    ) : null}
                  </div>
                  <h2 className="heading-card mb-1 group-hover:text-accent-cyan transition-colors">
                    {mod.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-3">{mod.tagline}</p>
                  <p className="text-body-sm flex-1">{mod.summary.slice(0, 120)}…</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-accent-cyan group-hover:text-accent-emerald">
                    Deep dive <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
