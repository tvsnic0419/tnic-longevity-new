import type { CSSProperties, ReactNode } from 'react';
import { Scale, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AnswerBox — the site's "bottom line" primitive: the crisp, citable answer,
 * pulled to the top of a decision page so it lands in the first screen of
 * server-rendered HTML.
 *
 * Two readers depend on this. A human scanning a comparison or "best for"
 * page wants the verdict before the table. And AI answer engines (Perplexity,
 * ChatGPT, Google AI Overviews) quote the first confident, self-contained
 * sentence they find — so the answer must be prose, high-contrast, and above
 * the fold, not buried below a metric grid.
 *
 * This is a server component (no hooks, no 'use client') so the answer text is
 * present in the initial HTML. The answer renders as a semantic <p>; when a
 * `question` is given it renders as an <h2> heading immediately above the
 * answer, matching the exact search query the page targets. Children must be
 * phrasing content only (text + inline elements like an EvidenceTag span) —
 * never block-level nodes — because the answer is a paragraph.
 */

type AnswerAccent = 'emerald' | 'cyan' | 'violet' | 'amber';

const accentToken: Record<AnswerAccent, string> = {
  emerald: 'var(--accent-emerald)',
  cyan: 'var(--accent-cyan)',
  violet: 'var(--accent-violet)',
  amber: 'var(--accent-amber)',
};

const accentText: Record<AnswerAccent, string> = {
  emerald: 'text-accent-emerald',
  cyan: 'text-accent-cyan',
  violet: 'text-accent-violet',
  amber: 'text-accent-amber',
};

interface AnswerBoxProps {
  /** The answer itself — phrasing content only (rendered inside a <p>). */
  children: ReactNode;
  /** Mono kicker above the answer. */
  label?: string;
  /** The question this answers — rendered as an <h2> matching search intent. */
  question?: string;
  /** Leading icon in the accent badge. Defaults to Scale (verdict/weighing). */
  icon?: LucideIcon;
  /** Accent hue — defaults to emerald, the site's "choose / advance" signal. */
  accent?: AnswerAccent;
  /** Optional muted attribution / caveat line under the answer. */
  footnote?: ReactNode;
  /** Anchor id for the section (deep-linking). */
  id?: string;
  className?: string;
}

export function AnswerBox({
  children,
  label = 'The bottom line',
  question,
  icon: Icon = Scale,
  accent = 'emerald',
  footnote,
  id,
  className,
}: AnswerBoxProps) {
  const token = accentToken[accent];

  return (
    <section
      id={id}
      className={cn('premium-card p-5 sm:p-6', className)}
      style={{ ['--card-accent' as string]: token } as CSSProperties}
      aria-label={question ? undefined : label}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
          style={{
            color: token,
            background: `color-mix(in srgb, ${token} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${token} 30%, transparent)`,
          }}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className={cn('text-label', accentText[accent])}>{label}</p>
      </div>

      {question && (
        <h2 className="heading-card mb-2 text-foreground">{question}</h2>
      )}

      <p className="text-base leading-relaxed font-medium text-foreground [text-wrap:pretty] md:text-lg">
        {children}
      </p>

      {footnote && (
        <p className="mt-3 border-t border-border/40 pt-3 text-caption text-muted-foreground">
          {footnote}
        </p>
      )}
    </section>
  );
}
