'use client';

import Link from 'next/link';
import {
  Shield,
  HardDrive,
  Scale,
  FileText,
  Download,
  BadgeCheck,
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

const badges = [
  { icon: BadgeCheck, label: 'Tier A/B/C graded',  desc: 'Human trial honesty',      href: '/trust/methodology', accent: 'emerald' },
  { icon: HardDrive,  label: 'Local-first data',    desc: 'No accounts required',     href: '/trust/disclaimers', accent: 'cyan' },
  { icon: Scale,      label: 'No shop bias',         desc: 'Intelligence, not inventory', href: '/shop',           accent: 'amber' },
  { icon: FileText,   label: 'MDX + PMID cited',    desc: 'Traceable sources',        href: '/library',           accent: 'violet' },
  { icon: Download,   label: 'Export your data',    desc: 'CSV & JSON kit',           href: '/dashboard',         accent: 'cyan' },
  { icon: Shield,     label: 'Evidence-first',      desc: 'Est. 2025',                href: '/trust',             accent: 'emerald' },
] as const;

const accentClasses: Record<string, { icon: string; hover: string; hoverBg: string }> = {
  emerald: { icon: 'text-accent-emerald', hover: 'group-hover:text-accent-emerald', hoverBg: 'hover:bg-accent-emerald/8 hover:border-accent-emerald/30' },
  cyan:    { icon: 'text-accent-cyan',    hover: 'group-hover:text-accent-cyan',    hoverBg: 'hover:bg-accent-cyan/8 hover:border-accent-cyan/30' },
  amber:   { icon: 'text-accent-amber',   hover: 'group-hover:text-accent-amber',   hoverBg: 'hover:bg-accent-amber/8 hover:border-accent-amber/30' },
  violet:  { icon: 'text-accent-violet',  hover: 'group-hover:text-accent-violet',  hoverBg: 'hover:bg-accent-violet/8 hover:border-accent-violet/30' },
};

export function HomepageTrustStrip() {
  return (
    <section aria-label="Trust indicators" className="border-b border-border bg-card/30">
      <div className="container-page py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {badges.map((badge) => {
            const ac = accentClasses[badge.accent];
            return (
              <TiltCard key={badge.label}>
              <Link
                href={badge.href}
                className={`focus-ring card-ultra card-ultra-hover rounded-xl p-4 text-center transition-all group block h-full ${ac.hoverBg}`}
              >
                <badge.icon
                  className={`w-5 h-5 ${ac.icon} mx-auto mb-2 group-hover:scale-110 transition-transform`}
                  aria-hidden="true"
                />
                <p className={`text-xs font-semibold leading-tight transition-colors ${ac.hover}`}>{badge.label}</p>
                <p className="text-caption font-mono mt-1">{badge.desc}</p>
              </Link>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
