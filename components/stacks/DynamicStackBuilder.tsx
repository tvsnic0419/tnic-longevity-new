'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { analyzeStack } from '@/lib/stack-analysis';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StackBuilder } from './StackBuilder';
import { SynergyScorePanel } from './SynergyScorePanel';
import { StackInteractionsPanel } from './StackInteractionsPanel';
import { StackMechanismPanel } from './StackMechanismPanel';

export function DynamicStackBuilder() {
  const { selected, score, selectedCompounds } = useStack();
  const analysis = analyzeStack(selected);

  const amDose = selectedCompounds.filter((c) => c.timing === 'AM' || c.timing === 'AM/PM');
  const pmDose = selectedCompounds.filter((c) => c.timing === 'PM');

  return (
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
  );
}