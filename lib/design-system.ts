/** TNiC Design System v2 — tokens, themes, component variants */

export type ThemeAccent = 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose';

export const palette = {
  dark: {
    base: '#030712',
    elevated: '#0a0f1a',
    cyan: '#22d3ee',
    emerald: '#34d399',
    violet: '#a78bfa',
    rose: '#fb7185',
    amber: '#fbbf24',
  },
  light: {
    base: '#f8fafc',
    elevated: '#ffffff',
    cyan: '#0891b2',
    emerald: '#059669',
    violet: '#7c3aed',
    rose: '#e11d48',
    amber: '#d97706',
  },
} as const;

export const themes: Record<
  ThemeAccent,
  { text: string; bg: string; bgSolid: string; border: string; glow: string; dot: string; cssVar: string; sectionBadge: string }
> = {
  cyan: {
    text: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    bgSolid: 'bg-accent-cyan',
    border: 'border-accent-cyan/30',
    glow: 'section-glow-cyan',
    dot: 'bg-accent-cyan',
    cssVar: 'var(--accent-cyan)',
    sectionBadge: 'section-badge-cyan',
  },
  emerald: {
    text: 'text-accent-emerald',
    bg: 'bg-accent-emerald/10',
    bgSolid: 'bg-accent-emerald',
    border: 'border-accent-emerald/30',
    glow: 'section-glow-emerald',
    dot: 'bg-accent-emerald',
    cssVar: 'var(--accent-emerald)',
    sectionBadge: 'section-badge-emerald',
  },
  amber: {
    text: 'text-accent-amber',
    bg: 'bg-accent-amber/10',
    bgSolid: 'bg-accent-amber',
    border: 'border-accent-amber/30',
    glow: 'section-glow-amber',
    dot: 'bg-accent-amber',
    cssVar: 'var(--accent-amber)',
    sectionBadge: 'section-badge-amber',
  },
  violet: {
    text: 'text-accent-violet',
    bg: 'bg-accent-violet/10',
    bgSolid: 'bg-accent-violet',
    border: 'border-accent-violet/30',
    glow: 'section-glow-violet',
    dot: 'bg-accent-violet',
    cssVar: 'var(--accent-violet)',
    sectionBadge: 'section-badge-violet',
  },
  rose: {
    text: 'text-accent-rose',
    bg: 'bg-accent-rose/10',
    bgSolid: 'bg-accent-rose',
    border: 'border-accent-rose/30',
    glow: 'section-glow-rose',
    dot: 'bg-accent-rose',
    cssVar: 'var(--accent-rose)',
    sectionBadge: 'section-badge-rose',
  },
};

export const statusColors = {
  optimal: { text: 'text-accent-emerald', bg: 'badge-optimal', border: 'border-accent-emerald/25' },
  watch: { text: 'text-accent-amber', bg: 'badge-watch', border: 'border-accent-amber/25' },
  critical: { text: 'text-accent-rose', bg: 'badge-critical', border: 'border-accent-rose/25' },
  info: { text: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/25' },
} as const;

export const spacing = {
  pageY: 'py-16 md:py-24 lg:py-28',
  sectionY: 'py-16 md:py-24 lg:py-32',
  container: 'container-page',
  stackSm: 'space-y-3',
  stackMd: 'space-y-6',
  stackLg: 'space-y-10',
  gapGrid: 'gap-4 md:gap-6 lg:gap-8',
} as const;

export const type = {
  pageTitle: 'heading-page',
  sectionTitle: 'heading-section',
  cardTitle: 'heading-card',
  body: 'text-body',
  bodySm: 'text-body-sm',
  caption: 'text-caption',
  label: 'text-label',
  mono: 'font-mono',
} as const;

/** Button size variants (shadcn-aligned) */
export const buttonSizes = {
  sm: 'px-3 py-2 text-xs min-h-[2.25rem]',
  md: 'px-5 py-3 text-sm min-h-[var(--space-touch)]',
  lg: 'px-6 py-3.5 text-base min-h-[3rem]',
} as const;

/** Card variants */
export const cardVariants = {
  default: 'glass rounded-xl',
  elevated: 'card-elevated',
  outline: 'border border-border bg-card rounded-xl',
  scientific: 'card-base border-l-2 border-l-accent-cyan',
} as const;