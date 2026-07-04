'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, HelpCircle, Flag, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import {
  gettingStartedSteps,
  glossary,
  consumerFAQ,
  outcomeMilestones,
  supplementRedFlags,
} from '@/lib/data';
import { usePlatform } from '@/context/PlatformContext';
import { getHubContext } from '@/lib/hub-context';

const tabs = [
  { id: 'start', label: 'Start Here', icon: MapPin },
  { id: 'glossary', label: 'Glossary', icon: BookOpen },
  { id: 'outcomes', label: 'What to Expect', icon: ArrowRight },
  { id: 'redflags', label: 'Red Flags', icon: Flag },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
] as const;

type TabId = (typeof tabs)[number]['id'];

const faqCategories = [
  { id: 'all', label: 'All' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'safety', label: 'Safety' },
  { id: 'science', label: 'Science' },
  { id: 'products', label: 'Products' },
] as const;

export function LearnCenter({ defaultTab }: { defaultTab?: TabId }) {
  const { checklist, toggleChecklist } = usePlatform();
  const [tab, setTab] = useState<TabId>(defaultTab ?? 'start');
  const [faqFilter, setFaqFilter] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<string | null>(consumerFAQ[0].id);
  const [openTerm, setOpenTerm] = useState<string | null>(glossary[0].term);

  const filteredFaq = faqFilter === 'all'
    ? consumerFAQ
    : consumerFAQ.filter((f) => f.category === faqFilter);

  return (
    <SectionShell
      id="learn"
      mod="MOD-LRN-09"
      theme="cyan"
      badge="Consumer Intelligence"
      title="Learn Before You Stack"
      subtitle="Intelligent consumers ask hard questions. TNiC answers them openly — from first-time basics to supplement industry red flags. Quick answers also live at /faq."
      context={getHubContext('learn')}
      mesh
      className="bg-background"
    >
      <div className="flex flex-wrap gap-2 mb-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              tab === t.id ? 'bg-accent-cyan text-black' : 'glass text-muted-foreground hover:text-foreground'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {gettingStartedSteps.map((step) => {
              const done = checklist.includes(String(step.step));
              return (
                <div
                  key={step.step}
                  className={`gradient-border p-6 flex items-start gap-5 glass-hover group ${
                    done ? 'opacity-70' : ''
                  }`}
                >
                  <label className="flex items-center shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleChecklist(String(step.step))}
                      className="sr-only"
                    />
                    <span className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${
                      done ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-accent-cyan/10 text-accent-cyan'
                    }`}>
                      {done ? '✓' : step.step}
                    </span>
                  </label>
                  <a href={step.link} className="flex-1 block">
                    <h3 className={`font-bold group-hover:text-accent-cyan transition-colors ${done ? 'line-through text-muted-foreground' : ''}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  </a>
                  <a href={step.link} className="shrink-0 mt-1">
                    <ArrowRight className="w-5 h-5 text-caption group-hover:text-accent-cyan transition-colors" />
                  </a>
                </div>
              );
            })}

            {/* Supplement guide links */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Compound-specific guides</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {([
                  { href: '/longevity-supplements-guide', label: 'Best Supplements 2026', desc: 'Master ranked guide' },
                  { href: '/nad-supplement-guide', label: 'NAD+ Guide', desc: 'NMN vs NR, dosing, decline curve' },
                  { href: '/glynac-supplement-guide', label: 'GlyNAC Guide', desc: '9 hallmarks reversed — Sekhar 2021' },
                  { href: '/spermidine-supplement-guide', label: 'Spermidine Guide', desc: 'ITP data + autophagy mechanism' },
                  { href: '/berberine-supplement-guide', label: 'Berberine Guide', desc: "Nature's Ozempic — honest review" },
                  { href: '/taurine-supplement-guide', label: 'Taurine Guide', desc: 'Singh 2023 Science paper' },
                  { href: '/sulforaphane-supplement-guide', label: 'Sulforaphane Guide', desc: 'NRF2 activation protocol' },
                  { href: '/supplement-guides', label: 'All Guide Index →', desc: 'Hub for all compound guides' },
                ] as const).map((g) => (
                  <a
                    key={g.href}
                    href={g.href}
                    className="group flex items-center justify-between gap-2 p-3 rounded-xl glass glass-hover transition"
                  >
                    <div>
                      <p className="font-medium text-xs text-foreground">{g.label}</p>
                      <p className="text-xs text-muted-foreground">{g.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'glossary' && (
          <motion.div
            key="glossary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 gap-3"
          >
            {glossary.map((g) => (
              <button
                key={g.term}
                onClick={() => setOpenTerm(openTerm === g.term ? null : g.term)}
                className={`text-left rounded-xl transition-all ${
                  openTerm === g.term ? 'gradient-border p-5' : 'glass p-5 glass-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-accent-cyan">{g.term}</h3>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openTerm === g.term ? 'rotate-180' : ''}`} />
                </div>
                {openTerm === g.term && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                    <p className="text-sm text-foreground/80 mb-2">{g.simple}</p>
                    <p className="text-xs text-muted-foreground border-t border-border pt-2">
                      <span className="text-accent-cyan font-mono">Why it matters: </span>{g.why}
                    </p>
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {tab === 'outcomes' && (
          <motion.div
            key="outcomes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <p className="text-sm text-muted-foreground glass rounded-xl p-4 border border-accent-cyan/10">
              TNiC sets realistic expectations. Anyone promising overnight biological age reversal is not credible.
              Here is what peer-reviewed timelines actually show.
            </p>
            {outcomeMilestones.map((m, i) => (
              <div key={m.week} className="flex gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-accent-cyan" />
                  {i < outcomeMilestones.length - 1 && (
                    <div className="w-px flex-1 bg-accent-cyan/20 mt-2" />
                  )}
                </div>
                <div className="gradient-border p-6 flex-1 mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-accent-cyan">{m.week}</span>
                    <h3 className="font-bold">{m.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {m.expectations.map((e) => (
                      <li key={e} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-accent-cyan shrink-0">→</span> {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'redflags' && (
          <motion.div
            key="redflags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground mb-6">
              The supplement industry is largely unregulated. TNiC acts as your filter —
              here is what to reject before you spend a dollar.
            </p>
            {supplementRedFlags.map((r, i) => (
              <div key={r.flag} className="glass rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-lg bg-accent-rose/10 text-accent-rose font-mono text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-accent-rose mb-2">{r.flag}</h3>
                    <p className="text-sm text-muted-foreground mb-2"><span className="text-muted-foreground">Why: </span>{r.why}</p>
                    <p className="text-sm text-accent-emerald/80"><span className="text-accent-emerald font-mono text-xs">ACTION → </span>{r.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'faq' && (
          <motion.div
            key="faq"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFaqFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    faqFilter === cat.id ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'glass text-muted-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredFaq.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl overflow-hidden ${openFaq === item.id ? 'gradient-border' : 'glass'}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-sm pr-4">{item.question}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openFaq === item.id ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 mx-5">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}