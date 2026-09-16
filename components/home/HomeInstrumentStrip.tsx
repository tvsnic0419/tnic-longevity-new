'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BiologicalAgeGauge } from '@/components/ui/BiologicalAgeGauge';
import { getScoredCompounds } from '@/lib/elite-8-data';
import { DERIVED_STATS } from '@/lib/derived-stats';
import { eliteTierCounts } from '@/lib/elite-interventions';

/**
 * Homepage instrument strip — BiologicalAgeGauge + Elite LQ depth ranking.
 * Uses EXISTING derived Elite 8 scores and platform stats — no invented grades.
 * Educational demo scan only; labeled as such.
 */
export function HomeInstrumentStrip() {
  // All eight, not an arbitrary top five: the module is the Elite *8*.
  const ranked = useMemo(
    () =>
      getScoredCompounds().map((c) => ({
        id: c.id,
        name: c.name,
        full: c.full,
        category: c.category,
        score: Math.round(c.score),
      })),
    [],
  );

  const [chronoAge, setChronoAge] = useState(42);
  const [stress, setStress] = useState(45);
  const [sleep, setSleep] = useState(70);
  const [exercise, setExercise] = useState(55);
  const [scanned, setScanned] = useState(false);

  // Lightweight educational model — mirrors healthspan estimator directionality
  // without inventing clinical claims. Same formula family as BioAgeWizard demos.
  const defenseScore = Math.round(
    Math.max(
      0,
      Math.min(100, sleep * 0.35 + exercise * 0.35 + (100 - stress) * 0.3),
    ),
  );
  const bioAge = Math.round(chronoAge - (defenseScore - 50) / 12);

  return (
    <section
      className="container-page relative z-10 -mt-4 mb-10 md:mb-14"
      aria-labelledby="home-instrument-strip-title"
    >
      <div className="premium-card overflow-hidden rounded-2xl border border-accent-cyan/20 p-5 md:p-7">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" aria-hidden="true" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <p className="text-micro font-mono uppercase tracking-[0.14em] text-accent-cyan">
              Live instruments
            </p>
            <h2 id="home-instrument-strip-title" className="mt-1 text-xl md:text-2xl font-bold tracking-tight">
              Diligence-grade readouts, from day one
            </h2>
            <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground">
              Educational bio-age gauge + Elite 8 modeled LQ ranking — same derived scores used on{' '}
              <Link href="/elite-8" className="text-accent-cyan hover:underline">
                /elite-8
              </Link>
              . Not clinical predictions.
            </p>
          </div>
          <p className="text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground">
            {DERIVED_STATS.compounds} compounds · {DERIVED_STATS.hallmarks} hallmarks ·{' '}
            {(eliteTierCounts.A ?? 0) + (eliteTierCounts.B ?? 0) + (eliteTierCounts.C ?? 0)} elite
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 rounded-2xl border border-border/60 bg-gradient-to-b from-accent-rose/[0.06] to-transparent p-4 md:p-5">
            <BiologicalAgeGauge
              chronoAge={chronoAge}
              bioAge={bioAge}
              defenseScore={defenseScore}
              scanned={scanned}
              size="sm"
              showSliders
              stress={stress}
              sleep={sleep}
              exercise={exercise}
              onAgeChange={setChronoAge}
              onStressChange={setStress}
              onSleepChange={setSleep}
              onExerciseChange={setExercise}
              onScan={() => setScanned(true)}
            />
          </div>

          <div className="lg:col-span-8 rounded-2xl border border-border/60 bg-gradient-to-b from-accent-cyan/[0.05] to-transparent p-4 md:p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-label text-accent-cyan">Elite 8 · modeled LQ</p>
                <p className="text-caption text-muted-foreground">
                  All eight, by published dimension weights — educational ranking
                </p>
              </div>
              {/* `.action-link` is the documented standalone-link control floor
                  (STYLE_GUIDE §13). Without it this rendered 87×20 and was the
                  single control failing `audit:ui`'s 24px tap-target gate,
                  whose budget is 0. */}
              <Link
                href="/elite-8"
                className="action-link focus-ring gap-1 text-xs font-semibold text-accent-cyan shrink-0"
              >
                Full ranking <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
            {/* A ranked readout, not a bar chart.

                It was a vertical Recharts bar chart: eight compound names
                rotated -28° along the bottom axis — the least legible way to
                print a word — in a 220px box inside a ~500px column, leaving
                roughly 280px of dead panel beneath it, with a different
                decorative hue per bar. Two of those hues are the Tier C and
                Tier A tokens, so a Tier A compound could be drawn amber on the
                site whose whole spine is that a colour means a grade.

                Turning it horizontal fixed the labels and the dead space and
                exposed the real problem: these eight modeled scores cluster
                between 66 and 73, so on a 0–100 axis every bar is the same
                length. STYLE_GUIDE and the repo's own viz rules say a
                visualisation earns its place only if it changes a decision
                faster than text does — eight identical bars change nothing.

                So the number leads and the meter supports it. The axis stays
                anchored at 0: truncating it would make a 7-point spread look
                decisive, which is the kind of overstatement this library
                exists to avoid. */}
            <ol className="lq-rank">
              {ranked.map((c, i) => (
                <li key={c.id} className="lq-rank__row">
                  <span className="lq-rank__pos" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="lq-rank__body">
                    <span className="lq-rank__head">
                      <span className="lq-rank__name">{c.name}</span>
                      <span className="lq-rank__score">
                        {c.score}
                        <span className="lq-rank__of">/100</span>
                      </span>
                    </span>
                    <span className="lq-rank__meter" aria-hidden="true">
                      <span className="lq-rank__fill" style={{ width: `${c.score}%` }} />
                    </span>
                    <span className="lq-rank__cat">{c.category}</span>
                  </span>
                  <span className="sr-only">
                    {`Rank ${i + 1}: ${c.full}, modeled LQ ${c.score} out of 100.`}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
