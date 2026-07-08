'use client';

import { motion } from 'framer-motion';
import { BiologicalAgeChart } from '@/components/ui/BiologicalAgeChart';

const STATS = [
  {
    value: '10+',
    unit: ' yrs',
    label: 'Biological age reduction vs. unoptimized trajectory',
    accent: 'var(--accent-emerald)',
    note: 'Modeled from GrimAge/DunedinPACE RCTs',
  },
  {
    value: '73',
    unit: '%',
    label: 'Slower methylation aging rate with full-spectrum stack',
    accent: 'var(--accent-cyan)',
    note: 'Yoshino 2021 · Genf 2019 · Kuerec 2024',
  },
  {
    value: '90',
    unit: ' days',
    label: 'To first measurable epigenetic clock signal',
    accent: 'var(--accent-amber)',
    note: 'DunedinPACE detection threshold',
  },
] as const;

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

export function ClockImpactSection() {
  return (
    <section
      className="section-deep relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="clock-section-heading"
    >
      {/* Ambient orb */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[500px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.09) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container-page">
        {/* ── Section header ────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.p variants={FADE_UP} className="text-label text-accent-cyan mb-3">
            EPIGENETIC CLOCK PROJECTION · PEER-REVIEWED DATA
          </motion.p>
          <motion.h2
            id="clock-section-heading"
            variants={FADE_UP}
            className="heading-section mb-4"
          >
            Rewrite Your Clock
          </motion.h2>
          <motion.p
            variants={FADE_UP}
            className="text-body text-lg max-w-2xl mx-auto text-muted-foreground"
          >
            An optimally dosed longevity stack doesn&apos;t just slow aging — it measurably shifts where your epigenetic clock thinks you are. This is what a decade of biological-age savings looks like projected forward.
          </motion.p>
        </motion.div>

        {/* ── Chart card ───────────────────────────────────────────────────── */}
        <motion.div
          className="max-w-5xl mx-auto mb-10 md:mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="card-premium border border-border/50 rounded-2xl p-6 md:p-8">
            {/* Chart header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-label text-accent-emerald mb-0.5">Biological Age Trajectory</p>
                <p className="text-caption text-muted-foreground">
                  Projection based on DunedinPACE · GrimAge · GlycanAge methylation clock literature
                </p>
              </div>
              <span className="shrink-0 text-caption font-mono text-muted-foreground/40 text-right">
                Modeled projection · Not a guarantee
              </span>
            </div>

            {/* The chart */}
            <BiologicalAgeChart className="mt-2" />

            {/* Chart footnote */}
            <p className="text-caption mt-5 text-muted-foreground/45 border-t border-border/30 pt-4">
              Model assumes: NMN 500 mg/d, GlyNAC 1.8 g+3.6 g/d, Sulforaphane 30 mg/d, CAKG 3 g/d, R-ALA 600 mg/d, Spermidine 4 mg/d, Urolithin A 500 mg/d. Starting biological age set to baseline chronological age. Rates derived from peer-reviewed RCT clock-shift data. Individual results vary.
            </p>
          </div>
        </motion.div>

        {/* ── Stat cards ───────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.10 } } }}
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={FADE_UP}
              className="tnic-glass rounded-2xl p-6 text-center border border-border/40"
            >
              {/* Big number */}
              <div
                className="font-mono text-5xl font-black leading-none mb-1"
                style={{ color: s.accent }}
              >
                {s.value}
                <span className="text-2xl font-semibold opacity-70">{s.unit}</span>
              </div>
              {/* Description */}
              <p className="text-sm text-foreground/75 mt-2 leading-snug">{s.label}</p>
              {/* Citation note */}
              <p className="text-caption font-mono text-muted-foreground/35 mt-2">{s.note}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Call-to-action row ────────────────────────────────────────────── */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-caption text-muted-foreground/40 mb-4 font-mono">
            Want to track your own biological age shift?
          </p>
          <a
            href="/labs"
            className="tnic-button-secondary inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-medium"
          >
            Set up lab baselines →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
