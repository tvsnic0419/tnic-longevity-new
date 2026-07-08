'use client';

import { platformStats } from '@/lib/platform-stats';
import { Shield, Dna, FlaskConical, BookOpen } from 'lucide-react';

const highlights = [
  { icon: Dna, text: '12 Hallmarks of Aging — full mechanistic coverage' },
  { icon: BookOpen, text: 'Every compound PMID-cited and Tier A/B/C graded' },
  { icon: FlaskConical, text: 'Biomarker tracking stays local — never on TNiC servers' },
  { icon: Shield, text: 'Affiliate links disclosed — intelligence, not inventory' },
] as const;

/** Infinite marquee of platform trust signals and live stats */
export function PlatformTicker() {
  const items = [
    ...platformStats.map((s) => `${s.value} ${s.label}`),
    ...highlights.map((h) => h.text),
  ];

  const doubled = [...items, ...items];

  return (
    <div className="platform-ticker border-y border-border bg-card/40 overflow-hidden" aria-hidden="true">
      <div className="platform-ticker-track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="platform-ticker-item">
            <span className="platform-ticker-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}