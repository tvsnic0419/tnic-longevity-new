'use client';

/* ============================================================================
   TNIC · COMPOUND INTELLIGENCE ENGINE
   A mechanistic scoring instrument for longevity supplement stacks.

   Fully offline / deterministic: a curated mechanistic library scores every
   known compound instantly (evidence, effect, breadth, bioavailability,
   safety), computes stack synergy, and maps coverage across the 12 Hallmarks
   of Aging (López-Otín 2023). Rule-based transparent reasoning — not generative
   AI. Every claim's provenance is exposed on the Fact-Check tab, and each
   compound links to its library deep-dive and to PubMed.

   Scoring dataset + pure analysis live in `lib/compound-engine-data.ts`.

   Styling: every colour resolves through the `--sie-*` block below, which is a
   thin alias layer over the site's global design tokens in `app/globals.css`.
   There are no literal colours in this file, so the engine follows the
   light/dark toggle exactly like the compound deep-dives it links out to.
   Type follows the site's three roles: Fraunces for headings, JetBrains Mono
   for scores and labels, Inter for body.
============================================================================ */

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  FlaskConical, Network, ShieldCheck, Search, X,
  AlertTriangle, CheckCircle2, Dna, ExternalLink, BookOpen, Info,
  SlidersHorizontal,
} from 'lucide-react';
import {
  PALETTE as COLORS, alpha,
  HALLMARKS, HALLMARK_MAP, PATHWAY_LABELS,
  COMPOUND_DB, TIER_META, DEFAULT_WEIGHTS, FORM_LABEL,
  analyzeStack, parseEngineStackParam, scoreColor, scoreInk, tierColor, pubmedUrl,
  type BreakdownTone, type Compound, type Form, type HallmarkId, type StagedItem,
  type ScoredItem, type Tier, type Weights,
} from '@/lib/compound-engine-data';
import { ENGINE_STACK_PARAM } from '@/lib/stack-url';

/* Mono micro-labels never go below 11px — the site-wide floor set by
   `.text-label` in globals.css. SVG text is sized in user units, and every
   surface here renders its viewBox 1:1 or larger, so these are literal px. */
const LABEL_PX = 11;

// The recharts radar is lazy + client-only so recharts (~85 KB gz) stays out of
// this route's first-load bundle. A same-size aria-hidden placeholder holds the
// chart's slot so nothing reflows when it swaps in.
const EngineRadar = dynamic(() => import('./EngineRadar'), {
  ssr: false,
  loading: () => <div aria-hidden style={{ width: '100%', height: '100%' }} />,
});

const css = `
.sie-root{
  /* ── Surfaces ─────────────────────────────────────────────────────────── */
  --sie-ink: var(--color-bg-base);
  --sie-panel: var(--color-bg-elevated);
  --sie-panel-2: var(--color-bg-surface);
  --sie-line: var(--color-border-subtle);
  --sie-line-strong: var(--color-border-strong);

  /* ── Ink ──────────────────────────────────────────────────────────────── */
  --sie-text: var(--color-text-primary);
  --sie-body: var(--color-text-secondary);
  /* The faintest text tier that clears WCAG AA in *both* themes
     (7.3:1 dark, 4.8:1 light). Nothing readable goes below this. */
  --sie-muted: var(--color-text-muted);
  /* Decoration only — dashed outlines, tick marks, empty bar tracks. Light
     theme's --color-text-faint is ~2.6:1 on white, so it must never be text. */
  --sie-faint: var(--color-text-faint);

  /* ── Accents: graphics ────────────────────────────────────────────────── */
  --sie-cyan: var(--accent-cyan);
  --sie-jade: var(--accent-emerald);
  --sie-indigo: var(--accent-violet);
  --sie-gold: var(--signal-elite);
  --sie-rose: var(--accent-rose);

  /* ── Accents: text ────────────────────────────────────────────────────── */
  /* Blending 28% of the theme's primary ink into each accent darkens it on the
     light theme and brightens it on dark — the direction that raises contrast
     either way. Worst case after the mix is gold at 5.1:1 on light (3.2:1
     before), so every accent-coloured label clears AA in both themes. */
  --sie-cyan-ink:   color-mix(in srgb, var(--sie-cyan)   72%, var(--sie-text));
  --sie-jade-ink:   color-mix(in srgb, var(--sie-jade)   72%, var(--sie-text));
  --sie-indigo-ink: color-mix(in srgb, var(--sie-indigo) 72%, var(--sie-text));
  --sie-gold-ink:   color-mix(in srgb, var(--sie-gold)   72%, var(--sie-text));
  --sie-rose-ink:   color-mix(in srgb, var(--sie-rose)   72%, var(--sie-text));

  /* ── Geometry ─────────────────────────────────────────────────────────── */
  --sie-r-panel: var(--radius-lg);
  --sie-r-card: var(--radius-md);
  --sie-r-control: var(--radius-sm);
  --sie-track: color-mix(in srgb, var(--sie-muted) 16%, transparent);

  /* The page background belongs to the site canvas, not to this component —
     only the accent mesh layers on top, so both themes come through intact. */
  background:
    radial-gradient(1200px 600px at 78% -8%, var(--hero-mesh-2), transparent 60%),
    radial-gradient(900px 500px at 8% 8%, var(--hero-mesh-1), transparent 55%);
  font-family: var(--font-sans);
  color: var(--sie-body);
  min-height:100%;line-height:1.5;-webkit-font-smoothing:antialiased;
}
.sie-root *{box-sizing:border-box;}

/* ── Type roles: display / mono / body ─────────────────────────────────── */
.sie-disp{font-family:var(--font-display);font-weight:500;letter-spacing:-.02em;color:var(--sie-text);}
.sie-mono{font-family:var(--font-mono);font-variant-numeric:tabular-nums;}
.sie-num{font-family:var(--font-mono);font-variant-numeric:tabular-nums;font-weight:600;letter-spacing:-.02em;color:var(--sie-text);}
.sie-eyebrow{
  font-family:var(--font-mono);font-size:${LABEL_PX}px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;color:var(--sie-muted);
}

/* ── Surfaces ──────────────────────────────────────────────────────────── */
.sie-card{
  background:linear-gradient(180deg,
    color-mix(in srgb, var(--sie-panel) 88%, transparent),
    color-mix(in srgb, var(--sie-ink) 82%, transparent));
  border:1px solid var(--sie-line);border-radius:var(--sie-r-panel);backdrop-filter:blur(6px);
}
.sie-hair{border:1px solid var(--sie-line);border-radius:var(--sie-r-card);}

/* ── Controls ──────────────────────────────────────────────────────────── */
.sie-input{
  background:color-mix(in srgb, var(--sie-ink) 55%, transparent);
  border:1px solid var(--sie-line);border-radius:var(--sie-r-control);
  color:var(--sie-text);padding:11px 13px;font-size:14px;width:100%;outline:none;
  transition:border-color .15s, box-shadow .15s;font-family:var(--font-sans);
}
.sie-input:focus{
  border-color:color-mix(in srgb, var(--sie-jade) 55%, transparent);
  box-shadow:0 0 0 3px color-mix(in srgb, var(--sie-jade) 14%, transparent);
}
.sie-input::placeholder{color:var(--sie-muted);}
.sie-btn{
  display:inline-flex;align-items:center;gap:7px;border-radius:var(--sie-r-control);
  border:1px solid var(--sie-line);
  background:color-mix(in srgb, var(--sie-panel) 70%, transparent);
  color:var(--sie-text);padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;
  transition:transform .12s, border-color .15s, background .15s;
  font-family:var(--font-sans);text-decoration:none;
}
.sie-btn:hover{border-color:color-mix(in srgb, var(--sie-jade) 50%, transparent);transform:translateY(-1px);}
.sie-btn:active{transform:translateY(0);}
.sie-btn:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px;}
.sie-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.sie-tab{
  display:inline-flex;align-items:center;gap:8px;padding:10px 14px;
  border-radius:var(--sie-r-control);font-size:13px;font-weight:600;cursor:pointer;
  color:var(--sie-muted);border:1px solid transparent;background:transparent;
  transition:color .15s, background .15s, border-color .15s;white-space:nowrap;
  font-family:var(--font-sans);
}
.sie-tab:hover{color:var(--sie-text);}
.sie-tab:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px;}
.sie-tab-active{
  color:var(--sie-text);
  background:color-mix(in srgb, var(--sie-panel) 90%, transparent);
  border-color:var(--sie-line);
}
.sie-chip{
  display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;
  border:1px solid var(--sie-line);
  background:color-mix(in srgb, var(--sie-ink) 45%, transparent);
  font-size:12px;color:var(--sie-body);
}
.sie-tag{
  display:inline-block;padding:3px 8px;border-radius:var(--radius-sm);
  font-size:${LABEL_PX}px;font-weight:600;font-family:var(--font-mono);letter-spacing:.02em;
}
.sie-row{
  display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--sie-r-card);
  border:1px solid var(--sie-line);
  background:color-mix(in srgb, var(--sie-ink) 30%, transparent);
  cursor:pointer;transition:border-color .15s, background .15s;
  width:100%;text-align:left;font-family:inherit;color:inherit;
}
.sie-row:hover{
  border-color:color-mix(in srgb, var(--sie-cyan) 45%, transparent);
  background:color-mix(in srgb, var(--sie-panel) 55%, transparent);
}
.sie-row:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px;}
.sie-row-active{
  border-color:color-mix(in srgb, var(--sie-jade) 60%, transparent);
  background:color-mix(in srgb, var(--sie-panel) 75%, transparent);
}
.sie-iconbtn{
  display:inline-flex;align-items:center;justify-content:center;background:transparent;
  border:none;padding:2px;cursor:pointer;color:var(--sie-muted);border-radius:var(--radius-sm);
}
.sie-iconbtn:hover{color:var(--sie-text);}
.sie-iconbtn:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:2px;}
.sie-suggest{
  position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:30;
  background:var(--sie-panel);border:1px solid var(--sie-line-strong);
  border-radius:var(--sie-r-card);overflow:hidden;
  box-shadow:0 20px 50px color-mix(in srgb, var(--sie-ink) 55%, transparent);
}
.sie-suggest-item{
  padding:11px 13px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;
  gap:10px;border:none;border-bottom:1px solid var(--sie-line);background:transparent;
  color:var(--sie-body);width:100%;text-align:left;font-family:inherit;
}
.sie-suggest-item:last-child{border-bottom:none;}
.sie-suggest-item:hover{background:color-mix(in srgb, var(--sie-jade) 10%, transparent);}
.sie-suggest-item:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:-2px;}
.sie-scroll::-webkit-scrollbar{width:9px;height:9px;}
.sie-scroll::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:8px;}
.sie-scroll::-webkit-scrollbar-track{background:transparent;}
@keyframes siePulse{0%,100%{opacity:.55;}50%{opacity:1;}}
@keyframes sieFade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
.sie-fade{animation:sieFade .3s ease both;}
.sie-pulse{animation:siePulse 3.2s ease-in-out infinite;}
input[type=range].sie-range{
  -webkit-appearance:none;appearance:none;height:4px;background:var(--sie-track);
  border-radius:4px;outline:none;
}
input[type=range].sie-range::-webkit-slider-thumb{
  -webkit-appearance:none;height:15px;width:15px;border-radius:50%;
  background:var(--sie-jade);cursor:pointer;border:2px solid var(--sie-panel);
}
input[type=range].sie-range::-moz-range-thumb{
  height:15px;width:15px;border-radius:50%;
  background:var(--sie-jade);cursor:pointer;border:2px solid var(--sie-panel);
}
input[type=range].sie-range:focus-visible{outline:2px solid var(--color-border-focus);outline-offset:3px;}
@media (prefers-reduced-motion: reduce){.sie-fade,.sie-pulse{animation:none;}}
@media (max-width: 860px){
  .sie-grid{grid-template-columns:minmax(0,1fr) !important;}
  .sie-detail-grid{grid-template-columns:minmax(0,1fr) !important;}
  .sie-hall-grid{grid-template-columns:minmax(0,1fr) !important;}
}
@media (max-width: 620px){ .sie-hide-sm{display:none !important;} }
`;

/* ── SVG geometry helpers ────────────────────────────────────────────────── */
const polar = (cx: number, cy: number, r: number, angle: number) => {
  const a = (angle * Math.PI) / 180;
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
};
const arcPath = (cx: number, cy: number, r: number, start: number, end: number) => {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const delta = (((end - start) % 360) + 360) % 360;
  const large = delta > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
};

/** Breakdown tone → the graphic and text tokens it paints with. */
const TONE: Record<BreakdownTone, { bar: string; ink: string }> = {
  neutral: { bar: COLORS.muted, ink: COLORS.muted },
  cyan: { bar: COLORS.cyan, ink: COLORS.cyanInk },
  indigo: { bar: COLORS.indigo, ink: COLORS.indigoInk },
  gold: { bar: COLORS.gold, ink: COLORS.goldInk },
  rose: { bar: COLORS.rose, ink: COLORS.roseInk },
};

/* ── Small UI atoms ──────────────────────────────────────────────────────── */

/**
 * One scoring axis. All five axes render through this single component with a
 * fixed label gutter and value gutter, so the sub-scores read as one aligned
 * instrument rather than five separately-styled chips.
 */
function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        className="sie-mono"
        style={{ width: 72, flexShrink: 0, fontSize: LABEL_PX, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '.08em' }}
      >
        {label}
      </div>
      <div style={{ flex: 1, height: 6, background: 'var(--sie-track)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: scoreColor(value), borderRadius: 4, transition: 'width .4s' }} />
      </div>
      <div className="sie-num" style={{ width: 28, flexShrink: 0, fontSize: 12, textAlign: 'right' }}>{value}</div>
    </div>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const m = TIER_META[tier] || TIER_META.D;
  return (
    <span
      className="sie-tag"
      style={{ color: m.ink, background: alpha(m.color, 14), border: `1px solid ${alpha(m.color, 34)}` }}
    >
      TIER {tier}
    </span>
  );
}

function Dial({ value, label, size = 148 }: { value: number | null; label: string; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 16;
  const frac = Math.max(0, Math.min(1, (value ?? 0) / 100));
  const col = value == null ? COLORS.faint : scoreColor(value);
  const ticks = Array.from({ length: 11 }, (_, i) => 225 + 270 * (i / 10));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${value == null ? 'not available' : value}`}>
      {ticks.map((a, i) => {
        const o = polar(cx, cy, r + 6, a), inr = polar(cx, cy, r + 2, a);
        return <line key={i} x1={inr.x} y1={inr.y} x2={o.x} y2={o.y} stroke={COLORS.faint} strokeWidth={1} />;
      })}
      <path d={arcPath(cx, cy, r, 225, 225 + 270)} fill="none" stroke="var(--sie-track)" strokeWidth={9} strokeLinecap="round" />
      {value != null && (
        <path
          d={arcPath(cx, cy, r, 225, 225 + 270 * frac)}
          fill="none" stroke={col} strokeWidth={9} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${alpha(col, 60)})` }}
        />
      )}
      <text x={cx} y={cy - 2} textAnchor="middle" className="sie-num" style={{ fontSize: 30, fill: value == null ? COLORS.muted : scoreInk(value) }}>
        {value == null ? '—' : value}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" className="sie-mono" style={{ fontSize: LABEL_PX, fill: COLORS.muted, letterSpacing: '.14em', textTransform: 'uppercase' }}>
        {label}
      </text>
    </svg>
  );
}

function HallmarkBloom({
  depthMap, coveragePct, selected, onSelect, size = 320,
}: {
  depthMap: Partial<Record<HallmarkId, number>>;
  coveragePct: number;
  selected?: HallmarkId;
  onSelect?: (id: HallmarkId) => void;
  size?: number;
}) {
  const cx = size / 2, cy = size / 2, R = size * 0.32;
  const coreR = size * 0.06 + (coveragePct || 0) * size * 0.03;
  // Label ring sits clear of the largest possible node so 11px tags never
  // collide with the bloom itself at either rendered size.
  const labelR = R + size * 0.095;
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: size }} role="img" aria-label={`Hallmark coverage: ${Math.round((coveragePct || 0) * 100)} percent`}>
      <defs>
        <radialGradient id="sieCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.jade} stopOpacity={0.5 + (coveragePct || 0) * 0.4} />
          <stop offset="100%" stopColor={COLORS.jade} stopOpacity={0.02} />
        </radialGradient>
      </defs>
      {HALLMARKS.map((h, i) => {
        const angle = -90 + i * 30;
        const p = polar(cx, cy, R, angle);
        const depth = depthMap?.[h.id] || 0;
        const covered = depth > 0;
        const col = depth >= 3 ? COLORS.gold : COLORS.jade;
        const lineOp = covered ? Math.min(0.14 + depth * 0.12, 0.7) : 0.05;
        return <line key={'l' + h.id} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={covered ? col : COLORS.faint} strokeWidth={covered ? 1.4 : 1} strokeOpacity={lineOp} />;
      })}
      <circle cx={cx} cy={cy} r={coreR} fill="url(#sieCore)" className="sie-pulse" />
      <circle cx={cx} cy={cy} r={coreR} fill="none" stroke={COLORS.jade} strokeOpacity={0.5} strokeWidth={1} />
      <text x={cx} y={cy + 4} textAnchor="middle" className="sie-num" style={{ fontSize: 13, fill: COLORS.text }}>
        {Math.round((coveragePct || 0) * 100)}%
      </text>
      {HALLMARKS.map((h, i) => {
        const angle = -90 + i * 30;
        const p = polar(cx, cy, R, angle);
        const lp = polar(cx, cy, labelR, angle);
        const depth = depthMap?.[h.id] || 0;
        const covered = depth > 0;
        const col = depth >= 3 ? COLORS.gold : COLORS.jade;
        const nodeR = 4.5 + Math.min(depth, 4) * 2.4;
        const isSel = selected === h.id;
        const interactive = !!onSelect;
        return (
          <g
            key={h.id}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => onSelect && onSelect(h.id)}
            onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect!(h.id); } } : undefined}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={interactive ? `${h.label}: ${depth} compound${depth === 1 ? '' : 's'}` : undefined}
            aria-pressed={interactive ? isSel : undefined}
          >
            {isSel && <circle cx={p.x} cy={p.y} r={nodeR + 6} fill="none" stroke={col} strokeOpacity={0.5} strokeWidth={1.2} />}
            {covered ? (
              <circle cx={p.x} cy={p.y} r={nodeR} fill={col} style={{ filter: `drop-shadow(0 0 ${4 + depth * 2.5}px ${alpha(col, 70)})` }} />
            ) : (
              <circle cx={p.x} cy={p.y} r={5} fill="none" stroke={COLORS.faint} strokeWidth={1.2} strokeDasharray="2 2.5" />
            )}
            <text
              x={lp.x} y={lp.y + 3} textAnchor="middle" className="sie-mono"
              style={{ fontSize: LABEL_PX, letterSpacing: '.05em', fill: covered ? COLORS.text : COLORS.muted, fontWeight: covered ? 600 : 400 }}
            >
              {h.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

type TabId = 'compounds' | 'synergy' | 'hallmarks' | 'factcheck';

/* ============================================================================
   MAIN COMPONENT
============================================================================ */
export function CompoundIntelligenceEngine() {
  const [staged, setStaged] = useState<StagedItem[]>([]);
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [dose, setDose] = useState('');
  const [form, setForm] = useState<Form>('std');
  const [tab, setTab] = useState<TabId>('compounds');
  const [selUid, setSelUid] = useState<string | null>(null);
  const [selHall, setSelHall] = useState<HallmarkId>('mito');
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [showWeights, setShowWeights] = useState(false);
  const prefilled = useRef(false);

  /* `?compounds=` hand-off from the Stack Architect and the library deep-dives.
     Read from `location` rather than `useSearchParams` on purpose: this page is
     statically rendered for SEO, and `useSearchParams` would force the whole
     engine behind a Suspense boundary and out of the prerendered HTML. The
     staged set is a client-only enhancement, so applying it once on mount costs
     nothing. */
  useEffect(() => {
    if (prefilled.current) return;
    prefilled.current = true;
    const incoming = parseEngineStackParam(
      new URLSearchParams(window.location.search).get(ENGINE_STACK_PARAM),
    );
    if (incoming.length === 0) return;
    const now = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is a client-only source; not derivable during render.
    setStaged(incoming.map((data, i) => ({
      uid: `${data.id}:${now + i}`,
      data,
      name: data.name,
      brand: '',
      dose: '',
      form: 'std' as Form,
      source: 'curated' as const,
    })));
  }, []);

  const analysis = useMemo(() => analyzeStack(staged, weights), [staged, weights]);
  const selected: ScoredItem | null =
    analysis.scored.find((s) => s.uid === selUid) || analysis.scored[0] || null;

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const have = new Set(staged.map((s) => s.data?.id));
    return COMPOUND_DB.filter((c) =>
      !have.has(c.id) &&
      (c.name.toLowerCase().includes(q) || c.full.toLowerCase().includes(q) ||
        c.aliases.some((a) => a.includes(q)))
    ).slice(0, 6);
  }, [query, staged]);

  const exactMiss = query.trim().length > 1 && suggestions.length === 0;

  /* Weights are normalized before scoring, so the panel shows each axis's real
     share of the model rather than its raw slider position. */
  const weightTotal = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0) || 1;

  function stage(dataObj: Compound) {
    const uid = `${dataObj.id}:${Date.now()}`;
    setStaged((s) => [...s, { uid, data: dataObj, name: dataObj.name, brand, dose, form, source: 'curated' }]);
    setSelUid(uid); setQuery(''); setBrand(''); setDose(''); setForm('std');
  }
  function remove(uid: string) {
    setStaged((s) => s.filter((x) => x.uid !== uid));
    if (selUid === uid) setSelUid(null);
  }
  function setW(k: keyof Weights, v: number) {
    setWeights((w) => ({ ...w, [k]: v }));
  }

  const TABS: { id: TabId; label: string; icon: typeof FlaskConical }[] = [
    { id: 'compounds', label: 'Compounds', icon: FlaskConical },
    { id: 'synergy', label: 'Stack Synergy', icon: Network },
    { id: 'hallmarks', label: 'Hallmark Bloom', icon: Dna },
    { id: 'factcheck', label: 'Fact-Check', icon: ShieldCheck },
  ];

  return (
    <div className="sie-root" style={{ padding: 'clamp(14px, 3vw, 30px)' }}>
      <style>{css}</style>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        {/* MASTHEAD */}
        <div className="sie-fade" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 22 }}>
          <div>
            <div className="sie-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: COLORS.jade, boxShadow: `0 0 8px ${COLORS.jade}` }} className="sie-pulse" />
              TNiC · Cellular Intelligence
            </div>
            <h1 className="sie-disp" style={{ fontSize: 'clamp(2rem, 4vw + 1rem, 3rem)', margin: '10px 0 0', lineHeight: 1.05 }}>
              Compound Intelligence Engine
            </h1>
            <p style={{ color: COLORS.body, margin: '10px 0 0', maxWidth: 560, fontSize: 15, lineHeight: 1.6 }}>
              Stage supplements to score each compound mechanistically, resolve stack synergy, and watch coverage bloom across the twelve hallmarks of aging.
            </p>
          </div>
          <div className="sie-mono" style={{ display: 'flex', gap: 18, fontSize: LABEL_PX, letterSpacing: '.1em', color: COLORS.muted, textTransform: 'uppercase' }}>
            <div><div className="sie-num" style={{ fontSize: 24 }}>{analysis.scored.length}</div>Staged</div>
            <div><div className="sie-num" style={{ fontSize: 24, color: scoreInk(analysis.meanScore ?? 0) }}>{analysis.meanScore ?? '—'}</div>Mean</div>
            <div><div className="sie-num" style={{ fontSize: 24, color: analysis.synergyScore == null ? COLORS.muted : COLORS.indigoInk }}>{analysis.synergyScore ?? '—'}</div>Synergy</div>
            <div><div className="sie-num" style={{ fontSize: 24, color: COLORS.jadeInk }}>{analysis.coveredCount}<span style={{ color: COLORS.muted, fontSize: 15 }}>/12</span></div>Hallmarks</div>
          </div>
        </div>

        {/* ENTRY BAR */}
        <div className="sie-card sie-fade" style={{ padding: 16, marginBottom: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ position: 'relative', flex: '2 1 260px' }}>
              <label className="sie-eyebrow" htmlFor="sie-search" style={{ display: 'block', marginBottom: 6 }}>Compound</label>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: 13, color: COLORS.muted }} aria-hidden />
                <input id="sie-search" className="sie-input" style={{ paddingLeft: 34 }} placeholder="Search NMN, lactoferrin, Ca-AKG…"
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && suggestions[0]) stage(suggestions[0]); }} />
              </div>
              {(suggestions.length > 0 || exactMiss) && (
                <div className="sie-suggest">
                  {suggestions.map((c) => (
                    <button type="button" key={c.id} className="sie-suggest-item" onClick={() => stage(c)}>
                      <span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{c.name} <span style={{ color: COLORS.muted, fontWeight: 400, fontSize: 12 }}>· {c.cls}</span></span>
                        <span style={{ display: 'block', color: COLORS.muted, fontSize: 12 }}>{c.full}</span>
                      </span>
                      <TierBadge tier={c.tier} />
                    </button>
                  ))}
                  {exactMiss && (
                    <div className="sie-suggest-item" style={{ cursor: 'default' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.muted }}>
                        <Info size={15} aria-hidden />
                        <span style={{ fontSize: 13 }}>No match for “{query.trim()}” in the curated library.</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ flex: '1 1 130px' }}>
              <label className="sie-eyebrow" htmlFor="sie-brand" style={{ display: 'block', marginBottom: 6 }}>Brand <span style={{ textTransform: 'none', letterSpacing: 0 }}>(opt)</span></label>
              <input id="sie-brand" className="sie-input" placeholder="e.g. TNIC" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div style={{ flex: '1 1 110px' }}>
              <label className="sie-eyebrow" htmlFor="sie-dose" style={{ display: 'block', marginBottom: 6 }}>Dose <span style={{ textTransform: 'none', letterSpacing: 0 }}>(opt)</span></label>
              <input id="sie-dose" className="sie-input" placeholder="500 mg" value={dose} onChange={(e) => setDose(e.target.value)} />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <span className="sie-eyebrow" style={{ display: 'block', marginBottom: 6 }}>Form</span>
              <div style={{ display: 'flex', gap: 4 }} role="group" aria-label="Formulation grade">
                {(['basic', 'std', 'enh'] as Form[]).map((f) => (
                  <button key={f} type="button" onClick={() => setForm(f)} className="sie-mono" aria-pressed={form === f}
                    style={{
                      flex: 1, padding: '9px 0', fontSize: LABEL_PX, borderRadius: 'var(--sie-r-control)', cursor: 'pointer',
                      textTransform: 'uppercase', letterSpacing: '.04em',
                      border: `1px solid ${form === f ? alpha(COLORS.jade, 60) : COLORS.line}`,
                      background: form === f ? alpha(COLORS.jade, 14) : 'transparent',
                      color: form === f ? COLORS.jadeInk : COLORS.muted,
                    }}>
                    {f === 'std' ? 'Std' : f === 'enh' ? 'Enh' : 'Basic'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* staged chips */}
          {staged.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {staged.map((s) => (
                <span key={s.uid} className="sie-chip">
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: tierColor(s.data.tier) }} />
                  <span style={{ fontWeight: 600, color: COLORS.text }}>{s.name}</span>
                  {s.brand && <span style={{ color: COLORS.muted }}>· {s.brand}</span>}
                  {s.dose && <span className="sie-mono" style={{ color: COLORS.muted, fontSize: LABEL_PX }}>{s.dose}</span>}
                  {s.form !== 'std' && <span className="sie-mono" style={{ color: COLORS.muted, fontSize: LABEL_PX }}>{FORM_LABEL[s.form]}</span>}
                  <button type="button" className="sie-iconbtn" aria-label={`Remove ${s.name}`} onClick={() => remove(s.uid)}><X size={13} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* MAIN GRID: rail + stage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 18 }}>
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '260px minmax(0,1fr)' }} className="sie-grid">
            {/* LEFT RAIL */}
            <div className="sie-card sie-fade" style={{ padding: 18, alignSelf: 'start' }}>
              <h2 className="sie-eyebrow" style={{ marginBottom: 4 }}>Stack Readout</h2>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 2px' }}>
                <Dial value={analysis.meanScore} label="Mean score" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '10px 0 14px' }}>
                <div className="sie-hair" style={{ padding: '10px 12px' }}>
                  <div className="sie-mono" style={{ fontSize: LABEL_PX, color: COLORS.muted, letterSpacing: '.1em' }}>SYNERGY</div>
                  <div className="sie-num" style={{ fontSize: 24, color: analysis.synergyScore == null ? COLORS.muted : COLORS.indigoInk }}>{analysis.synergyScore ?? '—'}</div>
                </div>
                <div className="sie-hair" style={{ padding: '10px 12px' }}>
                  <div className="sie-mono" style={{ fontSize: LABEL_PX, color: COLORS.muted, letterSpacing: '.1em' }}>COVERAGE</div>
                  <div className="sie-num" style={{ fontSize: 24, color: COLORS.jadeInk }}>{Math.round(analysis.coveragePct * 100)}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <HallmarkBloom depthMap={analysis.hallmarkDepth} coveragePct={analysis.coveragePct} size={210} />
              </div>
              {analysis.gaps.length > 0 && analysis.scored.length > 0 && (
                <div style={{ marginTop: 12, fontSize: 12, color: COLORS.muted, lineHeight: 1.55 }}>
                  <span style={{ color: COLORS.goldInk, fontWeight: 600 }}>{analysis.gaps.length} uncovered</span>: {analysis.gaps.map((g) => g.short).join(' · ')}
                </div>
              )}
            </div>

            {/* STAGE */}
            <div style={{ minWidth: 0 }}>
              {/* tabs */}
              {/* The "Model" toggle and the flex spacer used to live inside
                  role="tablist", which may only contain role="tab" children.
                  The tablist is now scoped to the tabs themselves; the toggle
                  is a sibling, so it also stays put while the tabs scroll. */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14 }}>
                <div className="sie-scroll" role="tablist" aria-label="Engine views" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, flex: 1, minWidth: 0 }}>
                  {TABS.map((t) => (
                    <button type="button" key={t.id} role="tab" aria-selected={tab === t.id} className={`sie-tab ${tab === t.id ? 'sie-tab-active' : ''}`} onClick={() => setTab(t.id)}>
                      <t.icon size={15} aria-hidden /> {t.label}
                    </button>
                  ))}
                </div>
                {tab === 'compounds' && (
                  <button type="button" className="sie-tab" aria-pressed={showWeights} onClick={() => setShowWeights((v) => !v)} style={{ flexShrink: 0, color: showWeights ? COLORS.jadeInk : COLORS.muted }}>
                    <SlidersHorizontal size={15} aria-hidden /> Model
                  </button>
                )}
              </div>

              {staged.length === 0 ? (
                <div className="sie-card" style={{ padding: 48, textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, opacity: 0.5 }}>
                    <HallmarkBloom depthMap={{}} coveragePct={0} size={200} />
                  </div>
                  <p className="sie-disp" style={{ fontSize: 20, margin: 0 }}>No compounds staged</p>
                  <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 6 }}>Add a compound above to begin mechanistic scoring.</div>
                </div>
              ) : (
                <div className="sie-fade">
                  {/* weights panel */}
                  {tab === 'compounds' && showWeights && (
                    <div className="sie-card" style={{ padding: 16, marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <h3 className="sie-eyebrow" style={{ margin: 0 }}>Scoring Model · weights</h3>
                        <button type="button" className="sie-btn" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setWeights(DEFAULT_WEIGHTS)}>Reset</button>
                      </div>
                      {/* One row per axis, identical structure — the five axes are one
                          model, not five independent controls. */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
                        {(Object.keys(DEFAULT_WEIGHTS) as (keyof Weights)[]).map((k) => (
                          <div key={k}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                              <span className="sie-mono" style={{ fontSize: LABEL_PX, letterSpacing: '.08em', textTransform: 'uppercase', color: COLORS.muted }}>{k}</span>
                              <span className="sie-num" style={{ fontSize: 12 }}>{Math.round((weights[k] / weightTotal) * 100)}%</span>
                            </div>
                            <input type="range" className="sie-range" aria-label={`${k} weight`} min={0} max={0.5} step={0.02} value={weights[k]} onChange={(e) => setW(k, parseFloat(e.target.value))} style={{ width: '100%' }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 10 }}>Percentages are each axis&rsquo;s normalized share of the model — overall scores update live.</div>
                    </div>
                  )}

                  {tab === 'compounds' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 14 }}>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {analysis.scored.slice().sort((a, b) => b.overall - a.overall).map((it) => (
                          <button type="button" key={it.uid} className={`sie-row ${selected?.uid === it.uid ? 'sie-row-active' : ''}`} aria-pressed={selected?.uid === it.uid} onClick={() => setSelUid(it.uid)}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              <svg width={44} height={44} viewBox="0 0 44 44" aria-hidden>
                                <circle cx={22} cy={22} r={18} fill="none" stroke="var(--sie-track)" strokeWidth={4} />
                                <path d={arcPath(22, 22, 18, 0, 360 * (it.overall / 100) - 0.01)} fill="none" stroke={scoreColor(it.overall)} strokeWidth={4} strokeLinecap="round" />
                                <text x={22} y={26} textAnchor="middle" className="sie-num" style={{ fontSize: 14, fill: COLORS.text }}>{it.overall}</text>
                              </svg>
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{it.name}</span>
                                <TierBadge tier={it.data.tier} />
                              </div>
                              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{it.data.cls} · {it.data.hallmarks.length} hallmarks · {it.data.pathways.length} pathways</div>
                            </div>
                            <div style={{ width: 148, flexShrink: 0, display: 'grid', gap: 4 }} className="sie-hide-sm">
                              <Bar label="Evid" value={it.subs.evidence} />
                              <Bar label="Breadth" value={it.subs.breadth} />
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* detail */}
                      {selected && (
                        <div className="sie-card" style={{ padding: 18 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                            <div>
                              <h2 className="sie-disp" style={{ fontSize: 24, margin: 0 }}>{selected.name}</h2>
                              <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{selected.data.full} · {selected.data.cls}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div className="sie-num" style={{ fontSize: 34, color: scoreInk(selected.overall), lineHeight: 1 }}>{selected.overall}</div>
                              <div className="sie-mono" style={{ fontSize: LABEL_PX, color: COLORS.muted, letterSpacing: '.14em' }}>MECH SCORE</div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0,1fr)', gap: 18, marginTop: 16, alignItems: 'center' }} className="sie-detail-grid">
                            <div style={{ height: 180 }}>
                              <EngineRadar subs={selected.subs} />
                            </div>
                            {/* Same five axes as the radar, same order, one shared alignment. */}
                            <div style={{ display: 'grid', gap: 7 }}>
                              <Bar label="Evidence" value={selected.subs.evidence} />
                              <Bar label="Effect" value={selected.subs.effect} />
                              <Bar label="Breadth" value={selected.subs.breadth} />
                              <Bar label="Bioavail" value={selected.subs.bioavail} />
                              <Bar label="Safety" value={selected.subs.safety} />
                            </div>
                          </div>

                          <div style={{ marginTop: 14 }}>
                            <h3 className="sie-eyebrow" style={{ marginBottom: 6 }}>Mechanistic pathways</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {selected.data.pathways.map((p) => (
                                <span key={p} className="sie-tag" style={{ color: COLORS.cyanInk, background: alpha(COLORS.cyan, 14), border: `1px solid ${alpha(COLORS.cyan, 30)}` }}>{PATHWAY_LABELS[p] || p}</span>
                              ))}
                            </div>
                          </div>

                          <div style={{ marginTop: 12 }}>
                            <h3 className="sie-eyebrow" style={{ marginBottom: 6 }}>Hallmarks addressed</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                              {HALLMARKS.map((h) => {
                                const on = selected.data.hallmarks.includes(h.id);
                                return (
                                  <span
                                    key={h.id}
                                    className="sie-tag"
                                    style={{
                                      color: on ? COLORS.jadeInk : COLORS.muted,
                                      background: on ? alpha(COLORS.jade, 14) : 'transparent',
                                      border: `1px solid ${on ? alpha(COLORS.jade, 30) : COLORS.line}`,
                                    }}
                                  >
                                    {h.short}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          <p style={{ marginTop: 12, marginBottom: 0, fontSize: 14, color: COLORS.body, lineHeight: 1.6 }}>{selected.data.note}</p>
                          {selected.data.flags.length > 0 && (
                            <div style={{ marginTop: 10, display: 'grid', gap: 5 }}>
                              {selected.data.flags.map((f, i) => (
                                <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: 12.5, color: COLORS.goldInk }}>
                                  <AlertTriangle size={13} style={{ marginTop: 2, flexShrink: 0 }} aria-hidden />{f}
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                            <TierBadge tier={selected.data.tier} />
                            <span style={{ fontSize: 12, color: COLORS.muted }}>{TIER_META[selected.data.tier].label}</span>
                            <span style={{ flex: 1 }} />
                            {selected.data.libraryHref && (
                              <a className="sie-btn" href={selected.data.libraryHref}>
                                <BookOpen size={13} aria-hidden /> Library deep-dive
                              </a>
                            )}
                            <a className="sie-btn" href={pubmedUrl(selected.data.full || selected.name)} target="_blank" rel="noreferrer">
                              <ExternalLink size={13} aria-hidden /> PubMed
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'synergy' && (
                    <div style={{ display: 'grid', gap: 14 }}>
                      {analysis.synergyScore == null ? (
                        <div className="sie-card" style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>Stage at least two compounds to compute synergy.</div>
                      ) : (
                        <>
                          <div className="sie-card sie-detail-grid" style={{ padding: 18, display: 'grid', gridTemplateColumns: '160px minmax(0,1fr)', gap: 18, alignItems: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Dial value={analysis.synergyScore} label="Synergy" size={150} />
                            </div>
                            <div>
                              <h2 className="sie-eyebrow" style={{ marginBottom: 8 }}>Score composition</h2>
                              <div style={{ display: 'grid', gap: 6 }}>
                                {analysis.breakdown.map((b, i) => {
                                  const tone = TONE[b.tone];
                                  return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <div className="sie-mono" style={{ width: 152, flexShrink: 0, fontSize: LABEL_PX, letterSpacing: '.06em', textTransform: 'uppercase', color: COLORS.muted }}>{b.label}</div>
                                      <div style={{ flex: 1, height: 6, background: 'var(--sie-track)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                                        <div style={{
                                          position: 'absolute', left: b.kind === 'neg' ? 'auto' : 0, right: b.kind === 'neg' ? '50%' : 'auto',
                                          width: `${Math.min(Math.abs(b.value), 50)}%`, height: '100%',
                                          background: tone.bar, borderRadius: 4,
                                        }} />
                                      </div>
                                      <div className="sie-num" style={{ width: 34, flexShrink: 0, textAlign: 'right', fontSize: 12, color: b.kind === 'base' ? COLORS.muted : tone.ink }}>
                                        {b.value > 0 && b.kind !== 'base' ? '+' : ''}{b.value}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
                            <div className="sie-card" style={{ padding: 16 }}>
                              <h3 className="sie-eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><Network size={13} aria-hidden /> Convergent pathways</h3>
                              {analysis.convergent.length === 0 ? <div style={{ color: COLORS.muted, fontSize: 13 }}>No pathway hit by 2+ compounds yet.</div> :
                                analysis.convergent.map((c) => (
                                  <div key={c.p} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.line}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.cyanInk }}>{PATHWAY_LABELS[c.p] || c.p}</span>
                                      <span className="sie-num" style={{ fontSize: 12 }}>×{c.count}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: COLORS.muted }}>{c.members.join(', ')}</div>
                                  </div>
                                ))}
                            </div>

                            <div className="sie-card" style={{ padding: 16 }}>
                              <h3 className="sie-eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={13} aria-hidden /> Synergies</h3>
                              {analysis.synergies.length === 0 ? <div style={{ color: COLORS.muted, fontSize: 13 }}>No curated synergy pairs present.</div> :
                                analysis.synergies.map((s, i) => (
                                  <div key={i} style={{ padding: '8px 0', borderBottom: `1px solid ${COLORS.line}` }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.indigoInk }}>{s.a} + {s.b}</div>
                                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2, lineHeight: 1.55 }}>{s.rationale}</div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {(analysis.cautions.length > 0 || analysis.redundancies.length > 0) && (
                            <div className="sie-card" style={{ padding: 16, borderColor: alpha(COLORS.rose, 34) }}>
                              <h3 className="sie-eyebrow" style={{ marginBottom: 10, color: COLORS.roseInk, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={13} aria-hidden /> Cautions &amp; redundancy</h3>
                              {analysis.redundancies.map((r, i) => (
                                <div key={'r' + i} style={{ fontSize: 12.5, marginBottom: 8, lineHeight: 1.55 }}>
                                  <span style={{ fontWeight: 600, color: COLORS.goldInk }}>{r.label}</span> <span style={{ color: COLORS.muted }}>({r.members.join(', ')}) — {r.rationale}</span>
                                </div>
                              ))}
                              {analysis.cautions.map((c, i) => (
                                <div key={'c' + i} style={{ fontSize: 12.5, marginBottom: 8, lineHeight: 1.55 }}>
                                  <span style={{ fontWeight: 600, color: COLORS.roseInk }}>{c.kind}{c.a ? `: ${c.a} + ${c.b}` : ''}</span> <span style={{ color: COLORS.muted }}>— {c.rationale}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {tab === 'hallmarks' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 18 }} className="sie-hall-grid">
                      <div className="sie-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 className="sie-eyebrow" style={{ alignSelf: 'flex-start', marginBottom: 4 }}>Hallmark Bloom · click a node</h2>
                        <HallmarkBloom depthMap={analysis.hallmarkDepth} coveragePct={analysis.coveragePct} selected={selHall} onSelect={setSelHall} size={340} />
                        <div className="sie-mono" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 10, fontSize: LABEL_PX, letterSpacing: '.06em', textTransform: 'uppercase', color: COLORS.muted }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: COLORS.jade }} /> covered</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: COLORS.gold }} /> deep (3+)</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 999, border: `1.5px dashed ${COLORS.faint}` }} /> gap</span>
                        </div>
                      </div>
                      <div className="sie-card" style={{ padding: 18, alignSelf: 'start' }}>
                        <div className="sie-eyebrow" style={{ marginBottom: 4 }}>{HALLMARK_MAP[selHall].short}</div>
                        <h2 className="sie-disp" style={{ fontSize: 20, margin: 0 }}>{HALLMARK_MAP[selHall].label}</h2>
                        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 6, lineHeight: 1.6 }}>{HALLMARK_MAP[selHall].blurb}</div>
                        <div style={{ margin: '14px 0', height: 1, background: COLORS.line }} />
                        <div className="sie-mono" style={{ fontSize: LABEL_PX, letterSpacing: '.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>
                          Depth · {analysis.hallmarkDepth[selHall]} compound{analysis.hallmarkDepth[selHall] === 1 ? '' : 's'}
                        </div>
                        {analysis.hallmarkMembers[selHall].length ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {analysis.hallmarkMembers[selHall].map((m, i) => <span key={i} className="sie-chip" style={{ fontSize: 12 }}>{m}</span>)}
                          </div>
                        ) : (
                          <div style={{ fontSize: 12.5, color: COLORS.goldInk, display: 'flex', gap: 6, alignItems: 'flex-start', lineHeight: 1.55 }}>
                            <AlertTriangle size={13} style={{ marginTop: 2, flexShrink: 0 }} aria-hidden /> Gap — no staged compound addresses this hallmark.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {tab === 'factcheck' && (
                    <div style={{ display: 'grid', gap: 14 }}>
                      <div className="sie-card" style={{ padding: 16 }}>
                        <h2 className="sie-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}><ShieldCheck size={13} aria-hidden /> Evidence provenance</h2>
                        <div className="sie-scroll" style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 560 }}>
                            <thead>
                              <tr style={{ textAlign: 'left', color: COLORS.muted }} className="sie-mono">
                                <th scope="col" style={{ padding: '8px 10px', fontWeight: 600, fontSize: LABEL_PX, letterSpacing: '.08em' }}>COMPOUND</th>
                                <th scope="col" style={{ padding: '8px 10px', fontWeight: 600, fontSize: LABEL_PX, letterSpacing: '.08em' }}>TIER</th>
                                <th scope="col" style={{ padding: '8px 10px', fontWeight: 600, fontSize: LABEL_PX, letterSpacing: '.08em' }}>RCT</th>
                                <th scope="col" style={{ padding: '8px 10px', fontWeight: 600, fontSize: LABEL_PX, letterSpacing: '.08em' }}>LIT (INDIC.)</th>
                                <th scope="col" style={{ padding: '8px 10px', fontWeight: 600, fontSize: LABEL_PX, letterSpacing: '.08em' }}>SOURCE</th>
                                <th scope="col" style={{ padding: '8px 10px', fontWeight: 600, fontSize: LABEL_PX, letterSpacing: '.08em' }}>LINKS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analysis.scored.map((it) => (
                                <tr key={it.uid} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                                  <td style={{ padding: '9px 10px', fontWeight: 600, color: COLORS.text }}>{it.name}</td>
                                  <td style={{ padding: '9px 10px' }}><TierBadge tier={it.data.tier} /></td>
                                  <td style={{ padding: '9px 10px' }}>{it.data.rct ? <CheckCircle2 size={14} style={{ color: COLORS.jadeInk }} aria-label="yes" /> : <X size={14} style={{ color: COLORS.muted }} aria-label="no" />}</td>
                                  <td style={{ padding: '9px 10px' }} className="sie-num">{it.data.studies ? `~${it.data.studies}` : '—'}</td>
                                  <td style={{ padding: '9px 10px', color: COLORS.muted, fontSize: 12 }}>Curated library</td>
                                  <td style={{ padding: '9px 10px' }}>
                                    <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
                                      {it.data.libraryHref && <a href={it.data.libraryHref} style={{ color: COLORS.jadeInk }} aria-label={`${it.name} library deep-dive`}><BookOpen size={13} /></a>}
                                      <a href={pubmedUrl(it.data.full || it.name)} target="_blank" rel="noreferrer" style={{ color: COLORS.cyanInk }} aria-label={`${it.name} on PubMed`}><ExternalLink size={13} /></a>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="sie-card" style={{ padding: 16, display: 'grid', gap: 8 }}>
                        <h2 className="sie-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Info size={13} aria-hidden /> Methodology &amp; honesty</h2>
                        <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.65, margin: 0 }}>
                          Scores are computed transparently and deterministically — rule-based reasoning, not generative AI. <span style={{ color: COLORS.text }}>Evidence</span> derives from study tier, <span style={{ color: COLORS.text }}>Breadth</span> from pathway + hallmark count, and <span style={{ color: COLORS.text }}>Effect / Bioavailability / Safety</span> from the curated library (adjusted by formulation grade). Synergy is Baseline 50 ± pathway convergence, curated synergy pairs, hallmark coverage, and redundancy / interaction / redox-load penalties — the exact composition is shown on the Synergy tab.
                        </p>
                        <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.65, margin: 0 }}>
                          Curated values reflect a point-in-time evidence review and should be re-verified against current literature. “Indicative lit” is a stored magnitude, not a live count — follow the <span style={{ color: COLORS.jadeInk }}>library</span> and <span style={{ color: COLORS.cyanInk }}>PubMed</span> links for primary sources. Nothing here is medical advice.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sie-mono" style={{ textAlign: 'center', marginTop: 22, fontSize: LABEL_PX, letterSpacing: '.08em', color: COLORS.muted }}>
          TNiC · COMPOUND INTELLIGENCE ENGINE — mechanistic scoring is decision-support, not medical advice.
        </div>
      </div>
    </div>
  );
}

export default CompoundIntelligenceEngine;
