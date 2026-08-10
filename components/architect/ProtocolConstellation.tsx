'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight, Layers, ShieldAlert, AlertTriangle } from 'lucide-react';
import { compounds } from '@/lib/data/compounds';
import { hallmarks } from '@/lib/data/hallmarks';
import { stackInteractions } from '@/lib/stack-analysis';
import { useStack } from '@/context/PlatformContext';
import { GlassPanel } from '@/components/ui/GlassPanel';

const VIEW = 720;
const CENTER = VIEW / 2;
const HALLMARK_RADIUS = 300;
const COMPOUND_RADIUS_BASE = 195;

/** Deterministic hash so compound placement is stable across renders/reloads. */
function hashJitter(id: string, spread: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 1000) / 1000 - 0.5) * spread;
}

function polar(angle: number, radius: number) {
  return {
    x: CENTER + radius * Math.cos(angle - Math.PI / 2),
    y: CENTER + radius * Math.sin(angle - Math.PI / 2),
  };
}

const evidenceGlow: Record<string, string> = {
  A: 'var(--accent-emerald)',
  B: 'var(--accent-cyan)',
  C: 'var(--accent-amber)',
};

/** Short, unambiguous anchor labels — several hallmark titles share a first
 * word ("Disabled Autophagy" vs "Disabled Macroautophagy"), so the label
 * can't just be a naive truncation of the full title. */
const HALLMARK_SHORT_LABEL: Record<string, string> = {
  genomic: 'Genomic',
  telomeres: 'Telomeres',
  epigenetic: 'Epigenetic',
  proteostasis: 'Proteostasis',
  autophagy: 'Autophagy',
  mito: 'Mitochondrial',
  senescence: 'Senescence',
  stem: 'Stem Cells',
  communication: 'Intercellular',
  inflammation: 'Inflammation',
  dysbiosis: 'Dysbiosis',
  nutrient: 'Nutrient Sensing',
};

export function ProtocolConstellation() {
  const router = useRouter();
  const { selected, toggle, setSelected } = useStack();
  const [hoveredHallmark, setHoveredHallmark] = useState<string | null>(null);
  const [hoveredCompound, setHoveredCompound] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const hallmarkAngle = useMemo(() => {
    const map: Record<string, number> = {};
    hallmarks.forEach((h, i) => {
      map[h.id] = (i / hallmarks.length) * Math.PI * 2;
    });
    return map;
  }, []);

  const hallmarkAnchors = useMemo(
    () => hallmarks.map((h) => ({ ...h, angle: hallmarkAngle[h.id], ...polar(hallmarkAngle[h.id], HALLMARK_RADIUS) })),
    [hallmarkAngle],
  );

  const compoundNodes = useMemo(() => {
    return compounds.map((c) => {
      const angles = c.hallmarks.map((h) => hallmarkAngle[h]).filter((a) => a !== undefined);
      // Circular mean so e.g. angles near 0 and 2π average correctly.
      const sin = angles.reduce((s, a) => s + Math.sin(a), 0);
      const cos = angles.reduce((s, a) => s + Math.cos(a), 0);
      const avgAngle = angles.length ? Math.atan2(sin, cos) : 0;
      // Compounds touching more hallmarks pull inward — reads as "broader coverage".
      const radius = COMPOUND_RADIUS_BASE - Math.min(angles.length - 1, 3) * 22 + hashJitter(c.id, 26);
      const jitterAngle = avgAngle + hashJitter(c.id + 'a', 0.18);
      const pos = polar(jitterAngle, Math.max(radius, 60));
      return { ...c, ...pos };
    });
  }, [hallmarkAngle]);

  const filteredIds = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return new Set(
      compoundNodes
        .filter((c) => c.name.toLowerCase().includes(q) || c.mechanism.toLowerCase().includes(q))
        .map((c) => c.id),
    );
  }, [compoundNodes, query]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const selectedCompoundData = useMemo(
    () => compoundNodes.filter((c) => selectedSet.has(c.id)),
    [compoundNodes, selectedSet],
  );

  // Coverage per hallmark: fraction of selected compounds' hallmark tags hitting it, 0-1.
  const coverage = useMemo(() => {
    const map: Record<string, number> = {};
    hallmarks.forEach((h) => {
      map[h.id] = 0;
    });
    selectedCompoundData.forEach((c) => {
      c.hallmarks.forEach((h) => {
        map[h] = Math.min(1, (map[h] ?? 0) + 0.34);
      });
    });
    return map;
  }, [selectedCompoundData]);

  const synergyLinks = useMemo(() => {
    const links: { a: typeof compoundNodes[number]; b: typeof compoundNodes[number] }[] = [];
    const seen = new Set<string>();
    selectedCompoundData.forEach((c) => {
      c.synergies.forEach((sid) => {
        if (!selectedSet.has(sid)) return;
        const key = [c.id, sid].sort().join('|');
        if (seen.has(key)) return;
        seen.add(key);
        const other = compoundNodes.find((n) => n.id === sid);
        if (other) links.push({ a: c, b: other });
      });
    });
    return links;
  }, [selectedCompoundData, selectedSet, compoundNodes]);

  /* Caution / contraindication edges between selected compounds. Drawn
     alongside synergies so this map is the single place on the site where
     compound-to-compound relationships are visualized — both the good and
     the risky. Detail text is surfaced in the side panel below. */
  const conflictLinks = useMemo(() => {
    return stackInteractions
      .filter((i) => i.type !== 'synergy')
      .filter((i) => selectedSet.has(i.compoundIds[0]) && selectedSet.has(i.compoundIds[1]))
      .map((i) => {
        const a = compoundNodes.find((n) => n.id === i.compoundIds[0]);
        const b = compoundNodes.find((n) => n.id === i.compoundIds[1]);
        return a && b ? { interaction: i, a, b } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [selectedSet, compoundNodes]);

  const toggleCompound = useCallback((id: string) => toggle(id), [toggle]);

  const sendToArchitect = useCallback(() => {
    setSelected(Array.from(selectedSet));
    router.push('/stacks?from=architect');
  }, [selectedSet, setSelected, router]);

  const coverageCount = Object.values(coverage).filter((v) => v > 0).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start">
      {/* Constellation */}
      <GlassPanel depth="content" className="relative isolate rounded-3xl overflow-hidden p-4 md:p-6">
        <div
          aria-hidden="true"
          className="absolute -top-[20%] -left-[10%] z-0 h-3/5 w-3/5 pointer-events-none blur-[60px]"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-violet) 22%, transparent), transparent 70%)' }}
        />
        <div className="relative flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-violet" aria-hidden="true" />
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {coverageCount}/12 hallmarks touched · {selectedCompoundData.length} compounds active
            {conflictLinks.length > 0 && ` · ${conflictLinks.length} flagged`}
          </p>
        </div>

        <svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Interactive map of longevity compounds connected to the twelve hallmarks of aging"
        >
          {/* Hallmark-to-compound threads */}
          {compoundNodes.map((c) =>
            c.hallmarks.map((hid) => {
              const anchor = hallmarkAnchors.find((h) => h.id === hid);
              if (!anchor) return null;
              const dimmed = filteredIds ? !filteredIds.has(c.id) : false;
              const active =
                selectedSet.has(c.id) || hoveredCompound === c.id || hoveredHallmark === hid;
              return (
                <line
                  key={`${c.id}-${hid}`}
                  x1={c.x}
                  y1={c.y}
                  x2={anchor.x}
                  y2={anchor.y}
                  stroke={active ? evidenceGlow[c.evidence] : 'var(--color-border)'}
                  strokeWidth={active ? 1.4 : 0.6}
                  opacity={dimmed ? 0.05 : active ? 0.75 : 0.18}
                />
              );
            }),
          )}

          {/* Synergy arcs between selected compounds */}
          {synergyLinks.map(({ a, b }) => (
            <motion.line
              key={`${a.id}-${b.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--accent-violet)"
              strokeWidth={2}
              strokeDasharray="4 5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85, strokeDashoffset: [0, -18] }}
              transition={{ opacity: { duration: 0.3 }, strokeDashoffset: { duration: 1.6, repeat: Infinity, ease: 'linear' } }}
            />
          ))}

          {/* Conflict arcs — caution (amber) / contraindication (rose) */}
          {conflictLinks.map(({ interaction, a, b }) => (
            <motion.line
              key={`conflict-${a.id}-${b.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={
                interaction.type === 'contraindication'
                  ? 'var(--accent-rose)'
                  : 'var(--accent-amber)'
              }
              strokeWidth={2.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.45, 0.95, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Hallmark anchors */}
          {hallmarkAnchors.map((h) => {
            const cov = coverage[h.id] ?? 0;
            const Icon = h.icon;
            return (
              <g
                key={h.id}
                transform={`translate(${h.x}, ${h.y})`}
                onMouseEnter={() => setHoveredHallmark(h.id)}
                onMouseLeave={() => setHoveredHallmark(null)}
                style={{ cursor: 'default' }}
              >
                <circle r={30} fill="var(--color-bg-elevated)" stroke="var(--color-border)" strokeWidth={1.5} />
                <circle
                  r={30}
                  fill="none"
                  stroke="var(--accent-emerald)"
                  strokeWidth={3}
                  strokeDasharray={`${cov * 2 * Math.PI * 30} ${2 * Math.PI * 30}`}
                  strokeLinecap="round"
                  transform="rotate(-90)"
                  opacity={cov > 0 ? 1 : 0}
                />
                <foreignObject x={-14} y={-14} width={28} height={28}>
                  <Icon className="w-full h-full text-foreground/80" aria-hidden="true" />
                </foreignObject>
                <text
                  y={48}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                >
                  {HALLMARK_SHORT_LABEL[h.id] ?? h.title}
                </text>
              </g>
            );
          })}

          {/* Compound nodes */}
          {compoundNodes.map((c) => {
            const isSelected = selectedSet.has(c.id);
            const dimmed = filteredIds ? !filteredIds.has(c.id) : false;
            return (
              <g
                key={c.id}
                transform={`translate(${c.x}, ${c.y})`}
                onMouseEnter={() => setHoveredCompound(c.id)}
                onMouseLeave={() => setHoveredCompound(null)}
                onClick={() => toggleCompound(c.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${c.name} — ${c.mechanism}${isSelected ? ' (selected)' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCompound(c.id);
                  }
                }}
                style={{ cursor: 'pointer', opacity: dimmed ? 0.15 : 1, transition: 'opacity 0.2s' }}
              >
                <motion.circle
                  r={isSelected ? 9 : 6}
                  fill={isSelected ? evidenceGlow[c.evidence] : 'var(--color-bg-elevated)'}
                  stroke={evidenceGlow[c.evidence]}
                  strokeWidth={isSelected ? 2 : 1.4}
                  animate={{ scale: isSelected ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 1.8, repeat: isSelected ? Infinity : 0 }}
                />
                {(hoveredCompound === c.id || isSelected) && (
                  <text
                    y={-14}
                    textAnchor="middle"
                    className="fill-foreground font-semibold"
                    style={{ fontSize: 11 }}
                  >
                    {c.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </GlassPanel>

      {/* Side panel */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search compounds or mechanisms…"
            className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2.5 text-sm focus-ring"
            aria-label="Search compounds"
          />
        </div>

        <GlassPanel depth="mid" className="rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-medium text-lg flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-cyan" aria-hidden="true" />
              Active protocol
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              {selectedCompoundData.length} selected
            </span>
          </div>

          {selectedCompoundData.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Click nodes in the constellation to build a protocol — connections to the
              hallmarks they target light up automatically.
            </p>
          ) : (
            <>
              <AnimatePresence initial={false}>
                <div className="space-y-2 mb-4 max-h-72 overflow-y-auto pr-1">
                  {selectedCompoundData.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.mechanism} · {c.dose}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCompound(c.id)}
                        className="focus-ring shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-accent-rose hover:bg-accent-rose/10 transition"
                        aria-label={`Remove ${c.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {synergyLinks.length > 0 && (
                <div className="mb-3 rounded-lg bg-accent-violet/10 border border-accent-violet/20 px-3 py-2 text-xs text-accent-violet flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{synergyLinks.length} synergy connection{synergyLinks.length === 1 ? '' : 's'} active among your selection.</span>
                </div>
              )}

              {conflictLinks.map(({ interaction }) => {
                const isContra = interaction.type === 'contraindication';
                return (
                  <div
                    key={interaction.compoundIds.join('-')}
                    className={`mb-3 rounded-lg px-3 py-2 text-xs flex items-start gap-2 border ${
                      isContra
                        ? 'bg-accent-rose/10 border-accent-rose/25 text-accent-rose'
                        : 'bg-accent-amber/10 border-accent-amber/25 text-accent-amber'
                    }`}
                  >
                    {isContra ? (
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                    )}
                    <span>
                      <strong className="font-semibold">{interaction.title}</strong> — {interaction.detail}
                    </span>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={sendToArchitect}
                className="focus-ring w-full flex items-center justify-center gap-2 btn-gradient rounded-xl py-3 text-sm font-semibold"
              >
                Open in Stack Architect
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </>
          )}
        </GlassPanel>

        <div className="flex items-start gap-2 text-xs text-muted-foreground px-1">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <p>Educational tool, not medical advice. Hallmark coverage rings are directional, not a clinical score.</p>
        </div>
      </div>
    </div>
  );
}
