'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { HALLMARK_VISUALS } from './HallmarkVisuals';

interface ContextualProps {
  className?: string;
  showContext?: boolean;
  contextLevel?: 'brief' | 'detailed';
}

const CONFIGS: Record<string, {
  number: number;
  title: string;
  accentColor: string;
  accentClass: string;
  borderHover: string;
  tagBg: string;
  summary: string;
  crossLinks: Array<{ color: string; text: string }>;
  tags: string[];
  leverage: string;
}> = {
  genomic: {
    number: 1, title: 'Genomic Instability', accentColor: 'cyan',
    accentClass: 'text-cyan-400', borderHover: 'hover:border-cyan-400/30',
    tagBg: 'bg-cyan-400/10 text-cyan-400',
    leverage: 'Core Driver',
    summary: 'DNA damage accumulates faster than repair after ~age 40. PARP consumes NAD⁺; NRF2/glutathione intercept oxidative adducts. Primary amplifier of downstream hallmarks.',
    crossLinks: [
      { color: 'text-emerald-400', text: '→ Mito link: Excess ROS from dysfunctional mitochondria accelerates DNA lesions.' },
      { color: 'text-violet-400', text: '→ Senescence link: Unrepaired damage triggers p53/p21 senescence programs.' },
      { color: 'text-amber-400', text: '→ GlyNAC impact: Strongly reduces 8-OHdG and γ-H2AX (multi-hallmark protection).' },
    ],
    tags: ['NAD⁺ • PARP', 'NRF2 • GSH', '8-OHdG ↓'],
  },
  telomeres: {
    number: 2, title: 'Telomere Attrition', accentColor: 'amber',
    accentClass: 'text-amber-400', borderHover: 'hover:border-amber-400/30',
    tagBg: 'bg-amber-400/10 text-amber-400',
    leverage: 'Downstream',
    summary: 'Chromosome end-caps shorten with every cell division. Critically short telomeres activate DNA damage checkpoints and trigger senescence.',
    crossLinks: [
      { color: 'text-rose-400', text: '→ Senescence link: Short telomeres trigger p53/p21 senescence and SASP.' },
      { color: 'text-violet-400', text: '→ Epigenetic link: Telomere loss accelerates epigenetic clock drift.' },
      { color: 'text-amber-400', text: '→ Spermidine protects telomere integrity via autophagy enhancement.' },
    ],
    tags: ['Telomerase', 'ATM/ATR', 'Spermidine'],
  },
  epigenetic: {
    number: 3, title: 'Epigenetic Alterations', accentColor: 'violet',
    accentClass: 'text-violet-400', borderHover: 'hover:border-violet-400/30',
    tagBg: 'bg-violet-400/10 text-violet-400',
    leverage: 'Central Hub',
    summary: 'The methylation clock drifts as NAD⁺-dependent sirtuins and TET/KDM dioxygenases decline. Ca-AKG and NMN have the broadest reprogramming potential.',
    crossLinks: [
      { color: 'text-emerald-400', text: '→ Mito link: SIRT1/SIRT3 regulate mitochondrial biogenesis via PGC-1α.' },
      { color: 'text-cyan-400', text: '→ Genomic link: Epigenetic silencing impairs DNA repair gene expression.' },
      { color: 'text-violet-400', text: '→ Ca-AKG + NMN: Highest cross-hallmark reprogramming reach.' },
    ],
    tags: ['SIRT1 • NAD⁺', 'Ca-AKG • TET', 'Methylation clock'],
  },
  proteostasis: {
    number: 4, title: 'Loss of Proteostasis', accentColor: 'violet',
    accentClass: 'text-violet-400', borderHover: 'hover:border-violet-400/30',
    tagBg: 'bg-violet-400/10 text-violet-400',
    leverage: 'Moderate',
    summary: 'Misfolded proteins accumulate and overwhelm the ubiquitin-proteasome system. GSH depletion is the central driver — GlyNAC directly restores it.',
    crossLinks: [
      { color: 'text-emerald-400', text: '→ Mito link: Damaged mitochondrial proteins overload UPS throughput.' },
      { color: 'text-cyan-400', text: '→ Autophagy link: Impaired autophagy (H5) reduces alternative clearance.' },
      { color: 'text-violet-400', text: '→ GlyNAC: Only Tier A compound to simultaneously restore GSH + UPS.' },
    ],
    tags: ['GSH • GlyNAC', 'UPS • Proteasome', 'Protein aggregates'],
  },
  autophagy: {
    number: 5, title: 'Disabled Autophagy', accentColor: 'cyan',
    accentClass: 'text-cyan-400', borderHover: 'hover:border-cyan-400/30',
    tagBg: 'bg-cyan-400/10 text-cyan-400',
    leverage: 'High Leverage',
    summary: 'Hyperactivated mTOR halts lysosomal recycling. Damaged organelles and proteins accumulate. AMPK activation and fasting are the most potent restorers.',
    crossLinks: [
      { color: 'text-emerald-400', text: '→ Mito link: PINK1-Parkin mitophagy failure amplifies mitochondrial dysfunction.' },
      { color: 'text-violet-400', text: '→ Proteostasis link: Impaired autophagy reduces protein aggregate clearance.' },
      { color: 'text-cyan-400', text: '→ NMN activates AMPK → ULK1 → autophagy initiation.' },
    ],
    tags: ['mTOR • ULK1', 'AMPK • Beclin-1', 'Mitophagy'],
  },
  mito: {
    number: 6, title: 'Mitochondrial Dysfunction', accentColor: 'emerald',
    accentClass: 'text-emerald-400', borderHover: 'hover:border-emerald-400/30',
    tagBg: 'bg-emerald-400/10 text-emerald-400',
    leverage: 'Highest Stack Coverage',
    summary: 'NAD⁺ depletion starves SIRT3/PGC-1α. Damaged mitochondria leak ROS and fail mitophagy. Central bottleneck that amplifies almost every other hallmark.',
    crossLinks: [
      { color: 'text-cyan-400', text: '→ Genomic link: Mitochondrial ROS is a major driver of oxidative DNA damage.' },
      { color: 'text-rose-400', text: '→ Inflammation link: mtDNA leakage and ROS activate NLRP3 inflammasome.' },
      { color: 'text-violet-400', text: '→ GlyNAC + NMN: Protects mitochondria while restoring biogenesis (highest leverage).' },
    ],
    tags: ['NAD⁺ • SIRT3', 'PGC-1α • Mitophagy', 'ROS ↓'],
  },
  senescence: {
    number: 7, title: 'Cellular Senescence', accentColor: 'rose',
    accentClass: 'text-rose-400', borderHover: 'hover:border-rose-400/30',
    tagBg: 'bg-rose-400/10 text-rose-400',
    leverage: 'High Cascade',
    summary: 'Senescent cells refuse to die, secreting SASP cytokines (IL-6, IL-8, TNF-α) that age neighboring tissue. Fisetin clears them; Quercetin suppresses SASP.',
    crossLinks: [
      { color: 'text-rose-400', text: '→ Inflammation link: SASP drives chronic inflammaging (H10) systemically.' },
      { color: 'text-violet-400', text: '→ Stem cell link: SASP disrupts stem cell niches (H8), reducing regeneration.' },
      { color: 'text-amber-400', text: '→ Fisetin: Only Tier B senolytic with human pilot data (Mayo Clinic trial).' },
    ],
    tags: ['SASP • p21', 'Fisetin • senolytic', 'IL-6 ↓'],
  },
  stem: {
    number: 8, title: 'Stem Cell Exhaustion', accentColor: 'violet',
    accentClass: 'text-violet-400', borderHover: 'hover:border-violet-400/30',
    tagBg: 'bg-violet-400/10 text-violet-400',
    leverage: 'Downstream',
    summary: 'Regenerative capacity declines as stem pools deplete. SIRT1 and NAD⁺ maintain quiescence — their loss drives premature differentiation and self-renewal failure.',
    crossLinks: [
      { color: 'text-violet-400', text: '→ Epigenetic link: Epigenetic drift (H3) drives premature stem cell differentiation.' },
      { color: 'text-rose-400', text: '→ Senescence link: SASP from senescent cells (H7) directly impairs niches.' },
      { color: 'text-emerald-400', text: '→ NMN + Ca-AKG: Restores NAD⁺ and epigenetic marks for stem maintenance.' },
    ],
    tags: ['SIRT1 • NAD⁺', 'Self-renewal', 'Niche signaling'],
  },
  communication: {
    number: 9, title: 'Intercellular Communication', accentColor: 'amber',
    accentClass: 'text-amber-400', borderHover: 'hover:border-amber-400/30',
    tagBg: 'bg-amber-400/10 text-amber-400',
    leverage: 'Integrator',
    summary: 'Paracrine signals, exosomal cargo, and endocrine factors degrade. GDF11/GDF15, klotho, and gap junction communication all deteriorate with age.',
    crossLinks: [
      { color: 'text-rose-400', text: '→ SASP amplification: Senescent cells (H7) distort communication via cytokines.' },
      { color: 'text-violet-400', text: '→ Stem cell link: Distorted signals impair stem cell niche maintenance (H8).' },
      { color: 'text-amber-400', text: '→ Omega-3 + Pterostilbene: Best-evidence communication-modulating compounds.' },
    ],
    tags: ['Exosomes', 'GDF11 • Klotho', 'Gap junctions'],
  },
  inflammation: {
    number: 10, title: 'Chronic Inflammation', accentColor: 'rose',
    accentClass: 'text-rose-400', borderHover: 'hover:border-rose-400/30',
    tagBg: 'bg-rose-400/10 text-rose-400',
    leverage: 'High Cascade',
    summary: 'Persistent NF-κB activation creates a tissue-degrading inflammatory milieu. Inflammaging accelerates all other hallmarks — a systemic amplifier.',
    crossLinks: [
      { color: 'text-amber-400', text: '→ Telomere link: Inflammaging accelerates telomere shortening (H2) significantly.' },
      { color: 'text-violet-400', text: '→ Epigenetic link: NF-κB-driven cytokines alter methylation patterns (H3).' },
      { color: 'text-rose-400', text: '→ Omega-3 (Tier A): Strongest evidence for systemic inflammaging resolution.' },
    ],
    tags: ['NF-κB • IL-6', 'Omega-3 • Quercetin', 'Inflammaging'],
  },
  dysbiosis: {
    number: 11, title: 'Dysbiosis', accentColor: 'emerald',
    accentClass: 'text-emerald-400', borderHover: 'hover:border-emerald-400/30',
    tagBg: 'bg-emerald-400/10 text-emerald-400',
    leverage: 'Upstream Driver',
    summary: 'Loss of Akkermansia and beneficial Lactobacillus reduces SCFA production, increasing intestinal permeability (leaky gut) and systemic LPS translocation.',
    crossLinks: [
      { color: 'text-rose-400', text: '→ Inflammation link: LPS from dysbiosis directly activates NF-κB → inflammaging (H10).' },
      { color: 'text-emerald-400', text: '→ Mito link: Gut-derived butyrate supports mitochondrial biogenesis (H6).' },
      { color: 'text-amber-400', text: '→ Spermidine + Taurine: Both support Akkermansia growth and SCFA production.' },
    ],
    tags: ['SCFAs • Akkermansia', 'LPS • Leaky gut', 'Spermidine'],
  },
  nutrient: {
    number: 12, title: 'Deregulated Nutrient Sensing', accentColor: 'amber',
    accentClass: 'text-amber-400', borderHover: 'hover:border-amber-400/30',
    tagBg: 'bg-amber-400/10 text-amber-400',
    leverage: 'Master Regulator',
    summary: 'Chronic mTOR overactivation suppresses autophagy and TFEB, while AMPK and sirtuins decline. Berberine and caloric restriction are the top restorers.',
    crossLinks: [
      { color: 'text-cyan-400', text: '→ Autophagy link: mTOR hyperactivation is the primary autophagy suppressor (H5).' },
      { color: 'text-violet-400', text: '→ Proteostasis link: mTOR suppresses TFEB → impairs lysosomal clearance (H4).' },
      { color: 'text-amber-400', text: '→ Berberine (Tier B): Activates AMPK as potently as Metformin in human trials.' },
    ],
    tags: ['mTOR • AMPK', 'IGF-1 • Sirtuins', 'Berberine'],
  },
};

function ContextualCard({ id, className, showContext = true, contextLevel = 'detailed' }: { id: string } & ContextualProps) {
  const cfg = CONFIGS[id];
  if (!cfg) return null;
  const Visual = HALLMARK_VISUALS[id];

  return (
    <div className={cn(
      'group rounded-2xl border border-white/10 bg-[#0a0f1a] p-6 transition-all duration-200',
      cfg.borderHover,
      'hover:shadow-2xl',
      className,
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={cn('text-xs uppercase tracking-[2px] mb-0.5 opacity-70', cfg.accentClass)}>Hallmark {cfg.number}</div>
          <h3 className={cn('text-xl font-semibold text-white')}>{cfg.title}</h3>
        </div>
        <div className={cn('text-right text-xs px-2 py-1 rounded-full', cfg.tagBg)}>{cfg.leverage}</div>
      </div>

      {Visual && <Visual className="w-full mb-6" accentColor={cfg.accentColor} />}

      {showContext && (
        <div className="space-y-4 text-sm text-white/80">
          <p className="leading-relaxed">{cfg.summary}</p>
          {contextLevel === 'detailed' && (
            <div className="pt-3 border-t border-white/10 text-xs space-y-1.5 text-white/70">
              {cfg.crossLinks.map((link, i) => (
                <div key={i}><span className={link.color}>{link.text}</span></div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-white/60">
        {cfg.tags.map((tag) => (
          <span key={tag} className="rounded bg-white/5 px-2 py-0.5">{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* Named exports for every hallmark */
export const ContextualGenomicInstability: React.FC<ContextualProps> = (p) => <ContextualCard id="genomic" {...p} />;
export const ContextualTelomereAttrition: React.FC<ContextualProps> = (p) => <ContextualCard id="telomeres" {...p} />;
export const ContextualEpigeneticAlterations: React.FC<ContextualProps> = (p) => <ContextualCard id="epigenetic" {...p} />;
export const ContextualProteostasis: React.FC<ContextualProps> = (p) => <ContextualCard id="proteostasis" {...p} />;
export const ContextualAutophagy: React.FC<ContextualProps> = (p) => <ContextualCard id="autophagy" {...p} />;
export const ContextualMitochondrialDysfunction: React.FC<ContextualProps> = (p) => <ContextualCard id="mito" {...p} />;
export const ContextualCellularSenescence: React.FC<ContextualProps> = (p) => <ContextualCard id="senescence" {...p} />;
export const ContextualStemCellExhaustion: React.FC<ContextualProps> = (p) => <ContextualCard id="stem" {...p} />;
export const ContextualIntercellularCommunication: React.FC<ContextualProps> = (p) => <ContextualCard id="communication" {...p} />;
export const ContextualChronicInflammation: React.FC<ContextualProps> = (p) => <ContextualCard id="inflammation" {...p} />;
export const ContextualDysbiosis: React.FC<ContextualProps> = (p) => <ContextualCard id="dysbiosis" {...p} />;
export const ContextualNutrientSensing: React.FC<ContextualProps> = (p) => <ContextualCard id="nutrient" {...p} />;
