'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, FileCheck, Scale } from 'lucide-react';
import { platformStats, trustPillars } from '@/lib/homepage';

const pillarIcons = [Shield, Eye, FileCheck, Scale];

const neonColors = ['stat-neon-emerald', 'stat-neon', 'stat-neon-violet', 'stat-neon-amber'] as const;

export function HomepageTrust() {
  return (
    <section className="py-20 md:py-28 section-deep border-b border-border relative overflow-hidden">
      <div className="aurora-beams aurora-beams-emerald" aria-hidden="true" />
      <div className="bracket-corner bracket-corner-tl" aria-hidden="true" />
      <div className="bracket-corner bracket-corner-br" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Stats bar — v4 cards with neon numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {platformStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="stat-card-v4"
            >
              <p className={`text-3xl md:text-4xl tabular-nums mb-1 ${neonColors[i % neonColors.length]}`}>{stat.value}</p>
              <p className="text-label text-muted-foreground">{stat.label}</p>
              {stat.sublabel && (
                <p className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">{stat.sublabel}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Section heading */}
        <div className="text-center mb-12 section-spotlight">
          <span className="section-badge-emerald mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse-glow" />
            Why Trust TNiC
          </span>
          <h2 className="heading-section mt-4">
            Graded by evidence. Built for trust.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
            We name the trial, the PMID, the year, and the effect size. We label every projection as modeled — not lab-measured. No black-box recommendations, no hidden affiliate pressure on evidence grading.
          </p>
        </div>

        {/* Trust pillar cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPillars.map((pillar, i) => {
            const Icon = pillarIcons[i];
            return (
              <motion.a
                key={pillar.title}
                href={pillar.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card-floating card-floating-hover p-6 group block"
              >
                <div className="icon-badge-emerald w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-sm mb-2 group-hover:text-accent-emerald transition-colors duration-200">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </motion.a>
            );
          })}
        </div>

        <p className="text-center text-caption mt-10 font-mono opacity-60">
          TNiC is an educational platform — not a medical provider. Projections ≠ lab diagnostics. Consult your physician before any protocol.
        </p>
      </div>
    </section>
  );
}
