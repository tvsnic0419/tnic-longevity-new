'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BiologicalAgeGauge } from '@/components/ui/BiologicalAgeGauge';
import { DepthBarChart } from '@/components/ui/DepthBarChart';
import { getScoredCompounds } from '@/lib/elite-8-data';
import { DERIVED_STATS } from '@/lib/derived-stats';
import { eliteTierCounts } from '@/lib/elite-interventions';

/**
 * Homepage instrument strip — BiologicalAgeGauge + Elite LQ depth ranking.
 * Uses EXISTING derived Elite 8 scores and platform stats — no invented grades.
 * Educational demo scan only; labeled as such.
 */
export function HomeInstrumentStrip() {
  const ranked = useMemo(() => getScoredCompounds().slice(0, 5), []);
  const chartData = useMemo(
    () =>
      ranked.map((c) => ({
        name: c.name,
        fullName: `${c.full} · modeled LQ`,
        value: Math.round(c.score),
        color: c.color,
      })),
    [ranked],
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
      className="container-page relative z-10 -mt-6 mb-12 md:mb-16"
      aria-labelledby="home-instrument-strip-title"
    >
      <div className="instrument-bezel premium-card overflow-hidden rounded-[1.35rem] border border-accent-cyan/25 p-0 md:p-0">
        <div className="instrument-bezel__chrome" aria-hidden="true">
          <span className="instrument-bezel__screw" />
          <span className="instrument-bezel__screw" />
          <span className="instrument-bezel__led" />
          <span className="instrument-bezel__title">TNiC · INSTRUMENT BAY</span>
          <span className="instrument-bezel__screw" />
          <span className="instrument-bezel__screw" />
        </div>
        <div className="relative p-5 md:p-7">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" aria-hidden="true" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <p className="text-micro font-mono uppercase tracking-[0.16em] text-accent-cyan">
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

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="instrument-module lg:col-span-4 rounded-2xl border border-accent-rose/25 bg-gradient-to-b from-accent-rose/[0.10] via-accent-rose/[0.03] to-transparent p-4 md:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_40px_-28px_rgba(244,63,94,0.45)]">
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

          <div className="instrument-module lg:col-span-8 rounded-2xl border border-accent-cyan/25 bg-gradient-to-b from-accent-cyan/[0.10] via-accent-cyan/[0.03] to-transparent p-4 md:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_40px_-28px_rgba(34,211,238,0.4)]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-label text-accent-cyan">Elite 8 · modeled LQ</p>
                <p className="text-caption text-muted-foreground">
                  Top 5 by published dimension weights — educational ranking
                </p>
              </div>
              <Link
                href="/elite-8"
                className="focus-ring tnic-button-outline inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-accent-cyan shrink-0"
              >
                Full ranking <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
            <DepthBarChart
              data={chartData}
              height={240}
              valueLabel="Modeled LQ"
              max={100}
              color="var(--accent-cyan)"
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
