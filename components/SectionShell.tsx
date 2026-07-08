'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { ThemeAccent } from '@/lib/design-system';
import { themes } from '@/lib/design-system';
import { ContextRail } from '@/components/ui/ContextRail';

interface SectionContext {
  what: string;
  why: string;
  next?: string;
}

interface SectionShellProps {
  id: string;
  mod?: string;
  theme: ThemeAccent;
  title: string;
  subtitle: string;
  badge: string;
  context?: SectionContext;
  children: ReactNode;
  className?: string;
  mesh?: boolean;
}

export function SectionShell({
  id,
  mod,
  theme,
  title,
  subtitle,
  badge,
  context,
  children,
  className = '',
  mesh = false,
}: SectionShellProps) {
  const t = themes[theme];

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`py-16 md:py-24 lg:py-32 relative ${t.glow} ${mesh ? 'section-mesh' : ''} ${className}`}
    >
      <div className="aurora-beams" aria-hidden="true" />
      <div className="section-divider absolute top-0 left-0 right-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" aria-hidden="true" />

      {/* Corner bracket ornaments */}
      <div className="bracket-corner bracket-corner-tl" aria-hidden="true" />
      <div className="bracket-corner bracket-corner-br" aria-hidden="true" />

      <div className="relative container-page">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14 section-spotlight"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {mod && (
                  <span className={`text-label ${t.text} opacity-60 hidden sm:inline font-mono`}>{mod}</span>
                )}
                <span className={t.sectionBadge}>
                  <span className={`w-1.5 h-1.5 rounded-full ${t.dot} animate-pulse-glow`} aria-hidden="true" />
                  {badge}
                </span>
              </div>
              <h2 id={`${id}-heading`} className="heading-section mb-3">{title}</h2>
              <p className="text-body">{subtitle}</p>
            </div>
          </div>
          {context && (
            <ContextRail
              what={context.what}
              why={context.why}
              next={context.next}
              theme={theme}
              className="mt-8"
            />
          )}
        </motion.header>

        {children}
      </div>
    </section>
  );
}