'use client';

/**
 * Combination Lab — interactive combination-analysis engine for TNiC stacks.
 * Three regions: compound library · network graph · analysis tabs.
 * Selection syncs with the sitewide stack via PlatformContext (`useStack`),
 * so compounds added here are the same compounds the rest of the site sees.
 * The scoring config persists under its own namespaced localStorage key and
 * never touches PlatformContext storage.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  FlaskConical,
  Gauge,
  Link2,
  ListChecks,
  Network,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { compounds } from '@/lib/data';
import type { EvidenceTier } from '@/lib/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageShell } from '@/components/ui/PageShell';
import { TabBar } from '@/components/ui/TabBar';
import type { TabItem } from '@/components/ui/TabBar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  LAB_CONFIG_STORAGE_KEY,
  LAB_SYSTEMS,
  cloneLabConfig,
  computeLabScore,
  compoundToLabNode,
  getLabCompound,
  pairKey,
  sanitizeLabConfig,
  type LabRelationship,
  type LabScoringConfig,
} from '@/lib/combination-lab';
import { LabGraph } from './LabGraph';
import {
  ConfigPanel,
  MarginalPanel,
  OptimizePanel,
  OverviewPanel,
  RelationsPanel,
  TierBadge,
  WhyPanel,
} from './LabPanels';

type LabTab = 'overview' | 'relations' | 'marginal' | 'optimize' | 'config';

/* ------------------------------------------------------------------ */
/* Compound library (left region)                                      */
/* ------------------------------------------------------------------ */

function CompoundLibrary({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [hallmarkFilter, setHallmarkFilter] = useState<ReadonlySet<string>>(new Set());
  const [tierFilter, setTierFilter] = useState<'all' | EvidenceTier>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return compounds.filter(
      (c) =>
        (tierFilter === 'all' || c.evidence === tierFilter) &&
        (hallmarkFilter.size === 0 || c.hallmarks.some((h) => hallmarkFilter.has(h))) &&
        (q === '' || c.name.toLowerCase().includes(q) || c.pathway.toLowerCase().includes(q)),
    );
  }, [query, hallmarkFilter, tierFilter]);

  const toggleHallmark = (id: string) => {
    setHallmarkFilter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const searchField = (
    <div className="relative">
      <label htmlFor="lab-search" className="sr-only">
        Search compounds by name or pathway
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="lab-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search compounds…"
        className="input-base pl-9"
      />
    </div>
  );

  return (
    <>
      {/* Mobile: compact strip */}
      <div className="lg:hidden">
        {searchField}
        <div className="scroll-region mt-3 flex gap-2 pb-1">
          {filtered.slice(0, 40).map((c) => {
            const isIn = selected.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={isIn}
                onClick={() => onToggle(c.id)}
                className={cn(
                  'focus-ring interactive flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-caption font-semibold',
                  isIn
                    ? 'border-accent-violet/50 bg-accent-violet/10 text-accent-violet'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {isIn ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                {c.name}
                <TierBadge tier={c.evidence} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: full filter panel */}
      <div className="hidden lg:block">
        <div className="glass rounded-2xl p-4">
          <p className="text-label mb-3 text-accent-violet">Compound library</p>
          {searchField}

          <p className="text-label mt-4 mb-2">Hallmark filter</p>
          <div className="flex flex-wrap gap-1.5">
            {LAB_SYSTEMS.map((s) => {
              const on = hallmarkFilter.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleHallmark(s.id)}
                  className={cn(
                    'focus-ring interactive rounded border px-1.5 py-0.5 text-micro',
                    on
                      ? 'border-accent-violet/50 bg-accent-violet/10 text-accent-violet'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <p className="text-label mt-4 mb-2">Evidence tier</p>
          <div className="flex gap-1.5" role="group" aria-label="Filter by evidence tier">
            {(['all', 'A', 'B', 'C'] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tierFilter === t}
                onClick={() => setTierFilter(t)}
                className={cn(
                  'focus-ring interactive rounded-lg border px-3 py-1.5 text-caption font-semibold',
                  tierFilter === t
                    ? 'border-accent-violet/50 bg-accent-violet/10 text-accent-violet'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {t === 'all' ? 'All' : `Tier ${t}`}
              </button>
            ))}
          </div>

          <p className="mt-4 text-caption text-muted-foreground" aria-live="polite">
            {filtered.length} of {compounds.length} compounds
          </p>
          <ul className="mt-2 max-h-[460px] space-y-1.5 overflow-y-auto scroll-region pr-1">
            {filtered.map((c) => {
              const isIn = selected.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={isIn}
                    onClick={() => onToggle(c.id)}
                    className={cn(
                      'focus-ring interactive w-full rounded-xl border px-3 py-2.5 text-left',
                      isIn ? 'border-accent-violet/50 bg-accent-violet/5' : 'border-border hover:border-accent-violet/30',
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-body-sm font-semibold text-foreground">{c.name}</span>
                      <span className="flex items-center gap-1.5">
                        <TierBadge tier={c.evidence} />
                        {isIn ? (
                          <Check className="h-4 w-4 text-accent-violet" aria-hidden="true" />
                        ) : (
                          <Plus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        )}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-caption text-muted-foreground">
                      {c.pathway} · {c.dose}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Main tool                                                           */
/* ------------------------------------------------------------------ */

export function CombinationLab() {
  const { selected, toggle, setSelected, shareUrl } = useStack();

  /* Editable scoring config — defaults on server/first paint, persisted
     copy hydrates after mount to avoid an SSR/CSR mismatch. */
  const [config, setConfigState] = useState<LabScoringConfig>(() => cloneLabConfig());
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAB_CONFIG_STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate persisted weights after mount
        setConfigState(sanitizeLabConfig(JSON.parse(raw)));
      }
    } catch {
      /* storage unavailable or corrupt — defaults already active */
    }
  }, []);

  const updateConfig = (next: LabScoringConfig) => {
    setConfigState(next);
    try {
      window.localStorage.setItem(LAB_CONFIG_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — config stays session-only */
    }
  };
  const resetConfig = () => {
    setConfigState(cloneLabConfig());
    try {
      window.localStorage.removeItem(LAB_CONFIG_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  const [tab, setTab] = useState<LabTab>('overview');
  const [selectedPairKey, setSelectedPairKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => computeLabScore(selected, config), [selected, config]);
  const nodes = useMemo(
    () =>
      selected
        .map(getLabCompound)
        .filter((c): c is NonNullable<typeof c> => c !== undefined)
        .map(compoundToLabNode),
    [selected],
  );
  const activeRelationship: LabRelationship | null =
    result.relationships.find((r) => pairKey(r.pair[0], r.pair[1]) === selectedPairKey) ?? null;

  const selectRelationship = (r: LabRelationship) => setSelectedPairKey(pairKey(r.pair[0], r.pair[1]));

  const clearAll = () => {
    setSelected([]);
    setSelectedPairKey(null);
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const tabs: TabItem<LabTab>[] = [
    { id: 'overview', label: 'Overview', icon: Gauge },
    {
      id: 'relations',
      label: 'Relations',
      icon: Network,
      badge: result.relationships.length > 0 ? String(result.relationships.length) : undefined,
    },
    { id: 'marginal', label: 'Marginal', icon: TrendingUp },
    { id: 'optimize', label: 'Optimize', icon: ListChecks },
    { id: 'config', label: 'Config', icon: SlidersHorizontal },
  ];

  return (
    <section id="lab" aria-label="Combination Lab">
      <PageShell>
        <PageHeader
          icon={FlaskConical}
          eyebrow="Combination Lab"
          title="Combination Lab"
          description="Progressive relationship analysis for your stack: every pair classified, every point in the score itemized, every compound judged on what it actually adds. Curated interactions are demonstrated; ontology-derived links are labeled as mechanistic hypotheses — never silently blended."
          meta="SYNERGY · REDUNDANCY · ANTAGONISM · MARGINAL CONTRIBUTION · EXPLAINABLE SCORING"
          theme="violet"
          as="h1"
        />

        {/* Sync strip */}
        <div className="glass mb-6 flex flex-wrap items-center gap-3 rounded-xl px-4 py-3">
          <p className="text-caption text-muted-foreground">
            <span className="font-mono tabular-nums text-foreground">{selected.length}</span>{' '}
            compound{selected.length === 1 ? '' : 's'} —{' '}
            <span className="text-accent-emerald">synced with your TNiC stack</span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={Link2} onClick={() => void copyShareLink()}>
              {copied ? 'Copied' : 'Copy share link'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={clearAll}
              disabled={selected.length === 0}
            >
              Clear all
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)_360px]">
          {/* Left — library (compact strip on mobile) */}
          <div>
            <CompoundLibrary selected={selected} onToggle={toggle} />
          </div>

          {/* Center — network graph + WHY panel, or a designed empty state
              before anything is added (the graph is meaningless with 0 nodes). */}
          <div className="min-w-0">
            {selected.length === 0 ? (
              <div className="glass flex min-h-[360px] flex-col items-center justify-center rounded-2xl p-8 text-center">
                <span
                  className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-accent-violet/30 bg-accent-violet/[0.08] text-accent-violet"
                  aria-hidden="true"
                >
                  <Network className="h-7 w-7" />
                </span>
                <h2 className="heading-card mb-1.5 text-foreground">Add compounds to begin</h2>
                <p className="mx-auto max-w-sm text-body-sm text-muted-foreground">
                  Pick from the library on the left. As you add each compound, every pair is
                  classified live — synergy, redundancy, or antagonism — with its marginal
                  contribution to the stack score itemized.
                </p>
                <p className="mt-4 text-caption font-mono uppercase tracking-wider text-accent-violet/80">
                  Synergy · Redundancy · Antagonism
                </p>
              </div>
            ) : (
              <>
                <LabGraph
                  nodes={nodes}
                  relationships={result.relationships}
                  selectedPairKey={selectedPairKey}
                  onSelectRelationship={selectRelationship}
                />
                {activeRelationship && (
                  <div className="mt-4">
                    <WhyPanel relationship={activeRelationship} onClose={() => setSelectedPairKey(null)} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right — analysis tabs */}
          <div className="min-w-0">
            <TabBar tabs={tabs} active={tab} onChange={setTab} theme="violet" ariaLabel="Lab analysis views" />
            <div
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              className="glass mt-4 rounded-2xl p-4 md:p-5"
            >
              {tab === 'overview' && <OverviewPanel result={result} />}
              {tab === 'relations' && (
                <RelationsPanel
                  relationships={result.relationships}
                  selectedPairKey={selectedPairKey}
                  onSelect={selectRelationship}
                />
              )}
              {tab === 'marginal' && (
                <MarginalPanel selectedIds={selected} config={config} onRemove={toggle} />
              )}
              {tab === 'optimize' && (
                <OptimizePanel selectedIds={selected} config={config} onRemove={toggle} />
              )}
              {tab === 'config' && (
                <ConfigPanel config={config} onChange={updateConfig} onReset={resetConfig} />
              )}
            </div>
            <p className="mt-3 text-caption text-muted-foreground">
              Educational analysis of curated data — not medical advice. Hypothesized relationships
              are mechanistic inferences, not demonstrated in humans.
            </p>
          </div>
        </div>
      </PageShell>
    </section>
  );
}
