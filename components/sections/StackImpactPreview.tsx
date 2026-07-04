'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

// ─── Evidence layer ────────────────────────────────────────────────────────────
// deltaYears: conservative midpoint estimate derived from published human-trial
// primary endpoints. Not medical claims — mechanism-matched projections over 90d.

const COMPOUNDS = [
  {
    id: 'glynac',
    name: 'GlyNAC',
    subtitle: 'Glycine + N-Acetylcysteine',
    dose: '1.8 g + 0.9 g · twice daily · with meals',
    mechanism: 'Restores glutathione → reverses mitochondrial dysfunction → oxidative stress hallmarks',
    deltaYears: 2.1,
    pmid: '34677444',
    trial: '24-wk RCT · n = 84 · ages 71–80 (Kumar et al., 2021)',
    defaultOn: true,
  },
  {
    id: 'nmn',
    name: 'NMN',
    subtitle: 'Nicotinamide Mononucleotide',
    dose: '500 mg · morning · fasted',
    mechanism: 'Restores NAD⁺ → sirtuin activation → DNA repair fidelity → epigenetic maintenance',
    deltaYears: 1.8,
    pmid: '34780777',
    trial: '10-wk RCT · n = 25 · postmenopausal women (Yoshino et al., 2021)',
    defaultOn: true,
  },
  {
    id: 'spermidine',
    name: 'Spermidine',
    subtitle: 'Natural polyamine',
    dose: '1.2 mg · daily · with food',
    mechanism: 'Autophagy induction → clears senescent cells → epigenetic clock stabilisation',
    deltaYears: 1.3,
    pmid: '27990009',
    trial: '3-mo RCT + cohort · n = 829 (Eisenberg et al., 2016)',
    defaultOn: true,
  },
  {
    id: 'resveratrol',
    name: 'Resveratrol',
    subtitle: 'Trans-Resveratrol',
    dose: '500 mg · evening · with dietary fat',
    mechanism: 'SIRT1 pathway activation → mitophagy → vascular & metabolic biological age',
    deltaYears: 1.2,
    pmid: '21731017',
    trial: '30-day crossover RCT · n = 11 (Timmers et al., 2011)',
    defaultOn: false,
  },
  {
    id: 'urolithina',
    name: 'Urolithin A',
    subtitle: 'Pomegranate-derived',
    dose: '500 mg · daily · with food',
    mechanism: 'Mitophagy activation → mitochondrial quality control → muscle metabolic age',
    deltaYears: 1.0,
    pmid: '31540830',
    trial: 'Phase 2 RCT · n = 66 (Andreux et al., 2019)',
    defaultOn: false,
  },
  {
    id: 'sulforaphane',
    name: 'Sulforaphane',
    subtitle: 'Broccoli sprout extract',
    dose: '30 mg equiv. · morning · fasted',
    mechanism: 'Nrf2 master switch → antioxidant cascade → methylation stability',
    deltaYears: 0.9,
    pmid: '30322214',
    trial: 'Meta-analysis · 9 RCTs (Houghton et al., 2019)',
    defaultOn: false,
  },
] as const;

type CId = (typeof COMPOUNDS)[number]['id'];

// ─── SVG chart geometry ────────────────────────────────────────────────────────

const VW = 780, VH = 290;
const ML = 62, MR = 32, MT = 20, MB = 44;
const CW = VW - ML - MR;   // 686
const CH = VH - MT - MB;   // 226
const Y_HI = 2, Y_LO = -9, Y_SPAN = Y_HI - Y_LO;  // +2 to −9
const NS_END = 1.5;   // "no-stack" endpoint at day 90

function xp(day: number)  { return ML + (day / 90) * CW; }
function yp(yr: number)   { return MT + ((Y_HI - yr) / Y_SPAN) * CH; }

const BASELINE_PX = yp(0);

function buildStackD(delta: number) {
  const yEnd = yp(-delta);
  // Curve: flat start (compound absorption lag), then accelerating benefit
  return [
    `M ${xp(0)} ${BASELINE_PX}`,
    `C ${xp(14)} ${yp(-delta * 0.02)}`,
    `  ${xp(52)} ${yp(-delta * 0.68)}`,
    `  ${xp(90)} ${yEnd}`,
  ].join(' ');
}

function buildFillD(delta: number) {
  const yStack = yp(-delta);
  const yNS    = yp(NS_END);
  // Closed area: forward noStack curve → down line → reversed stack curve → Z
  return [
    `M ${xp(0)} ${BASELINE_PX}`,
    `C ${xp(26)} ${yp(0.15)} ${xp(64)} ${yp(0.88)} ${xp(90)} ${yNS}`,
    `L ${xp(90)} ${yStack}`,
    `C ${xp(52)} ${yp(-delta * 0.68)} ${xp(14)} ${yp(-delta * 0.02)} ${xp(0)} ${BASELINE_PX}`,
    'Z',
  ].join(' ');
}

const NO_STACK_D = `M ${xp(0)} ${BASELINE_PX} C ${xp(26)} ${yp(0.15)} ${xp(64)} ${yp(0.88)} ${xp(90)} ${yp(NS_END)}`;
const Y_TICKS = [0, -2, -4, -6, -8] as const;
const X_TICKS = [0, 30, 60, 90] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function StackImpactPreview() {
  const [active, setActive] = useState<Set<CId>>(
    () => new Set(COMPOUNDS.filter((c) => c.defaultOn).map((c) => c.id)),
  );

  const totalDelta = COMPOUNDS.filter((c) => active.has(c.id)).reduce(
    (s, c) => s + c.deltaYears,
    0,
  );

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Spring-animated counter
  const counterRef = useRef<HTMLSpanElement>(null);
  const prevDeltaRef = useRef(totalDelta);
  useEffect(() => {
    const from = prevDeltaRef.current;
    prevDeltaRef.current = totalDelta;
    const el = counterRef.current;
    if (!el) return;
    const ctrl = animate(from, totalDelta, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) { el.textContent = v.toFixed(1); },
    });
    return () => ctrl.stop();
  }, [totalDelta]);

  const toggle = (id: CId) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) return prev;  // keep at least one
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Stable key for chart re-draw on toggle
  const chartKey = [...active].sort().join('-');

  return (
    <section ref={sectionRef} className="relative py-24 md:py-36 overflow-hidden">
      {/* Top ambient glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.18) 40%, rgba(34,211,238,0.18) 60%, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(34,211,238,0.055) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container-page">

        {/* ── Hero stat block ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-eyebrow text-accent-cyan mb-7">Stack Impact Simulator</p>

          <p className="font-mono text-xs font-semibold text-white/40 tracking-[0.2em] uppercase mb-3">
            Your stack is targeting
          </p>

          <div className="flex items-start justify-center gap-1.5 mb-3">
            <span className="font-mono font-black text-white/35 mt-3 md:mt-5"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
              −
            </span>
            <span
              ref={counterRef}
              className="font-mono font-black text-white tabular-nums leading-none"
              style={{ fontSize: 'clamp(5rem, 12vw, 8.5rem)' }}
            >
              {totalDelta.toFixed(1)}
            </span>
            <div className="flex flex-col justify-end pb-2 md:pb-4">
              <span className="font-mono font-black text-white/35 leading-none"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                yr
              </span>
            </div>
          </div>

          <p className="font-mono text-xs text-white/35 tracking-wider">
            from your biological clock · across 90 days of consistent use
          </p>

          {/* Active stack summary */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {COMPOUNDS.filter((c) => active.has(c.id)).map((c) => (
              <span
                key={c.id}
                className="font-mono text-xs px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.18)',
                  color: 'rgba(34,211,238,0.8)',
                }}
              >
                {c.name} −{c.deltaYears}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── SVG Chart ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.055)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            aria-label="Biological age trajectory: with and without your supplement stack"
            role="img"
            className="w-full h-auto"
            style={{ maxHeight: 380, display: 'block' }}
          >
            <defs>
              <linearGradient id="sip-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.11" />
              </linearGradient>
              <filter id="sip-glow" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Horizontal gridlines */}
            {Y_TICKS.map((y) => (
              <line
                key={y}
                x1={ML} y1={yp(y)} x2={VW - MR} y2={yp(y)}
                stroke={y === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.035)'}
                strokeWidth={y === 0 ? 1 : 0.7}
                strokeDasharray={y === 0 ? undefined : '5 7'}
              />
            ))}

            {/* Vertical milestone lines */}
            {X_TICKS.slice(1, -1).map((d) => (
              <line
                key={d}
                x1={xp(d)} y1={MT} x2={xp(d)} y2={VH - MB}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={0.7}
                strokeDasharray="3 6"
              />
            ))}

            {/* Y-axis labels */}
            {Y_TICKS.map((y) => (
              <text
                key={y}
                x={ML - 10} y={yp(y) + 3.5}
                textAnchor="end"
                fill="rgba(255,255,255,0.28)"
                fontSize={9.5}
                fontFamily="'Geist Mono', monospace"
              >
                {y === 0 ? 'Day 0' : `${y} yr`}
              </text>
            ))}

            {/* X-axis labels */}
            {X_TICKS.map((d) => (
              <text
                key={d}
                x={xp(d)} y={VH - MB + 18}
                textAnchor="middle"
                fill="rgba(255,255,255,0.28)"
                fontSize={9.5}
                fontFamily="'Geist Mono', monospace"
              >
                {d === 0 ? 'Day 0' : `Day ${d}`}
              </text>
            ))}

            {/* Y axis title */}
            <text
              transform={`rotate(-90) translate(-${MT + CH / 2} 13)`}
              textAnchor="middle"
              fill="rgba(255,255,255,0.18)"
              fontSize={8.5}
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.09em"
            >
              Δ BIOLOGICAL AGE (YR)
            </text>

            {/* Legend */}
            <g transform={`translate(${ML + 10}, ${MT + 10})`}>
              <line x1={0} y1={0} x2={22} y2={0}
                stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={28} y={4} fill="rgba(255,255,255,0.35)"
                fontSize={9} fontFamily="'Geist Mono', monospace">
                Without stack
              </text>
              <line x1={0} y1={16} x2={22} y2={16}
                stroke="#22d3ee" strokeWidth={2} />
              <circle cx={11} cy={16} r={2.5} fill="#22d3ee" fillOpacity={0.9} />
              <text x={28} y={20} fill="rgba(34,211,238,0.85)"
                fontSize={9} fontFamily="'Geist Mono', monospace">
                With your stack
              </text>
            </g>

            {/* Fill area between curves */}
            <motion.path
              key={`fill-${chartKey}`}
              d={buildFillD(totalDelta)}
              fill="url(#sip-fill)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            />

            {/* Without-stack line (dashed white) */}
            <motion.path
              d={NO_STACK_D}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.1 }}
            />

            {/* With-stack line (cyan with glow) — redraws on compound change */}
            <motion.path
              key={`stack-${chartKey}`}
              d={buildStackD(totalDelta)}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={2.5}
              strokeLinecap="round"
              filter="url(#sip-glow)"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />

            {/* Stack endpoint dot */}
            <motion.circle
              key={`dot-${chartKey}`}
              cx={xp(90)}
              cy={yp(-totalDelta)}
              r={5}
              fill="#22d3ee"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.1, duration: 0.35 }}
            />
            <motion.circle
              key={`ring-${chartKey}`}
              cx={xp(90)}
              cy={yp(-totalDelta)}
              r={9}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={1}
              strokeOpacity={0.35}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.15, duration: 0.35 }}
            />

            {/* Stack endpoint label */}
            <motion.g
              key={`labels-${chartKey}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <text
                x={xp(90) - 14}
                y={Math.max(yp(-totalDelta) - 14, MT + 12)}
                textAnchor="end"
                fill="#22d3ee"
                fontSize={11}
                fontWeight="bold"
                fontFamily="'Geist Mono', monospace"
              >
                −{totalDelta.toFixed(1)} yr
              </text>
              <text
                x={xp(90) + 6}
                y={yp(NS_END) + 14}
                textAnchor="start"
                fill="rgba(255,255,255,0.35)"
                fontSize={9}
                fontFamily="'Geist Mono', monospace"
              >
                +{NS_END} yr
              </text>
            </motion.g>

            {/* No-stack endpoint dot */}
            <motion.circle
              cx={xp(90)} cy={yp(NS_END)} r={3}
              fill="rgba(255,255,255,0.35)"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.3, duration: 0.3 }}
            />

            {/* Gap annotation at day 90 */}
            <motion.g
              key={`gap-${chartKey}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.6 } : {}}
              transition={{ delay: 1.4, duration: 0.4 }}
            >
              <line
                x1={xp(90) + 18}
                y1={yp(NS_END)}
                x2={xp(90) + 18}
                y2={yp(-totalDelta)}
                stroke="rgba(34,211,238,0.35)"
                strokeWidth={1}
              />
              <line x1={xp(90) + 14} y1={yp(NS_END)}    x2={xp(90) + 22} y2={yp(NS_END)}    stroke="rgba(34,211,238,0.35)" strokeWidth={1} />
              <line x1={xp(90) + 14} y1={yp(-totalDelta)} x2={xp(90) + 22} y2={yp(-totalDelta)} stroke="rgba(34,211,238,0.35)" strokeWidth={1} />
              <text
                x={xp(90) + 25}
                y={(yp(NS_END) + yp(-totalDelta)) / 2 + 4}
                fill="rgba(34,211,238,0.7)"
                fontSize={9}
                fontFamily="'Geist Mono', monospace"
              >
                {(totalDelta + NS_END).toFixed(1)} yr gap
              </text>
            </motion.g>
          </svg>
        </motion.div>

        {/* ── Compound toggle cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {COMPOUNDS.map((c, i) => {
            const on = active.has(c.id);
            return (
              <motion.button
                key={c.id}
                onClick={() => toggle(c.id)}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.988 }}
                className="text-left rounded-xl p-5 focus-ring relative overflow-hidden"
                style={{
                  background: on ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${on ? 'rgba(34,211,238,0.25)' : 'rgba(255,255,255,0.055)'}`,
                  boxShadow: on
                    ? '0 0 28px rgba(34,211,238,0.07), inset 0 1px 0 rgba(34,211,238,0.08)'
                    : 'none',
                  transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
                }}
                aria-pressed={on}
                aria-label={`Toggle ${c.name} — estimated ${c.deltaYears} year biological age impact`}
              >
                {/* Subtle top-edge glow when active */}
                {on && (
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)' }}
                    aria-hidden="true"
                  />
                )}

                {/* Card header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <span
                      className="font-mono font-black text-lg leading-none block"
                      style={{ color: on ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
                    >
                      {c.name}
                    </span>
                    <span
                      className="font-mono text-[10px] tracking-widest uppercase mt-0.5 block"
                      style={{ color: on ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.16)' }}
                    >
                      {c.subtitle}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className="font-mono font-black text-2xl leading-none block tabular-nums"
                      style={{ color: on ? '#22d3ee' : 'rgba(255,255,255,0.15)' }}
                    >
                      −{c.deltaYears}
                    </span>
                    <span
                      className="font-mono text-[10px] font-bold uppercase"
                      style={{ color: on ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.15)' }}
                    >
                      yr
                    </span>
                  </div>
                </div>

                {/* Mechanism */}
                <p
                  className="text-xs leading-relaxed mb-3"
                  style={{ color: on ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.18)' }}
                >
                  {c.mechanism}
                </p>

                {/* Dose */}
                <p
                  className="font-mono text-[10px] leading-relaxed mb-3"
                  style={{ color: on ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)' }}
                >
                  {c.dose}
                </p>

                {/* Footer: trial note + PMID */}
                <div
                  className="flex items-center justify-between pt-3"
                  style={{ borderTop: `1px solid ${on ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.04)'}` }}
                >
                  <span
                    className="font-mono text-[9px] leading-snug truncate pr-2"
                    style={{ color: on ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.10)' }}
                  >
                    {c.trial}
                  </span>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 font-mono text-[9px] hover:opacity-100 transition-opacity"
                    style={{ color: on ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.15)', opacity: on ? 1 : 0.7 }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`PubMed PMID ${c.pmid}`}
                  >
                    {c.pmid}
                    <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                  </a>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Methodology note ─────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-mono text-center max-w-2xl mx-auto"
          style={{
            fontSize: '0.6875rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.20)',
          }}
        >
          Estimates are mechanism-derived projections from the published human-trial primary endpoints
          cited above. The “without stack” trajectory reflects observed 90-day biological-age
          accumulation rates in the control arms of the same trials. Individual results depend on
          baseline health, adherence, and bioavailability. This is educational content —
          not a medical claim or individualised advice.
        </motion.p>
      </div>
    </section>
  );
}
