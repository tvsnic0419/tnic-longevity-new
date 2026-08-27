'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sun, Moon, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { analyzeStack } from '@/lib/stack-analysis';
import { buildShopStackUrl } from '@/lib/stack-url';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';
import { StackBuilder } from './StackBuilder';
import { SynergyScorePanel } from './SynergyScorePanel';
import { StackInteractionsPanel } from './StackInteractionsPanel';
import { StackMechanismPanel } from './StackMechanismPanel';

export function DynamicStackBuilder() {
  const { selected, score, selectedCompounds } = useStack();
  const analysis = analyzeStack(selected);

  const amDose = selectedCompounds.filter((c) => c.timing === 'AM' || c.timing === 'AM/PM');
  const pmDose = selectedCompounds.filter((c) => c.timing === 'PM');
  const shopHref = buildShopStackUrl(selected);
  const openShop = (surface: 'readiness_bridge' | 'mobile_tray') => {
    trackEvent(ANALYTICS_EVENTS.stackShopOpened, {
      surface,
      compounds: selected.length,
      hallmarks: analysis.hallmarkCount,
      score,
    });
  };

  return (
    <div className={selected.length > 0 ? 'pb-24 lg:pb-0' : undefined}>
      {selected.length > 0 && (
        <section
          aria-labelledby="stack-readiness-title"
          className="mb-6 overflow-hidden rounded-2xl border border-accent-amber/30 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--accent-amber)_13%,transparent),color-mix(in_srgb,var(--accent-violet)_8%,transparent))] p-5 md:p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-label flex items-center gap-2 text-accent-amber"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Stack readiness</p>
              <h3 id="stack-readiness-title" className="mt-2 font-display text-2xl font-medium tracking-tight text-foreground">Your stack is ready for a buyer-grade review.</h3>
              <p className="mt-1.5 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">Review form, dose anchors, and COA demands for the compounds you selected. This checklist supports product due diligence; it does not determine personal suitability.</p>
            </div>
            <Link
              href={shopHref}
              onClick={() => openShop('readiness_bridge')}
              className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-amber px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-accent-amber/90"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Verify {selected.length} {selected.length === 1 ? 'compound' : 'compounds'}
            </Link>
          </div>
          <dl className="mt-5 grid grid-cols-3 divide-x divide-accent-amber/20 rounded-xl border border-accent-amber/20 bg-black/10 text-center">
            <div className="px-3 py-3"><dt className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Compounds</dt><dd className="mt-1 font-mono text-lg font-bold text-foreground">{selected.length}</dd></div>
            <div className="px-3 py-3"><dt className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Hallmarks</dt><dd className="mt-1 font-mono text-lg font-bold text-foreground">{analysis.hallmarkCount}/12</dd></div>
            <div className="px-3 py-3"><dt className="text-micro font-mono uppercase tracking-[0.12em] text-muted-foreground">Stack score</dt><dd className="mt-1 font-mono text-lg font-bold text-foreground">{score}/100</dd></div>
          </dl>
        </section>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7">
        <StackBuilder title="Build your protocol" />
      </div>

      <div className="lg:col-span-5 space-y-5">
        <SynergyScorePanel score={score} analysis={analysis} />

        <AnimatePresence mode="wait">
          {selected.length > 0 ? (
            <motion.div
              key={selected.join(',')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <StackInteractionsPanel analysis={analysis} />

              <StackMechanismPanel />

              <GlassPanel depth="mid" className="rounded-2xl p-5">
                <p className="text-label text-muted-foreground mb-3">Dosing protocol</p>
                <div className="space-y-3">
                  {amDose.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-accent-amber text-xs font-semibold mb-1.5">
                        <Sun className="w-3.5 h-3.5" aria-hidden="true" /> AM
                      </div>
                      {amDose.map((c) => (
                        <div
                          key={c.id}
                          className="flex justify-between text-sm py-1 border-b border-border last:border-0"
                        >
                          <span className="text-[var(--color-text-secondary)]">{c.name}</span>
                          <span className="font-mono text-micro text-muted-foreground">{c.dose}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {pmDose.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-accent-violet text-xs font-semibold mb-1.5">
                        <Moon className="w-3.5 h-3.5" aria-hidden="true" /> PM
                      </div>
                      {pmDose.map((c) => (
                        <div
                          key={c.id}
                          className="flex justify-between text-sm py-1 border-b border-border last:border-0"
                        >
                          <span className="text-[var(--color-text-secondary)]">{c.name}</span>
                          <span className="font-mono text-micro text-muted-foreground">{c.dose}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlassPanel>

              <p className="rounded-xl border border-border/60 bg-card/35 px-4 py-3 text-caption leading-relaxed text-muted-foreground">
                Your selected compounds, scoring, and interaction context stay visible here while you review the buyer checklist.
              </p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassPanel depth="mid" className="rounded-2xl p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Toggle compounds to see real-time synergy and safety analysis.
                </p>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      {selected.length > 0 && (
        <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden">
          <Link
            href={shopHref}
            onClick={() => openShop('mobile_tray')}
            className="focus-ring flex items-center justify-between gap-3 rounded-2xl border border-accent-amber/45 bg-[color-mix(in_srgb,var(--color-bg-base)_88%,var(--accent-amber)_12%)] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.36)] backdrop-blur-xl"
          >
            <span className="min-w-0 text-left">
              <span className="block text-micro font-mono uppercase tracking-[0.12em] text-accent-amber">{selected.length} {selected.length === 1 ? 'compound' : 'compounds'} · {analysis.hallmarkCount}/12 hallmarks</span>
              <span className="mt-0.5 block text-sm font-semibold text-foreground">Verify your active stack</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-accent-amber px-3 py-2 text-xs font-bold text-black">Review <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" /></span>
          </Link>
        </div>
      )}
    </div>
  );
}