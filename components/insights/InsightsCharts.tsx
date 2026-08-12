'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  TIER_SPLIT,
  TIER_ACCENT,
  HALLMARK_COVERAGE,
  BIOAVAILABILITY_RANK,
  DOSING_TIME,
  MOST_CITED,
} from '@/lib/insights';

/**
 * The "Longevity by the Numbers" charts. Every value is read from lib/insights
 * (which computes it from lib/data.ts / pathways / hallmarks), so nothing here
 * is a hand-typed figure. Marks follow the dataviz method: thin bars with 4px
 * rounded data-ends on a recessive track, tabular figures, one hue per chart
 * (magnitude) or the canonical evidence colors (status, always letter-labelled).
 * The category name and value are both printed on every row, so the data reads
 * without a hover tooltip.
 */

const DOSING_ACCENT: Record<string, string> = {
  AM: 'var(--accent-amber)',
  'AM/PM': 'var(--accent-cyan)',
  PM: 'var(--accent-violet)',
};

function ChartCard({
  eyebrow,
  title,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="premium-card rounded-2xl p-5 md:p-6" style={{ '--card-accent': 'var(--accent-cyan)' } as CSSProperties}>
      <p className="text-label text-accent-cyan mb-1.5">{eyebrow}</p>
      <h3 className="heading-card text-base mb-1">{title}</h3>
      <p className="text-caption text-muted-foreground mb-5">{note}</p>
      {children}
    </section>
  );
}

/** Horizontal magnitude bar — the shared mark for the ranked lists. */
function Bar({
  label,
  value,
  max,
  display,
  color,
  href,
  badge,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  color: string;
  href?: string;
  badge?: string;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, 1.5) : 0;
  const row = (
    <div className="group flex items-center gap-3 py-1.5">
      <span className="w-28 shrink-0 truncate text-body-sm text-foreground group-hover:text-accent-cyan transition-colors sm:w-36">
        {label}
      </span>
      <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
        <span
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </span>
      {badge && <span className="w-4 shrink-0 text-center font-mono text-micro font-bold" style={{ color }}>{badge}</span>}
      <span className="w-12 shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-foreground">
        {display}
      </span>
    </div>
  );
  return href ? (
    <Link href={href} className="focus-ring block rounded-md">
      {row}
    </Link>
  ) : (
    row
  );
}

/** Segmented proportion bar — one row, tier/timing shares with a 2px surface gap. */
function ProportionBar({
  slices,
}: {
  slices: { key: string; label: string; count: number; color: string; href?: string }[];
}) {
  const total = slices.reduce((s, x) => s + x.count, 0) || 1;
  return (
    <div>
      <div className="flex gap-[2px] mb-4 h-4 rounded-full overflow-hidden">
        {slices.map((s) => (
          <span
            key={s.key}
            className="h-full first:rounded-l-full last:rounded-r-full transition-opacity hover:opacity-80"
            style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
            title={`${s.label}: ${s.count}`}
          />
        ))}
      </div>
      <dl className="grid grid-cols-3 gap-2">
        {slices.map((s) => {
          const inner = (
            <div className="rounded-lg border border-border/60 px-2.5 py-2">
              <dt className="flex items-center gap-1.5 text-micro font-mono uppercase tracking-wide text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                {s.label}
              </dt>
              <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-foreground">
                {s.count}
                <span className="ml-1 text-caption font-normal text-muted-foreground">
                  {Math.round((s.count / total) * 100)}%
                </span>
              </dd>
            </div>
          );
          return s.href ? (
            <Link key={s.key} href={s.href} className="focus-ring interactive hover:border-accent-cyan/40 rounded-lg [&>div]:hover:border-transparent">
              {inner}
            </Link>
          ) : (
            <div key={s.key}>{inner}</div>
          );
        })}
      </dl>
    </div>
  );
}

export function InsightsCharts() {
  const coverageMax = Math.max(...HALLMARK_COVERAGE.map((h) => h.count));
  const citedMax = Math.max(...MOST_CITED.map((c) => c.studyCount));
  const topCited = MOST_CITED.slice(0, 8);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Evidence tiers */}
      <ChartCard
        eyebrow="Evidence"
        title="How the graded set breaks down"
        note="Every compound is rated A / B / C by the strength of human evidence."
      >
        <ProportionBar
          slices={TIER_SPLIT.map((t) => ({
            key: t.tier,
            label: `Tier ${t.tier}`,
            count: t.count,
            color: TIER_ACCENT[t.tier],
            href: `/library?tiers=${t.tier}`,
          }))}
        />
      </ChartCard>

      {/* Dosing time */}
      <ChartCard
        eyebrow="Circadian"
        title="When the library is dosed"
        note="Timing drawn from each compound's studied protocol — morning, evening, or split."
      >
        <ProportionBar
          slices={DOSING_TIME.map((t) => ({
            key: t.key,
            label: t.label,
            count: t.count,
            color: DOSING_ACCENT[t.key],
          }))}
        />
      </ChartCard>

      {/* Hallmark coverage */}
      <ChartCard
        eyebrow="Coverage"
        title="Levers per hallmark of aging"
        note="How many graded compounds act on each of the 12 hallmarks. Click a row to open it."
      >
        <div>
          {HALLMARK_COVERAGE.map((h) => (
            <Bar
              key={h.id}
              label={h.title}
              value={h.count}
              max={coverageMax}
              display={String(h.count)}
              color="var(--accent-emerald)"
              href={`/hallmarks/${h.slug}`}
            />
          ))}
        </div>
      </ChartCard>

      {/* Bioavailability */}
      <ChartCard
        eyebrow="Absorption"
        title="Oral bioavailability, ranked"
        note={`The ${BIOAVAILABILITY_RANK.length} compounds that carry a bioavailability figure, highest first (%).`}
      >
        <div>
          {BIOAVAILABILITY_RANK.map((c) => (
            <Bar
              key={c.id}
              label={c.name}
              value={c.value}
              max={100}
              display={`${c.value}`}
              color="var(--accent-cyan)"
              badge={c.tier}
              href={`/library/compounds/${c.id}`}
            />
          ))}
        </div>
      </ChartCard>

      {/* Most cited */}
      <ChartCard
        eyebrow="Citations"
        title="Most-cited compounds"
        note="Ranked by the number of human / clinical studies cited on each compound's page."
      >
        <div>
          {topCited.map((c) => (
            <Bar
              key={c.id}
              label={c.name}
              value={c.studyCount}
              max={citedMax}
              display={`${c.studyCount}`}
              color="var(--accent-violet)"
              badge={c.tier}
              href={`/library/compounds/${c.id}`}
            />
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
