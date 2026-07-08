'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Plus, X, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { compounds } from '@/lib/data';
import {
  analyzeStack,
  computeLiveStackAnalysis,
  hallmarkDisplayNames,
  compoundBaseScores,
} from '@/lib/stack-analysis';
import { evidenceLevelFromTier } from '@/lib/trust';
import type { EvidenceLevel } from '@/lib/types';
import EvidenceBadge from '@/components/trust/EvidenceBadge';
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
          <h1 className="heading-page text-3xl md:text-4xl">{title}</h1>
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
          <p className="text-[10px] font-mono text-caption mt-1">
            Platform score {analysis.score}/100
          </p>
        </div>
      </div>

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
  return (
    <>
      <CardHeader className={compact ? 'p-4 pb-2' : undefined}>
        <CardTitle className={compact ? 'text-base' : undefined}>Compound library</CardTitle>
        <p className="text-body-sm text-muted-foreground mt-1">
          {compounds.length} evidence-graded compounds
        </p>
      </CardHeader>
      <CardContent className={cn('space-y-3', compact && 'p-4 pt-0')}>
        {compounds.map((c) => {
          const inStack = selected.includes(c.id);
          const evidence = evidenceLevelFromTier(c.evidence) as EvidenceLevel;
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
                  <EvidenceBadge level={evidence} size="sm" showTooltip={false} />
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
              const evidence = evidenceLevelFromTier(c.evidence) as EvidenceLevel;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-muted/40 border border-border p-4 md:p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <span className="font-semibold">{c.name}</span>
                    <EvidenceBadge level={evidence} size="sm" showTooltip={false} />
                    <span className="text-caption font-mono text-muted-foreground hidden sm:inline">
                      {c.dose}
                    </span>
                    {COMPOUND_LIBRARY_HREF[c.id] && (
                      <Link
                        href={COMPOUND_LIBRARY_HREF[c.id]}
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-cyan hover:text-accent-emerald transition-colors focus-ring rounded"
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