'use client';

import { motion, type Variants } from 'framer-motion';
import { Layers, Pipette, Clock, CalendarDays } from 'lucide-react';

const ACCENT = '#22d3ee';
const ACCENT_BG = 'rgba(34,211,238,0.05)';
const ACCENT_BORDER = 'rgba(255,255,255,0.06)';

const pillars = [
  {
    icon: Layers,
    stat: '2–4×',
    label: 'Synergy Uplift',
    claim:
      'Synergistic pairs — NMN + resveratrol, GlyNAC + sulforaphane — produce 2–4× the outcome of either compound alone in published human-trial data.',
  },
  {
    icon: Pipette,
    stat: 'Exact',
    label: 'Trial Doses',
    claim:
      'We list the doses the trials actually used — not the label dose, not a proprietary blend. Dose is the difference between a result and a placebo.',
  },
  {
    icon: Clock,
    stat: '~30%',
    label: 'Timing Shift',
    claim:
      'NMN in the AM, sulforaphane fasted, resveratrol with fat. Circadian timing shifts published outcomes by up to 30%. We tell you when, not just what.',
  },
  {
    icon: CalendarDays,
    stat: '90 days',
    label: 'Clock Response',
    claim:
      'Epigenetic clocks like DunedinPACE need ~90 days of adherence before they register change. We track consistency so the clock has something to measure.',
  },
] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
  }),
};

export function PremiumManifestoSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden section-deep">
      <div className="absolute inset-0 section-deep pointer-events-none" aria-hidden="true" />

      <div className="relative container-page">
        {/* Editorial headline block */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-20"
        >
          <p className="text-eyebrow text-accent-cyan mb-6">What actually moves the needle</p>

          <h2 className="headline-editorial mb-6">
            Supplements work when<br />
            <span className="gradient-sweep-text">they’re stacked correctly.</span>
          </h2>

          <p className="manifesto-text max-w-2xl">
            The gap between a supplement that does nothing and one that measurably shifts your
            biological age is stack, dose, timing, and consistency. Most platforms get none of
            these right. TNiC is built around all four.
          </p>
        </motion.div>

        {/* Four-lever bento grid */}
        <div className="bento-grid">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="bento-cell tnic-card p-8 flex flex-col gap-5"
              style={{
                background: ACCENT_BG,
                borderColor: ACCENT_BORDER,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}` }}
                aria-hidden="true"
              >
                <p.icon className="w-5 h-5" style={{ color: ACCENT }} />
              </div>

              <div>
                <span className="font-mono text-3xl font-black tracking-tight block leading-none mb-1 text-white">
                  {p.stat}
                </span>
                <span className="font-mono text-xs font-bold tracking-widest uppercase text-white/50">
                  {p.label}
                </span>
              </div>

              <p className="text-body-sm leading-relaxed mt-auto text-white/70">{p.claim}</p>

              <div
                className="h-px w-full mt-2"
                style={{ background: `linear-gradient(90deg, ${ACCENT}30, transparent)` }}
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>

        {/* Divider rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 origin-left"
        >
          <div className="gradient-rule-orb">
            <span className="gradient-rule-orb-dot" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
