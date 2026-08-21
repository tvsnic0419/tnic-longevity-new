'use client';

/**
 * Combination Lab — analysis panels (Overview / Relations / Marginal /
 * Optimize / Config) plus the shared "WHY this connection exists" sheet.
 * All data comes from the pure engine in `@/lib/combination-lab`.
 */
import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { EvidenceTier } from '@/lib/types';
import {
  HYPOTHESIS_LABEL,
  LAB_SUB_SCORE_LABELS,
  LAB_SYSTEMS,
  RELATIONSHIP_LABELS,
  RELATIONSHIP_TYPES,
  REMOVAL_VERDICT_LABELS,
  cloneLabConfig,
  computeMarginal,
  getLabCompound,
  hallmarkLabel,
  pairKey,
  simulateRemovals,
  type LabConfidence,
  type LabRelationship,
  type LabScoreResult,
  type LabScoringConfig,
  type RelationshipType,
  type RemovalVerdict,
} from '@/lib/combination-lab';

/* ------------------------------------------------------------------ */
/* Shared chips                                                        */
/* ------------------------------------------------------------------ */

export function TierBadge({ tier, className = '' }: { tier: EvidenceTier; className?: string }) {
  const variant = tier === 'A' ? 'success' : tier === 'B' ? 'info' : 'warning';
  const label =
    tier === 'A' ? 'Tier A — human RCT evidence' : tier === 'B' ? 'Tier B — strong mechanistic + emerging human data' : 'Tier C — preclinical only';
  return (
    <Badge variant={variant} className={className} title={label}>
      {tier}
    </Badge>
  );
}

const TYPE_TEXT: Record<RelationshipType, string> = {
  synergy: 'text-accent-emerald',
  complementary: 'text-accent-cyan',
  additive: 'text-muted-foreground',
  redundancy: 'text-accent-amber',
  interaction: 'text-orange-400',
  antagonism: 'text-accent-rose',
  uncertain: 'text-muted-foreground',
};

export function RelationshipTypeChip({ type }: { type: RelationshipType }) {
  return (
    <span className={cn('text-label', TYPE_TEXT[type])}>
      {RELATIONSHIP_LABELS[type]}
    </span>
  );
}

function ConfidenceChip({ confidence }: { confidence: LabConfidence }) {
  const variant = confidence === 'high' ? 'success' : confidence === 'moderate' ? 'warning' : 'default';
  return <Badge variant={variant}>Confidence: {confidence}</Badge>;
}

function compoundName(id: string): string {
  return getLabCompound(id)?.name ?? id;
}

/* ------------------------------------------------------------------ */
/* WHY panel — "why this connection exists"                            */
/* ------------------------------------------------------------------ */

export function WhyPanel({
  relationship,
  onClose,
}: {
  relationship: LabRelationship;
  onClose: () => void;
}) {
  const [a, b] = relationship.pair;
  return (
    <Card variant="elevated" className="border-l-2 border-l-accent-violet">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-label text-accent-violet mb-1">Why this connection exists</p>
          {/* h2, not h3: the page's only other heading is the PageHeader h1,
              so an h3 here skips a level. `.heading-card` carries the size. */}
          <h2 className="heading-card">
            {compoundName(a)} <span className="text-muted-foreground">+</span> {compoundName(b)}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close relationship detail"
          className="focus-ring interactive rounded-lg p-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {relationship.demonstrated ? (
        <p className="mb-3 inline-flex items-center gap-2 rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 px-3 py-1.5 text-caption text-accent-emerald">
          Curated relationship — drawn from the TNiC interaction dataset.
        </p>
      ) : (
        <p className="mb-3 inline-flex items-center gap-2 rounded-lg border border-accent-amber/30 bg-accent-amber/10 px-3 py-1.5 text-caption text-accent-amber">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {relationship.limitation ?? HYPOTHESIS_LABEL}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <RelationshipTypeChip type={relationship.type} />
        <ConfidenceChip confidence={relationship.confidence} />
        {relationship.severity && <Badge variant="outline">Severity: {relationship.severity}</Badge>}
        {relationship.redundancyGrade && <Badge variant="warning">{relationship.redundancyGrade}</Badge>}
      </div>

      <p className="text-body-sm font-semibold text-foreground mb-1">{relationship.title}</p>
      <p className="text-body-sm text-muted-foreground mb-4">{relationship.detail}</p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-caption">
        <div>
          <dt className="text-label mb-1">Shared pathway</dt>
          <dd className="text-foreground">{relationship.sharedPathway ?? 'None — distinct pathways'}</dd>
        </div>
        <div>
          <dt className="text-label mb-1">Shared hallmarks</dt>
          <dd>
            {relationship.sharedHallmarks.length > 0 ? (
              <span className="flex flex-wrap gap-1">
                {relationship.sharedHallmarks.map((h) => (
                  <span key={h} className="rounded border border-border bg-muted/40 px-1.5 py-0.5">
                    {hallmarkLabel(h)}
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-muted-foreground">None</span>
            )}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Overview panel                                                      */
/* ------------------------------------------------------------------ */

export function OverviewPanel({ result }: { result: LabScoreResult }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { overall, subScores, contributions, counts, confidence } = result;

  if (counts.compounds === 0) {
    return (
      <p className="text-body-sm text-muted-foreground">
        Add compounds from the library to compute an explainable stack score — every point in the
        composite will be itemized below.
      </p>
    );
  }

  const maxAbsDelta = Math.max(1, ...contributions.map((c) => Math.abs(c.delta)));
  const circumference = 2 * Math.PI * 52;
  const covered = new Set(result.coveredHallmarks);
  const extraCovered = result.coveredHallmarks.filter((h) => !LAB_SYSTEMS.some((s) => s.id === h));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`Stack score ${overall} out of 100`}>
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-[var(--color-border-subtle)]" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - overall / 100)}
              transform="rotate(-90 60 60)"
              className="stroke-accent-violet transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono tabular-nums text-2xl font-bold text-foreground">{overall}</span>
            <span className="text-micro text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="space-y-2">
          <ConfidenceChip confidence={confidence} />
          <p className="text-caption text-muted-foreground">
            {counts.compounds} compound{counts.compounds === 1 ? '' : 's'} · {counts.pairs} pairs ·{' '}
            {counts.demonstrated} demonstrated · {counts.hypothesized} hypothesized
            {counts.flagged > 0 && (
              <span className="text-accent-rose"> · {counts.flagged} flagged</span>
            )}
          </p>
          <p className="text-caption text-muted-foreground">
            Mechanistic hypotheses score at reduced weight; antagonism is never netted silently.
          </p>
        </div>
      </div>

      <div>
        <p className="text-label mb-2">Hallmark coverage</p>
        <div className="flex flex-wrap gap-1.5">
          {LAB_SYSTEMS.map((s) => (
            <span
              key={s.id}
              className={cn(
                'rounded border px-2 py-0.5 text-caption',
                covered.has(s.id)
                  ? 'border-accent-violet/40 bg-accent-violet/10 text-accent-violet'
                  : 'border-border text-muted-foreground',
              )}
            >
              {s.label}
            </span>
          ))}
          {extraCovered.map((h) => (
            <span key={h} className="rounded border border-accent-violet/40 bg-accent-violet/10 px-2 py-0.5 text-caption text-accent-violet">
              {hallmarkLabel(h)}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-label mb-2">Sub-scores</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {(Object.keys(LAB_SUB_SCORE_LABELS) as (keyof typeof LAB_SUB_SCORE_LABELS)[]).map((key) => (
            <div key={key}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-caption text-muted-foreground">{LAB_SUB_SCORE_LABELS[key]}</span>
                <span className="font-mono tabular-nums text-caption text-foreground">{subScores[key]}</span>
              </div>
              <div className="h-1 rounded-full bg-muted/40">
                <div
                  className="h-1 rounded-full bg-accent-violet/70"
                  style={{ width: `${Math.max(0, Math.min(100, subScores[key]))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-label mb-2">Score waterfall — every point itemized</p>
        <ul className="space-y-1">
          {contributions.map((c) => {
            const isOpen = expanded === c.key;
            return (
              <li key={c.key}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : c.key)}
                  className="focus-ring interactive flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted/30"
                >
                  <span className="w-40 shrink-0 text-caption font-semibold text-foreground">{c.label}</span>
                  <span className="relative h-1.5 flex-1 rounded-full bg-muted/30">
                    <span
                      className={cn(
                        'absolute inset-y-0 rounded-full',
                        c.kind === 'positive' ? 'left-1/2 bg-accent-emerald/70' : 'right-1/2 bg-accent-rose/70',
                      )}
                      style={{ width: `${(Math.abs(c.delta) / maxAbsDelta) * 50}%` }}
                    />
                  </span>
                  <span
                    className={cn(
                      'w-12 shrink-0 text-right font-mono tabular-nums text-caption',
                      c.kind === 'positive' ? 'text-accent-emerald' : 'text-accent-rose',
                    )}
                  >
                    {c.delta > 0 ? `+${c.delta}` : c.delta}
                  </span>
                  <ChevronDown
                    className={cn('w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="ml-2 border-l border-border pl-4 py-2">
                    <p className="text-caption text-muted-foreground mb-1">{c.detail}</p>
                    {c.refIds.length > 0 && (
                      <p className="text-caption text-muted-foreground">
                        <span className="text-label mr-1">Involves</span>
                        {c.refIds.map(compoundName).join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Relations panel                                                     */
/* ------------------------------------------------------------------ */

export function RelationsPanel({
  relationships,
  selectedPairKey,
  onSelect,
}: {
  relationships: LabRelationship[];
  selectedPairKey: string | null;
  onSelect: (r: LabRelationship) => void;
}) {
  const [filter, setFilter] = useState<'all' | RelationshipType>('all');

  if (relationships.length === 0) {
    return (
      <p className="text-body-sm text-muted-foreground">
        Relationships appear once at least two compounds are in the stack.
      </p>
    );
  }

  const counts = new Map<RelationshipType, number>();
  for (const r of relationships) counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
  const visible = relationships.filter((r) => filter === 'all' || r.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter relationships by type">
        <button
          type="button"
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
          className={cn(
            'focus-ring interactive rounded-lg border px-2.5 py-1.5 text-caption',
            filter === 'all' ? 'border-accent-violet/40 text-accent-violet bg-accent-violet/10' : 'border-border text-muted-foreground',
          )}
        >
          All ({relationships.length})
        </button>
        {RELATIONSHIP_TYPES.map((t) => {
          const n = counts.get(t) ?? 0;
          if (n === 0) return null;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={filter === t}
              onClick={() => setFilter(t)}
              className={cn(
                'focus-ring interactive rounded-lg border px-2.5 py-1.5 text-caption',
                filter === t ? 'border-accent-violet/40 text-accent-violet bg-accent-violet/10' : 'border-border text-muted-foreground',
              )}
            >
              {RELATIONSHIP_LABELS[t]} ({n})
            </button>
          );
        })}
      </div>

      <ul className="space-y-1.5">
        {visible.map((r) => {
          const key = pairKey(r.pair[0], r.pair[1]);
          const active = key === selectedPairKey;
          return (
            <li key={key}>
              <button
                type="button"
                aria-current={active}
                onClick={() => onSelect(r)}
                className={cn(
                  'focus-ring interactive w-full rounded-xl border px-3 py-2.5 text-left transition-colors',
                  active ? 'border-accent-violet/50 bg-accent-violet/5' : 'border-border hover:border-accent-violet/30',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-body-sm font-semibold text-foreground">
                    {compoundName(r.pair[0])} <span className="text-muted-foreground">+</span> {compoundName(r.pair[1])}
                  </span>
                  <RelationshipTypeChip type={r.type} />
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                  {r.demonstrated ? (
                    <Badge variant="success">Demonstrated</Badge>
                  ) : (
                    <Badge variant="outline">Hypothesis</Badge>
                  )}
                  <span>{r.title}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-caption text-muted-foreground">
        Hypothesis rows are ontology-derived — {HYPOTHESIS_LABEL}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marginal panel                                                      */
/* ------------------------------------------------------------------ */

function MarginalEdgeList({
  title,
  edges,
}: {
  title: string;
  edges: LabRelationship[];
}) {
  if (edges.length === 0) return null;
  return (
    <div>
      <p className="text-label mb-1">{title}</p>
      <ul className="space-y-1">
        {edges.map((e) => (
          <li key={pairKey(e.pair[0], e.pair[1])} className="flex flex-wrap items-center gap-2 text-caption">
            <RelationshipTypeChip type={e.type} />
            <span className="text-foreground">
              {compoundName(e.pair[0])} + {compoundName(e.pair[1])}
            </span>
            {e.demonstrated ? (
              <Badge variant="success">Demonstrated</Badge>
            ) : (
              <Badge variant="outline">Hypothesis</Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarginalPanel({
  selectedIds,
  config,
  onRemove,
}: {
  selectedIds: string[];
  config: LabScoringConfig;
  onRemove: (id: string) => void;
}) {
  const [memberId, setMemberId] = useState<string | null>(null);
  const active =
    memberId && selectedIds.includes(memberId)
      ? memberId
      : selectedIds[selectedIds.length - 1] ?? null;

  const marginal = useMemo(
    () => (active ? computeMarginal(selectedIds, active, config) : null),
    [selectedIds, active, config],
  );

  if (selectedIds.length === 0 || !marginal) {
    return (
      <p className="text-body-sm text-muted-foreground">
        Add compounds to see what each one individually contributes — new coverage, new synergies,
        new redundancies, and its net effect on the score.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose compound to inspect">
        {selectedIds.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === active}
            onClick={() => setMemberId(id)}
            className={cn(
              'focus-ring interactive rounded-lg border px-2.5 py-1.5 text-caption',
              id === active
                ? 'border-accent-violet/40 text-accent-violet bg-accent-violet/10'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {compoundName(id)}
          </button>
        ))}
      </div>

      <Card variant="elevated">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-label text-accent-violet mb-1">Marginal contribution</p>
            {/* h2 for the same reason as WhyPanel above — no h2 precedes it. */}
            <h2 className="heading-card">{marginal.name}</h2>
          </div>
          <span
            className={cn(
              'font-mono tabular-nums text-lg font-bold',
              marginal.scoreDelta > 0
                ? 'text-accent-emerald'
                : marginal.scoreDelta < 0
                  ? 'text-accent-rose'
                  : 'text-muted-foreground',
            )}
          >
            {marginal.scoreDelta > 0 ? `+${marginal.scoreDelta}` : marginal.scoreDelta} pts
          </span>
        </div>

        <p className="text-body-sm text-muted-foreground italic mb-4">{marginal.verdict}</p>

        <p className="text-caption text-muted-foreground mb-4">
          Score {marginal.scoreBefore} → {marginal.scoreAfter} against{' '}
          {marginal.againstIds.length === 0
            ? 'an empty stack'
            : marginal.againstIds.map(compoundName).join(', ')}
          .
        </p>

        <div className="space-y-3">
          {marginal.newHallmarks.length > 0 && (
            <div>
              <p className="text-label mb-1">New hallmark coverage</p>
              <div className="flex flex-wrap gap-1.5">
                {marginal.newHallmarks.map((h) => (
                  <span key={h} className="rounded border border-accent-emerald/40 bg-accent-emerald/10 px-2 py-0.5 text-caption text-accent-emerald">
                    {hallmarkLabel(h)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {marginal.newPathways.length > 0 && (
            <div>
              <p className="text-label mb-1">New pathway</p>
              <p className="text-caption text-foreground">{marginal.newPathways.join(', ')}</p>
            </div>
          )}
          {marginal.strengthenedHallmarks.length > 0 && (
            <div>
              <p className="text-label mb-1">Reinforces existing coverage</p>
              <p className="text-caption text-muted-foreground">
                {marginal.strengthenedHallmarks.map(hallmarkLabel).join(', ')}
              </p>
            </div>
          )}
          <MarginalEdgeList title="New synergies" edges={marginal.newSynergies} />
          <MarginalEdgeList title="New complementary links" edges={marginal.newComplementary} />
          <MarginalEdgeList title="New additive links" edges={marginal.newAdditive} />
          <MarginalEdgeList title="Redundancies introduced" edges={marginal.newRedundancies} />
          <MarginalEdgeList title="Demonstrated interactions" edges={marginal.newInteractions.demonstrated} />
          <MarginalEdgeList title="Hypothesized interactions" edges={marginal.newInteractions.hypothesized} />
          <MarginalEdgeList title="Antagonisms" edges={marginal.newAntagonisms} />
          <div>
            <p className="text-label mb-1">Evidence added</p>
            <p className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
              <TierBadge tier={marginal.evidenceAdded.tier} />
              <span>
                {marginal.evidenceAdded.studyCount} cited stud
                {marginal.evidenceAdded.studyCount === 1 ? 'y' : 'ies'} — {marginal.evidenceAdded.note}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <Button variant="danger" size="sm" onClick={() => onRemove(marginal.addedId)}>
            Remove {marginal.name} from stack
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Optimize panel (removal simulation)                                 */
/* ------------------------------------------------------------------ */

const VERDICT_VARIANT: Record<RemovalVerdict, 'success' | 'info' | 'default' | 'warning' | 'danger'> = {
  'high-value': 'success',
  'disproportionately-beneficial': 'info',
  'low-value': 'default',
  redundant: 'warning',
  'disproportionately-risky': 'danger',
};

export function OptimizePanel({
  selectedIds,
  config,
  onRemove,
}: {
  selectedIds: string[];
  config: LabScoringConfig;
  onRemove: (id: string) => void;
}) {
  const simulations = useMemo(() => simulateRemovals(selectedIds, config), [selectedIds, config]);

  if (simulations.length === 0) {
    return (
      <p className="text-body-sm text-muted-foreground">
        The removal simulator recomputes the full score once per compound — add compounds to run it.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-caption text-muted-foreground">
        Each row re-scores the stack without that compound. Positive Δ means removing it
        <em> improves</em> the stack. Simulation only — nothing changes until you remove it yourself.
      </p>
      <div className="overflow-x-auto scroll-region">
        <table className="w-full text-left text-body-sm">
          <caption className="sr-only">Removal simulation — stack score without each compound</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-3 text-label">Compound</th>
              <th scope="col" className="py-2 pr-3 text-label">Score without</th>
              <th scope="col" className="py-2 pr-3 text-label">Δ</th>
              <th scope="col" className="py-2 pr-3 text-label">Verdict</th>
              <th scope="col" className="py-2 text-label"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {simulations.map((s) => (
              <tr key={s.id} className="border-b border-border/60 align-top">
                <td className="py-2.5 pr-3">
                  <span className="font-semibold text-foreground">{s.name}</span>
                  <span className="block text-caption text-muted-foreground">{s.rationale}</span>
                </td>
                <td className="py-2.5 pr-3 font-mono tabular-nums">{s.scoreWithout}</td>
                <td
                  className={cn(
                    'py-2.5 pr-3 font-mono tabular-nums',
                    s.delta > 0 ? 'text-accent-emerald' : s.delta < 0 ? 'text-accent-rose' : 'text-muted-foreground',
                  )}
                >
                  {s.delta > 0 ? `+${s.delta}` : s.delta}
                </td>
                <td className="py-2.5 pr-3">
                  <Badge variant={VERDICT_VARIANT[s.verdict]}>{REMOVAL_VERDICT_LABELS[s.verdict]}</Badge>
                </td>
                <td className="py-2.5">
                  <Button variant="ghost" size="sm" onClick={() => onRemove(s.id)} aria-label={`Remove ${s.name}`}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Config panel (editable scoring weights)                             */
/* ------------------------------------------------------------------ */

interface ConfigControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  get: (c: LabScoringConfig) => number;
  set: (c: LabScoringConfig, v: number) => void;
}

const CONFIG_SECTIONS: { title: string; controls: ConfigControl[] }[] = [
  {
    title: 'Bonuses',
    controls: [
      { id: 'baseWeight', label: 'Base strength weight', min: 0, max: 40, step: 1, get: (c) => c.baseWeight, set: (c, v) => { c.baseWeight = v; } },
      { id: 'synergyBonus', label: 'Synergy bonus / pair', min: 0, max: 12, step: 0.5, get: (c) => c.synergyBonus, set: (c, v) => { c.synergyBonus = v; } },
      { id: 'complementaryBonus', label: 'Complementary bonus / pair', min: 0, max: 8, step: 0.5, get: (c) => c.complementaryBonus, set: (c, v) => { c.complementaryBonus = v; } },
      { id: 'additiveBonus', label: 'Additive bonus / pair', min: 0, max: 6, step: 0.2, get: (c) => c.additiveBonus, set: (c, v) => { c.additiveBonus = v; } },
      { id: 'hypothesisDiscount', label: 'Hypothesis discount (×)', min: 0, max: 1, step: 0.05, get: (c) => c.hypothesisDiscount, set: (c, v) => { c.hypothesisDiscount = v; } },
      { id: 'coverageBonus', label: 'Coverage bonus / hallmark', min: 0, max: 8, step: 0.5, get: (c) => c.coverageBonus, set: (c, v) => { c.coverageBonus = v; } },
      { id: 'benefitBonus', label: 'Benefit coverage bonus', min: 0, max: 10, step: 0.5, get: (c) => c.benefitBonus, set: (c, v) => { c.benefitBonus = v; } },
      { id: 'evidenceBonus', label: 'Evidence bonus (× mean tier)', min: 0, max: 20, step: 1, get: (c) => c.evidenceBonus, set: (c, v) => { c.evidenceBonus = v; } },
      { id: 'marginalBonus', label: 'Marginal utility bonus', min: 0, max: 8, step: 0.5, get: (c) => c.marginalBonus, set: (c, v) => { c.marginalBonus = v; } },
    ],
  },
  {
    title: 'Penalties',
    controls: [
      { id: 'redundancyPenalty.usefulOverlap', label: 'Redundancy — useful overlap', min: 0, max: 10, step: 0.5, get: (c) => c.redundancyPenalty.usefulOverlap, set: (c, v) => { c.redundancyPenalty.usefulOverlap = v; } },
      { id: 'redundancyPenalty.excessive', label: 'Redundancy — excessive', min: 0, max: 15, step: 0.5, get: (c) => c.redundancyPenalty.excessive, set: (c, v) => { c.redundancyPenalty.excessive = v; } },
      { id: 'antagonismPenalty', label: 'Antagonism penalty / edge', min: 0, max: 25, step: 1, get: (c) => c.antagonismPenalty, set: (c, v) => { c.antagonismPenalty = v; } },
      { id: 'interactionPenalty.demonstrated', label: 'Interaction — demonstrated', min: 0, max: 15, step: 0.5, get: (c) => c.interactionPenalty.demonstrated, set: (c, v) => { c.interactionPenalty.demonstrated = v; } },
      { id: 'interactionPenalty.hypothesized', label: 'Interaction — hypothesized', min: 0, max: 8, step: 0.5, get: (c) => c.interactionPenalty.hypothesized, set: (c, v) => { c.interactionPenalty.hypothesized = v; } },
      { id: 'complexityPenalty', label: 'Complexity penalty / extra compound', min: 0, max: 5, step: 0.25, get: (c) => c.complexityPenalty, set: (c, v) => { c.complexityPenalty = v; } },
      { id: 'complexityThreshold', label: 'Complexity threshold (compounds)', min: 1, max: 15, step: 1, get: (c) => c.complexityThreshold, set: (c, v) => { c.complexityThreshold = Math.max(1, Math.round(v)); } },
    ],
  },
  {
    title: 'Evidence tier multipliers',
    controls: [
      { id: 'tierMultipliers.A', label: 'Tier A multiplier', min: 0, max: 1, step: 0.05, get: (c) => c.tierMultipliers.A, set: (c, v) => { c.tierMultipliers.A = v; } },
      { id: 'tierMultipliers.B', label: 'Tier B multiplier', min: 0, max: 1, step: 0.05, get: (c) => c.tierMultipliers.B, set: (c, v) => { c.tierMultipliers.B = v; } },
      { id: 'tierMultipliers.C', label: 'Tier C multiplier', min: 0, max: 1, step: 0.05, get: (c) => c.tierMultipliers.C, set: (c, v) => { c.tierMultipliers.C = v; } },
    ],
  },
  {
    title: 'Normalization caps',
    controls: [
      { id: 'caps.synergy', label: 'Cap — synergy', min: 5, max: 60, step: 1, get: (c) => c.caps.synergy, set: (c, v) => { c.caps.synergy = v; } },
      { id: 'caps.complementary', label: 'Cap — complementarity', min: 2, max: 30, step: 1, get: (c) => c.caps.complementary, set: (c, v) => { c.caps.complementary = v; } },
      { id: 'caps.additive', label: 'Cap — additive', min: 2, max: 30, step: 1, get: (c) => c.caps.additive, set: (c, v) => { c.caps.additive = v; } },
      { id: 'caps.coverage', label: 'Cap — coverage', min: 5, max: 40, step: 1, get: (c) => c.caps.coverage, set: (c, v) => { c.caps.coverage = v; } },
      { id: 'caps.benefit', label: 'Cap — benefit coverage', min: 2, max: 20, step: 1, get: (c) => c.caps.benefit, set: (c, v) => { c.caps.benefit = v; } },
      { id: 'caps.evidence', label: 'Cap — evidence', min: 2, max: 25, step: 1, get: (c) => c.caps.evidence, set: (c, v) => { c.caps.evidence = v; } },
      { id: 'caps.marginal', label: 'Cap — marginal utility', min: 2, max: 20, step: 1, get: (c) => c.caps.marginal, set: (c, v) => { c.caps.marginal = v; } },
    ],
  },
];

export function ConfigPanel({
  config,
  onChange,
  onReset,
}: {
  config: LabScoringConfig;
  onChange: (next: LabScoringConfig) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-caption text-muted-foreground">
          Every weight of the explainable scorer. Changes re-score the stack immediately and persist
          on this device only.
        </p>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset to defaults
        </Button>
      </div>
      {CONFIG_SECTIONS.map((section) => (
        <fieldset key={section.title}>
          <legend className="text-label text-accent-violet mb-3">{section.title}</legend>
          <div className="space-y-3">
            {section.controls.map((control) => {
              const value = control.get(config);
              const inputId = `lab-cfg-${control.id}`;
              return (
                <div key={control.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
                  <label htmlFor={inputId} className="text-caption text-foreground">
                    {control.label}
                  </label>
                  <input
                    id={inputId}
                    type="number"
                    className="input-base w-20 px-2 py-1 text-right font-mono tabular-nums text-caption"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(e) => {
                      const v = Number.parseFloat(e.target.value);
                      if (!Number.isFinite(v)) return;
                      const next = cloneLabConfig(config);
                      control.set(next, v);
                      onChange(next);
                    }}
                  />
                  <input
                    type="range"
                    aria-label={`${control.label} slider`}
                    className="col-span-2 w-full accent-[var(--accent-violet)]"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(e) => {
                      const v = Number.parseFloat(e.target.value);
                      if (!Number.isFinite(v)) return;
                      const next = cloneLabConfig(config);
                      control.set(next, v);
                      onChange(next);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
