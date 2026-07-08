'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Scale, Eye, AlertTriangle, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { EvidenceTag, EvidenceTagLegend } from '@/components/trust/EvidenceTag';
import {
  evidenceStandards,
  selectionCriteria,
  transparencyPledge,
  safetyNotes,
  generalSafetyGuidance,
  compounds,
} from '@/lib/data';
import type { EvidenceTier } from '@/lib/types';

const tabs = [
  { id: 'standards', label: 'Evidence Standards', icon: Scale },
  { id: 'safety', label: 'Safety Center', icon: Shield },
  { id: 'transparency', label: 'Transparency', icon: Eye },
] as const;

type TabId = (typeof tabs)[number]['id'];

const tierBorder: Record<EvidenceTier, string> = {
  A: 'border-accent-emerald/30',
  B: 'border-accent-cyan/30',
  C: 'border-accent-amber/30',
};

export function TrustCenter() {
  const [tab, setTab] = useState<TabId>('standards');
  const [selectedSafety, setSelectedSafety] = useState(safetyNotes[0].compoundId);

  const compound = compounds.find((c) => c.id === selectedSafety) ?? compounds[0];
  const safety =
    safetyNotes.find((s) => s.compoundId === compound.id) ?? safetyNotes[0];

  return (
    <SectionShell
      id="trust"
      mod="MOD-TRU-08"
      theme="emerald"
      badge="Trust & Credibility"
      title="How TNiC Earns Your Trust"
      subtitle="Consumers deserve to know how recommendations are made, what the evidence actually says, and what safety limits apply. No black boxes."
      className="bg-[#0a0f1a]/60"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`focus-ring interactive flex items-center gap-2 px-5 py-3 min-h-[var(--space-touch)] rounded-xl text-sm font-semibold ${
                tab === t.id ? 'bg-accent-emerald text-black' : 'glass text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
        <Link
          href="/trust"
          className="focus-ring interactive text-sm font-semibold text-accent-emerald hover:text-accent-cyan inline-flex items-center gap-1 shrink-0"
        >
          Full Trust Hub <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'standards' && (
          <motion.div
            key="standards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EvidenceTagLegend className="mb-8" />
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {(['A', 'B', 'C'] as EvidenceTier[]).map((tier) => {
                const std = evidenceStandards.find((s) => s.tier === tier)!;
                return (
                  <div key={tier} className={`card-elevated p-6 border ${tierBorder[tier]}`}>
                    <EvidenceTag tier={tier} size="lg" className="mb-4" />
                    <h3 className="heading-card text-base mb-4">{std.label.split('—')[1]?.trim()}</h3>
                    <ul className="space-y-2 mb-4">
                      {std.criteria.map((c: string) => (
                        <li key={c} className="flex items-start gap-2 text-body-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" aria-hidden="true" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <p className="text-caption border-t border-border pt-3">
                      <span className="text-accent-emerald">Example: </span>{std.example}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] font-mono text-accent-emerald uppercase tracking-wider mb-4">
              5-Step Compound Selection Process
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {selectionCriteria.map((c) => (
                <div key={c.step} className="glass rounded-xl p-5">
                  <span className="font-mono text-accent-emerald text-xs">{c.step}</span>
                  <h4 className="font-bold text-sm mt-2 mb-2">{c.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'safety' && (
          <motion.div
            key="safety"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="gradient-border p-6 mb-8 border border-accent-amber/20 bg-accent-amber/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-2">General Safety Protocol</h3>
                  <ul className="space-y-2">
                    {generalSafetyGuidance.map((g) => (
                      <li key={g} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent-amber shrink-0">•</span> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {compounds.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedSafety(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedSafety === c.id
                      ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30'
                      : 'glass text-muted-foreground'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="gradient-border p-8">
              <h3 className="text-xl font-bold mb-1">{compound.name}</h3>
              <p className="text-xs text-muted-foreground mb-6">{compound.dose} · Evidence Tier {compound.evidence}</p>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-mono text-accent-amber uppercase mb-3">Cautions</p>
                  {safety.cautions.map((c) => (
                    <p key={c} className="text-sm text-muted-foreground mb-2 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-accent-amber shrink-0 mt-0.5" /> {c}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-mono text-accent-rose uppercase mb-3">Avoid If</p>
                  {safety.avoidIf.length > 0 ? safety.avoidIf.map((a) => (
                    <p key={a} className="text-sm text-muted-foreground mb-2">{a}</p>
                  )) : (
                    <p className="text-sm text-caption">No absolute contraindications listed</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-mono text-accent-cyan uppercase mb-3">Consult Physician If</p>
                  {safety.consultIf.map((c) => (
                    <p key={c} className="text-sm text-muted-foreground mb-2 flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" /> {c}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'transparency' && (
          <motion.div
            key="transparency"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {transparencyPledge.map((item, i) => (
              <div key={item.title} className="glass rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-emerald/10 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-accent-emerald" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                <span className="font-mono text-[10px] text-caption shrink-0">0{i + 1}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}