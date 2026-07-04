'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Pill, Activity, Stethoscope, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import type { LabRecommendation } from '@/lib/lab-analysis';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { usePlatform } from '@/context/PlatformContext';

const hallmarkSlug = (id: string) => hallmarkLibrary.find((h) => h.id === id)?.slug ?? id;

const categoryMeta = {
  compound:   { icon: Pill,        label: 'Compound',   color: 'var(--accent-violet)' },
  lifestyle:  { icon: Activity,    label: 'Lifestyle',  color: 'var(--accent-cyan)' },
  monitoring: { icon: Lightbulb,   label: 'Monitoring', color: 'var(--accent-amber)' },
  clinical:   { icon: Stethoscope, label: 'Clinical',   color: 'var(--accent-rose)' },
};

const priorityMeta = {
  high:   { label: 'HIGH',   color: 'var(--accent-rose)' },
  medium: { label: 'MEDIUM', color: 'var(--accent-amber)' },
  low:    { label: 'LOW',    color: 'var(--muted-foreground)' },
};

interface LabRecommendationsProps {
  recommendations: LabRecommendation[];
}

export function LabRecommendations({ recommendations }: LabRecommendationsProps) {
  const { toggle, selected } = usePlatform();

  if (recommendations.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground text-sm">Log lab data to unlock personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => {
        const cat = categoryMeta[rec.category];
        const pri = priorityMeta[rec.priority];
        const Icon = cat.icon;
        const inStack = rec.compoundId && selected.includes(rec.compoundId);

        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-xl p-5 border border-border"
            style={{
              borderColor: rec.priority === 'high'
                ? 'color-mix(in srgb, var(--accent-rose) 25%, transparent)'
                : rec.priority === 'medium'
                  ? 'color-mix(in srgb, var(--accent-amber) 15%, transparent)'
                  : undefined,
              background: rec.priority === 'high'
                ? 'color-mix(in srgb, var(--accent-rose) 4%, transparent)'
                : undefined,
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ background: `color-mix(in srgb, ${cat.color} 12%, transparent)` }}
              >
                <Icon className="w-4 h-4" style={{ color: cat.color }} />
              </div>

              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h4 className="font-semibold text-sm">{rec.title}</h4>

                  {/* Priority badge */}
                  <span
                    className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full"
                    style={{
                      color: pri.color,
                      background: `color-mix(in srgb, ${pri.color} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${pri.color} 25%, transparent)`,
                    }}
                  >
                    {pri.label}
                  </span>

                  {/* Category chip */}
                  <span
                    className="text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded"
                    style={{
                      color: cat.color,
                      background: `color-mix(in srgb, ${cat.color} 8%, transparent)`,
                    }}
                  >
                    {cat.label}
                  </span>

                  {inStack && (
                    <span className="text-[9px] font-mono text-accent-emerald bg-accent-emerald/10 px-1.5 py-0.5 rounded border border-accent-emerald/20">
                      in stack
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-1.5 leading-relaxed">{rec.rationale}</p>
                <p className="text-xs text-foreground/70 leading-relaxed">{rec.action}</p>

                {/* Add to stack CTA */}
                {rec.compoundId && !inStack && (
                  <button
                    onClick={() => toggle(rec.compoundId!)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      color: 'var(--accent-rose)',
                      background: 'color-mix(in srgb, var(--accent-rose) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--accent-rose) 20%, transparent)',
                    }}
                  >
                    <Plus className="w-3 h-3" />
                    Add to active stack
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {/* Hallmark tags */}
                {rec.hallmarkIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {rec.hallmarkIds.map((h) => (
                      <Link
                        key={h}
                        href={`/library/${hallmarkSlug(h)}`}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors"
                        style={{
                          color: 'var(--accent-cyan)',
                          background: 'color-mix(in srgb, var(--accent-cyan) 8%, transparent)',
                          border: '1px solid color-mix(in srgb, var(--accent-cyan) 15%, transparent)',
                        }}
                      >
                        #{h}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
