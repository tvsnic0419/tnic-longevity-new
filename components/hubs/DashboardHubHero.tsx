'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, FlaskConical, Layers, ArrowRight } from 'lucide-react';
import { BiologicalAgeGauge } from '@/components/ui/BiologicalAgeGauge';
import { HallmarkCoverageRing } from '@/components/os/HallmarkCoverageRing';
import { usePlatform } from '@/context/PlatformContext';
import { analyzeStack } from '@/lib/stack-analysis';
import { CountUp } from '@/components/ui/CountUp';

const goalLabels: Record<string, string> = {
  learn: 'Learning the science',
  defense: 'Cellular defense',
  energy: 'Mitochondrial energy',
  full: 'Full longevity optimization',
  longevity: 'Senolytic & healthspan focus',
  metabolic: 'Cardio-metabolic health',
};

export function DashboardHubHero() {
  const { profile, setProfile, defenseProfile, score, selected, quizResult } = usePlatform();
  const analysis = analyzeStack(selected);
  const coveredCount = analysis.hallmarkCoverage.length;

  return (
    <section className="hub-hero hub-hero-dashboard relative overflow-hidden mb-8 md:mb-10">
      <div className="absolute inset-0 hub-hero-mesh pointer-events-none" aria-hidden="true" />
      <div className="relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="card-ultra p-6 md:p-8">
              <BiologicalAgeGauge
                chronoAge={profile.age}
                bioAge={defenseProfile.biologicalAge}
                defenseScore={defenseProfile.defenseScore}
                scanned={profile.scanned}
                size="lg"
                showSliders
                stress={profile.stress}
                sleep={profile.sleep}
                exercise={profile.exercise}
                onAgeChange={(v) => setProfile({ age: v })}
                onStressChange={(v) => setProfile({ stress: v })}
                onSleepChange={(v) => setProfile({ sleep: v })}
                onExerciseChange={(v) => setProfile({ exercise: v })}
                onScan={() => setProfile({ scanned: true })}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 card-ultra rounded-full px-4 py-2 mb-4 text-body-sm">
              <LayoutDashboard className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
              <span>Personal command center</span>
            </div>

            <h1 className="heading-page mb-3">My Longevity OS</h1>
            <p className="text-body max-w-xl mb-6">
              {quizResult
                ? `Goal: ${goalLabels[quizResult.goal] ?? quizResult.goal} — stack, labs, and journey unified.`
                : 'Your anti-aging operating system — stack, labs, and journey in one place. Data stays local unless you export it.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="stat-card-v3">
                <p className="stat-value-v3 text-accent-violet">
                  <CountUp value={score} />
                </p>
                <p className="text-label mt-1">Synergy</p>
              </div>
              <div className="stat-card-v3">
                <p className="stat-value-v3 text-accent-cyan">
                  <CountUp value={selected.length} />
                </p>
                <p className="text-label mt-1">Compounds</p>
              </div>
              <div className="stat-card-v3 flex flex-col items-center justify-center">
                <HallmarkCoverageRing covered={coveredCount} size="md" showLabel={false} className="!p-0" />
                <p className="text-label mt-2">{coveredCount}/12 hallmarks</p>
              </div>
              <div className="stat-card-v3">
                <p className="stat-value-v3 text-accent-emerald">
                  {profile.scanned ? (
                    <CountUp value={defenseProfile.ageDelta > 0 ? defenseProfile.ageDelta : 0} />
                  ) : (
                    '—'
                  )}
                </p>
                <p className="text-label mt-1">Yrs reversal</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/stacks" className="focus-ring btn-gradient text-sm !py-2.5 !px-5 !min-h-0">
                <Layers className="w-4 h-4" aria-hidden="true" />
                Stack Architect
              </Link>
              <Link href="/labs" className="focus-ring btn-ghost-premium text-sm !py-2.5 !px-5 !min-h-0">
                <FlaskConical className="w-4 h-4" aria-hidden="true" />
                Lab Hub
              </Link>
              <Link href="/tools?tab=healthspan" className="focus-ring interactive text-sm text-accent-cyan inline-flex items-center gap-1.5 px-4 py-2">
                Healthspan tools
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}