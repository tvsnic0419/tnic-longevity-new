'use client';

import Link from 'next/link';
import { ArrowRight, FlaskConical, Scan, BookOpen, Layers, Target } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { stackPresets } from '@/lib/presets';
import { compounds } from '@/lib/data';

const DEFAULT_IDS = new Set<string>(stackPresets.starter.ids);

const GOAL_LABEL: Record<string, string> = {
  learn: 'Learning the science',
  defense: 'Cellular defense',
  energy: 'Mitochondrial energy',
  full: 'Full longevity optimization',
  longevity: 'Senolytic & healthspan focus',
  metabolic: 'Cardio-metabolic health',
};

const COMPOUND_MODULE: Record<string, string> = {
  glynac: '/library/compounds/glynac',
  nmn: '/library/compounds/nmn',
  sulforaphane: '/library/compounds/sulforaphane',
  resveratrol: '/library/compounds/resveratrol',
  cakg: '/library/compounds/cakg',
  rala: '/library/compounds/rala',
  taurine: '/library/compounds/taurine',
  spermidine: '/library/compounds/spermidine',
  pterostilbene: '/library/compounds/pterostilbene',
  berberine: '/library/compounds/berberine',
  urolithina: '/library/compounds/urolithina',
  fisetin: '/library/compounds/fisetin',
  coq10: '/library/compounds/coq10',
  omega3: '/library/compounds/omega3',
};

interface ActionItem {
  icon: typeof FlaskConical;
  title: string;
  description: string;
  href: string;
  accent: string;
  priority: number;
}

export function UserNextStepsPanel() {
  const { quizResult, selected, labs, profile } = usePlatform();

  const actions: ActionItem[] = [];

  if (!quizResult) {
    actions.push({
      icon: Target,
      title: 'Take the 3-min quiz',
      description: 'Get a personalized stack preset matched to your goal and experience level.',
      href: '/quiz',
      accent: 'text-accent-cyan',
      priority: 10,
    });
  }

  if (labs.length === 0) {
    actions.push({
      icon: FlaskConical,
      title: 'Log your baseline labs',
      description: 'Log week-0 biomarkers (glutathione, CRP, NAD+) so you have a reference point at week 12.',
      href: '/labs',
      accent: 'text-accent-emerald',
      priority: 9,
    });
  }

  if (!profile.scanned) {
    actions.push({
      icon: Scan,
      title: 'Run your defense scan',
      description: 'Answer 4 questions to calibrate your biological age estimate and defense pathway score.',
      href: '/tools?tab=healthspan',
      accent: 'text-accent-violet',
      priority: 8,
    });
  }

  if (selected.length > 0 && selected.every((id: string) => DEFAULT_IDS.has(id))) {
    actions.push({
      icon: Layers,
      title: 'Customize your stack',
      description: 'You\'re on the default preset. Adjust compounds in Stack Architect to match your actual goal.',
      href: '/stacks',
      accent: 'text-accent-amber',
      priority: 7,
    });
  }

  const topCompound = selected.find((id: string) => COMPOUND_MODULE[id]);
  if (topCompound) {
    const name = compounds.find((c) => c.id === topCompound)?.name ?? topCompound;
    actions.push({
      icon: BookOpen,
      title: `Read the ${name} deep-dive`,
      description: 'Understand the mechanism, dosing anchors, evidence tier, and safety profile before week 1.',
      href: COMPOUND_MODULE[topCompound] ?? '/library',
      accent: 'text-accent-cyan',
      priority: 5,
    });
  }

  if (actions.length === 0) {
    actions.push({
      icon: BookOpen,
      title: 'Explore the lipid delivery guide',
      description: 'Understand why phytosomes and NLCs outperform standard powders for your compounds.',
      href: '/library/delivery-systems',
      accent: 'text-accent-violet',
      priority: 3,
    });
  }

  const sorted = [...actions].sort((a, b) => b.priority - a.priority).slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-label text-muted-foreground">YOUR NEXT STEPS</p>
        {quizResult && (
          <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full">
            Goal: {GOAL_LABEL[quizResult.goal] ?? quizResult.goal}
          </span>
        )}
      </div>

      {sorted.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            href={item.href}
            className="focus-ring group flex items-start gap-3 glass glass-hover rounded-xl p-4 transition-all hover:border-border/80"
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.accent}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-snug">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        );
      })}
    </div>
  );
}
