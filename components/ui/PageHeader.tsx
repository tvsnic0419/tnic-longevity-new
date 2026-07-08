import type { LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { themes } from '@/lib/design-system';
import { ContextRail } from '@/components/ui/ContextRail';

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
  theme?: ThemeAccent;
  as?: 'h1' | 'h2';
  align?: 'center' | 'left';
  id?: string;
}

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  meta,
  context,
  theme = 'cyan',
  as: Tag = 'h1',
  align = 'center',
  id,
}: PageHeaderProps) {
  const t = themes[theme];
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <header className={`mb-10 md:mb-12 max-w-4xl ${alignClass} section-header-mesh relative`}>
      <div className="inline-flex items-center gap-2 card-ultra rounded-full px-4 py-2.5 mb-5 text-body-sm">
        <Icon className={`w-4 h-4 ${t.text}`} aria-hidden="true" />
        <span className="text-foreground/90">{eyebrow}</span>
      </div>
      <Tag id={id} className="heading-page mb-4">{title}</Tag>
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
          className={`mt-8 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}
        />
      )}
    </header>
  );
}