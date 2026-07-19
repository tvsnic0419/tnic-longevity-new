'use client';

import { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Sparkles, Leaf } from 'lucide-react';
import { mechanismAtlas } from '@/lib/mechanism-atlas';
import type { EvidenceTier } from '@/lib/types';

/* ── Geometry (SVG user units; scales to any width via viewBox) ─────────── */
const VBW = 960;
const VBH = 860;
const PAD_TOP = 78;
const PAD_BOTTOM = 34;
const USABLE = VBH - PAD_TOP - PAD_BOTTOM;

const HALL = { x: 40, w: 196, h: 42 };
const PATH = { cx: 480, w: 150, h: 46 };
const LEVER = { x: 736, w: 188, h: 34 };
const HALL_RIGHT = HALL.x + HALL.w; // 236
const PATH_LEFT = PATH.cx - PATH.w / 2; // 405
const PATH_RIGHT = PATH.cx + PATH.w / 2; // 555
const LEVER_LEFT = LEVER.x; // 736

const TIER_VAR: Record<EvidenceTier, string> = {
  A: 'var(--accent-emerald)',
  B: 'var(--accent-cyan)',
  C: 'var(--accent-amber)',
};

/* SVG <text> presentation is set inline, not via CSS classes: the project's
   CSS pipeline (Tailwind v4 / Lightning CSS) did not emit a raw `.atlas-*`
   rule block, so class-based fill silently fell back to black. Inline
   attributes always paint — the same approach PathwayDiagram.tsx relies on. */
const MONO = 'var(--font-mono)';
const COL_HEAD = {
  fill: 'var(--color-text-faint)',
  fontFamily: MONO,
  fontSize: 12,
  letterSpacing: '0.14em',
} as const;
const NODE_LABEL = {
  fill: 'var(--color-text-primary)',
  fontSize: 13.5,
  fontWeight: 600,
  dominantBaseline: 'central',
} as const;
const NODE_NUM = {
  fontSize: 12,
  fontWeight: 700,
  fontFamily: MONO,
  dominantBaseline: 'central',
} as const;
const NODE_TAG = {
  fill: 'var(--color-text-faint)',
  fontSize: 9.5,
  fontFamily: MONO,
  letterSpacing: '0.05em',
  dominantBaseline: 'central',
} as const;
const PATH_LABEL = {
  fontSize: 15,
  fontWeight: 700,
  dominantBaseline: 'central',
} as const;
const TIER_WORD: Record<EvidenceTier, string> = {
  A: 'Human RCT',
  B: 'Strong pre-clinical',
  C: 'Exploratory',
};

interface AtlasEdge {
  id: string;
  kind: 'hp' | 'pl';
  pathwaySlug: string;
  theme: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function centerY(i: number, count: number): number {
  return PAD_TOP + ((i + 0.5) * USABLE) / count;
}

export function MechanismAtlas() {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);

  const { hallmarks, pathways, levers } = mechanismAtlas;

  /* Position lookups ----------------------------------------------------- */
  const layout = useMemo(() => {
    const hallmarkY = new Map<string, number>();
    hallmarks.forEach((h, i) => hallmarkY.set(h.key, centerY(i, hallmarks.length)));
    const pathwayY = new Map<string, number>();
    pathways.forEach((p, i) => pathwayY.set(p.key, centerY(i, pathways.length)));
    const leverY = new Map<string, number>();
    levers.forEach((l, i) => leverY.set(l.key, centerY(i, levers.length)));

    const edges: AtlasEdge[] = [];
    for (const p of pathways) {
      const py = pathwayY.get(p.key)!;
      for (const hid of p.hallmarkIds) {
        const hKey = `hallmark:${hid}`;
        const hy = hallmarkY.get(hKey);
        if (hy === undefined) continue;
        edges.push({
          id: `${hKey}|${p.key}`,
          kind: 'hp',
          pathwaySlug: p.slug,
          theme: `var(--accent-${p.theme})`,
          x1: HALL_RIGHT,
          y1: hy,
          x2: PATH_LEFT,
          y2: py,
        });
      }
      for (const lKey of p.leverKeys) {
        const ly = leverY.get(lKey);
        if (ly === undefined) continue;
        edges.push({
          id: `${p.key}|${lKey}`,
          kind: 'pl',
          pathwaySlug: p.slug,
          theme: `var(--accent-${p.theme})`,
          x1: PATH_RIGHT,
          y1: py,
          x2: LEVER_LEFT,
          y2: ly,
        });
      }
    }
    return { hallmarkY, pathwayY, leverY, edges };
  }, [hallmarks, pathways, levers]);

  /* Which pathway slugs connect to the active node ----------------------- */
  const activePathwaySlugs = useMemo(() => {
    if (!active) return new Set<string>();
    if (active.startsWith('pathway:')) return new Set([active.slice('pathway:'.length)]);
    if (active.startsWith('hallmark:')) {
      const h = hallmarks.find((x) => x.key === active);
      return new Set(h?.pathwaySlugs ?? []);
    }
    const l = levers.find((x) => x.key === active);
    return new Set(l?.pathwaySlugs ?? []);
  }, [active, hallmarks, levers]);

  const activeNodeKeys = useMemo(() => {
    const set = new Set<string>();
    if (!active) return set;
    set.add(active);
    if (active.startsWith('pathway:')) {
      const p = pathways.find((x) => x.key === active);
      p?.hallmarkIds.forEach((id) => set.add(`hallmark:${id}`));
      p?.leverKeys.forEach((k) => set.add(k));
    } else {
      // hallmark or lever active → light up the reachable pathways, then their
      // far-side neighbours (levers for a hallmark, hallmarks for a lever).
      for (const slug of activePathwaySlugs) {
        const p = pathways.find((x) => x.slug === slug);
        if (!p) continue;
        set.add(p.key);
        if (active.startsWith('hallmark:')) p.leverKeys.forEach((k) => set.add(k));
        else p.hallmarkIds.forEach((id) => set.add(`hallmark:${id}`));
      }
    }
    return set;
  }, [active, pathways, activePathwaySlugs]);

  const isEdgeActive = useCallback(
    (edge: AtlasEdge) => {
      if (!active) return false;
      if (active.startsWith('pathway:')) return `pathway:${edge.pathwaySlug}` === active;
      if (active.startsWith('hallmark:')) {
        if (edge.kind === 'hp') return edge.id.startsWith(`${active}|`);
        return activePathwaySlugs.has(edge.pathwaySlug);
      }
      // lever active
      if (edge.kind === 'pl') return edge.id.endsWith(`|${active}`);
      return activePathwaySlugs.has(edge.pathwaySlug);
    },
    [active, activePathwaySlugs],
  );

  const nodeOpacity = (key: string) => {
    if (!active) return 1;
    return activeNodeKeys.has(key) ? 1 : 0.24;
  };

  const handleActivate = useCallback(
    (key: string, href: string) => {
      // Click focuses; clicking the already-focused node opens its page.
      if (active === key) router.push(href);
      else setActive(key);
    },
    [active, router],
  );

  const detail = useMemo(() => {
    if (!active) return null;
    if (active.startsWith('pathway:')) {
      const p = pathways.find((x) => x.key === active)!;
      const leverNames = levers.filter((l) => p.leverKeys.includes(l.key)).map((l) => l.name);
      const hallNames = hallmarks.filter((h) => p.hallmarkIds.includes(h.id)).map((h) => h.title);
      return {
        eyebrow: 'Convergence pathway',
        theme: p.theme,
        title: p.name,
        body: p.tagline,
        chipsLabel: 'Levers that engage it',
        chips: leverNames,
        metaLabel: 'Hallmarks it addresses',
        meta: hallNames,
        href: p.href,
        cta: 'Open pathway',
      };
    }
    if (active.startsWith('hallmark:')) {
      const h = hallmarks.find((x) => x.key === active)!;
      const pathNames = pathways.filter((p) => h.pathwaySlugs.includes(p.slug)).map((p) => p.name);
      return {
        eyebrow: `Hallmark ${String(h.number).padStart(2, '0')} of 12`,
        theme: h.theme,
        title: h.title,
        body: h.lifestyleLed
          ? `${h.tagline}. No single convergence pathway is its primary lever — on TNiC this hallmark is addressed mainly through lifestyle (${h.id === 'telomeres' ? 'stress, cortisol, and sleep' : 'dietary fiber and fermented foods'}), which its Library page covers in full.`
          : h.tagline,
        chipsLabel: h.lifestyleLed ? 'Primary lever' : 'Addressed by pathways',
        chips: h.lifestyleLed ? ['Lifestyle-led'] : pathNames,
        metaLabel: null,
        meta: [],
        href: h.href,
        cta: 'Open hallmark',
      };
    }
    const l = levers.find((x) => x.key === active)!;
    const pathNames = pathways.filter((p) => l.pathwaySlugs.includes(p.slug)).map((p) => p.name);
    const kindWord = l.leverKind === 'peptide' ? 'Peptide' : l.leverKind === 'rx' ? 'Prescription' : 'Compound';
    return {
      eyebrow: `${kindWord} lever · Tier ${l.evidenceTier} (${TIER_WORD[l.evidenceTier]})`,
      theme: (l.evidenceTier === 'A' ? 'emerald' : l.evidenceTier === 'B' ? 'cyan' : 'amber') as string,
      title: l.name,
      body: `Engages ${l.pathwaySlugs.length} of the six convergence pathways${l.isPrimaryAnywhere ? ', as a primary lever on at least one' : ''}.`,
      chipsLabel: 'Pathways it engages',
      chips: pathNames,
      metaLabel: null,
      meta: [],
      href: l.href,
      cta: l.leverKind === 'rx' ? 'Open reference' : 'Open module',
    };
  }, [active, hallmarks, pathways, levers]);

  /* ── Shared node interaction props ───────────────────────────────────── */
  const nodeProps = (key: string, href: string, label: string) => ({
    role: 'link',
    tabIndex: 0,
    'aria-label': label,
    style: { cursor: 'pointer' as const, outline: 'none', transition: 'opacity 0.25s' },
    onMouseEnter: () => setActive(key),
    onFocus: () => setActive(key),
    onClick: () => handleActivate(key, href),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivate(key, href);
      }
    },
  });

  return (
    <div className="not-prose">
      {/* ── Desktop / tablet: the interactive graph ──────────────────────── */}
      <div className="hidden md:block">
        <div className="card-premium p-3 sm:p-4">
          <svg
            viewBox={`0 0 ${VBW} ${VBH}`}
            className="atlas-svg w-full h-auto"
            role="group"
            aria-label="Mechanism atlas: 12 hallmarks of aging linked through 6 molecular pathways to their compound and peptide levers"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActive(null);
            }}
          >
            {/* Column headers */}
            <text x={HALL.x + HALL.w / 2} y={40} textAnchor="middle" {...COL_HEAD}>
              HALLMARKS · WHAT FAILS
            </text>
            <text x={PATH.cx} y={40} textAnchor="middle" {...COL_HEAD}>
              PATHWAYS · THE MECHANISM
            </text>
            <text x={LEVER.x + LEVER.w / 2} y={40} textAnchor="middle" {...COL_HEAD}>
              LEVERS · WHAT YOU PULL
            </text>

            {/* Edges (under nodes) */}
            <g>
              {layout.edges.map((edge) => {
                const on = isEdgeActive(edge);
                const midX = (edge.x1 + edge.x2) / 2;
                return (
                  <path
                    key={edge.id}
                    d={`M${edge.x1} ${edge.y1} C${midX} ${edge.y1}, ${midX} ${edge.y2}, ${edge.x2} ${edge.y2}`}
                    fill="none"
                    stroke={edge.theme}
                    strokeWidth={on ? 1.8 : 1}
                    strokeOpacity={active ? (on ? 0.75 : 0.045) : 0.1}
                    vectorEffect="non-scaling-stroke"
                    style={{ transition: 'stroke-opacity 0.25s, stroke-width 0.25s' }}
                  />
                );
              })}
            </g>

            {/* Hallmark nodes (left) */}
            {hallmarks.map((h) => {
              const y = layout.hallmarkY.get(h.key)!;
              const op = nodeOpacity(h.key);
              const lit = !active || activeNodeKeys.has(h.key);
              return (
                <g
                  key={h.key}
                  transform={`translate(0 ${y - HALL.h / 2})`}
                  opacity={op}
                  {...nodeProps(h.key, h.href, `Hallmark ${h.number}, ${h.title}`)}
                >
                  <rect
                    x={HALL.x}
                    y={0}
                    width={HALL.w}
                    height={HALL.h}
                    rx={11}
                    fill="var(--color-bg-elevated)"
                    stroke={lit ? `var(--accent-${h.theme})` : 'var(--color-border)'}
                    strokeWidth={lit ? 1.4 : 1}
                    strokeDasharray={h.lifestyleLed ? '4 3' : undefined}
                  />
                  <text x={HALL.x + 14} y={HALL.h / 2} {...NODE_NUM} fill={`var(--accent-${h.theme})`}>
                    {String(h.number).padStart(2, '0')}
                  </text>
                  <text x={HALL.x + 40} y={HALL.h / 2} {...NODE_LABEL}>
                    {h.shortLabel}
                  </text>
                  {h.lifestyleLed && (
                    <text x={HALL.x + HALL.w - 12} y={HALL.h / 2} textAnchor="end" {...NODE_TAG}>
                      LIFESTYLE
                    </text>
                  )}
                </g>
              );
            })}

            {/* Pathway nodes (center) */}
            {pathways.map((p) => {
              const y = layout.pathwayY.get(p.key)!;
              const op = nodeOpacity(p.key);
              const isActive = active === p.key;
              return (
                <g
                  key={p.key}
                  transform={`translate(0 ${y - PATH.h / 2})`}
                  opacity={op}
                  {...nodeProps(p.key, p.href, `Pathway, ${p.name}`)}
                >
                  <rect
                    x={PATH.cx - PATH.w / 2}
                    y={0}
                    width={PATH.w}
                    height={PATH.h}
                    rx={13}
                    fill={`color-mix(in srgb, var(--accent-${p.theme}) ${isActive ? 26 : 15}%, var(--color-bg-elevated))`}
                    stroke={`var(--accent-${p.theme})`}
                    strokeWidth={isActive ? 2 : 1.3}
                    style={{
                      transition: 'fill 0.25s, stroke-width 0.25s',
                      filter: isActive ? `drop-shadow(0 0 10px color-mix(in srgb, var(--accent-${p.theme}) 55%, transparent))` : 'none',
                    }}
                  />
                  <text x={PATH.cx} y={PATH.h / 2} textAnchor="middle" {...PATH_LABEL} fill={`var(--accent-${p.theme})`}>
                    {p.shortLabel}
                  </text>
                </g>
              );
            })}

            {/* Lever nodes (right) */}
            {levers.map((l) => {
              const y = layout.leverY.get(l.key)!;
              const op = nodeOpacity(l.key);
              const lit = !active || activeNodeKeys.has(l.key);
              return (
                <g
                  key={l.key}
                  transform={`translate(0 ${y - LEVER.h / 2})`}
                  opacity={op}
                  {...nodeProps(l.key, l.href, `${l.name}, evidence tier ${l.evidenceTier}`)}
                >
                  <rect
                    x={LEVER.x}
                    y={0}
                    width={LEVER.w}
                    height={LEVER.h}
                    rx={9}
                    fill="var(--color-bg-elevated)"
                    stroke={lit ? TIER_VAR[l.evidenceTier] : 'var(--color-border)'}
                    strokeWidth={lit ? 1.3 : 1}
                  />
                  <circle cx={LEVER.x + 14} cy={LEVER.h / 2} r={4} fill={TIER_VAR[l.evidenceTier]} />
                  <text x={LEVER.x + 26} y={LEVER.h / 2} {...NODE_LABEL}>
                    {l.name}
                  </text>
                  {l.leverKind !== 'compound' && (
                    <text x={LEVER.x + LEVER.w - 10} y={LEVER.h / 2} textAnchor="end" {...NODE_TAG}>
                      {l.leverKind === 'peptide' ? 'PEPTIDE' : 'Rx'}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── Mobile: same model, laid out as tappable chip clusters ────────── */}
      <div className="md:hidden space-y-5">
        <MobileCluster
          heading="Hallmarks · what fails"
          items={hallmarks.map((h) => ({
            key: h.key,
            label: `${String(h.number).padStart(2, '0')} ${h.shortLabel}`,
            theme: h.theme,
            dashed: h.lifestyleLed,
          }))}
          active={active}
          activeNodeKeys={activeNodeKeys}
          onTap={(k) => setActive(active === k ? null : k)}
        />
        <MobileCluster
          heading="Pathways · the mechanism"
          items={pathways.map((p) => ({ key: p.key, label: p.shortLabel, theme: p.theme, filled: true }))}
          active={active}
          activeNodeKeys={activeNodeKeys}
          onTap={(k) => setActive(active === k ? null : k)}
        />
        <MobileCluster
          heading="Levers · what you pull"
          items={levers.map((l) => ({
            key: l.key,
            label: l.name,
            tier: l.evidenceTier,
          }))}
          active={active}
          activeNodeKeys={activeNodeKeys}
          onTap={(k) => setActive(active === k ? null : k)}
        />
      </div>

      {/* ── Detail readout (shared by both layouts) ───────────────────────── */}
      <div className="mt-5">
        {detail ? (
          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor: `color-mix(in srgb, var(--accent-${detail.theme}) 35%, transparent)`,
              background: `color-mix(in srgb, var(--accent-${detail.theme}) 6%, var(--glass-bg))`,
            }}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: `var(--accent-${detail.theme})` }}>
              {detail.eyebrow}
            </p>
            <h3 className="text-lg font-bold text-foreground">{detail.title}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{detail.body}</p>

            {detail.chips.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-mono uppercase text-muted-foreground/70 mb-1.5">{detail.chipsLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.chips.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
                      style={{
                        borderColor: `color-mix(in srgb, var(--accent-${detail.theme}) 28%, transparent)`,
                        color: `var(--accent-${detail.theme})`,
                        background: `color-mix(in srgb, var(--accent-${detail.theme}) 8%, transparent)`,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={detail.href}
              className="focus-ring interactive mt-4 inline-flex items-center gap-1.5 text-sm font-semibold rounded-lg"
              style={{ color: `var(--accent-${detail.theme})` }}
            >
              {detail.cta}
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/30 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent-violet" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">Hover, tap, or focus any node to trace its mechanism</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Select a hallmark to see which pathways address it and the levers that reach it; select a lever to walk
              the chain back to the hallmarks it touches. Click a focused node again to open its full page.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-emerald)' }} /> Tier A · Human RCT
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-cyan)' }} /> Tier B · Pre-clinical
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent-amber)' }} /> Tier C · Exploratory
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="w-3 h-3 text-accent-emerald" aria-hidden="true" /> Dashed hallmark · lifestyle-led
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Mobile chip cluster ─────────────────────────────────────────────────── */
interface MobileChip {
  key: string;
  label: string;
  theme?: string;
  tier?: EvidenceTier;
  filled?: boolean;
  dashed?: boolean;
}

function MobileCluster({
  heading,
  items,
  active,
  activeNodeKeys,
  onTap,
}: {
  heading: string;
  items: MobileChip[];
  active: string | null;
  activeNodeKeys: Set<string>;
  onTap: (key: string) => void;
}) {
  const tierVar: Record<EvidenceTier, string> = {
    A: 'var(--accent-emerald)',
    B: 'var(--accent-cyan)',
    C: 'var(--accent-amber)',
  };
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 mb-2">{heading}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => {
          const dim = active !== null && !activeNodeKeys.has(it.key);
          const accent = it.tier ? tierVar[it.tier] : it.theme ? `var(--accent-${it.theme})` : 'var(--color-border)';
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onTap(it.key)}
              className="focus-ring text-xs font-medium px-2.5 py-1 rounded-full border transition"
              style={{
                borderColor: `color-mix(in srgb, ${accent} ${isActive ? 70 : 32}%, transparent)`,
                borderStyle: it.dashed ? 'dashed' : 'solid',
                color: it.filled || isActive ? accent : 'var(--color-text-primary)',
                background: it.filled
                  ? `color-mix(in srgb, ${accent} ${isActive ? 22 : 12}%, transparent)`
                  : isActive
                    ? `color-mix(in srgb, ${accent} 12%, transparent)`
                    : 'transparent',
                opacity: dim ? 0.35 : 1,
              }}
            >
              {it.tier && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                  style={{ background: accent }}
                />
              )}
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
