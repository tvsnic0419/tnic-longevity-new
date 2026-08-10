import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { themes } from '@/lib/design-system';
import { cn } from '@/lib/utils';
import { ContextRail } from '@/components/ui/ContextRail';
import { CellularDivider } from '@/components/ui/CellularDivider';

interface PageHeaderContext {
  what: string;
  why: string;
  next?: string;
}

interface PageHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  context?: PageHeaderContext;
  /** See ContextRail's own variant doc — 'cards' (default) or 'compact'. */
  contextVariant?: 'cards' | 'compact';
  theme?: ThemeAccent;
  as?: 'h1' | 'h2';
  align?: 'center' | 'left';
  /**
   * Render the header inside a themed cinematic hero panel — an animated
   * ambient accent field + dot grid behind the content, so entering a hub
   * reads as an "arrival" moment. Opt-in; default keeps the plain header.
   */
  cinematic?: boolean;
  id?: string;
}

/** Hub accent → [primary, secondary] field colors for the cinematic backdrop. */
const fieldAccents: Record<ThemeAccent, [string, string]> = {
  cyan: ['var(--accent-cyan)', 'var(--accent-emerald)'],
  emerald: ['var(--accent-emerald)', 'var(--accent-cyan)'],
  violet: ['var(--accent-violet)', 'var(--accent-cyan)'],
  rose: ['var(--accent-rose)', 'var(--accent-amber)'],
  amber: ['var(--accent-amber)', 'var(--accent-rose)'],
};

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  meta,
  context,
  contextVariant,
  theme = 'cyan',
  as: Tag = 'h1',
  align = 'center',
  cinematic = false,
  id,
}: PageHeaderProps) {
  const t = themes[theme];
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const [fieldA, fieldB] = fieldAccents[theme];

  const inner = (
    <>
      {align === 'center' && <CellularDivider className="!-top-3" />}
      <div className="inline-flex items-center gap-2 card-ultra rounded-full px-4 py-2.5 mb-5 text-body-sm">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.dot} animate-pulse-glow`} aria-hidden="true" />
        <Icon className={`w-4 h-4 ${t.text}`} aria-hidden="true" />
        <span className="font-mono text-xs tracking-wide text-foreground/90 uppercase">{eyebrow}</span>
      </div>
      <Tag id={id} className="heading-page mb-4">{title}</Tag>
      <div
        className={`heading-accent-rule mb-5 ${align === 'center' ? 'is-center' : ''}`}
        aria-hidden="true"
      />
      <p className={`text-body max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>{description}</p>
      {meta && (
        <p className={`text-label mt-4 ${t.text}`}>{meta}</p>
      )}
      {context && (
        <ContextRail
          what={context.what}
          why={context.why}
          next={context.next}
          theme={theme}
          variant={contextVariant}
          className={`mt-8 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}
        />
      )}
    </>
  );

  if (cinematic) {
    return (
      <header
        className={cn(
          'section-header-mesh relative isolate overflow-hidden mb-10 md:mb-12',
          'rounded-3xl border px-6 py-12 md:px-10 md:py-16',
          t.border,
          alignClass,
          align === 'center' ? 'max-w-4xl' : 'max-w-5xl',
        )}
      >
        <div
          className="hub-hero-field"
          style={{ '--flair-accent': fieldA, '--flair-accent-2': fieldB } as CSSProperties}
          aria-hidden="true"
        >
          <div className="hub-hero-grid" />
        </div>
        <div className="relative z-10">{inner}</div>
      </header>
    );
  }

  return (
    <header className={`mb-10 md:mb-12 max-w-4xl ${alignClass} section-header-mesh relative`}>
      {inner}
    </header>
  );
}
