'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FlaskConical,
  Layers,
  Scan,
  Library,
  Calculator,
  ChevronUp,
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

const tools = [
  { href: '/dashboard', label: 'OS', icon: LayoutDashboard },
  { href: '/stacks', label: 'Stack', icon: Layers },
  { href: '/labs', label: 'Labs', icon: FlaskConical },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/tools?tab=healthspan', label: 'Scan', icon: Scan },
  { href: '/tools', label: 'Tools', icon: Calculator },
] as const;

export function ToolsDock() {
  const { score, selected } = usePlatform();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="tools-dock-shell card-ultra overflow-hidden">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-muted/50 transition"
              aria-expanded={expanded}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-accent-emerald">LONGEVITY OS</span>
                {selected.length > 0 && (
                  <span className="text-[10px] font-mono bg-accent-violet/20 text-accent-violet px-2 py-0.5 rounded-full">
                    {selected.length} · {score}
                  </span>
                )}
              </div>
              <ChevronUp
                className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap justify-center gap-1 px-2 pb-2">
                    {tools.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        onClick={() => setExpanded(false)}
                        className="tools-dock-item focus-ring flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-semibold text-muted-foreground hover:text-accent-emerald transition min-w-[64px]"
                      >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}