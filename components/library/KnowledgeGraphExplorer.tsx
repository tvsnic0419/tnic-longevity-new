'use client';

import { useMemo, useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { GraphHallmarkNode, GraphCompoundNode, GraphEdge } from '@/lib/knowledge-graph';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

/**
 * KnowledgeGraphExplorer — the flagship "legible system" page.
 *
 * Renders the full hallmark ↔ compound interlink graph as a two-ring radial
 * diagram: the 12 hallmarks of aging on an inner ring, every compound with a
 * library page on an outer ring, edges connecting each compound to the
 * hallmark(s) it targets. Hover isolates a node's connections; click (or
 * Enter/Space on focus) navigates straight to that entity's real page.
 *
 * Data is computed server-side (`lib/knowledge-graph.ts`) from the same graph
 * functions the rest of the site's interlinking relies on, so every edge
 * shown here is a real, already-tested relationship — never a fabricated or
 * decorative connection.
 */

type NodeKey = `hallmark:${string}` | `compound:${string}`;

const HALLMARK_R = 16;
const COMPOUND_R = 11;
const RING_HALLMARK = 190;
const RING_COMPOUND = 340;
const CENTER = 380;
const VIEWBOX = 760;

function polar(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

const tierColor: Record<string, string> = { A: '#34d399', B: '#22d3ee', C: '#fbbf24' };

export function KnowledgeGraphExplorer({
  hallmarks,
  compounds,
  edges,
}: {
  hallmarks: GraphHallmarkNode[];
  compounds: GraphCompoundNode[];
  edges: GraphEdge[];
}) {
  const router = useRouter();
  const uid = useId().replace(/:/g, 's');
  const [hovered, setHovered] = useState<NodeKey | null>(null);

  const hallmarkPositions = useMemo(
    () =>
      new Map(
        hallmarks.map((h, i) => [h.id, polar(RING_HALLMARK, (360 / hallmarks.length) * i - 90)]),
      ),
    [hallmarks],
  );
  const compoundPositions = useMemo(
    () =>
      new Map(
        compounds.map((c, i) => [c.slug, polar(RING_COMPOUND, (360 / compounds.length) * i - 90)]),
      ),
    [compounds],
  );

  const connectedKeys = useMemo(() => {
    if (!hovered) return null;
    const set = new Set<NodeKey>([hovered]);
    for (const e of edges) {
      const hKey: NodeKey = `hallmark:${e.hallmarkId}`;
      const cKey: NodeKey = `compound:${e.compoundSlug}`;
      if (hKey === hovered) set.add(cKey);
      if (cKey === hovered) set.add(hKey);
    }
    return set;
  }, [hovered, edges]);

  const hoveredHallmark = hovered?.startsWith('hallmark:')
    ? hallmarks.find((h) => `hallmark:${h.id}` === hovered)
    : undefined;
  const hoveredCompound = hovered?.startsWith('compound:')
    ? compounds.find((c) => `compound:${c.slug}` === hovered)
    : undefined;

  const hrefFor = (key: NodeKey): string => {
    if (key.startsWith('hallmark:')) {
      const id = key.slice('hallmark:'.length);
      const h = hallmarks.find((x) => x.id === id);
      return h ? `/library/${h.slug}` : '/library';
    }
    const slug = key.slice('compound:'.length);
    return `/library/compounds/${slug}`;
  };

  const navigate = (key: NodeKey) => router.push(hrefFor(key));

  const connectionsFor = (key: NodeKey) => {
    if (key.startsWith('hallmark:')) {
      const id = key.slice('hallmark:'.length);
      return edges
        .filter((e) => e.hallmarkId === id)
        .map((e) => compounds.find((c) => c.slug === e.compoundSlug))
        .filter((c): c is GraphCompoundNode => c !== undefined);
    }
    const slug = key.slice('compound:'.length);
    return edges
      .filter((e) => e.compoundSlug === slug)
      .map((e) => hallmarks.find((h) => h.id === e.hallmarkId))
      .filter((h): h is GraphHallmarkNode => h !== undefined);
  };

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="w-full"
        role="img"
        aria-label="Knowledge graph: 12 hallmarks of aging connected to every compound that targets them"
      >
        <defs>
          <radialGradient id={`kg-center-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={RING_COMPOUND + 30} fill={`url(#kg-center-${uid})`} />

        {/* Edges */}
        {edges.map((e) => {
          const hp = hallmarkPositions.get(e.hallmarkId);
          const cp = compoundPositions.get(e.compoundSlug);
          if (!hp || !cp) return null;
          const hKey: NodeKey = `hallmark:${e.hallmarkId}`;
          const cKey: NodeKey = `compound:${e.compoundSlug}`;
          const isHighlighted = connectedKeys?.has(hKey) && connectedKeys?.has(cKey);
          const dimmed = hovered && !isHighlighted;
          return (
            <line
              key={`${e.hallmarkId}-${e.compoundSlug}`}
              x1={hp.x}
              y1={hp.y}
              x2={cp.x}
              y2={cp.y}
              stroke={isHighlighted ? '#22d3ee' : '#475569'}
              strokeWidth={isHighlighted ? 1.6 : 0.6}
              strokeOpacity={dimmed ? 0.06 : isHighlighted ? 0.85 : 0.22}
              style={{ transition: 'stroke-opacity 0.15s, stroke-width 0.15s' }}
            />
          );
        })}

        {/* Hallmark nodes (inner ring) */}
        {hallmarks.map((h) => {
          const p = hallmarkPositions.get(h.id)!;
          const key: NodeKey = `hallmark:${h.id}`;
          const dimmed = connectedKeys ? !connectedKeys.has(key) : false;
          const active = hovered === key;
          return (
            <g
              key={h.id}
              role="link"
              tabIndex={0}
              aria-label={`Hallmark ${h.number}: ${h.title}`}
              style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
              opacity={dimmed ? 0.25 : 1}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(key)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  navigate(key);
                }
              }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={HALLMARK_R + (active ? 4 : 0)}
                fill="rgba(167,139,250,0.16)"
                stroke="#a78bfa"
                strokeWidth={active ? 2.5 : 1.5}
                style={{ transition: 'r 0.15s, stroke-width 0.15s' }}
              />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fontFamily="monospace"
                fontWeight={700}
                fill="#a78bfa"
                style={{ pointerEvents: 'none' }}
              >
                {h.number}
              </text>
              <text
                x={p.x}
                y={p.y + HALLMARK_R + 14}
                textAnchor="middle"
                fontSize={active ? 10 : 9}
                fontWeight={active ? 700 : 500}
                fill={active ? '#a78bfa' : '#94a3b8'}
                style={{ pointerEvents: 'none' }}
              >
                {h.title.length > 22 ? `${h.title.slice(0, 20)}…` : h.title}
              </text>
            </g>
          );
        })}

        {/* Compound nodes (outer ring) */}
        {compounds.map((c) => {
          const p = compoundPositions.get(c.slug)!;
          const key: NodeKey = `compound:${c.slug}`;
          const dimmed = connectedKeys ? !connectedKeys.has(key) : false;
          const active = hovered === key;
          const col = tierColor[c.evidence] ?? '#94a3b8';
          return (
            <g
              key={c.slug}
              role="link"
              tabIndex={0}
              aria-label={`Compound: ${c.name}, evidence tier ${c.evidence}`}
              style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
              opacity={dimmed ? 0.2 : 1}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(key)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  navigate(key);
                }
              }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={COMPOUND_R + (active ? 3 : 0)}
                fill={active ? `${col}33` : `${col}1a`}
                stroke={col}
                strokeWidth={active ? 2 : 1.25}
                style={{ transition: 'r 0.15s, stroke-width 0.15s' }}
              />
              <text
                x={p.x}
                y={p.y + COMPOUND_R + 12}
                textAnchor="middle"
                fontSize={active ? 9.5 : 8}
                fontWeight={active ? 700 : 500}
                fill={active ? col : '#94a3b8'}
                fillOpacity={dimmed ? 0.4 : 1}
                style={{ pointerEvents: 'none' }}
              >
                {c.name.length > 16 ? `${c.name.slice(0, 14)}…` : c.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Details panel */}
      <div className="mt-4 min-h-[110px]" aria-live="polite" aria-atomic="true">
        {hoveredHallmark || hoveredCompound ? (
          <div className="rounded-xl border border-border bg-card/40 p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="font-semibold text-sm text-foreground">
                {hoveredHallmark ? `#${hoveredHallmark.number} ${hoveredHallmark.title}` : hoveredCompound!.name}
              </span>
              {hoveredCompound && <EvidenceTag tier={hoveredCompound.evidence} size="sm" />}
              <Link
                href={hrefFor(hovered!)}
                className="ml-auto inline-flex items-center gap-1 text-caption text-accent-cyan hover:text-accent-emerald"
              >
                Open page <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            <p className="text-caption mb-2">
              {connectionsFor(hovered!).length} connection{connectionsFor(hovered!).length !== 1 ? 's' : ''}
            </p>
            <ul className="flex flex-wrap gap-2">
              {connectionsFor(hovered!)
                .slice(0, 10)
                .map((n) => (
                  <li key={'id' in n ? n.id : n.slug}>
                    <Link
                      href={'id' in n ? `/library/${n.slug}` : `/library/compounds/${n.slug}`}
                      className="text-caption rounded-full border border-border px-2.5 py-1 text-foreground/80 hover:border-accent-cyan/50 hover:text-foreground transition-colors"
                    >
                      {'id' in n ? n.title : n.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <p className="text-body-sm text-muted-foreground">
            Hover or focus a node to see its connections — click any node to open its page.
          </p>
        )}
      </div>
    </div>
  );
}
