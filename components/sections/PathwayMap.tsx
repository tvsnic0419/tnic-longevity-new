'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { pathways } from '@/lib/data';

export function PathwayMap() {
  const [active, setActive] = useState('nrf2');
  const node = pathways.find((p) => p.id === active)!;

  return (
    <SectionShell
      id="pathways"
      mod="MOD-PATH-01"
      theme="cyan"
      badge="Pathway Intelligence"
      title="The Defense Cascade"
      subtitle="Three interconnected systems govern cellular survival. Select a node to trace the full mechanistic cascade."
      className="bg-background"
    >
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] glass rounded-3xl p-6 overflow-hidden">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {pathways.map((p, i) => {
              if (i === pathways.length - 1) return null;
              const next = pathways[i + 1];
              return (
                <motion.line
                  key={`line-${p.id}`}
                  x1={p.x}
                  y1={p.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="url(#flowGrad)"
                  strokeWidth={active === p.id || active === next.id ? 0.8 : 0.3}
                  strokeDasharray="2 1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, opacity: active === p.id || active === next.id ? 1 : 0.3 }}
                  transition={{ duration: 1 }}
                />
              );
            })}

            {pathways.map((p) => (
              <g key={p.id} onClick={() => setActive(p.id)} className="cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active === p.id ? 8 : 6}
                  fill={active === p.id ? '#22d3ee' : '#1e293b'}
                  stroke={active === p.id ? '#22d3ee' : '#334155'}
                  strokeWidth={0.5}
                  className="transition-all duration-300"
                />
                {active === p.id && (
                  <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="#22d3ee" strokeWidth={0.3} opacity={0.5}>
                    <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill={active === p.id ? '#22d3ee' : '#71717a'}
                  fontSize="4"
                  fontWeight="bold"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            {pathways.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active === p.id ? 'bg-accent-cyan text-black' : 'glass text-muted-foreground hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="gradient-border p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-3xl font-bold">{node.label}</h3>
              {node.genes > 0 && (
                <span className="text-xs font-mono bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full">
                  {node.genes}+ genes
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">{node.summary}</p>

            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Mechanistic Cascade</p>
            <div className="space-y-3">
              {node.cascade.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-mono flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/80">{step}</span>
                  {i < node.cascade.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground/50 ml-auto shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}