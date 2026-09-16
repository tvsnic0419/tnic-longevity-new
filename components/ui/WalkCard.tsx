import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { themes, type ThemeAccent } from '@/lib/design-system';
import { cn } from '@/lib/utils';

export interface WalkItem {
  href: string;
  kicker: string;
  title: string;
  detail: string;
  accent?: ThemeAccent;
}

/**
 * One destination in the walk graph — related compound, hallmark, protocol,
 * lab. Shared by ContinueTrail and in-page related rails so a neighbor looks
 * like a neighbor, not a leftover text list.
 */
export function WalkCard({
  href,
  kicker,
  title,
  detail,
  accent = 'cyan',
  className,
}: WalkItem & { className?: string }) {
  const t = themes[accent];

  return (
    <Link
      href={href}
      className={cn('walk-card focus-ring group', className)}
      style={{ '--walk-accent': t.cssVar } as CSSProperties}
    >
      <p className="walk-card__kicker">{kicker}</p>
      <p className="walk-card__title">{title}</p>
      <p className="walk-card__detail">{detail}</p>
      <span className="walk-card__go" aria-hidden="true">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export function ContinueTrail({
  items,
  eyebrow = 'Continue',
  title = 'Walk from here.',
}: {
  items: WalkItem[];
  eyebrow?: string;
  title?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="continue-trail" aria-labelledby="continue-trail-heading">
      <div className="continue-trail__intro">
        <p className="text-label text-accent-cyan">{eyebrow}</p>
        <h2 id="continue-trail-heading" className="heading-section">
          {title}
        </h2>
        <div className="heading-accent-rule mt-3" aria-hidden="true" />
      </div>
      <div className="continue-trail__grid">
        {items.map((item) => (
          <WalkCard key={`${item.href}-${item.title}`} {...item} />
        ))}
      </div>
    </section>
  );
}
