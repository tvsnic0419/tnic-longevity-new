'use client';

/**
 * Combination Lab — network graph. Pure SVG, no libraries.
 *
 * Robustness over physics: deterministic radial placement + drag-to-move
 * (persisted per compound id), wheel/pinch zoom, drag pan. Every edge uses
 * triple encoding — color + line style + a mid-edge code — so relationship
 * types survive grayscale and color-vision deficiency. A full text/table
 * fallback always renders below the graph, mirroring the established idiom
 * in `components/tools/StackNetworkGraph.tsx` — nobody who can't use (or
 * doesn't want) the interactive graph is left without the same data.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ChevronDown, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tierColor } from '@/components/viz/tokens';
import {
  RELATIONSHIP_LABELS,
  pairKey,
  type LabNode,
  type LabRelationship,
  type RelationshipType,
} from '@/lib/combination-lab';

/* ------------------------------------------------------------------ */
/* Geometry + view state                                               */
/* ------------------------------------------------------------------ */

const W = 800;
const H = 560;
const CX = W / 2;
const CY = H / 2;

interface Pt {
  x: number;
  y: number;
}

interface ViewState {
  scale: number;
  tx: number;
  ty: number;
}

const DEFAULT_VIEW: ViewState = { scale: 1, tx: 0, ty: 0 };
const MIN_SCALE = 0.45;
const MAX_SCALE = 2.6;

function clampScale(s: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

/** Deterministic radial placement — index-stable, no simulation loop. */
function radialPosition(index: number, total: number): Pt {
  if (total <= 1) return { x: CX, y: CY };
  const radius = Math.min(235, 105 + total * 14);
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) };
}

/* ------------------------------------------------------------------ */
/* Edge encoding                                                       */
/* ------------------------------------------------------------------ */

interface EdgeEncoding {
  /** CSS color value (token var where one exists). */
  color: string;
  /** Mid-edge code label — the third encoding channel. */
  code: string;
}

const EDGE_ENCODING: Record<RelationshipType, EdgeEncoding> = {
  synergy: { color: 'var(--accent-emerald)', code: 'SYN' },
  complementary: { color: 'var(--accent-cyan)', code: 'CMP' },
  additive: { color: 'var(--color-text-faint)', code: 'ADD' },
  redundancy: { color: 'var(--accent-amber)', code: 'RED' },
  interaction: { color: '#fb923c', code: 'INT' },
  antagonism: { color: 'var(--accent-rose)', code: 'ANT' },
  uncertain: { color: 'var(--color-text-faint)', code: '?' },
};

/** Zigzag polyline points between two points (antagonism glyph). */
function zigzagPoints(a: Pt, b: Pt, segments = 8, amplitude = 5): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const pts: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const off = i === 0 || i === segments ? 0 : i % 2 === 0 ? -amplitude : amplitude;
    pts.push(`${(a.x + dx * t + px * off).toFixed(1)},${(a.y + dy * t + py * off).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Render the visible stroke(s) for one relationship. */
function EdgeShape({ r, a, b }: { r: LabRelationship; a: Pt; b: Pt }) {
  const { color } = EDGE_ENCODING[r.type];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * 3.5;
  const py = (dx / len) * 3.5;

  switch (r.type) {
    case 'synergy':
      return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={2.5} />;
    case 'complementary':
      return (
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={color}
          strokeWidth={2}
          markerEnd="url(#lab-graph-arrow)"
        />
      );
    case 'additive':
      return (
        <>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={1.25} />
          <line
            x1={(a.x + b.x) / 2 - px * 2}
            y1={(a.y + b.y) / 2 - py * 2}
            x2={(a.x + b.x) / 2 + px * 2}
            y2={(a.y + b.y) / 2 + py * 2}
            stroke={color}
            strokeWidth={2}
          />
        </>
      );
    case 'redundancy':
      return (
        <>
          <line x1={a.x + px} y1={a.y + py} x2={b.x + px} y2={b.y + py} stroke={color} strokeWidth={1.5} />
          <line x1={a.x - px} y1={a.y - py} x2={b.x - px} y2={b.y - py} stroke={color} strokeWidth={1.5} />
        </>
      );
    case 'interaction':
      return (
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="0.1 7"
        />
      );
    case 'antagonism':
      return <polyline points={zigzagPoints(a, b)} fill="none" stroke={color} strokeWidth={2} />;
    case 'uncertain':
      return (
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="5 7"
          opacity={0.35}
        />
      );
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface LabGraphProps {
  nodes: LabNode[];
  relationships: LabRelationship[];
  selectedPairKey: string | null;
  onSelectRelationship: (r: LabRelationship) => void;
}

type Gesture =
  | { kind: 'pan'; pointerId: number; startClient: Pt; startView: ViewState }
  | { kind: 'node'; pointerId: number; id: string; offset: Pt }
  | {
      kind: 'pinch';
      startDist: number;
      startScale: number;
      startMid: Pt;
      startTx: number;
      startTy: number;
    };

export function LabGraph({ nodes, relationships, selectedPairKey, onSelectRelationship }: LabGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [view, setView] = useState<ViewState>(DEFAULT_VIEW);
  const [dragOverrides, setDragOverrides] = useState<Record<string, Pt>>({});
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [showUncertain, setShowUncertain] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const gesture = useRef<Gesture | null>(null);
  const activePointers = useRef(new Map<number, Pt>());

  /* Node positions: radial default, user drags win. */
  const positions = useMemo(() => {
    const map = new Map<string, Pt>();
    nodes.forEach((n, i) => {
      map.set(n.id, dragOverrides[n.id] ?? radialPosition(i, nodes.length));
    });
    return map;
  }, [nodes, dragOverrides]);

  const visibleEdges = useMemo(
    () => relationships.filter((r) => showUncertain || r.type !== 'uncertain'),
    [relationships, showUncertain],
  );
  const uncertainCount = relationships.length - relationships.filter((r) => r.type !== 'uncertain').length;

  /* ---- coordinate conversion ---- */
  const toSvgPoint = (clientX: number, clientY: number): Pt => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };
  const toGraphPoint = (clientX: number, clientY: number): Pt => {
    const p = toSvgPoint(clientX, clientY);
    return { x: (p.x - view.tx) / view.scale, y: (p.y - view.ty) / view.scale };
  };

  /* ---- zoom (wheel needs a non-passive listener to preventDefault) ---- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      setView((v) => {
        const scale = clampScale(v.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
        const k = scale / v.scale;
        return { scale, tx: p.x - (p.x - v.tx) * k, ty: p.y - (p.y - v.ty) * k };
      });
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  const zoomBy = (factor: number) => {
    setView((v) => {
      const scale = clampScale(v.scale * factor);
      const k = scale / v.scale;
      return { scale, tx: CX - (CX - v.tx) * k, ty: CY - (CY - v.ty) * k };
    });
  };
  const resetView = () => {
    setView(DEFAULT_VIEW);
    setDragOverrides({});
  };

  /* ---- gestures ---- */
  const onBackgroundPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    svgRef.current?.setPointerCapture(e.pointerId);
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size === 2) {
      const [p1, p2] = [...activePointers.current.values()] as [Pt, Pt];
      const s1 = toSvgPoint(p1.x, p1.y);
      const s2 = toSvgPoint(p2.x, p2.y);
      gesture.current = {
        kind: 'pinch',
        startDist: Math.hypot(s2.x - s1.x, s2.y - s1.y) || 1,
        startScale: view.scale,
        startMid: { x: (s1.x + s2.x) / 2, y: (s1.y + s2.y) / 2 },
        startTx: view.tx,
        startTy: view.ty,
      };
    } else {
      gesture.current = {
        kind: 'pan',
        pointerId: e.pointerId,
        startClient: { x: e.clientX, y: e.clientY },
        startView: view,
      };
    }
  };

  const onNodePointerDown = (e: ReactPointerEvent<SVGGElement>, id: string) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    const node = positions.get(id) ?? { x: CX, y: CY };
    const g = toGraphPoint(e.clientX, e.clientY);
    gesture.current = { kind: 'node', pointerId: e.pointerId, id, offset: { x: node.x - g.x, y: node.y - g.y } };
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (activePointers.current.has(e.pointerId)) {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    const g = gesture.current;
    if (!g) return;
    if (g.kind === 'pan' && g.pointerId === e.pointerId) {
      const start = toSvgPoint(g.startClient.x, g.startClient.y);
      const cur = toSvgPoint(e.clientX, e.clientY);
      setView({ ...g.startView, tx: g.startView.tx + (cur.x - start.x), ty: g.startView.ty + (cur.y - start.y) });
    } else if (g.kind === 'node' && g.pointerId === e.pointerId) {
      const p = toGraphPoint(e.clientX, e.clientY);
      setDragOverrides((prev) => ({ ...prev, [g.id]: { x: p.x + g.offset.x, y: p.y + g.offset.y } }));
    } else if (g.kind === 'pinch' && activePointers.current.size >= 2) {
      const [p1, p2] = [...activePointers.current.values()] as [Pt, Pt];
      const s1 = toSvgPoint(p1.x, p1.y);
      const s2 = toSvgPoint(p2.x, p2.y);
      const dist = Math.hypot(s2.x - s1.x, s2.y - s1.y) || 1;
      const mid = { x: (s1.x + s2.x) / 2, y: (s1.y + s2.y) / 2 };
      const scale = clampScale(g.startScale * (dist / g.startDist));
      const k = scale / g.startScale;
      setView({
        scale,
        tx: mid.x - (g.startMid.x - g.startTx) * k,
        ty: mid.y - (g.startMid.y - g.startTy) * k,
      });
    }
  };

  const endGesture = (e: ReactPointerEvent<SVGSVGElement>) => {
    activePointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (!g) return;
    if (g.kind === 'pinch') {
      /* drop from pinch to pan with the remaining pointer */
      const remaining = [...activePointers.current.entries()];
      if (remaining.length === 1) {
        const [pid, p] = remaining[0] as [number, Pt];
        gesture.current = { kind: 'pan', pointerId: pid, startClient: p, startView: view };
      } else {
        gesture.current = null;
      }
    } else if (g.pointerId === e.pointerId) {
      gesture.current = null;
    }
  };

  /* ---- empty state ---- */
  if (nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-label text-accent-violet mb-2">Network graph</p>
        <p className="text-body-sm max-w-sm">
          Add compounds from the library. Each pair is classified — synergy, complementarity,
          redundancy, antagonism, or honestly labeled uncertain — and drawn here.
        </p>
      </div>
    );
  }

  const focusKey = hoverKey ?? selectedPairKey;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-[380px] w-full touch-none rounded-2xl border border-border bg-card/40 lg:h-[540px]"
        role="application"
        aria-label="Stack relationship network — drag nodes, scroll to zoom, click an edge for detail"
        onPointerDown={onBackgroundPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        <defs>
          <marker id="lab-graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--accent-cyan)" />
          </marker>
        </defs>

        <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
          {/* edges */}
          {visibleEdges.map((r) => {
            const key = pairKey(r.pair[0], r.pair[1]);
            const a = positions.get(r.pair[0]);
            const b = positions.get(r.pair[1]);
            if (!a || !b) return null;
            const dim = focusKey !== null && focusKey !== key;
            const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            const enc = EDGE_ENCODING[r.type];
            const isSelected = key === selectedPairKey;
            return (
              <g key={key} opacity={dim ? 0.12 : 1} style={{ transition: 'opacity 0.15s' }}>
                <EdgeShape r={r} a={a} b={b} />
                {isSelected && (
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={enc.color} strokeWidth={6} opacity={0.18} />
                )}
                <text
                  x={mid.x}
                  y={mid.y - 6}
                  textAnchor="middle"
                  fontSize={8.5}
                  fontFamily="var(--font-mono)"
                  fontWeight={700}
                  fill={enc.color}
                  stroke="var(--color-bg-base)"
                  strokeWidth={3}
                  paintOrder="stroke"
                  opacity={r.type === 'uncertain' ? 0.5 : 0.9}
                  aria-hidden="true"
                >
                  {enc.code}
                </text>
                {/* fat invisible hit line — the actual interactive control */}
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="transparent"
                  strokeWidth={16}
                  pointerEvents="stroke"
                  className="focus-ring cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`${nodes.find((n) => n.id === r.pair[0])?.name ?? r.pair[0]} + ${
                    nodes.find((n) => n.id === r.pair[1])?.name ?? r.pair[1]
                  }: ${RELATIONSHIP_LABELS[r.type]}${r.demonstrated ? ' (curated)' : ' (hypothesis)'} — show detail`}
                  onClick={() => onSelectRelationship(r)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectRelationship(r);
                    }
                  }}
                  onMouseEnter={() => setHoverKey(key)}
                  onMouseLeave={() => setHoverKey((k) => (k === key ? null : k))}
                />
              </g>
            );
          })}

          {/* nodes */}
          {nodes.map((n) => {
            const p = positions.get(n.id) ?? { x: CX, y: CY };
            const ring = tierColor(n.tier);
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => onNodePointerDown(e, n.id)}
              >
                <circle r={19} fill="var(--color-bg-elevated)" stroke={ring} strokeWidth={2} />
                <text
                  textAnchor="middle"
                  dy={3.5}
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fontWeight={800}
                  fill={ring}
                  aria-hidden="true"
                >
                  {n.tier}
                </text>
                <text
                  y={34}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontFamily="var(--font-sans)"
                  fontWeight={600}
                  fill="var(--color-text-secondary)"
                  stroke="var(--color-bg-base)"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {n.name.length > 16 ? `${n.name.slice(0, 15)}…` : n.name}
                </text>
                <title>{`${n.name} — Tier ${n.tier} · ${n.pathway}`}</title>
              </g>
            );
          })}
        </g>
      </svg>

      {/* zoom controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in" className="focus-ring interactive rounded-lg border border-border bg-card/80 p-2 text-muted-foreground hover:text-foreground">
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.25)} aria-label="Zoom out" className="focus-ring interactive rounded-lg border border-border bg-card/80 p-2 text-muted-foreground hover:text-foreground">
          <ZoomOut className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={resetView} aria-label="Reset view and node positions" className="focus-ring interactive rounded-lg border border-border bg-card/80 p-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* legend + uncertain toggle */}
      <div className="absolute bottom-3 left-3 max-w-[calc(100%-5rem)]">
        <button
          type="button"
          aria-expanded={legendOpen}
          onClick={() => setLegendOpen((o) => !o)}
          className="focus-ring interactive flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-2.5 py-1.5 text-caption text-muted-foreground hover:text-foreground"
        >
          Legend
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', legendOpen && 'rotate-180')} aria-hidden="true" />
        </button>
        {legendOpen && (
          <div className="mt-1 rounded-xl border border-border bg-card/95 p-3">
            <ul className="space-y-1.5">
              {(Object.keys(EDGE_ENCODING) as RelationshipType[]).map((t) => {
                const enc = EDGE_ENCODING[t];
                return (
                  <li key={t} className="flex items-center gap-2 text-caption text-muted-foreground">
                    <svg width="26" height="8" aria-hidden="true">
                      <line
                        x1="0"
                        y1="4"
                        x2="26"
                        y2="4"
                        stroke={enc.color}
                        strokeWidth={t === 'synergy' ? 2.5 : 1.5}
                        strokeDasharray={t === 'uncertain' ? '4 4' : t === 'interaction' ? '0.1 4' : undefined}
                        strokeLinecap="round"
                        opacity={t === 'uncertain' ? 0.5 : 1}
                      />
                    </svg>
                    <span className="text-label" style={{ color: enc.color }}>
                      {enc.code}
                    </span>
                    <span>{RELATIONSHIP_LABELS[t]}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-micro text-muted-foreground">
              Color + line style + code label — triple-encoded.
            </p>
          </div>
        )}
      </div>

      {uncertainCount > 0 && (
        <button
          type="button"
          aria-pressed={showUncertain}
          onClick={() => setShowUncertain((s) => !s)}
          className="focus-ring interactive absolute right-3 bottom-3 rounded-lg border border-border bg-card/80 px-2.5 py-1.5 text-caption text-muted-foreground hover:text-foreground"
        >
          {showUncertain ? 'Hide' : 'Show'} uncertain pairs ({uncertainCount})
        </button>
      )}

      {nodes.length === 1 && (
        <p className="mt-2 text-center text-caption text-muted-foreground">
          Add a second compound to see how it relates to {nodes[0]?.name}.
        </p>
      )}

      {/* Always-visible fallback table — the graph above only surfaces edge
          detail on hover/focus/click; this gives the same data to anyone who
          doesn't want (or can't use) the interaction. Matches
          StackNetworkGraph.tsx's established idiom. */}
      {visibleEdges.length > 0 && (
        <div className="mt-4 scroll-region rounded-2xl border border-border/70 bg-card/30">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              All {visibleEdges.length} relationships in this stack&apos;s network, with type, status,
              and detail.
            </caption>
            <thead>
              <tr className="border-b border-border/60">
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound A</th>
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Compound B</th>
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Type</th>
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Status</th>
                <th scope="col" className="px-3 py-2 text-label text-muted-foreground">Detail</th>
              </tr>
            </thead>
            <tbody>
              {visibleEdges.map((r) => {
                const key = pairKey(r.pair[0], r.pair[1]);
                const a = nodes.find((n) => n.id === r.pair[0]);
                const b = nodes.find((n) => n.id === r.pair[1]);
                const enc = EDGE_ENCODING[r.type];
                return (
                  <tr key={key} className="border-t border-border/50">
                    <td className="px-3 py-2 text-body-sm">{a?.name ?? r.pair[0]}</td>
                    <td className="px-3 py-2 text-body-sm">{b?.name ?? r.pair[1]}</td>
                    <td className="px-3 py-2 text-caption capitalize" style={{ color: enc.color }}>
                      {RELATIONSHIP_LABELS[r.type]}
                    </td>
                    <td className="px-3 py-2 text-caption text-muted-foreground">
                      {r.demonstrated ? 'Demonstrated' : 'Hypothesis'}
                    </td>
                    <td className="px-3 py-2 text-body-sm text-muted-foreground">{r.title}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
