import Link from 'next/link';
import { Dna, FlaskConical, Scale, Layers, BookOpen, ArrowRight } from 'lucide-react';
import type { NextBestItem, NextBestType } from '@/lib/next-best';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { cn } from '@/lib/utils';

const typeIcon: Record<NextBestType, typeof Dna> = {
  hallmark: Dna,
  compound: FlaskConical,
  comparison: Scale,
  stack: Layers,
  guide: BookOpen,
};

const typeLabel: Record<NextBestType, string> = {
  hallmark: 'Hallmark',
  compound: 'Compound',
  comparison: 'Comparison',
  stack: 'Elite Stack',
  guide: 'Guide',
};

/**
 * NextBestRail — the "no dead ends" component. Renders a small set of
 * contextual links to related entities (hallmark ↔ compound ↔ comparison ↔
 * stack ↔ guide), computed server-side from the interlink graph
 * (`lib/next-best.ts`) and passed in as lightweight, serializable props.
 *
 * Every entity page — compound, hallmark, comparison, and supplement guide —
 * ends with this rail so a visitor always has a next, real step.
 */
export function NextBestRail({
  items,
  title = 'Continue exploring',
  className,
}: {
  items: NextBestItem[];
  title?: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="next-best-heading" className={cn('rounded-xl border border-border bg-card/40 p-6 md:p-8', className)}>
      <div className="flex items-center gap-2 mb-4">
        <ArrowRight className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
        <h2 id="next-best-heading" className="text-label">
          {title}
        </h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = typeIcon[item.type];
          return (
            <li key={`${item.type}:${item.slug}`}>
              <Link
                href={item.href}
                className="focus-ring interactive group flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 hover:border-accent-cyan/40 hover:bg-accent-cyan/5 transition-colors"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-cyan transition-colors" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-caption text-muted-foreground">{item.meta ?? typeLabel[item.type]}</p>
                  <p className="text-body-sm font-medium text-foreground group-hover:text-accent-cyan transition-colors truncate">
                    {item.title}
                  </p>
                </div>
                {item.evidence && <EvidenceTag tier={item.evidence} size="sm" className="shrink-0" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
