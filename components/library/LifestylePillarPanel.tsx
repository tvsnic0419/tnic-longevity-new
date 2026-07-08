'use client';

import Link from 'next/link';
import { FlaskConical, Activity, GitBranch, ArrowRight } from 'lucide-react';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { biomarkers } from '@/lib/data';
import {
  getLabsDeepLink,
  getLifestylePillar,
  type LifestyleSlug,
} from '@/lib/lifestyle-pillars';
import { themes } from '@/lib/design-system';

interface LifestylePillarPanelProps {
  slug: LifestyleSlug;
}

export function LifestylePillarPanel({ slug }: LifestylePillarPanelProps) {
  const pillar = getLifestylePillar(slug);
  if (!pillar) return null;

  const t = themes[pillar.accent];

  return (
    <div className="space-y-5">
      <div className={`card-premium p-5 border ${t.border}`}>
        <p className={`text-label ${t.text} mb-2`}>Pillar priority #{pillar.priority}</p>
        <p className="text-sm font-semibold leading-snug mb-3">{pillar.headline}</p>
        <div className="flex items-start gap-2 rounded-xl p-3 bg-muted/30 border border-border/50">
          <GitBranch className={`w-4 h-4 ${t.text} shrink-0 mt-0.5`} aria-hidden="true" />
          <p className="text-xs text-muted-foreground leading-relaxed">{pillar.decisionSummary}</p>
        </div>
        <p className="text-caption mt-3">{pillar.stackPrerequisite}</p>
      </div>

      <div className="glass rounded-xl p-5">
        <p className={`text-label ${t.text} mb-3`}>Hallmark impact</p>
        <ul className="space-y-2.5">
          {pillar.hallmarkWeights.map((hw) => {
            const h = hallmarkLibrary.find((x) => x.id === hw.hallmarkId);
            return (
              <li key={hw.hallmarkId} className="text-xs">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <Link
                    href={h ? `/library/${h.slug}` : '/library'}
                    className="font-semibold text-foreground hover:text-accent-cyan transition"
                  >
                    {h ? `#${h.number} ${h.title}` : hw.hallmarkId}
                  </Link>
                  <span
                    className={[
                      'text-[9px] font-mono uppercase px-1.5 py-0.5 rounded',
                      hw.impact === 'primary'
                        ? `${t.bg} ${t.text} border ${t.border}`
                        : 'bg-muted/40 text-muted-foreground border border-border/50',
                    ].join(' ')}
                  >
                    {hw.impact}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{hw.mechanism}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className={`w-4 h-4 ${t.text}`} aria-hidden="true" />
          <p className={`text-label ${t.text}`}>Lab tie-ins</p>
        </div>
        <ul className="space-y-3">
          {pillar.labTieIns.map((lab) => {
            const marker = biomarkers.find((b) => b.id === lab.markerId);
            return (
              <li key={lab.markerId}>
                <Link
                  href={getLabsDeepLink(lab.markerId)}
                  className="focus-ring block rounded-lg p-3 border border-border/50 hover:border-accent-cyan/30 hover:bg-accent-cyan/5 transition group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold group-hover:text-accent-cyan transition">
                      {lab.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent-cyan transition" />
                  </div>
                  <p className="text-caption">
                    {lab.cadence} · Target {lab.target}
                    {marker ? ` · ${marker.unit}` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{lab.rationale}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className={`w-4 h-4 ${t.text}`} aria-hidden="true" />
          <p className={`text-label ${t.text}`}>Wearable signals</p>
        </div>
        <ul className="space-y-2">
          {pillar.wearableSignals.map((sig) => (
            <li key={sig.label} className="flex justify-between gap-3 text-xs">
              <span className="text-muted-foreground">{sig.label}</span>
              <span className="font-mono text-foreground/90 text-right">
                {sig.target}
                <span className="text-caption block">{sig.frequency}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}