'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Unlock } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { roadmap } from '@/lib/data';

export function FutureSection() {
  const [expanded, setExpanded] = useState(0);

  return (
    <SectionShell
      id="future"
      mod="MOD-HZN-06"
      theme="violet"
      badge="Horizon Engine"
      title="What Comes Next"
      subtitle="Each milestone unlocks a new intelligence layer. Expand any phase to preview the technical specification."
      className="bg-[#0a0f1a]/60"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {roadmap.map((item, i) => {
          const isOpen = expanded === i;
          return (
            <motion.div
              key={i}
              layout
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                item.active
                  ? 'gradient-border'
                  : 'glass'
              }`}
            >
              <button
                onClick={() => setExpanded(isOpen ? -1 : i)}
                className="w-full flex items-center gap-4 p-6 text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.active ? 'bg-accent-violet/20' : 'bg-muted'
                }`}>
                  {item.active ? (
                    <Unlock className="w-5 h-5 text-accent-violet" />
                  ) : (
                    <Lock className="w-5 h-5 text-caption" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-mono text-xs ${item.active ? 'text-accent-violet' : 'text-muted-foreground'}`}>
                      {item.phase}
                    </span>
                    {item.active && (
                      <span className="text-[10px] bg-accent-violet/20 text-accent-violet px-2 py-0.5 rounded-full font-semibold">
                        LIVE
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{item.desc}</p>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                        <p className="text-[10px] font-mono text-accent-violet uppercase tracking-wider mb-3">
                          Technical Specification
                        </p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {item.specs.map((spec) => (
                            <div
                              key={spec}
                              className="flex items-center gap-2 text-xs text-foreground/80 glass rounded-lg px-3 py-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-accent-violet shrink-0" />
                              {spec}
                            </div>
                          ))}
                        </div>
                        {!item.active && (
                          <Link
                            href="/trust/updates#next-up"
                            className="mt-4 inline-block text-xs text-accent-violet hover:text-accent-cyan transition-colors font-semibold focus-ring rounded"
                          >
                            See what&apos;s next →
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}