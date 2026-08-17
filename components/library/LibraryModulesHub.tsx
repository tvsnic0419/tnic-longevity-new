'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Pill, Layers, HeartPulse, FlaskConical, Scale } from 'lucide-react';
import {
  libraryModules,
  libraryCategoryMeta,
  getModulePath,
  type LibraryModuleCategory,
} from '@/lib/library-modules';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PageHeader } from '@/components/ui/PageHeader';
import { RevealItem } from '@/components/ui/RevealItem';
import { signatureHue } from '@/components/viz/tokens';
import { getHubContext } from '@/lib/hub-context';

const categoryIcons: Record<LibraryModuleCategory, typeof Pill> = {
  compounds: Pill,
  synergies: Layers,
  lifestyle: HeartPulse,
  guides: FlaskConical,
};

const categoryOrder = (Object.keys(libraryCategoryMeta) as LibraryModuleCategory[]).sort(
  (a, b) => libraryCategoryMeta[a].hubOrder - libraryCategoryMeta[b].hubOrder,
);

export function LibraryModulesHub() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return libraryModules;
    const q = query.toLowerCase();
    return libraryModules.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.outline.some((o) => o.toLowerCase().includes(q)),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<LibraryModuleCategory, typeof libraryModules>();
    categoryOrder.forEach((cat) => map.set(cat, []));
    filtered.forEach((m) => {
      const list = map.get(m.category) ?? [];
      list.push(m);
      map.set(m.category, list);
    });
    return map;
  }, [filtered]);

  return (
    <section
      id="content-modules"
      aria-labelledby="modules-heading"
      className="py-8 md:py-12 canvas-scrim border-b border-border"
    >
      <div className="container-page">
        <PageHeader
          id="modules-heading"
          icon={FlaskConical}
          eyebrow="Content Modules"
          title="Elite Anti-Aging Library"
          description="Compound deep-dives, synergy guides, lifestyle pillars, and testing protocols — evidence-graded, MDX-ready, with personal tracking templates."
          theme="emerald"
          as="h2"
          context={getHubContext('libraryModules')}
          contextVariant="compact"
        />

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Link
            href="/library/compare"
            className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover text-sm font-semibold text-accent-cyan"
          >
            <Scale className="w-4 h-4" />
            Evidence comparisons
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative max-w-lg mx-auto mb-10">
          <label htmlFor="module-search" className="sr-only">
            Search library modules
          </label>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="module-search"
            type="search"
            placeholder="Search compounds, synergies, lifestyle, guides…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-base pl-11"
          />
        </div>

        <div className="space-y-14">
          {categoryOrder.map((category) => {
            const modules = grouped.get(category) ?? [];
            if (modules.length === 0) return null;
            const meta = libraryCategoryMeta[category];
            const Icon = categoryIcons[category];

            return (
              <div key={category}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 shrink-0">
                    <Icon className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="heading-section text-xl md:text-2xl">{meta.label}</h3>
                    <p className="text-body-sm text-muted-foreground mt-1">{meta.description}</p>
                  </div>
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
                          <h4 className="heading-card mb-1 flex items-center gap-2 transition-colors group-hover:[color:var(--card-accent)]">
                            <span
                              aria-hidden="true"
                              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                            />
                            {mod.title}
                          </h4>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}