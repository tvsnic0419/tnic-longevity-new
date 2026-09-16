'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, BookOpen, BarChart3, Cpu, ShoppingBag } from 'lucide-react';

interface RecommendedNextStepsProps {
  context?: 'library' | 'nico' | 'general';
  className?: string;
}

export const RecommendedNextSteps: React.FC<RecommendedNextStepsProps> = ({
  context = 'general',
  className = '',
}) => {
  const steps = {
    library: [
      {
        icon: Target,
        title: 'Build your first stack',
        description: 'Open Stack Architect with evidence-graded presets and synergy scoring',
        href: '/stacks',
        label: 'Open Stack Architect',
      },
      {
        icon: ShoppingBag,
        title: 'Verify before you buy',
        description: 'COA checklists filtered by your stack — commission never moves a grade',
        href: '/shop',
        label: 'Verify stack',
      },
      {
        icon: BarChart3,
        title: 'Track your biomarkers',
        description: 'Set up Lab Hub baselines for the markers your stack is meant to move',
        href: '/labs',
        label: 'Go to Lab Hub',
      },
      {
        icon: Cpu,
        title: 'Score a compound or stack',
        description: 'Rate evidence, effect, breadth, bioavailability and safety — and see hallmark coverage',
        href: '/compound-engine',
        label: 'Open Compound Engine',
      },
    ],
    nico: [
      {
        icon: Target,
        title: 'Load your stack in Architect',
        description: 'Import the recommended protocol into Stack Builder and inspect synergies',
        href: '/stacks',
        label: 'Open Stack Architect',
      },
      {
        icon: BookOpen,
        title: 'Explore the library',
        description: 'Dive deeper into the mechanisms behind your stack',
        href: '/library',
        label: 'Explore library',
      },
      {
        icon: ShoppingBag,
        title: 'Verify stack',
        description: 'Check dose-matched forms and COA demands before you buy',
        href: '/shop',
        label: 'Open Protocol Shop',
      },
    ],
    general: [
      {
        icon: Target,
        title: 'Start with NICO',
        description: 'Get a mechanism-matched stack recommendation',
        href: '/nico',
        label: 'Start with NICO',
      },
      {
        icon: BookOpen,
        title: 'Explore the library',
        description: 'Browse hallmarks, compounds and protocols',
        href: '/library',
        label: 'Explore library',
      },
      {
        icon: ShoppingBag,
        title: 'Verify stack',
        description: 'Buyer checklists once you have a protocol to inspect',
        href: '/shop',
        label: 'Verify stack',
      },
    ],
  };

  const currentSteps = steps[context];

  return (
    <div className={`tnic-glass rounded-2xl p-6 ${className}`}>
      <div className="text-label text-[var(--accent-cyan)] mb-3">RECOMMENDED NEXT STEPS</div>
      <div className="space-y-4">
        {currentSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Link
              key={index}
              href={step.href}
              className="group flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--accent-cyan)]/40 transition-all"
            >
              <div className="mt-0.5">
                <Icon className="w-5 h-5 text-[var(--accent-cyan)]" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                  {step.title}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {step.description}
                </div>
              </div>
              <div className="self-center">
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--accent-cyan)] group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
