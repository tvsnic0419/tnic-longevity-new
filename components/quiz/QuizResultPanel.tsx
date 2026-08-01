'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw, Check, Layers, Compass, ShoppingBag, BookOpen, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBriefSubscribe } from '@/hooks/useBriefSubscribe';
import { DetailedStackSuggestion } from '@/components/quiz/DetailedStackSuggestion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { usePlatform } from '@/context/PlatformContext';
import type { PresetKey } from '@/lib/presets';
import type { getQuizResult } from '@/lib/homepage';
import { QuizShareCard } from '@/components/quiz/QuizShareCard';
import { isCompleteQuizAnswers } from '@/lib/quiz-share';
import { buildShopPresetUrl } from '@/lib/stack-url';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';

type QuizResult = ReturnType<typeof getQuizResult>;

const AGE_PROFILE_MAP: Record<string, number> = {
  '30-40': 35,
  '41-50': 45,
  '51-60': 55,
  '60+': 65,
};

interface QuizResultPanelProps {
  result: QuizResult;
  answers: { goal?: string; age?: string; experience?: string };
  onRetake: () => void;
}

export function QuizResultPanel({ result, answers, onRetake }: QuizResultPanelProps) {
  const router = useRouter();
  const { applyPreset, setProfile, setQuizResult } = usePlatform();
  const { email, setEmail, subscribed, loading, error, subscribe: subscribeBrief } = useBriefSubscribe();

  useEffect(() => {
    setQuizResult({
      goal: answers.goal ?? 'learn',
      age: answers.age,
      experience: answers.experience,
      preset: result.preset,
      completedAt: new Date().toISOString(),
    });
    trackEvent(ANALYTICS_EVENTS.quizCompleted, {
      preset: result.preset,
      goal: answers.goal ?? 'learn',
      age: answers.age ?? 'unknown',
      experience: answers.experience ?? 'unknown',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStackAndOpenArchitect = () => {
    applyPreset(result.preset as PresetKey);
    if (answers.age && AGE_PROFILE_MAP[answers.age]) {
      setProfile({ age: AGE_PROFILE_MAP[answers.age] });
    }
    router.push(`/stacks?from=quiz&preset=${result.preset}`);
  };

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent-emerald/20 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-accent-emerald" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-bold text-accent-emerald mb-1">Questionnaire complete — pick your next step</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{result.insight}</p>
        </div>
      </div>

      <DetailedStackSuggestion preset={result.preset as PresetKey} />

      <div className="space-y-2" role="group" aria-label="Nico Questionnaire result actions">
        <button
          type="button"
          onClick={loadStackAndOpenArchitect}
          className="focus-ring w-full text-left rounded-xl bg-accent-cyan text-black p-4 hover:bg-accent-emerald transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Layers className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Load stack &amp; open Architect</p>
                <p className="text-xs opacity-80 mt-0.5">
                  Applies <strong>{result.stack.label}</strong> preset ({result.stack.ids.length} compounds) and
                  opens the Builder tab
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
          </div>
        </button>

        <GlassPanel depth="mid" className="glass-hover rounded-xl">
        <Link
          href={buildShopPresetUrl(result.preset as PresetKey)}
          className="focus-ring block w-full text-left rounded-xl p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-accent-amber shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Shop verified picks</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  COA checklist filtered to <strong>{result.stack.label}</strong> — affiliate links disclosed, commission never influences listings
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          </div>
        </Link>
        </GlassPanel>

        <GlassPanel depth="mid" className="glass-hover rounded-xl">
        <Link
          href="/brief"
          className="focus-ring block w-full text-left rounded-xl p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">Read Protocol Brief</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PMID-curated research mapped to your stack compounds
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          </div>
        </Link>
        </GlassPanel>

        <GlassPanel depth="mid" className="glass-hover rounded-xl">
        <Link
          href={result.primary.href}
          className="focus-ring block w-full text-left rounded-xl p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold">{result.primary.cta}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{result.primary.title}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          </div>
        </Link>
        </GlassPanel>

        <div className="glass-deep glass-plane-mid rounded-xl border border-accent-violet/20 p-4">
          <p className="text-xs font-semibold mb-2">Get weekly Protocol Brief</p>
          {subscribed ? (
            <div className="flex items-center gap-2 text-xs text-accent-emerald">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Subscribed — PMID research mapped to {result.stack.label}
            </div>
          ) : (
            <form onSubmit={subscribeBrief} className="flex flex-col gap-2">
              {error && (
                <p role="alert" className="flex items-center gap-1.5 text-xs text-accent-rose">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </p>
              )}
              <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-card pl-8 pr-2 py-2 text-xs focus-ring"
                  aria-label="Email for Protocol Brief"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring shrink-0 bg-accent-violet/20 border border-accent-violet/30 text-accent-violet px-3 py-2 rounded-lg font-semibold text-xs hover:bg-accent-violet/30 disabled:opacity-60"
              >
                {loading ? '…' : 'Subscribe'}
              </button>
              </div>
            </form>
          )}
        </div>

        <button
          type="button"
          onClick={onRetake}
          className="focus-ring w-full flex items-center justify-center gap-2 glass py-3 rounded-xl text-xs text-muted-foreground hover:text-foreground transition"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Retake questionnaire
          <span className="text-caption">— try a different goal or experience level</span>
        </button>
      </div>

      {isCompleteQuizAnswers(answers) && (
        <QuizShareCard
          answers={answers}
          preset={result.preset as PresetKey}
          stackLabel={result.stack.label}
        />
      )}
    </motion.div>
  );
}