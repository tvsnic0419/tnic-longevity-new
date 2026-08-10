import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ThemeAccent } from '@/lib/design-system';
import { themes } from '@/lib/design-system';

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  /**
   * Tints the top hairline + icon. Defaults to 'cyan' — pass the same accent
   * as the tile's own value color (e.g. 'emerald' for an evidence count that
   * already renders in emerald) so the rule and the number agree instead of
   * competing. Not a stand-in for evidence-tier grading — most metrics here
   * (bioavailability, dose, pathway) aren't tier-graded, only the compound as
   * a whole is, via the separate EvidenceTag above the tile grid.
   */
  accent?: ThemeAccent;
  children: React.ReactNode;
}

/**
 * Shared "at a glance" metric tile — was duplicated near-identically as a
 * local `Metric` in both CompoundGlancePanel and ModuleGlancePanel. A thin
 * top hairline in the tile's accent gives it an instrument-reading identity
 * at a glance, before any label is read. The value stays fully
 * caller-controlled (children) so short numeric readouts and longer text
 * values each keep whatever typography actually suits them.
 */
export function StatTile({ icon: Icon, label, accent = 'cyan', children }: StatTileProps) {
  const t = themes[accent];

  return (
    <div
      className="stat-instrument rounded-xl border border-border/60 p-4"
      style={{ '--flair-accent': t.cssVar } as CSSProperties}
    >
      <div className="flex items-center gap-1.5 text-label text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${t.text}`} aria-hidden="true" />
        {label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
