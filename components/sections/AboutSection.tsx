'use client';

import { motion } from 'framer-motion';
import { BookOpen, FlaskConical, Heart, User, Quote } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';

const founder = {
  name: 'Tommy Nichols',
  title: 'Founder, TNiC',
  bio: [
    'Tommy Nichols built TNiC after spending years navigating the longevity supplement industry and finding it dominated by marketing noise, undisclosed affiliate conflicts, and preclinical mouse studies dressed up as clinical proof.',
    'A self-taught researcher and software builder, he designed TNiC to be the platform he wished existed — one where every recommendation traces back to a PMID, every compound is graded honestly against human trial data, and the tools help you think rather than just buy.',
    'TNiC is independently built, carries no inventory, and discloses every commercial relationship. The independence is the point.',
  ],
  quote: 'Most longevity sites are supplement stores with a content problem. I wanted to build the opposite.',
};

const pillars = [
  {
    icon: BookOpen,
    title: 'Educate First',
    desc: 'Every tool is paired with plain-language explanations, PubMed citations, and evidence tiers. You understand the why before the what.',
  },
  {
    icon: FlaskConical,
    title: 'Evidence-Graded',
    desc: 'Compounds earn Tier A, B, or C ratings based on human trial data — not marketing claims. Preclinical-only interventions are labeled clearly.',
  },
  {
    icon: Heart,
    title: 'Safety-Centered',
    desc: 'Per-compound contraindications, physician consultation prompts, and realistic outcome timelines. We under-promise and over-cite.',
  },
  {
    icon: User,
    title: 'Personal + General',
    desc: 'Modeled biomarker projections help you explore scenarios. Your lab results (when available) remain the gold standard — TNiC never replaces clinical diagnostics.',
  },
];

const scopeNote = {
  covered: ['NRF2 / glutathione pathways', 'NAD+ & mitochondrial renewal', '12 Hallmarks of Aging framework', 'GlyNAC, NMN, Ca-AKG, Sulforaphane, R-ALA, Resveratrol'],
  planned: ['Rapamycin / mTOR modulation (Tier C — physician-supervised only)', 'SIRT1/PGC-1α deep-dive module', 'Personal lab upload & analysis', 'Follistatin / myostatin pathway (research stage)'],
};

export function AboutSection() {
  return (
    <SectionShell
      id="about"
      mod="MOD-ABT-00"
      theme="cyan"
      badge="About TNiC"
      title="An Educational Longevity Platform"
      subtitle="TNiC is not a supplement store or a personal health blog. It is a structured, science-backed resource for adults optimizing healthspan — with interactive tools to turn research into actionable protocols."
      className="bg-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="gradient-border p-8 mb-12"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 flex flex-col items-center md:items-start gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center text-black font-bold text-2xl">
              TN
            </div>
            <p className="font-bold text-foreground">{founder.name}</p>
            <p className="text-xs font-mono text-accent-cyan uppercase tracking-widest">{founder.title}</p>
          </div>
          <div className="flex-1 space-y-3">
            {founder.bio.map((para, i) => (
              <p key={i} className="text-sm text-foreground/80 leading-relaxed">{para}</p>
            ))}
            <div className="flex items-start gap-3 pt-3 border-t border-border mt-4">
              <Quote className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
              <p className="text-sm italic text-muted-foreground">{founder.quote}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-6"
          >
            <p.icon className="w-6 h-6 text-accent-cyan mb-4" />
            <h3 className="font-bold mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="gradient-border p-6">
          <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-wider mb-3">Currently Covered</p>
          <ul className="space-y-2">
            {scopeNote.covered.map((item) => (
              <li key={item} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="text-accent-emerald shrink-0">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="gradient-border p-6">
          <p className="text-[10px] font-mono text-accent-amber uppercase tracking-wider mb-3">Planned / Advanced (Roadmap)</p>
          <ul className="space-y-2">
            {scopeNote.planned.map((item) => (
              <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent-amber shrink-0">○</span> {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-caption mt-4 border-t border-border pt-3">
            Advanced interventions like rapamycin require physician supervision. TNiC will document evidence and risks — never promote unsupervised use.
          </p>
        </div>
      </div>

      <p className="text-xs text-caption text-center mt-8 font-mono">
        Last reviewed: June 2026 · Content version 1.2 · Evidence tiers re-evaluated quarterly
      </p>
    </SectionShell>
  );
}