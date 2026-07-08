'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Eye, Zap } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: Play,
      title: "Take the 3-Minute Quiz",
      description: "Answer a few questions and get a mechanism-matched stack recommendation tailored to your goals.",
      cta: "Start Quiz",
      href: "/quiz"
    },
    {
      number: "02",
      icon: Eye,
      title: "Explore Visual Mechanisms",
      description: "See how key hallmarks of aging actually work with high-detail interactive visuals and evidence.",
      cta: "Browse Visuals",
      href: "/library"
    },
    {
      number: "03",
      icon: Zap,
      title: "Build & Track in the OS",
      description: "Use the Stack Architect, Lab Hub, and simulators to design, test, and monitor your protocols.",
      cta: "Open Dashboard",
      href: "/dashboard"
    }
  ];

  return (
    <section className="container-page py-16 md:py-20 border-t border-[var(--color-border-subtle)]">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="text-label text-[var(--accent-cyan)] mb-3">GET STARTED IN 3 STEPS</div>
        <h2 className="heading-section mb-4">How TNiC Works</h2>
        <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          A simple path from curiosity to actionable longevity protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="tnic-glass rounded-2xl p-8 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-mono font-semibold text-[var(--accent-cyan)]/70">
                  {step.number}
                </div>
                <div className="p-3 rounded-xl bg-white/5">
                  <Icon className="w-6 h-6 text-[var(--accent-cyan)]" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
                {step.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] flex-1 mb-6">
                {step.description}
              </p>

              <Link 
                href={step.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-cyan)] hover:underline group mt-auto"
              >
                {step.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};
