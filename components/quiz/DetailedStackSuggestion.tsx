'use client';

import { ExternalLink, Sparkles, ShieldAlert } from 'lucide-react';
import { compounds } from '@/lib/data';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { analyzeStack, hallmarkDisplayNames } from '@/lib/stack-analysis';
import type { EvidenceTier } from '@/lib/types';

// Tier → the site's evidence color language (A Strong/emerald, B Moderate/amber,
// C Mechanistic/rose), kept as compact inline chips so each compound row stays tight.
const TIER_STYLE: Record<EvidenceTier, { label: string; cls: string }> = {
  A: { label: 'Tier A', cls: 'bg-accent-emerald/15 text-accent-emerald' },
  B: { label: 'Tier B', cls: 'bg-accent-amber/15 text-accent-amber' },
  C: { label: 'Tier C', cls: 'bg-accent-rose/15 text-accent-rose' },
};

function firstSentence(text: string, cap = 200): string {
  const dot = text.indexOf('. ');
  const sentence = dot > 0 ? text.slice(0, dot + 1) : text;
  return sentence.length > cap ? `${sentence.slice(0, cap - 1).trimEnd()}…` : sentence;
}

function hallmarkLabel(id: string): string {
  return hallmarkDisplayNames[id] ?? id.charAt(0).toUpperCase() + id.slice(1);
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/50 px-2.5 py-2 text-center">
      <p className="text-sm font-bold font-mono text-foreground tabular-nums leading-none">{value}</p>
      <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

/**
 * In-depth breakdown of the quiz-recommended protocol: stack-level metrics
 * (synergy score, hallmark coverage, evidence tier, monthly cost) plus a
 * per-compound card explaining mechanism, dose, timing, evidence, the aging
 * hallmarks it targets, and a key citation.
 */
export function DetailedStackSuggestion({ preset }: { preset: PresetKey }) {
  const stack = stackPresets[preset];
  const ids = [...stack.ids];
  const analysis = analyzeStack(ids);
  const tier = TIER_STYLE[analysis.evidenceTier];
  const stackCompounds = ids
    .map((id) => compounds.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <section className="mb-4" aria-label={`Recommended protocol: ${stack.label}`}>
      {/* Stack-level summary */}
      <div className="glass rounded-xl p-4 mb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-mono text-accent-violet uppercase tracking-wider mb-1">
              Your recommended protocol
            </p>
            <h4 className="text-base font-bold leading-tight">{stack.label}</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stack.desc}</p>
          </div>
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded ${tier.cls}`}>
            {tier.label} avg
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3">
          <Metric label="Synergy" value={analysis.score} />
          <Metric label="Hallmarks" value={`${analysis.hallmarkCount}/12`} />
          <Metric label="Compounds" value={analysis.compoundCount} />
          <Metric label="Est./mo" value={`$${analysis.monthlyCost.low}–${analysis.monthlyCost.high}`} />
        </div>

        {analysis.hallmarkCoverage.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {analysis.hallmarkCoverage.map((h) => (
              <span
                key={h}
                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan"
              >
                {hallmarkLabel(h)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Per-compound depth */}
      <ol className="space-y-2">
        {stackCompounds.map((c, i) => {
          const t = TIER_STYLE[c.evidence];
          const study = c.studies[0];
          return (
            <li key={c.id} className="glass rounded-xl p-3">
              <div className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-md bg-accent-violet/15 text-accent-violet text-[10px] font-bold font-mono flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${t.cls}`}>{t.label}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {c.timing}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {c.pathway} · {c.dose}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5">
                    {firstSentence(c.mechanism)}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.hallmarks.slice(0, 4).map((h) => (
                      <span
                        key={h}
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-accent-emerald/10 text-accent-emerald"
                      >
                        {hallmarkLabel(h)}
                      </span>
                    ))}
                  </div>

                  {study && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring inline-flex items-center gap-1 text-[10px] text-accent-cyan hover:underline mt-1.5 rounded"
                    >
                      PMID {study.pmid} · {study.journal} {study.year}
                      <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Synergy pairs inside the stack */}
      {analysis.synergies.length > 0 && (
        <div className="glass rounded-xl p-3 mt-2">
          <p className="flex items-center gap-1.5 text-[10px] font-mono text-accent-violet uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            Synergy pairs in this stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.synergies.map((s) => (
              <span
                key={`${s.from}-${s.to}`}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-accent-violet/10 text-accent-violet"
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Safety-first cautions */}
      {analysis.cautions.length > 0 && (
        <div className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-3 mt-2">
          <p className="flex items-center gap-1.5 text-[10px] font-mono text-accent-amber uppercase tracking-wider mb-1.5">
            <ShieldAlert className="w-3 h-3" aria-hidden="true" />
            Before you start
          </p>
          <ul className="space-y-1">
            {analysis.cautions.slice(0, 3).map((c) => (
              <li key={c} className="text-[10px] text-muted-foreground leading-relaxed">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
