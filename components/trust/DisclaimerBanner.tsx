import { AlertTriangle, Info, Scale } from 'lucide-react';
import type { DisclaimerBlock } from '@/lib/types';

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
    <aside
      className={`card-base p-4 md:p-5 border ${style.border} ${style.bg}`}
      role="note"
      aria-label={`Disclaimer: ${disclaimer.title}`}
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${style.text}`} aria-hidden="true" />
        <div>
          <h4 className={`heading-card mb-1 ${style.text}`}>{disclaimer.title}</h4>
          <p className="text-body-sm">{disclaimer.body}</p>
          {showAppliesTo && disclaimer.appliesTo.length > 0 && (
            <p className="text-caption mt-2">
              Applies to: {disclaimer.appliesTo.join(' · ')}
            </p>
          )}
        </div>
      </div>
    </aside>
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