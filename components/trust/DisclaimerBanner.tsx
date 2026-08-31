import { AlertTriangle, Info, Scale } from 'lucide-react';
import type { DisclaimerBlock } from '@/lib/types';
import { GlassPanel } from '@/components/ui/GlassPanel';

const severityStyle = {
  info: { icon: Info, border: 'border-accent-cyan/20', bg: 'bg-accent-cyan/5', text: 'text-cyan-300' },
  warning: { icon: AlertTriangle, border: 'border-accent-amber/25', bg: 'bg-accent-amber/5', text: 'text-amber-300' },
  legal: { icon: Scale, border: 'border-accent-rose/25', bg: 'bg-accent-rose/5', text: 'text-rose-300' },
};

interface DisclaimerBannerProps {
  disclaimer: DisclaimerBlock;
  showAppliesTo?: boolean;
}

export function DisclaimerBanner({ disclaimer, showAppliesTo = false }: DisclaimerBannerProps) {
  const style = severityStyle[disclaimer.severity];
  const Icon = style.icon;

  return (
    <GlassPanel depth="mid" className={`rounded-xl p-4 md:p-5 border ${style.border} ${style.bg}`}>
      <aside
        className="flex gap-3"
        role="note"
        aria-label={`Disclaimer: ${disclaimer.title}`}
      >
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${style.text}`} aria-hidden="true" />
        <div>
          {/* Styled label, not a document heading. This banner renders at
              varying depths (directly under an h1 on /peptides, below h3s on
              /trust), so a fixed h4 skipped heading levels wherever it landed.
              The `aria-label` on the enclosing role="note" already names the
              region, so nothing is lost by keeping it out of the outline. */}
          <p className={`heading-card mb-1 ${style.text}`}>{disclaimer.title}</p>
          <p className="text-body-sm">{disclaimer.body}</p>
          {showAppliesTo && disclaimer.appliesTo.length > 0 && (
            <p className="text-caption mt-2">
              Applies to: {disclaimer.appliesTo.join(' · ')}
            </p>
          )}
        </div>
      </aside>
    </GlassPanel>
  );
}

/** Compact inline disclaimer for exports and footers */
export function DisclaimerInline({ text }: { text: string }) {
  return (
    <p className="text-caption font-mono border-t border-border pt-3 mt-4" role="note">
      {text}
    </p>
  );
}