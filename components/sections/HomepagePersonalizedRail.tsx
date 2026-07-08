'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, FlaskConical, ShoppingBag } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { ContextRail } from '@/components/ui/ContextRail';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { buildShopPresetUrl } from '@/lib/stack-url';
import { getHeroPersonalization } from '@/lib/homepage-personalization';

export function HomepagePersonalizedRail() {
  const { quizResult, selected } = usePlatform();

  const hasStack = selected.length > 0;
  const hasQuiz = Boolean(quizResult?.preset);

  if (!hasQuiz && !hasStack) return null;

  const preset = (quizResult?.preset ?? 'starter') as PresetKey;
  const stack = stackPresets[preset];
  const hero = getHeroPersonalization(quizResult);

  return (
    <section className="py-12 md:py-16 border-b border-border bg-[#0a0f1a]/40 section-glow-violet">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl card-premium border border-accent-violet/25 bg-gradient-to-br from-accent-violet/8 to-transparent p-6 md:p-8"
        >
          <p className="text-label text-accent-violet mb-2">YOUR PROTOCOL</p>
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            {hasQuiz ? `Continue with ${stack.label}` : 'Your stack is in progress'}
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mb-6 leading-relaxed">
            {hasQuiz ? hero.subcopy : `${selected.length} compounds selected locally — load a preset or verify picks before you buy.`}
          </p>

          <ContextRail
            what={hasQuiz ? `${stack.label} preset with ${stack.ids.length} evidence-graded compounds.` : 'Active stack selections stored in your browser.'}
            why="Returning visitors should not restart from zero — TNiC remembers your quiz profile and stack locally."
            next={hero.contextNext}
            theme="violet"
            className="mb-6"
          />

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/stacks?preset=${preset}`}
              className="focus-ring inline-flex items-center gap-2 btn-gradient text-sm !py-2.5 !px-5 !min-h-0 rounded-full"
            >
              <Layers className="w-4 h-4" />
              Open Stack Architect
            </Link>
            <Link
              href={buildShopPresetUrl(preset)}
              className="focus-ring inline-flex items-center gap-2 glass glass-hover px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-accent-amber" />
              Verify at Shop
            </Link>
            <Link
              href="/labs?tab=input"
              className="focus-ring inline-flex items-center gap-2 glass glass-hover px-5 py-2.5 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              <FlaskConical className="w-4 h-4" />
              Log baseline labs
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}