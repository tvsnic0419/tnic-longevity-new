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
  /**
   * Heading level for the section title. Defaults to 'h2' — correct when the
   * shell is one section among several under a page-level <h1>. Pages that use
   * a single SectionShell as their *only* heading (e.g. /about) should pass
   * 'h1' so the page isn't left without a top-level heading (a WCAG 1.3.1 /
   * SEO defect).
   */
  headingLevel?: 'h1' | 'h2';
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
  headingLevel: HeadingTag = 'h2',
}: SectionShellProps) {
  const t = themes[theme];

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`py-16 md:py-24 lg:py-32 relative ${t.glow} ${mesh ? 'section-mesh' : ''} ${className}`}
    >
      <div className="section-divider absolute top-0 left-0 right-0" aria-hidden="true" />

      <div className="relative container-page">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
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
              <HeadingTag id={`${id}-heading`} className="heading-section mb-3">{title}</HeadingTag>
              <div className="heading-accent-rule mb-4" aria-hidden="true" />
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