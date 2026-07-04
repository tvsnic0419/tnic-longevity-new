'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Scale,
  BookOpen,
  Route,
  FileText,
  History,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { PageShell } from '@/components/ui/PageShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { TabBar } from '@/components/ui/TabBar';
import { EvidenceTagLegend } from './EvidenceTag';
import { CitationList } from './CitationList';
import { CitationExportPanel } from './CitationExportPanel';
import { DisclaimerBanner } from './DisclaimerBanner';
import { JourneyTimeline } from './JourneyTimeline';
import { UpdateHistoryList } from './UpdateHistoryList';
import { MethodologySection } from './MethodologySection';
import { PersonalJourneyPanel } from './PersonalJourneyPanel';
import {
  citationFramework,
  citationRegistry,
  disclaimers,
  evidenceTagDefinitions,
  methodologySections,
  updateHistory,
} from '@/lib/trust';
import { journeyMilestones } from '@/lib/journey';
import { evidenceStandards, transparencyPledge } from '@/lib/data';
import type { EvidenceTier } from '@/lib/types';
import { EvidenceTag } from './EvidenceTag';
import { CheckCircle2 } from 'lucide-react';
import { ContextRail } from '@/components/ui/ContextRail';
import { getHubContext, getTrustTabContext } from '@/lib/hub-context';

type Tab = 'overview' | 'evidence' | 'citations' | 'journey' | 'methodology' | 'disclaimers' | 'updates';

const tabs = [
  { id: 'overview' as const, label: 'Overview', icon: Shield },
  { id: 'evidence' as const, label: 'Evidence', icon: Scale },
  { id: 'citations' as const, label: 'Citations', icon: BookOpen },
  { id: 'journey' as const, label: 'Journey', icon: Route },
  { id: 'methodology' as const, label: 'Methodology', icon: FileText },
  { id: 'disclaimers' as const, label: 'Disclaimers', icon: Eye },
  { id: 'updates' as const, label: 'History', icon: History },
];

const deepLinks = [
  { href: '/trust/methodology', label: 'Full Methodology', icon: FileText },
  { href: '/trust/disclaimers', label: 'All Disclaimers', icon: Eye },
  { href: '/trust/journey', label: 'Journey Timeline', icon: Route },
  { href: '/trust/updates', label: 'Update History', icon: History },
];

const tierBorder: Record<EvidenceTier, string> = {
  A: 'border-accent-emerald/30',
  B: 'border-accent-cyan/30',
  C: 'border-accent-amber/30',
};

export function TrustHub() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <PageShell>
      <PageHeader
        icon={Shield}
        eyebrow="Trust & Transparency Hub"
        title="How TNiC Earns Your Trust"
        description="Evidence tagging, source citations, methodology, disclaimers, and public update history. No black boxes — every recommendation is traceable."
        theme="emerald"
        meta={`${citationRegistry.length} indexed citations · Tier A/B/C grading · N=1 clearly labeled`}
        context={getHubContext('trust')}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {deepLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring interactive card-base p-4 flex items-center justify-between group hover:border-accent-emerald/30"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground/80 group-hover:text-accent-emerald">
                <Icon className="w-4 h-4" aria-hidden="true" />
                {link.label}
              </span>
              <ArrowRight className="w-4 h-4 text-caption group-hover:text-accent-emerald" aria-hidden="true" />
            </Link>
          );
        })}
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} theme="emerald" ariaLabel="Trust hub sections" className="mb-8" />

      <ContextRail {...getTrustTabContext(tab)} theme="emerald" className="mb-8 max-w-4xl" />

      <motion.div
        key={tab}
        role="tabpanel"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === 'overview' && (
          <div className="space-y-8 max-w-4xl">
            {/* Citation breakdown visual */}
            {(() => {
              const typeCounts = citationRegistry.reduce<Record<string, number>>((acc, c) => {
                acc[c.type] = (acc[c.type] ?? 0) + 1;
                return acc;
              }, {});
              const total = citationRegistry.length;
              const typeColors: Record<string, string> = {
                'clinical':     'var(--accent-emerald)',
                'meta-analysis':'var(--accent-cyan)',
                'review':       'var(--accent-violet)',
                'guideline':    'var(--accent-amber)',
                'preclinical':  'var(--accent-rose)',
              };
              const typeLabels: Record<string, string> = {
                'clinical': 'Clinical RCT', 'meta-analysis': 'Meta-analysis',
                'review': 'Review', 'guideline': 'Guideline', 'preclinical': 'Preclinical',
              };
              return (
                <div className="card-elevated border border-accent-emerald/25 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-label text-accent-emerald">Citation type breakdown</p>
                    <span className="font-mono text-2xl font-black text-accent-emerald">{total}</span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
                    {Object.entries(typeCounts).map(([type, count]) => (
                      <div
                        key={type}
                        style={{ flex: count, background: typeColors[type] ?? 'var(--accent-cyan)', opacity: 0.85 }}
                        title={`${typeLabels[type] ?? type}: ${count}`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {Object.entries(typeCounts).map(([type, count]) => (
                      <span key={type} className="flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: typeColors[type] ?? 'var(--accent-cyan)' }} />
                        <span className="text-muted-foreground">{typeLabels[type] ?? type}</span>
                        <span className="font-mono font-semibold" style={{ color: typeColors[type] }}>{count}</span>
                      </span>
                    ))}
                  </div>
                  <p className="text-caption mt-4 pt-4 border-t border-border/40 text-muted-foreground/50">
                    All citations are peer-reviewed. Tiers A/B/C assigned by literature strength and re-evaluated quarterly.
                  </p>
                </div>
              );
            })()}
            <EvidenceTagLegend />
            <div className="space-y-4">
              {transparencyPledge.map((item) => (
                <div key={item.title} className="card-base p-5 flex gap-4">
                  <Eye className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="heading-card mb-1">{item.title}</h3>
                    <p className="text-body-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <DisclaimerBanner disclaimer={disclaimers[0]} />
          </div>
        )}

        {tab === 'evidence' && (
          <div className="space-y-8 max-w-4xl">
            <p className="text-body-sm">
              Every compound, intervention, and stack recommendation carries an evidence tier. Tiers are assigned by literature review and re-evaluated quarterly.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {(['A', 'B', 'C'] as EvidenceTier[]).map((tier) => {
                const def = evidenceTagDefinitions[tier];
                const std = evidenceStandards.find((s) => s.tier === tier)!;
                return (
                  <div key={tier} className={`card-elevated p-6 border ${tierBorder[tier]}`}>
                    <EvidenceTag tier={tier} size="lg" className="mb-4" />
                    <h3 className="heading-card text-base mb-3">{def.label.split('—')[1]?.trim()}</h3>
                    <ul className="space-y-2 mb-4">
                      {std.criteria.map((c) => (
                        <li key={c} className="text-body-sm flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" aria-hidden="true" />
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
          </div>
        )}

        {tab === 'citations' && (
          <div className="space-y-8 max-w-4xl">
            <section>
              <h2 className="heading-section text-xl mb-4">Citation Principles</h2>
              <div className="space-y-3">
                {citationFramework.principles.map((p) => (
                  <div key={p.title} className="card-base p-4">
                    <h3 className="heading-card mb-1">{p.title}</h3>
                    <p className="text-body-sm">{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-label text-accent-emerald mb-3">Citation Formats</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {citationFramework.formats.map((f) => (
                  <div key={f.format} className="card-base p-4">
                    <p className="heading-card text-sm mb-1">{f.format}</p>
                    <p className="text-caption mb-2">{f.example}</p>
                    <p className="text-label">{f.use}</p>
                  </div>
                ))}
              </div>
            </section>
            <CitationExportPanel />
            <CitationList citations={citationRegistry} title="Citation Registry" />
          </div>
        )}

        {tab === 'journey' && (
          <div className="space-y-10 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-4">
              <DisclaimerBanner disclaimer={disclaimers[2]} />
              <div className="card-base p-5">
                <p className="text-label text-accent-emerald mb-2">Population Science</p>
                <p className="text-body-sm">
                  PubMed-cited mechanisms and clinical trial doses apply broadly — with evidence tiers shown on every surface.
                </p>
              </div>
            </div>
            <section>
              <h2 className="heading-section text-xl mb-6">TNiC Platform Journey</h2>
              <JourneyTimeline milestones={journeyMilestones} />
            </section>
            <section>
              <h2 className="heading-section text-xl mb-6">Your Personal Journey</h2>
              <PersonalJourneyPanel />
            </section>
          </div>
        )}

        {tab === 'methodology' && (
          <div className="max-w-4xl">
            {methodologySections.map((section) => (
              <MethodologySection key={section.id} {...section} />
            ))}
            <Link href="/trust/methodology" className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-accent-emerald hover:text-accent-cyan mt-6 rounded">
              Full methodology page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {tab === 'disclaimers' && (
          <div className="space-y-4 max-w-3xl">
            {disclaimers.map((d) => (
              <DisclaimerBanner key={d.id} disclaimer={d} showAppliesTo />
            ))}
          </div>
        )}

        {tab === 'updates' && (
          <div className="max-w-3xl">
            <UpdateHistoryList entries={updateHistory} />
            <Link href="/trust/updates" className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-accent-emerald hover:text-accent-cyan mt-6 rounded">
              Full changelog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </motion.div>
    </PageShell>
  );
}