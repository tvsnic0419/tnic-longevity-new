'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartPulse, ArrowRight, GitBranch, FlaskConical } from 'lucide-react';
import { ContextRail } from '@/components/ui/ContextRail';
import { getModulePath } from '@/lib/library-modules';
import { lifestylePillarOrder, lifestylePillars } from '@/lib/lifestyle-pillars';
import { libraryModules } from '@/lib/library-modules';
import { themes } from '@/lib/design-system';

const pillarCardStyles: Record<string, { grad: string; hover: string; iconBadge: string }> = {
  cyan: {
    grad: 'from-accent-cyan/[0.07]',
    hover: 'glow-hover-cyan',
    iconBadge: 'icon-badge-cyan',
  },
  emerald: {
    grad: 'from-accent-emerald/[0.07]',
    hover: 'glow-hover-emerald',
    iconBadge: 'icon-badge-emerald',
  },
  amber: {
    grad: 'from-accent-amber/[0.07]',
    hover: 'glow-hover-amber',
    iconBadge: 'icon-badge-amber',
  },
  violet: {
    grad: 'from-accent-violet/[0.07]',
    hover: 'glow-hover-violet',
    iconBadge: 'icon-badge-violet',
  },
};

export function LifestylePillarsHub() {
  const modules = lifestylePillarOrder.map((slug) =>
    libraryModules.find((m) => m.category === 'lifestyle' && m.slug === slug),
  ).filter(Boolean);

  return (
    <section
      id="lifestyle-pillars"
      aria-labelledby="lifestyle-heading"
      className="py-8 md:py-12 border-b border-border section-mesh section-glow-amber"
    >
      <div className="container-page">
        <div className="text-center mb-8 section-header-mesh">
          <p className="text-label text-accent-amber mb-2">Lifestyle Pillars</p>
          <h2 id="lifestyle-heading" className="heading-section">
            Four protocols that outrank most supplements
          </h2>
          <p className="text-body-sm mt-3 max-w-2xl mx-auto">
            Sleep, exercise, nutrition, and stress recovery — each mapped to hallmarks, decision trees, lab tie-ins, and stack prerequisites.
          </p>
        </div>

        <ContextRail
          what="Evidence-graded lifestyle protocols with hallmark decision trees and biomarker tracking."
          why="Compounds provide substrate; lifestyle provides the signal and schedule. Fix pillars before escalating spend."
          next="Start with Sleep (#1 priority), then Exercise. Log labs at baseline and checkpoint weeks."
          theme="amber"
          className="mb-10 max-w-4xl mx-auto"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod, i) => {
            if (!mod) return null;
            const pillar = lifestylePillars[mod.slug as keyof typeof lifestylePillars];
            const t = themes[pillar.accent];
            const cardStyle = pillarCardStyles[pillar.accent];

            return (
              <motion.div
                key={mod.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={getModulePath(mod)}
                  className={[
                    'focus-ring group block h-full card-premium p-5',
                    'bg-gradient-to-br to-transparent',
                    cardStyle.grad,
                    cardStyle.hover,
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cardStyle.iconBadge}`}>
                      <HeartPulse className={`w-4 h-4 ${t.text}`} aria-hidden="true" />
                    </div>
                    <span className="os-card-number">#{pillar.priority}</span>
                  </div>

                  <h3 className="font-bold text-base mb-1 group-hover:text-accent-cyan transition">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{pillar.headline}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-md ${t.bg} ${t.text} border ${t.border}`}>
                      <GitBranch className="w-3 h-3" aria-hidden="true" />
                      Decision tree
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/50">
                      <FlaskConical className="w-3 h-3" aria-hidden="true" />
                      {pillar.labTieIns.length} labs
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-sm font-semibold ${t.text} group-hover:gap-2 transition-all`}>
                    Open protocol <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}