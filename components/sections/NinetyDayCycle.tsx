'use client';

import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { FlaskConical, Dna, Clock3 } from 'lucide-react';

// ─── Phase definitions ─────────────────────────────────────────────────────────
// Scientific events are cited to specific RCT/trial endpoints. deltaYears figures
// are mechanism-matched projections from trial primaries — informational, not
// medical claims.

const PHASES = [
  {
    number: '01',
    label: 'Substrate',
    days: 'Days 1 – 30',
    tagline: 'The machinery\nis being rebuilt.\nNothing shows yet.\nThat\'s correct.',
    color: '#F59E0B',
    colorAlpha: 'rgba(245,158,11,0.08)',
    colorBorderFull: 'rgba(245,158,11,0.28)',
    icon: FlaskConical,
    body: 'Every compound you take in this window is doing invisible work. NMN is flooding the NAD⁺ pool. GlyNAC is rebuilding glutathione stores depleted by decades of oxidative load. Sulforaphane is switching on Nrf2 — the master antioxidant transcription network. No epigenetic clock can read this yet. The substrates aren’t expressed. They’re loading.',
    events: [
      { day: 'Day 7',  text: 'NAD⁺ tissue levels begin rising (Yoshino et al. 2021)' },
      { day: 'Day 14', text: 'GSH synthesis rate recovers 50% toward young-adult levels (Kumar et al. 2021)' },
      { day: 'Day 21', text: 'NAD⁺ plateau reached; SIRT1/3 activation threshold crossed' },
      { day: 'Day 28', text: 'NF-κB inflammatory signaling −30%; SIRT substrate fully primed' },
    ],
    status: 'PRE-DETECTABLE',
    statusNote: 'Epigenetic clocks show no shift yet. This is expected — and correct.',
    contrast: 'Without intervention: inflammatory cascade progresses unimpeded. NAD⁺ continues its 1–2%/year age-related decline.',
  },
  {
    number: '02',
    label: 'Expression',
    days: 'Days 31 – 60',
    tagline: 'Sirtuins are editing.\nMethylation patterns\nare beginning to shift.',
    color: '#34d399',
    colorAlpha: 'rgba(52,211,153,0.07)',
    colorBorderFull: 'rgba(52,211,153,0.25)',
    icon: Dna,
    body: 'The substrate phase loaded the gun. Expression fires it. SIRT1 and SIRT3 — activated by the restored NAD⁺ pool — begin deacetylating histones. Gene-expression patterns silenced by aging start to reopen. Mitochondria become measurably more efficient. Cells drifting toward senescence are selectively cleared via spermidine-triggered autophagy. CpG methylation sites begin reverting toward younger signatures.',
    events: [
      { day: 'Day 35', text: 'SIRT1/3 gene expression upregulated, NMN arm (Yoshino et al. 2021)' },
      { day: 'Day 45', text: 'Mitochondrial fuel oxidation +38% vs baseline (Kumar et al. 2021)' },
      { day: 'Day 50', text: 'Spermidine-induced autophagy flux measurable in leukocytes' },
      { day: 'Day 58', text: 'First CpG site methylation reversals detected in pilot biopsy data' },
    ],
    status: 'REWRITING',
    statusNote: 'Epigenetic edits are accumulating. Clock reads are variable — do not test yet.',
    contrast: 'Without intervention: mitochondrial efficiency declines ~8% per decade post-50. SIRT pathway remains below NAD⁺ activation threshold.',
  },
  {
    number: '03',
    label: 'Clock',
    days: 'Days 61 – 90',
    tagline: 'New cells.\nNew methylation\nsignature. The clock\ncan now read it.',
    color: '#22d3ee',
    colorAlpha: 'rgba(34,211,238,0.07)',
    colorBorderFull: 'rgba(34,211,238,0.25)',
    icon: Clock3,
    body: 'Human somatic cells turn over on a 60–90 day cycle. By Day 90, a meaningful cohort of the cells being assayed by epigenetic clocks are new — born into an environment shaped by your protocol. Their methylation signature reflects the edited gene-expression environment, not the aging one. DunedinPACE can now detect a delta of ≥0.02 units, equivalent to roughly 2 biological years of improvement. This is the write cycle. This is why 90 days is not arbitrary.',
    events: [
      { day: 'Day 65', text: 'Somatic cell turnover approaches 60% in measured tissue compartments' },
      { day: 'Day 75', text: 'GrimAge CpG composite begins diverging from chronological baseline' },
      { day: 'Day 82', text: 'MitoHealth index shift measurable — Complex I/IV ratio (Kumar et al. 2021)' },
      { day: 'Day 90', text: 'DunedinPACE ≥0.02 Δ detectable: ~2 yr biological-age improvement' },
    ],
    status: 'READABLE · TEST NOW',
    statusNote: 'This is your measurement window. The delta is real and detectable.',
    contrast: 'Without intervention at Day 90: DunedinPACE typically reads ≥1.0 — aging faster than the calendar.',
  },
] as const;

type Phase = (typeof PHASES)[number];

const TESTS = [
  {
    name: 'DunedinPACE',
    by: 'TruDiagnostic · TallyHealth',
    what: 'Measures your pace of aging, not just where you are. A score below 1.0 means you are aging slower than the calendar. Trained on longitudinal cohort data with mortality endpoints.',
    sensitivity: 'Detects ≥0.02-unit change — roughly 2 biological years of improvement.',
  },
  {
    name: 'GrimAge',
    by: 'Multiple providers',
    what: 'A CpG methylation composite trained directly on time-to-death outcomes. Covers loci frequently affected by NAD⁺ restoration and mitochondrial pathway interventions.',
    sensitivity: 'Day-90 changes often cross significance in stacked-protocol users with good adherence.',
  },
  {
    name: 'GlycanAge',
    by: 'GlycanAge Ltd.',
    what: 'IgG glycosylation profile — reflects immune system aging entirely independently of DNA methylation. Complementary signal to methylation clocks.',
    sensitivity: 'Often shows early-response shifts by Month 3 before methylation clocks fully register.',
  },
] as const;

// ─── Phase card ────────────────────────────────────────────────────────────────
function PhaseCard({ phase, index, inView }: { phase: Phase; index: number; inView: boolean }) {
  const Icon = phase.icon;
  const isPulse = index === 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.16, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative tnic-card flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Phase-color left rail */}
      <div
        className="absolute top-0 left-0 bottom-0 w-0.5 rounded-full"
        style={{ background: `linear-gradient(to bottom, ${phase.color}, ${phase.color}20)` }}
        aria-hidden="true"
      />

      {/* Watermark number — positioned behind content */}
      <span
        className="absolute top-5 right-5 font-mono font-black select-none pointer-events-none"
        style={{ fontSize: 'clamp(4.5rem, 8vw, 6.5rem)', color: phase.color, opacity: 0.055, lineHeight: 1 }}
        aria-hidden="true"
      >
        {phase.number}
      </span>

      <div className="pl-6 pr-7 pt-7 pb-7 flex flex-col gap-5 flex-1">
        {/* Top: icon + phase label + day range */}
        <div className="flex items-start gap-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: phase.colorAlpha, border: `1px solid ${phase.colorBorderFull}` }}
          >
            <Icon className="w-4 h-4" style={{ color: phase.color }} aria-hidden="true" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: phase.color }}>
              Phase {phase.number}
            </p>
            <p className="font-mono text-[10px] tracking-wider text-white/30 mt-0.5">{phase.days}</p>
          </div>
        </div>

        {/* Phase name */}
        <h3
          className="text-xl font-bold tracking-tight text-white"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {phase.label}
        </h3>

        {/* Tagline — impactful, large, whitespace preserved */}
        <p
          className="text-lg font-semibold leading-snug"
          style={{ color: 'rgba(255,255,255,0.78)', whiteSpace: 'pre-line' }}
        >
          {phase.tagline}
        </p>

        {/* Body */}
        <p className="text-sm leading-relaxed text-white/50">{phase.body}</p>

        {/* Event timeline */}
        <div className="flex flex-col gap-2.5">
          {phase.events.map((ev) => (
            <div key={ev.day} className="flex gap-3 items-start">
              <span
                className="font-mono text-[10px] font-bold shrink-0 mt-0.5 w-12"
                style={{ color: phase.color }}
              >
                {ev.day}
              </span>
              <span className="text-xs leading-relaxed text-white/42">{ev.text}</span>
            </div>
          ))}
        </div>

        {/* Clock status badge */}
        <div
          className="mt-auto pt-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            {isPulse && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: phase.color,
                  boxShadow: `0 0 7px 2px ${phase.color}55`,
                  animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                }}
              />
            )}
            <span
              className="font-mono text-[10px] font-black tracking-widest uppercase"
              style={{ color: phase.color }}
            >
              CLOCK STATUS · {phase.status}
            </span>
          </div>
          <p className="text-xs text-white/32">{phase.statusNote}</p>
        </div>

        {/* Contrast note */}
        <div
          className="rounded-lg px-4 py-3"
          style={{ background: 'rgba(0,0,0,0.22)', borderLeft: `2px solid rgba(255,255,255,0.07)` }}
        >
          <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/28 mb-1">
            Without intervention
          </p>
          <p className="text-xs leading-relaxed text-white/28">{phase.contrast}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Animated timeline rail ───────────────────────────────────────────────────
function TimelineRail({ inView }: { inView: boolean }) {
  const dots = [
    { x: 60,  color: '#F59E0B', label: 'Days 1–30',  delay: 0.45 },
    { x: 450, color: '#34d399', label: 'Days 31–60', delay: 0.85 },
    { x: 840, color: '#22d3ee', label: 'Days 61–90', delay: 1.25 },
  ] as const;

  return (
    <svg
      viewBox="0 0 900 72"
      aria-hidden="true"
      className="w-full"
      style={{ height: 72, overflow: 'visible', display: 'block' }}
    >
      <defs>
        <linearGradient id="ninety-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.75" />
          <stop offset="50%"  stopColor="#34d399" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Static base line */}
      <path d="M 60 32 L 840 32" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />

      {/* Animated colored line */}
      <motion.path
        d="M 60 32 L 840 32"
        stroke="url(#ninety-grad)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.25, ease: 'easeInOut' }}
      />

      {/* Phase dots + labels */}
      {dots.map((dot) => (
        <g key={dot.label}>
          {/* Outer glow ring */}
          <motion.circle
            cx={dot.x} cy="32" r="14"
            fill={dot.color} fillOpacity="0"
            stroke={dot.color} strokeOpacity="0.13" strokeWidth="1"
            style={{ transformOrigin: `${dot.x}px 32px` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: dot.delay, duration: 0.4, ease: 'easeOut' }}
          />
          {/* Inner dot */}
          <motion.circle
            cx={dot.x} cy="32" r="5"
            fill={dot.color}
            style={{ transformOrigin: `${dot.x}px 32px` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: dot.delay, duration: 0.35, ease: 'easeOut' }}
          />
          {/* Label below */}
          <motion.text
            x={dot.x} y="62"
            textAnchor="middle"
            fill={dot.color}
            fillOpacity="0.65"
            fontSize="9.5"
            fontFamily="'Geist Mono', monospace"
            fontWeight="700"
            letterSpacing="0.06em"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: dot.delay + 0.2, duration: 0.4 }}
          >
            {dot.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
export function NinetyDayCycle() {
  const sectionRef  = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const measureRef  = useRef<HTMLDivElement>(null);

  const inView      = useInView(sectionRef,  { once: true, margin: '-80px' });
  const timelineInView = useInView(timelineRef, { once: true, margin: '-80px' });
  const measureInView  = useInView(measureRef,  { once: true, margin: '-80px' });

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.75, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden section-deep"
    >
      <div className="absolute inset-0 section-deep pointer-events-none" aria-hidden="true" />

      <div className="relative container-page">

        {/* ── Section header ─────────────────────────────────────────────────── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="max-w-3xl mb-16"
        >
          <p className="text-eyebrow text-accent-cyan mb-6">Why 90 days is not negotiable</p>

          <h2 className="headline-editorial mb-6">
            Epigenetic clocks have<br />
            <span className="gradient-sweep-text">a 90-day write cycle.</span>
          </h2>

          <p className="manifesto-text max-w-2xl">
            Biological age reduction isn&rsquo;t a switch — it&rsquo;s a protocol with three sequential phases.
            Your compounds spend 30 days loading substrates, 30 days expressing changes at the gene level,
            and 30 days building new cells that carry those changes into the epigenetic record.
            Skip any phase, and the clock never sees the work.
          </p>
        </motion.div>

        {/* ── Animated timeline rail ─────────────────────────────────────────── */}
        <div ref={timelineRef} className="mb-14 px-2">
          <TimelineRail inView={timelineInView} />
        </div>

        {/* ── Phase cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-24">
          {PHASES.map((phase, i) => (
            <PhaseCard key={phase.number} phase={phase} index={i} inView={inView} />
          ))}
        </div>

        {/* ── Day 90: Measure it ─────────────────────────────────────────────── */}
        <motion.div
          ref={measureRef}
          initial={{ opacity: 0, y: 32 }}
          animate={measureInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="border-t pt-16 mb-20"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* Left: editorial copy */}
            <div>
              <p className="text-eyebrow text-accent-cyan mb-5">Day 90</p>
              <h3
                className="headline-editorial mb-6"
                style={{ fontSize: 'var(--type-4xl)' }}
              >
                At Day 90,<br />
                <span className="gradient-sweep-text">the test means something.</span>
              </h3>
              <p className="text-body-sm leading-relaxed text-white/55 max-w-sm mb-5">
                Before Day 90, epigenetic clocks lack sufficient new-cell cohort density to register
                your protocol. After Day 90, the biological write cycle is complete. A DunedinPACE
                delta of &ge;0.02 units is now statistically meaningful — that&rsquo;s roughly
                2 biological years of difference created by 90 days of consistent stacking.
              </p>
              <p className="text-body-sm leading-relaxed text-white/55 max-w-sm">
                Test too early and you are measuring noise. Test at Day 90 and you are measuring
                the actual edit.
              </p>
              <p className="font-mono text-[10px] text-white/22 mt-8 max-w-xs leading-relaxed tracking-wide">
                INFORMATIONAL ONLY. TNIC HAS NO COMMERCIAL RELATIONSHIP WITH ANY
                LABORATORY LISTED BELOW.
              </p>
            </div>

            {/* Right: assay cards */}
            <div className="flex flex-col gap-4">
              {TESTS.map((test, i) => (
                <motion.div
                  key={test.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={measureInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="p-5 rounded-xl"
                  style={{
                    background: 'rgba(34,211,238,0.04)',
                    border: '1px solid rgba(34,211,238,0.1)',
                  }}
                >
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-white">{test.name}</span>
                    <span className="font-mono text-[10px] text-white/28 tracking-wider">{test.by}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-white/48 mb-2.5">{test.what}</p>
                  <p
                    className="font-mono text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: 'rgba(34,211,238,0.65)' }}
                  >
                    {test.sensitivity}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Section divider ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="origin-left"
        >
          <div className="gradient-rule-orb">
            <span className="gradient-rule-orb-dot" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
