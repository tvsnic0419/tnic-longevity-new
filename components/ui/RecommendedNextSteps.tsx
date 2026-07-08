'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, BookOpen, BarChart3 } from 'lucide-react';

interface RecommendedNextStepsProps {
  context?: 'library' | 'quiz' | 'general';
  className?: string;
}

export const RecommendedNextSteps: React.FC<RecommendedNextStepsProps> = ({ 
  context = 'general',
  className = '' 
}) => {
  const steps = {
    library: [
      {
        icon: Target,
        title: "Build your first stack",
        description: "Use the Stack Architect with your current filters",
        href: "/dashboard",
        label: "Open Stack Architect"
      },
      {
        icon: BarChart3,
        title: "Track your biomarkers",
        description: "Set up your Lab Hub baselines",
        href: "/labs",
        label: "Go to Lab Hub"
      }
    ],
    quiz: [
      {
        icon: Target,
        title: "Apply your personalized stack",
        description: "Import the recommended protocol into your dashboard",
        href: "/dashboard",
        label: "Open Dashboard & Import"
      },
      {
        icon: BookOpen,
        title: "Explore the science",
        description: "Dive deeper into the mechanisms behind your stack",
        href: "/library",
        label: "Browse Library"
      }
    ],
    general: [
      {
        icon: Target,
        title: "Take the 3-minute quiz",
        description: "Get a mechanism-matched stack recommendation",
        href: "/quiz",
        label: "Start Quiz"
      },
      {
        icon: BookOpen,
        title: "Explore the library",
        description: "Browse hallmarks, compounds and protocols",
        href: "/library",
        label: "Open Library"
      }
    ]
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
