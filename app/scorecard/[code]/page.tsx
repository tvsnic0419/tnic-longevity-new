import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Dna, Layers, PieChart, Activity } from 'lucide-react';
import {
  decodeScorecard,
  scorecardGrade,
  gradeLabels,
  ageDeltaHeadline,
} from '@/lib/scorecard';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const p = decodeScorecard(code);
  if (!p) return { title: 'Longevity Scorecard' };
  const grade = scorecardGrade(p);
  const deltaLine = p.age && p.bioAge && p.age > p.bioAge
    ? `Biological age ${p.bioAge} at ${p.age} years old. `
    : '';
  return {
    title: `Longevity Grade ${grade} — TNiC Scorecard`,
    description: `${deltaLine}${p.coverage}% of the 12 hallmarks of aging covered with a ${p.stackSize}-compound stack. Build yours free in 5 minutes — no account, evidence-graded.`,
    robots: { index: false, follow: true },
  };
}

const gradeTextColor: Record<string, string> = {
  S: 'text-accent-emerald',
  A: 'text-accent-cyan',
  B: 'text-accent-violet',
  C: 'text-accent-amber',
  D: 'text-accent-rose',
};

export default async function ScorecardPage({ params }: Props) {
  const { code } = await params;
  const p = decodeScorecard(code);
  if (!p) notFound();

  const grade = scorecardGrade(p);
  const delta = ageDeltaHeadline(p);

  const stats = [
    ...(p.bioAge
      ? [{ icon: Activity, label: 'Biological age', value: `${p.bioAge}`, sub: p.age ? `vs ${p.age} chronological` : '' }]
      : []),
    { icon: Layers, label: 'Synergy score', value: `${p.synergy}`, sub: `${p.stackSize}-compound stack` },
    { icon: PieChart, label: 'Hallmark coverage', value: `${p.coverage}%`, sub: 'of 12 aging pathways' },
  ];

  return (
    <div className="min-h-screen section-deep">
      <div className="container-page py-16 md:py-24 max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-eyebrow justify-center mb-4">TNiC Longevity Scorecard</p>
          <div className={`text-[7rem] md:text-[9rem] font-black leading-none font-mono ${gradeTextColor[grade]}`}>
            {grade}
          </div>
          <p className="text-xl md:text-2xl font-bold mt-2">{gradeLabels[grade]}</p>
          {delta && (
            <p className="text-body mt-3 text-muted-foreground">&ldquo;{delta}&rdquo;</p>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="card-depth rounded-2xl p-6 text-center">
              <s.icon className="w-5 h-5 text-accent-cyan mx-auto mb-3" aria-hidden="true" />
              <p className="stat-value">{s.value}</p>
              <p className="text-label mt-2">{s.label}</p>
              {s.sub && <p className="text-caption mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>

        <div className="card-floating rounded-2xl p-8 text-center">
          <Dna className="w-8 h-8 text-accent-emerald mx-auto mb-4" aria-hidden="true" />
          <h1 className="heading-section mb-3">What&rsquo;s your longevity grade?</h1>
          <p className="text-body-sm max-w-md mx-auto mb-6">
            This scorecard was built with TNiC — free, evidence-graded longevity intelligence.
            14 compounds, 12 hallmarks of aging, every claim PubMed-cited.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quiz" className="focus-ring btn-gradient rounded-full text-sm !px-6">
              Get my scorecard — 5 min
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/library"
              className="focus-ring btn-ghost-premium inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              Explore the science
            </Link>
          </div>
          <p className="text-caption mt-6">
            Modeled estimates, not medical diagnostics. Educational only.
          </p>
        </div>
      </div>
    </div>
  );
}
