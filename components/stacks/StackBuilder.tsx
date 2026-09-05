'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, X, CheckCircle2, AlertTriangle, BookOpen, Search } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { compounds } from '@/lib/data';
import {
  analyzeStack,
  computeLiveStackAnalysis,
  hallmarkDisplayNames,
  compoundBaseScores,
} from '@/lib/stack-analysis';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StackExport } from './StackExport';
import { cn } from '@/lib/utils';

const COMPOUND_LIBRARY_HREF: Record<string, string> = {
  glynac: '/library/compounds/glynac',
  nmn: '/library/compounds/nmn',
  sulforaphane: '/library/compounds/sulforaphane',
  resveratrol: '/library/compounds/resveratrol',
  tudca: '/library/compounds/tudca',
  rapamycin: '/library/compounds/rapamycin',
  rala: '/library/compounds/rala',
  cakg: '/library/compounds/cakg',
  taurine: '/library/compounds/taurine',
  spermidine: '/library/compounds/spermidine',
  pterostilbene: '/library/compounds/pterostilbene',
};

interface StackBuilderProps {
  title?: string;
  className?: string;
  /** Compact layout for Dashboard embed */
  compact?: boolean;
}

function LiveSynergyPanel({
  synergies,
  warnings,
}: {
  synergies: string[];
  warnings: string[];
}) {
  if (synergies.length === 0 && warnings.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-5 md:p-6">
      <h3 className="heading-card text-lg mb-4">Live synergy analysis</h3>
      <div className="space-y-5">
        {synergies.length > 0 && (
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-accent-emerald mb-2">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Strong synergies
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {synergies.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {warnings.length > 0 && (
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-accent-amber mb-2">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              Warnings
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function StackBuilder({
  title = 'Dynamic Stack Builder',
  className,
  compact = false,
}: StackBuilderProps) {
  const { selected, toggle, selectedCompounds } = useStack();
  const analysis = analyzeStack(selected);
  const liveAnalysis = useMemo(() => computeLiveStackAnalysis(selected), [selected]);

  // Suggest only compounds connected to the active stack by the authored
  // synergy data. This narrows a 100-item catalogue into a small, explainable
  // next step without changing scoring or making a new recommendation claim.
  const complementarySuggestions = useMemo(() => {
    if (selected.length === 0) return [];

    return compounds
      .filter((candidate) => !selected.includes(candidate.id))
      .map((candidate) => {
        const linkedTo = selectedCompounds.filter(
          (active) => active.synergies.includes(candidate.id) || candidate.synergies.includes(active.id),
        );
        return { candidate, linkedTo };
      })
      .filter(({ linkedTo }) => linkedTo.length > 0)
      .sort((a, b) => {
        const connectionDifference = b.linkedTo.length - a.linkedTo.length;
        if (connectionDifference !== 0) return connectionDifference;
        return (compoundBaseScores[b.candidate.id] ?? 0) - (compoundBaseScores[a.candidate.id] ?? 0);
      })
      .slice(0, 3);
  }, [selected, selectedCompounds]);

  const addCompound = (id: string) => {
    if (!selected.includes(id)) toggle(id);
  };

  const removeCompound = (id: string) => {
    if (selected.includes(id)) toggle(id);
  };

  if (compact) {
    return (
      <div className={cn('w-full', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompoundLibrary
            selected={selected}
            onAdd={addCompound}
            compact
          />
          <ActiveStackPanel
            selected={selected}
            selectedCompounds={selectedCompounds}
            liveAnalysis={liveAnalysis}
            onRemove={removeCompound}
            compact
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('max-w-6xl mx-auto', className)}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-8">
        <div>
          {/* h2, not h1: this builder always renders beneath a page-level
              PageHeader <h1> (the /stacks hub), so a second <h1> would give the
              page two top-level headings — a WCAG 1.3.1 / SEO defect. */}
          <h2 className="heading-page text-3xl md:text-4xl">{title}</h2>
          <p className="text-body-sm text-muted-foreground mt-2">
            Real-time synergy scoring · Evidence-based recommendations · Syncs across TNiC
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <div
            className={cn(
              'text-5xl font-bold font-mono tabular-nums',
              liveAnalysis.totalScore >= 70
                ? 'text-accent-emerald'
                : liveAnalysis.totalScore >= 50
                  ? 'text-accent-cyan'
                  : 'text-muted-foreground',
            )}
          >
            {liveAnalysis.totalScore}
          </div>
          <p className="text-caption text-muted-foreground">Synergy score</p>
          <p className="text-micro font-mono text-caption mt-1">
            Platform score {analysis.score}/100
          </p>
        </div>
      </div>

      {complementarySuggestions.length > 0 && (
        <section
          className="mb-6 rounded-2xl border border-accent-cyan/20 bg-accent-cyan/[0.045] p-4 md:p-5"
          aria-labelledby="stack-next-additions"
        >
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="text-label text-accent-cyan">Build with intent</p>
              <h3 id="stack-next-additions" className="mt-1 text-base font-semibold text-foreground">
                Complements your active stack
              </h3>
            </div>
            <p className="text-micro text-muted-foreground">Based on authored synergy links</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {complementarySuggestions.map(({ candidate, linkedTo }) => (
              <div key={candidate.id} className="rounded-xl border border-border/70 bg-card/60 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Connects with {linkedTo.map((compound) => compound.name).join(', ')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    theme="cyan"
                    size="sm"
                    onClick={() => addCompound(candidate.id)}
                    aria-label={`Add ${candidate.name} to your stack`}
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-5">
          <Card variant="elevated" className="lg:sticky lg:top-24">
            <CompoundLibrary selected={selected} onAdd={addCompound} />
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card variant="scientific">
            <ActiveStackPanel
              selected={selected}
              selectedCompounds={selectedCompounds}
              liveAnalysis={liveAnalysis}
              onRemove={removeCompound}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function CompoundLibrary({
  selected,
  onAdd,
  compact = false,
}: {
  selected: string[];
  onAdd: (id: string) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCompounds = useMemo(() => {
    if (!normalizedQuery) return compounds;

    return compounds.filter((compound) => {
      const searchable = [
        compound.name,
        compound.pathway,
        compound.mechanism,
        compound.desc,
        ...compound.hallmarks.map((hallmark) => hallmarkDisplayNames[hallmark] ?? hallmark),
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <>
      <CardHeader className={compact ? 'p-4 pb-2' : undefined}>
        <CardTitle className={compact ? 'text-base' : undefined}>Compound library</CardTitle>
        <p className="text-body-sm text-muted-foreground mt-1">
          {normalizedQuery
            ? `${filteredCompounds.length} of ${compounds.length} matching compounds`
            : `${compounds.length} evidence-graded compounds`}
        </p>
      </CardHeader>
      <CardContent className={cn('space-y-3', compact && 'p-4 pt-0')}>
        <div>
          <label htmlFor="stack-compound-search" className="sr-only">
            Search compounds, pathways, or hallmarks
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="stack-compound-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search compounds, pathways, or hallmarks"
              className="focus-ring w-full rounded-xl border border-border bg-background/50 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <p className="mt-2 text-micro text-muted-foreground" aria-live="polite">
            {normalizedQuery ? `${filteredCompounds.length} result${filteredCompounds.length === 1 ? '' : 's'}` : 'Search the full evidence-graded catalogue'}
          </p>
        </div>

        {filteredCompounds.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No compounds match “{query.trim()}”. Try a compound, pathway, or hallmark.
          </div>
        ) : filteredCompounds.map((c) => {
          const inStack = selected.includes(c.id);
          const baseScore = compoundBaseScores[c.id] ?? 7;
          const hallmarkPreview = c.hallmarks
            .slice(0, 2)
            .map((h) => hallmarkDisplayNames[h] ?? h)
            .join(' · ');

          return (
            <div
              key={c.id}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border border-border p-4 transition-colors',
                inStack ? 'bg-muted/40 opacity-70' : 'hover:bg-muted/30',
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{c.name}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <EvidenceTag tier={c.evidence} size="sm" />
                  <Badge variant="info" className="normal-case tracking-normal font-sans">
                    {baseScore}/10
                  </Badge>
                </div>
                <p className="text-caption text-muted-foreground mt-1 truncate">{hallmarkPreview}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {COMPOUND_LIBRARY_HREF[c.id] && (
                  <Link
                    href={COMPOUND_LIBRARY_HREF[c.id]}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-cyan transition-colors focus-ring"
                    title={`Read ${c.name} deep-dive`}
                    aria-label={`Read ${c.name} library module`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </Link>
                )}
                <Button
                  variant={inStack ? 'secondary' : 'outline'}
                  theme="violet"
                  size="sm"
                  disabled={inStack}
                  onClick={() => onAdd(c.id)}
                >
                  {inStack ? 'Added' : (
                    <>
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </>
  );
}

function ActiveStackPanel({
  selected,
  selectedCompounds,
  liveAnalysis,
  onRemove,
  compact = false,
}: {
  selected: string[];
  selectedCompounds: typeof compounds;
  liveAnalysis: ReturnType<typeof computeLiveStackAnalysis>;
  onRemove: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <>
      <CardHeader className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3', compact && 'p-4 pb-2')}>
        <CardTitle className={compact ? 'text-base' : undefined}>
          Your current stack ({selected.length})
        </CardTitle>
        {selected.length > 0 && (
          <Badge variant="outline" className="normal-case tracking-normal font-sans text-sm px-3 py-1">
            Hallmarks covered: {liveAnalysis.coverage}
          </Badge>
        )}
      </CardHeader>
      <CardContent className={cn('space-y-6', compact && 'p-4 pt-0')}>
        {selected.length === 0 ? (
          <p className="text-body-sm text-muted-foreground text-center py-10">
            Add compounds to see dynamic scoring
          </p>
        ) : (
          <div className="space-y-3">
            {selectedCompounds.map((c) => {
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-muted/40 border border-border p-4 md:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <span className="font-semibold">{c.name}</span>
                    <EvidenceTag tier={c.evidence} size="sm" />
                    <span className="text-caption font-mono text-muted-foreground hidden sm:inline">
                      {c.dose}
                    </span>
                    {COMPOUND_LIBRARY_HREF[c.id] && (
                      <Link
                        href={COMPOUND_LIBRARY_HREF[c.id]}
                        className="inline-flex items-center gap-1 text-micro font-mono text-accent-cyan hover:text-accent-emerald transition-colors focus-ring rounded"
                      >
                        <BookOpen className="w-3 h-3" />
                        Deep dive
                      </Link>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onRemove(c.id)}
                    aria-label={`Remove ${c.name}`}
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {selected.length > 0 && (
          <>
            {liveAnalysis.hallmarkLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {liveAnalysis.hallmarkLabels.map((label) => (
                  <Badge key={label} variant="default" className="normal-case tracking-normal font-sans">
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            <LiveSynergyPanel
              synergies={liveAnalysis.synergies}
              warnings={liveAnalysis.warnings}
            />

            <StackExport />
          </>
        )}
      </CardContent>
    </>
  );
}

export default StackBuilder;