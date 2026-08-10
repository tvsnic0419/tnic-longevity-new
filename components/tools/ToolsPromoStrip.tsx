import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';
import { toolsRegistry } from '@/lib/registry';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface ToolsPromoStripProps {
  headline?: string;
  className?: string;
}

export function ToolsPromoStrip({
  headline = 'Turn library knowledge into action',
  className = '',
}: ToolsPromoStripProps) {
  return (
    <div className={`gradient-border p-6 md:p-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-accent-violet" aria-hidden="true" />
            <p className="text-label text-accent-violet">Interactive Tools</p>
          </div>
          {/* h2, not h3: this follows the page's <h1> directly (via
              PageHeader) on every hub that renders this strip, and
              `heading-section` is the design system's h2-level style. */}
          <h2 className="heading-section text-xl mb-2">{headline}</h2>
          <p className="text-body-sm text-muted-foreground">
            Evidence-graded simulators with disclaimers. Educational only — not medical advice.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
          {toolsRegistry.map((t) => (
            <GlassPanel key={t.id} depth="mid" className="glass-hover h-full rounded-xl">
              <Link
                href={t.href}
                className="focus-ring interactive block h-full rounded-xl p-3 text-center group"
              >
                <p className="text-xs font-semibold text-foreground/90 group-hover:text-accent-cyan transition-colors">
                  {t.label}
                </p>
                <p className="text-micro text-caption mt-0.5">{t.shortLabel}</p>
              </Link>
            </GlassPanel>
          ))}
        </div>
        <Link
          href="/tools"
          className="focus-ring interactive inline-flex items-center gap-2 shrink-0 text-sm font-semibold text-accent-violet hover:text-accent-emerald"
        >
          All tools <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}