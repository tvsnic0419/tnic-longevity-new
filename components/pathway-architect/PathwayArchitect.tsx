'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Search, X, Plus, Check, ExternalLink, Share2, Printer, Trash2,
  Sparkles, AlertTriangle, Layers, Network, Target,
} from 'lucide-react';
import {
  COMPOUND_DB, CDB, HALLMARK_MAP, PATHWAY_LABELS, TIER_META, DEFAULT_WEIGHTS,
  analyzeStack, tierColor, tierInk, scoreInk,
  type Compound, type StagedItem, type PathwayId, type BreakdownTone,
} from '@/lib/compound-engine-data';
import { STARTER_STACKS, PATHWAY_PARAM, parsePathwayParam, buildPathwayArchitectUrl } from '@/lib/pathway-architect-data';
import { usePathwayArchitectStore } from '@/stores/pathwayArchitectStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { PageHeader } from '@/components/ui/PageHeader';
import { getHubContext } from '@/lib/hub-context';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

const toneClass: Record<BreakdownTone, string> = {
  neutral: 'bg-muted-foreground/40',
  cyan: 'bg-accent-cyan',
  indigo: 'bg-accent-violet',
  gold: 'bg-accent-amber',
  rose: 'bg-accent-rose',
};

function toStagedItem(c: Compound): StagedItem {
  return { uid: c.id, data: c, name: c.name, brand: '', dose: c.dose, form: 'std', source: 'curated' };
}

function CompoundCard({
  compound,
  selected,
  onToggle,
}: {
  compound: Compound;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const tier = TIER_META[compound.tier];
  return (
    <li className="list-none">
      <GlassPanel
        depth="mid"
        className={`glass-hover rounded-2xl h-full transition-colors ${
          selected ? 'ring-1 ring-accent-amber/60' : ''
        }`}
      >
        <div className="p-4 flex flex-col h-full gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="heading-card text-base leading-tight truncate">{compound.name}</h3>
              <p className="text-caption text-muted-foreground truncate">{compound.full}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggle(compound.id)}
              aria-pressed={selected}
              aria-label={selected ? `Remove ${compound.name} from protocol` : `Add ${compound.name} to protocol`}
              className={`focus-ring interactive shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                selected
                  ? 'bg-accent-amber text-black border-accent-amber'
                  : 'border-border text-muted-foreground hover:border-accent-amber hover:text-accent-amber'
              }`}
            >
              {selected ? <Check className="w-4 h-4" aria-hidden="true" /> : <Plus className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>

          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wide"
            style={{ color: tierInk(compound.tier), background: `color-mix(in srgb, ${tierColor(compound.tier)} 14%, transparent)` }}
          >
            Tier {compound.tier} · {tier.label}
          </span>

          <div className="flex flex-wrap gap-1">
            {compound.pathways.slice(0, 4).map((p) => (
              <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {PATHWAY_LABELS[p]}
              </span>
            ))}
          </div>

          <p className="text-body-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">{compound.note}</p>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
            <span className="text-caption font-mono text-muted-foreground">{compound.dose}</span>
            {compound.libraryHref ? (
              <Link
                href={compound.libraryHref}
                className="focus-ring interactive inline-flex items-center gap-1 text-caption font-semibold text-accent-cyan hover:underline rounded"
              >
                Evidence
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </Link>
            ) : (
              <span className="text-caption text-muted-foreground/50">No deep-dive yet</span>
            )}
          </div>
        </div>
      </GlassPanel>
    </li>
  );
}

export function PathwayArchitect() {
  const searchParams = useSearchParams();
  const { selectedIds, setAll, toggle, clear } = usePathwayArchitectStore();

  const [query, setQuery] = useState('');
  const [pathwayFilter, setPathwayFilter] = useState<PathwayId | 'all'>('all');
  const [announcement, setAnnouncement] = useState('');
  const seededFromUrl = useRef(false);

  // A shared link's ?p= param seeds (and overrides) the persisted selection
  // exactly once per page load, so a share link is deterministic for the
  // person opening it without permanently discarding their own saved protocol
  // on every future visit to the bare /tools/pathway-architect URL.
  useEffect(() => {
    if (seededFromUrl.current) return;
    seededFromUrl.current = true;
    const fromUrl = parsePathwayParam(searchParams.get(PATHWAY_PARAM));
    if (fromUrl.length > 0) {
      setAll(fromUrl.map((c) => c.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncUrl = useCallback((ids: string[]) => {
    const url = new URL(window.location.href);
    if (ids.length > 0) {
      url.searchParams.set(PATHWAY_PARAM, ids.join(','));
    } else {
      url.searchParams.delete(PATHWAY_PARAM);
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  const selectedCompounds = useMemo(
    () => selectedIds.map((id) => CDB[id]).filter((c): c is Compound => Boolean(c)),
    [selectedIds],
  );

  const analysis = useMemo(
    () => analyzeStack(selectedCompounds.map(toStagedItem), DEFAULT_WEIGHTS),
    [selectedCompounds],
  );

  const handleToggle = useCallback(
    (id: string) => {
      const wasSelected = selectedIds.includes(id);
      toggle(id);
      const nextIds = wasSelected ? selectedIds.filter((x) => x !== id) : [...selectedIds, id];
      syncUrl(nextIds);
      const compound = CDB[id];
      trackEvent(wasSelected ? ANALYTICS_EVENTS.pathwayArchitectRemove : ANALYTICS_EVENTS.pathwayArchitectAdd, {
        compound: id,
      });
      setAnnouncement(
        `${wasSelected ? 'Removed' : 'Added'} ${compound?.name ?? id}. Protocol now has ${nextIds.length} compound${
          nextIds.length === 1 ? '' : 's'
        }.`,
      );
    },
    [selectedIds, toggle, syncUrl],
  );

  const handleStarterStack = useCallback(
    (key: string, ids: string[], label: string) => {
      setAll(ids);
      syncUrl(ids);
      trackEvent(ANALYTICS_EVENTS.pathwayArchitectStarterStack, { stack: key });
      setAnnouncement(`Loaded ${label} — ${ids.length} compounds.`);
    },
    [setAll, syncUrl],
  );

  const handleClear = useCallback(() => {
    clear();
    syncUrl([]);
    setAnnouncement('Protocol cleared.');
  }, [clear, syncUrl]);

  const handleShare = useCallback(async () => {
    const url = buildPathwayArchitectUrl(selectedIds);
    const fullUrl = `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast('Link copied', { description: 'Your protocol link is on the clipboard.' });
    } catch {
      toast('Copy failed', { description: fullUrl });
    }
    trackEvent(ANALYTICS_EVENTS.pathwayArchitectShare, { count: selectedIds.length });
  }, [selectedIds]);

  const handlePrint = useCallback(() => {
    trackEvent(ANALYTICS_EVENTS.pathwayArchitectPrint, { count: selectedIds.length });
    window.print();
  }, [selectedIds]);

  const filteredCompounds = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPOUND_DB.filter((c) => {
      if (pathwayFilter !== 'all' && !c.pathways.includes(pathwayFilter)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.full.toLowerCase().includes(q) ||
        c.cls.toLowerCase().includes(q) ||
        c.aliases.some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [query, pathwayFilter]);

  const pathwayOptions = useMemo(
    () =>
      (Object.entries(PATHWAY_LABELS) as [PathwayId, string][]).sort((a, b) => a[1].localeCompare(b[1])),
    [],
  );

  return (
    <div className="container-page py-10 md:py-14">
      <div aria-live="polite" className="sr-only">{announcement}</div>

      <div className="no-print">
        <PageHeader
          icon={Layers}
          eyebrow="Pathway Architect"
          title="Build a protocol, watch the biology respond."
          description="Add compounds one at a time — synergy score, hallmark coverage, convergent pathways, and interaction cautions update live from the same curated dataset behind the Compound Intelligence Engine."
          theme="amber"
          context={getHubContext('pathwayArchitect')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* ── Compound browser ────────────────────────────────────────── */}
        <div className="no-print">
          <section aria-labelledby="starter-stacks-heading" className="mb-8">
            <h2 id="starter-stacks-heading" className="text-label mb-3 text-accent-amber">
              Starter stacks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STARTER_STACKS.map((stack) => (
                <button
                  key={stack.key}
                  type="button"
                  onClick={() => handleStarterStack(stack.key, stack.ids, stack.label)}
                  className="focus-ring interactive glass glass-hover text-left rounded-xl p-4"
                >
                  <p className="text-sm font-bold mb-1">{stack.label}</p>
                  <p className="text-caption text-muted-foreground leading-relaxed">{stack.desc}</p>
                  <p className="text-caption font-mono text-accent-amber mt-1.5">
                    {stack.ids.map((id) => CDB[id]?.name ?? id).join(' + ')}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="compound-browser-heading">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
              <h2 id="compound-browser-heading" className="sr-only">Browse compounds</h2>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search compounds…"
                  aria-label="Search compounds"
                  className="focus-ring w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2.5 text-sm"
                />
              </div>
              <select
                value={pathwayFilter}
                onChange={(e) => setPathwayFilter(e.target.value as PathwayId | 'all')}
                aria-label="Filter by pathway"
                className="focus-ring rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
              >
                <option value="all">All pathways</option>
                {pathwayOptions.map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            {filteredCompounds.length === 0 ? (
              <p className="text-body-sm text-muted-foreground py-12 text-center">
                No compounds match &ldquo;{query}&rdquo;.
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCompounds.map((c) => (
                  <CompoundCard key={c.id} compound={c} selected={selectedIds.includes(c.id)} onToggle={handleToggle} />
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ── Protocol panel ───────────────────────────────────────────── */}
        <aside
          aria-label="Your protocol"
          className="lg:sticky lg:top-24 print-protocol-panel"
        >
          <GlassPanel depth="float" className="rounded-2xl">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="heading-card text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent-amber" aria-hidden="true" />
                  Your Protocol
                </h2>
                {selectedCompounds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="focus-ring interactive no-print inline-flex items-center gap-1 text-caption text-muted-foreground hover:text-accent-rose rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Clear
                  </button>
                )}
              </div>

              {selectedCompounds.length === 0 ? (
                <p className="text-body-sm text-muted-foreground">
                  Add compounds from the browser, or load a starter stack, to see live synergy detection and hallmark coverage here.
                </p>
              ) : (
                <>
                  <ul className="flex flex-wrap gap-2 mb-5">
                    {selectedCompounds.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => handleToggle(c.id)}
                          className="focus-ring interactive no-print inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-caption font-semibold hover:bg-accent-rose/15 hover:text-accent-rose transition-colors"
                        >
                          {c.name}
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span className="hidden print-only text-caption font-semibold">{c.name}</span>
                      </li>
                    ))}
                  </ul>

                  {analysis.synergyScore !== null && (
                    <div className="mb-5">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-label text-muted-foreground">Synergy score</span>
                        <span className="text-2xl font-mono font-bold tabular-nums" style={{ color: scoreInk(analysis.synergyScore) }}>
                          {analysis.synergyScore}
                        </span>
                      </div>
                      <div className="space-y-1.5" role="img" aria-label={`Synergy score breakdown, total ${analysis.synergyScore}`}>
                        {analysis.breakdown.map((row) => (
                          <div key={row.label} className="flex items-center gap-2 text-caption">
                            <span className="w-32 shrink-0 text-muted-foreground truncate">{row.label}</span>
                            <span className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <span
                                className={`block h-full rounded-full ${toneClass[row.tone]}`}
                                style={{ width: `${Math.min(Math.abs(row.value), 100)}%` }}
                              />
                            </span>
                            <span className="w-8 text-right font-mono text-muted-foreground">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-5">
                    <p className="text-label text-muted-foreground mb-1.5">Hallmark coverage</p>
                    <p className="text-sm font-semibold">
                      {analysis.coveredCount} / 12 hallmarks — {Math.round(analysis.coveragePct * 100)}%
                    </p>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1.5">
                      <span
                        className="block h-full rounded-full bg-accent-emerald"
                        style={{ width: `${analysis.coveragePct * 100}%` }}
                      />
                    </div>
                  </div>

                  {analysis.convergent.length > 0 && (
                    <div className="mb-5">
                      <p className="text-label text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5" aria-hidden="true" />
                        Convergent pathways
                      </p>
                      <ul className="space-y-1.5">
                        {analysis.convergent.map((c) => (
                          <li key={c.p} className="text-caption text-muted-foreground">
                            <span className="font-semibold text-foreground">{PATHWAY_LABELS[c.p]}</span>
                            {' — '}{c.members.join(', ')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.synergies.length > 0 && (
                    <div className="mb-5">
                      <p className="text-label text-accent-emerald mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        Synergies
                      </p>
                      <ul className="space-y-2">
                        {analysis.synergies.map((s, i) => (
                          <li key={i} className="text-caption text-muted-foreground leading-relaxed">
                            <span className="font-semibold text-foreground">{s.a} + {s.b}</span> — {s.rationale}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(analysis.cautions.length > 0 || analysis.redundancies.length > 0) && (
                    <div className="mb-5">
                      <p className="text-label text-accent-amber mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                        Cautions
                      </p>
                      <ul className="space-y-2">
                        {analysis.cautions.map((c, i) => (
                          <li key={`c-${i}`} className="text-caption text-muted-foreground leading-relaxed">
                            {c.a && c.b ? <span className="font-semibold text-foreground">{c.a} + {c.b}</span> : null}
                            {c.a && c.b ? ' — ' : ''}{c.rationale}
                          </li>
                        ))}
                        {analysis.redundancies.map((r, i) => (
                          <li key={`r-${i}`} className="text-caption text-muted-foreground leading-relaxed">
                            <span className="font-semibold text-foreground">{r.label}</span> ({r.members.join(', ')}) — {r.rationale}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.gaps.length > 0 && (
                    <div className="mb-1 no-print">
                      <p className="text-label text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" aria-hidden="true" />
                        Uncovered hallmarks
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.gaps.map((h) => (
                          <span key={h.id} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {HALLMARK_MAP[h.id].short}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 mt-4 border-t border-border/50 no-print">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="focus-ring interactive flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-amber text-black px-4 py-2.5 text-sm font-semibold hover:brightness-110 transition-all"
                    >
                      <Share2 className="w-4 h-4" aria-hidden="true" />
                      Share
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="focus-ring interactive inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:border-accent-amber transition-colors"
                    >
                      <Printer className="w-4 h-4" aria-hidden="true" />
                      Print
                    </button>
                  </div>
                </>
              )}
            </div>
          </GlassPanel>
        </aside>
      </div>
    </div>
  );
}
