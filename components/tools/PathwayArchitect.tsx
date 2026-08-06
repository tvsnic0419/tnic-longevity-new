'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Check,
  Circle,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Share2,
  Printer,
  Trash2,
  Network,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import {
  COMPOUND_DB,
  CDB,
  HALLMARKS,
  PATHWAY_LABELS,
  DEFAULT_WEIGHTS,
  analyzeStack,
  type PathwayId,
  type StagedItem,
} from '@/lib/compound-engine-data';

/**
 * Pathway Architect — a protocol builder on the same curated dataset and
 * scoring engine as the Compound Intelligence Engine
 * (`lib/compound-engine-data.ts`). `analyzeStack()` already does real synergy
 * detection, redundancy/interaction cautions, convergent-pathway analysis,
 * and hallmark coverage — all unit-tested — so this component is purely a
 * focused UI on top of it, not a second data source or a second set of rules.
 */

const STORAGE_KEY = 'tnic:pathway-architect:selected';

// Every id here is a real pair drawn from SYNERGY_PAIRS in
// lib/compound-engine-data.ts — no invented combinations.
const STARTER_STACKS: { id: string; name: string; blurb: string; ids: string[] }[] = [
  { id: 'nad-methylation', name: 'NAD⁺ + Methylation', blurb: 'NMN paired with its methyl-donor offset.', ids: ['nmn', 'tmg'] },
  { id: 'redox-restoration', name: 'Redox Restoration', blurb: 'The GlyNAC glutathione-precursor pair.', ids: ['glycine', 'nac'] },
  { id: 'bone-mineral-axis', name: 'Bone-Mineral Axis', blurb: 'D3 routes calcium; K2 and magnesium complete the cofactor chain.', ids: ['vitd3', 'vitk2', 'magnesium'] },
  { id: 'mitophagy-duo', name: 'Mitophagy + Autophagy', blurb: 'Complementary cellular quality-control routes.', ids: ['urolithin-a', 'spermidine'] },
];

const FILTERS: { key: 'all' | PathwayId; label: string }[] = [
  { key: 'all', label: `All ${COMPOUND_DB.length}` },
  ...(Object.keys(PATHWAY_LABELS) as PathwayId[]).map((p) => ({ key: p, label: PATHWAY_LABELS[p] })),
];

function encodeIds(ids: string[]): string {
  return [...ids].sort().join(',');
}
function decodeIds(s: string | null | undefined): string[] {
  if (!s) return [];
  return s.split(',').map((x) => x.trim()).filter((id) => CDB[id]);
}

function toStagedItem(id: string): StagedItem | null {
  const data = CDB[id];
  if (!data) return null;
  return { uid: id, data, name: data.name, brand: '', dose: data.dose, form: 'std', source: 'curated' };
}

export function PathwayArchitect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | PathwayId>('all');
  const [copied, setCopied] = useState(false);
  const hydratedRef = useRef(false);

  // Hydrate from the URL first (a shared link), then localStorage — matches
  // the same priority the rest of the site's persisted-state tools use.
  useEffect(() => {
    const fromUrl = decodeIds(params?.get('p'));
    if (fromUrl.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is a client-only source; not derivable during render.
      setSelected(new Set(fromUrl));
    } else if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) setSelected(new Set(decodeIds(saved)));
      } catch {
        /* ignore */
      }
    }
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage + mirror into the URL (replace, no scroll) so a
  // protocol survives a refresh and can be shared as a link.
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === 'undefined') return;
    const encoded = encodeIds([...selected]);
    try {
      window.localStorage.setItem(STORAGE_KEY, encoded);
    } catch {
      /* ignore */
    }
    router.replace(encoded ? `${pathname}?p=${encoded}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const loadStack = (ids: string[]) => setSelected(new Set(ids));
  const clear = () => setSelected(new Set());

  const filtered = useMemo(() => {
    if (filter === 'all') return COMPOUND_DB;
    return COMPOUND_DB.filter((c) => c.pathways.includes(filter));
  }, [filter]);

  const staged = useMemo(
    () => [...selected].map(toStagedItem).filter((s): s is StagedItem => s !== null),
    [selected],
  );
  const analysis = useMemo(() => analyzeStack(staged, DEFAULT_WEIGHTS), [staged]);

  const share = async () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}${pathname}?p=${encodeIds([...selected])}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this share link:', url);
    }
  };

  const isEmpty = selected.size === 0;

  return (
    <div className="container-page py-10 md:py-14">
      <PageHeader
        icon={Network}
        eyebrow="Interactive Tool"
        title="Pathway Architect"
        description={`${COMPOUND_DB.length} evidence-graded compounds mapped to ${Object.keys(PATHWAY_LABELS).length} molecular pathways. Toggle cards to build a protocol — synergy, redundancy, and interaction cautions surface live from the same engine that powers the Compound Intelligence Engine.`}
        theme="violet"
        as="h1"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] mt-8">
        <div>
          {/* Pathway filter chips */}
          <div role="tablist" aria-label="Filter compounds by pathway" className="mb-4 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={[
                    'focus-ring rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'border-accent-violet bg-accent-violet/15 text-accent-violet'
                      : 'border-border text-foreground/70 hover:border-foreground/30 hover:text-foreground',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Compound grid */}
          <div role="list" aria-label={`Showing ${filtered.length} compounds`} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => {
              const isSel = selected.has(c.id);
              return (
                <div key={c.id} role="listitem" className="relative">
                  <div
                    className={[
                      'relative rounded-xl border p-3.5 transition-all',
                      isSel ? 'border-accent-violet bg-accent-violet/10' : 'card-elevated hover:border-foreground/25',
                    ].join(' ')}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      aria-pressed={isSel}
                      aria-label={`${isSel ? 'Remove' : 'Add'} ${c.name}${isSel ? ' from' : ' to'} protocol`}
                      className="focus-ring absolute inset-0 z-0 rounded-xl"
                    />
                    <div className="relative z-10 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-foreground">{c.name}</h3>
                        <EvidenceTag tier={c.tier as 'A' | 'B' | 'C'} size="sm" />
                      </div>
                      {isSel ? (
                        <Check className="h-[18px] w-[18px] shrink-0 text-accent-violet" aria-hidden="true" />
                      ) : (
                        <Circle className="h-[18px] w-[18px] shrink-0 text-foreground/30" aria-hidden="true" />
                      )}
                    </div>
                    <p className="relative z-10 mt-1 text-[11px] font-medium leading-snug text-foreground/70">{c.cls}</p>
                    <p className="relative z-10 mt-1.5 text-[11px] leading-snug text-foreground/60">{c.dose}</p>
                    {c.libraryHref && (
                      <Link
                        href={c.libraryHref}
                        onClick={(e) => e.stopPropagation()}
                        className="focus-ring relative z-10 mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-foreground/60 hover:text-accent-violet"
                      >
                        Evidence page <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-caption text-foreground/60">
            Every card links to its full mechanism and PMID citations. Selections are saved locally and mirrored
            into the URL, so a protocol survives a refresh and can be shared as a link.
          </p>
        </div>

        {/* Active protocol — sticky */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="card-ultra p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-accent-violet" aria-hidden="true" />
                Active protocol
              </h2>
              <span className="text-sm text-foreground/70">
                {selected.size} {selected.size === 1 ? 'compound' : 'compounds'}
              </span>
            </div>

            {isEmpty ? (
              <>
                <p className="py-2 text-center text-sm text-foreground/70">
                  No compounds selected. Tap cards to build your protocol.
                </p>
                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold text-foreground/70">Or start with a curated pair:</p>
                  <div className="grid gap-2">
                    {STARTER_STACKS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => loadStack(s.ids)}
                        className="focus-ring card-elevated rounded-lg p-2.5 text-left transition-colors hover:border-accent-violet/40"
                      >
                        <div className="text-sm font-semibold text-foreground">{s.name}</div>
                        <div className="mt-0.5 text-[11px] text-foreground/65">{s.blurb}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3 flex flex-col gap-1.5" aria-label="Selected compounds">
                  {[...selected].map((id) => {
                    const c = CDB[id];
                    if (!c) return null;
                    return (
                      <div key={id} className="card-elevated flex items-center justify-between rounded-lg px-2.5 py-1.5">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-foreground">{c.name}</div>
                          <div className="truncate text-[11px] text-foreground/60">{c.dose}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggle(id)}
                          aria-label={`Remove ${c.name}`}
                          className="focus-ring ml-2 shrink-0 rounded p-1 text-foreground/50 hover:bg-accent-rose/10 hover:text-accent-rose"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Synergy intelligence — real detections from analyzeStack() */}
                <div className="mb-3" aria-live="polite">
                  <p className="mb-2 text-[11px] font-mono uppercase tracking-wider text-foreground/60">
                    Synergy intelligence
                  </p>
                  {analysis.synergies.length === 0 && analysis.cautions.length === 0 && analysis.redundancies.length === 0 ? (
                    <p className="text-xs text-foreground/60">Add more compounds to unlock synergy intelligence.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {analysis.synergies.map((s) => (
                        <div key={`${s.a}-${s.b}`} className="flex items-start gap-2 rounded-lg bg-accent-emerald/10 px-2.5 py-1.5 text-[12px] leading-snug text-foreground">
                          <Sparkles className="mt-[1px] h-3.5 w-3.5 shrink-0 text-accent-emerald" aria-hidden="true" />
                          <span><strong>{s.a} + {s.b}:</strong> {s.rationale}</span>
                        </div>
                      ))}
                      {analysis.redundancies.map((r) => (
                        <div key={r.label} className="flex items-start gap-2 rounded-lg bg-accent-amber/10 px-2.5 py-1.5 text-[12px] leading-snug text-foreground">
                          <AlertTriangle className="mt-[1px] h-3.5 w-3.5 shrink-0 text-accent-amber" aria-hidden="true" />
                          <span><strong>{r.label}:</strong> {r.rationale}</span>
                        </div>
                      ))}
                      {analysis.cautions.map((c) => (
                        <div key={`${c.a}-${c.b}`} className="flex items-start gap-2 rounded-lg bg-accent-rose/10 px-2.5 py-1.5 text-[12px] leading-snug text-foreground">
                          <AlertTriangle className="mt-[1px] h-3.5 w-3.5 shrink-0 text-accent-rose" aria-hidden="true" />
                          <span><strong>{c.a} + {c.b}:</strong> {c.rationale}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Convergent pathways */}
                {analysis.convergent.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-2 text-[11px] font-mono uppercase tracking-wider text-foreground/60">
                      Convergent pathways
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.convergent.map((cv) => (
                        <span
                          key={cv.p}
                          className="rounded-md border border-accent-cyan/25 bg-accent-cyan/10 px-2 py-1 text-[11px] font-medium text-accent-cyan"
                          title={cv.members.join(', ')}
                        >
                          {PATHWAY_LABELS[cv.p]} · {cv.count}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hallmark coverage */}
                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-foreground/60">
                    <span>Hallmark coverage</span>
                    <span>{analysis.coveredCount}/{HALLMARKS.length}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {HALLMARKS.map((h) => {
                      const depth = analysis.hallmarkDepth[h.id];
                      const on = depth > 0;
                      return (
                        <div key={h.id} className="flex items-center gap-2">
                          <span className="w-[110px] shrink-0 truncate text-right text-[11px] text-foreground/60" title={h.label}>
                            {h.short}
                          </span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded bg-border/40">
                            <div
                              className={`h-full rounded transition-[width] duration-300 ${on ? 'bg-accent-violet' : 'w-1 bg-foreground/20'}`}
                              style={on ? { width: `${Math.min(100, depth * 34)}%` } : undefined}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {analysis.synergyScore !== null && (
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    <div className="card-elevated rounded-lg p-2.5 text-center">
                      <p className="text-xl font-black font-mono text-accent-violet">{Math.round(analysis.synergyScore)}</p>
                      <p className="text-[10px] uppercase tracking-wide text-foreground/60">Synergy /100</p>
                    </div>
                    <div className="card-elevated rounded-lg p-2.5 text-center">
                      <p className="text-xl font-black font-mono text-accent-violet">{analysis.coveragePct}%</p>
                      <p className="text-[10px] uppercase tracking-wide text-foreground/60">Hallmark coverage</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 no-print">
                  <button
                    type="button"
                    onClick={share}
                    className="focus-ring flex-1 rounded-lg bg-accent-violet px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-accent-violet/90"
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Share2 className="h-3.5 w-3.5" aria-hidden="true" />}
                      {copied ? 'Link copied' : 'Share protocol'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    aria-label="Print protocol"
                    className="focus-ring rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    aria-label="Clear protocol"
                    className="focus-ring rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-foreground/55">
                  Educational planning tool, not medical advice. Consult a qualified healthcare provider before
                  starting any regimen — synergy and caution notes reflect published mechanistic literature curated
                  by TNiC, not a personalized safety review.
                </p>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Print styles: protocol only, no chrome/controls. */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .container-page, .container-page * { visibility: visible; }
          nav, footer, .no-print, aside[aria-label="Your saved workspace"] { display: none !important; }
          .grid { display: block !important; }
        }
      `}</style>
    </div>
  );
}
