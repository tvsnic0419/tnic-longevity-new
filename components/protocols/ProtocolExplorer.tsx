'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Compass, Layers3, Scale, Sparkles } from 'lucide-react';
import { protocols, type Protocol } from '@/lib/protocols';
import { ProtocolCard } from './ProtocolCard';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

const focusOptions = [
  { id: 'all', label: 'All protocols', detail: 'See every authored system' },
  { id: 'foundation', label: 'Core resilience', detail: 'Defense and broad coverage' },
  { id: 'energy', label: 'Energy systems', detail: 'Mitochondria and NAD⁺' },
  { id: 'metabolic', label: 'Metabolic health', detail: 'Glucose, lipids, vascular' },
  { id: 'renewal', label: 'Cellular renewal', detail: 'Senescence and repair' },
  { id: 'cognition', label: 'Cognition', detail: 'Focus and neural support' },
] as const;

type FocusId = (typeof focusOptions)[number]['id'];

function matchesFocus(protocol: Protocol, focus: FocusId) {
  if (focus === 'all') return true;
  const byFocus: Record<Exclude<FocusId, 'all'>, string[]> = {
    foundation: ['nrf2-defense-triad', 'mitochondrial-renewal'],
    energy: ['nad-mitochondrial-stack', 'sirt1-activation-pair', 'mitochondrial-renewal'],
    metabolic: ['cardiovascular-nitric-oxide', 'metabolic-ampk-stack'],
    renewal: ['senolytic-protocol', 'nrf2-defense-triad'],
    cognition: ['cognition-stack'],
  };
  return byFocus[focus].includes(protocol.slug);
}

function timingSummary(protocol: Protocol) {
  return Array.from(new Set(protocol.steps.map((step) => step.timing))).join(' · ');
}

/**
 * A client-side orientation layer for the authored protocol registry. It is a
 * finder and comparison aid—not a recommendation engine—and makes no claims
 * about visitor suitability.
 */
export function ProtocolExplorer() {
  const [focus, setFocus] = useState<FocusId>('all');
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const shownProtocols = useMemo(() => protocols.filter((protocol) => matchesFocus(protocol, focus)), [focus]);
  const compared = compareSlugs
    .map((slug) => protocols.find((protocol) => protocol.slug === slug))
    .filter((protocol): protocol is Protocol => Boolean(protocol));

  const toggleCompare = (slug: string) => {
    setCompareSlugs((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length === 2) return [current[1], slug];
      return [...current, slug];
    });
  };

  return (
    <section aria-labelledby="protocol-explorer-title">
      <div className="card-floating card-shine relative overflow-hidden rounded-2xl p-5 md:p-6">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-accent-violet/15 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-accent-violet" aria-hidden="true" />
                <p className="text-micro font-mono uppercase tracking-[0.14em] text-accent-violet">Protocol Finder</p>
              </div>
              <h2 id="protocol-explorer-title" className="mt-2 text-xl font-bold tracking-tight">Choose a system to inspect first.</h2>
              <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">Use the focus lenses to orient the catalogue, then compare up to two curated protocols by their authored evidence, timing, and hallmark coverage.</p>
            </div>
            <p className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Educational planning only</p>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {focusOptions.map((option) => {
              const selected = option.id === focus;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFocus(option.id)}
                  aria-pressed={selected}
                  className={`focus-ring rounded-xl border p-3.5 text-left transition-colors ${
                    selected
                      ? 'border-accent-violet/50 bg-accent-violet/[0.10]'
                      : 'border-border/65 bg-background/20 hover:border-accent-violet/30 hover:bg-accent-violet/[0.04]'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold ${selected ? 'text-accent-violet' : 'text-foreground'}`}>{option.label}</span>
                    {selected && <Check className="h-4 w-4 text-accent-violet" aria-hidden="true" />}
                  </span>
                  <span className="mt-1 block text-caption text-muted-foreground">{option.detail}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {compared.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-accent-violet/25 bg-accent-violet/[0.04]">
          <div className="flex flex-col gap-3 border-b border-accent-violet/20 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-accent-violet" aria-hidden="true" />
              <div>
                <p className="text-label text-accent-violet">Comparison workspace</p>
                <p className="text-caption text-muted-foreground">{compared.length === 1 ? 'Choose one more protocol to compare their authored attributes.' : 'Compare structure and evidence context—not personal suitability.'}</p>
              </div>
            </div>
            <button type="button" onClick={() => setCompareSlugs([])} className="focus-ring text-xs font-semibold text-muted-foreground hover:text-foreground">Clear comparison</button>
          </div>
          <div className={`grid divide-y divide-accent-violet/15 ${compared.length === 2 ? 'md:grid-cols-2 md:divide-x md:divide-y-0' : ''}`}>
            {compared.map((protocol) => (
              <article key={protocol.slug} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-micro font-mono uppercase tracking-[0.12em] text-accent-violet">{protocol.formula}</p>
                    <h3 className="mt-1 text-base font-semibold">{protocol.name}</h3>
                  </div>
                  <EvidenceTag tier={protocol.evidence} size="sm" href="/trust/methodology" />
                </div>
                <p className="mt-2 text-caption leading-relaxed text-muted-foreground">{protocol.goal}</p>
                <dl className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-border/60 bg-background/25 p-2.5"><dt className="text-micro font-mono uppercase tracking-[0.08em] text-muted-foreground">Compounds</dt><dd className="mt-1 text-sm font-semibold">{protocol.steps.length}</dd></div>
                  <div className="rounded-lg border border-border/60 bg-background/25 p-2.5"><dt className="text-micro font-mono uppercase tracking-[0.08em] text-muted-foreground">Timing</dt><dd className="mt-1 text-sm font-semibold">{timingSummary(protocol)}</dd></div>
                  <div className="rounded-lg border border-border/60 bg-background/25 p-2.5"><dt className="text-micro font-mono uppercase tracking-[0.08em] text-muted-foreground">Targets</dt><dd className="mt-1 text-sm font-semibold">{protocol.hallmarkIds.length} hallmarks</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-3">
                  {protocol.moduleHref && <Link href={protocol.moduleHref} className="focus-ring text-xs font-semibold text-accent-violet hover:underline">Read evidence →</Link>}
                  <Link href="/stacks" className="focus-ring text-xs font-semibold text-accent-cyan hover:underline">Open Stack Architect →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {shownProtocols.map((protocol) => {
          const selected = compareSlugs.includes(protocol.slug);
          return (
            <div key={protocol.slug} className="relative h-full">
              <ProtocolCard protocol={protocol} />
              <button
                type="button"
                onClick={() => toggleCompare(protocol.slug)}
                aria-pressed={selected}
                className={`focus-ring absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-micro font-semibold transition-colors ${
                  selected
                    ? 'border-accent-violet/45 bg-accent-violet/15 text-accent-violet'
                    : 'border-border/60 bg-background/70 text-muted-foreground hover:border-accent-violet/40 hover:text-accent-violet'
                }`}
              >
                {selected ? <Check className="h-3 w-3" aria-hidden="true" /> : <Layers3 className="h-3 w-3" aria-hidden="true" />}
                {selected ? 'Compared' : 'Compare'}
              </button>
            </div>
          );
        })}
      </div>

      {shownProtocols.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-accent-violet/30 bg-accent-violet/[0.035] p-6 text-center">
          <Sparkles className="mx-auto h-5 w-5 text-accent-violet" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold">No protocol matches this focus yet.</p>
          <button type="button" onClick={() => setFocus('all')} className="focus-ring mt-2 text-xs font-semibold text-accent-violet hover:underline">View all protocols</button>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/25 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Want a workspace for your own decision process?</p>
          <p className="mt-1 text-caption text-muted-foreground">The Stack Architect adds and removes compounds, then surfaces coverage and interaction checks for inspection.</p>
        </div>
        <Link href="/stacks" className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/[0.07] px-4 py-3 text-sm font-semibold text-accent-cyan hover:bg-accent-cyan/[0.12]">
          Open Stack Architect <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
