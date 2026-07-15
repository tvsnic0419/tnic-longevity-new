import { ShieldCheck, ShieldAlert, FlaskConical } from 'lucide-react';
import type { PeptideLegalStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const legalStatusMeta: Record<
  PeptideLegalStatus,
  {
    label: string;
    short: string;
    description: string;
    icon: typeof ShieldCheck;
    className: string;
    bannerClassName: string;
    iconClassName: string;
  }
> = {
  'fda-approved-rx': {
    label: 'FDA-Approved Prescription Drug',
    short: 'FDA-Approved Rx',
    description: 'Approved by the FDA for a specific indication. Legal use requires a prescription and pharmacy dispensing — the anti-aging/longevity use discussed here is off-label.',
    icon: ShieldCheck,
    className: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/30',
    bannerClassName: 'border-accent-emerald/30 bg-accent-emerald/5',
    iconClassName: 'text-accent-emerald',
  },
  'compounding-restricted': {
    label: 'No Legal US Compounding Pathway',
    short: 'Compounding Restricted',
    description: 'Not FDA-approved for human use, and the FDA has explicitly excluded this substance from the bulk-drug list that lets compounding pharmacies dispense it. Sold almost exclusively as an unregulated research chemical.',
    icon: ShieldAlert,
    className: 'text-accent-rose bg-accent-rose/10 border-accent-rose/30',
    bannerClassName: 'border-accent-rose/30 bg-accent-rose/5',
    iconClassName: 'text-accent-rose',
  },
  'research-use-only': {
    label: 'Research Use Only — No FDA-Approved Human Use',
    short: 'Research Use Only',
    description: 'No FDA-approved pathway for human use. Sold by research-chemical vendors labeled "not for human consumption" — a real legal designation, not a formality. Purity and dosing accuracy are not independently regulated.',
    icon: FlaskConical,
    className: 'text-accent-amber bg-accent-amber/10 border-accent-amber/30',
    bannerClassName: 'border-accent-amber/30 bg-accent-amber/5',
    iconClassName: 'text-accent-amber',
  },
};

export function PeptideLegalBadge({
  status,
  size = 'md',
  className,
}: {
  status: PeptideLegalStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const meta = legalStatusMeta[status];
  const Icon = meta.icon;
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-2.5 py-1.5 gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-semibold rounded border',
        meta.className,
        sizeStyles[size],
        className,
      )}
      title={meta.description}
    >
      <Icon className={cn(size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5')} aria-hidden="true" />
      {meta.short}
    </span>
  );
}

export function getPeptideLegalStatusMeta(status: PeptideLegalStatus) {
  return legalStatusMeta[status];
}
