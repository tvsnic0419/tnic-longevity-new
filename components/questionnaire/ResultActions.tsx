'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Layers,
  ShoppingBag,
  BookOpen,
  Compass,
  RotateCcw,
  Mail,
  CheckCircle2,
  AlertCircle,
  Link2,
} from 'lucide-react';
import { useBriefSubscribe } from '@/hooks/useBriefSubscribe';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { usePlatform } from '@/context/PlatformContext';
import { buildShopPresetUrl } from '@/lib/stack-url';
import { buildResultsUrl } from '@/lib/quiz-share';
import { trackEvent } from '@/lib/analytics';
import { ANALYTICS_EVENTS } from '@/lib/analytics-events';
import type { PresetKey } from '@/lib/presets';
import type { QuestionnaireAnswers } from '@/lib/questionnaire';

const AGE_PROFILE_MAP: Record<string, number> = {
  '30-40': 35,
  '41-50': 45,
  '51-60': 55,
  '60+': 65,
};

type Props = {
  answers: QuestionnaireAnswers;
  preset: PresetKey;
  stackLabel: string;
  compoundCount: number;
  primary: { title: string; href: string; cta: string };
};

export function ResultActions({ answers, preset, stackLabel, compoundCount, primary }: Props) {
  const router = useRouter();
  const { applyPreset, setProfile, setQuizResult } = usePlatform();
  const { email, setEmail, subscribed, loading, error, subscribe } = useBriefSubscribe();
  const [copied, setCopied] = useState(false);
  const recorded = useRef(false);

  // Persist the completed result once per mount so the dashboard and OS status
  // bar pick it up. Guarded by a ref because the result is now reachable by URL —
  // a refresh or a shared link re-mounts this component.
  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;

    setQuizResult({
      goal: answers.goal ?? 'learn',
      age: answers.age,
      experience: answers.experience,
      preset,
      completedAt: new Date().toISOString(),
      sex: answers.sex,
      sleep: answers.sleep,
      energy: answers.energy,
      stress: answers.stress,
      movement: answers.movement,
      safety: answers.safety,
    });
    trackEvent(ANALYTICS_EVENTS.quizCompleted, {
      preset,
      goal: answers.goal ?? 'learn',
      age: answers.age ?? 'unknown',
      experience: answers.experience ?? 'unknown',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStackAndOpenArchitect = () => {
    applyPreset(preset);
    if (answers.age && AGE_PROFILE_MAP[answers.age]) {
      setProfile({ age: AGE_PROFILE_MAP[answers.age] });
    }
    router.push(`/stacks?from=quiz&preset=${preset}`);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildResultsUrl(answers));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-2" role="group" aria-label="Result actions">
      <button
        type="button"
        onClick={loadStackAndOpenArchitect}
        className="focus-ring w-full rounded-xl bg-accent-cyan p-4 text-left text-black transition-colors hover:bg-accent-emerald"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Layers className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-body-sm font-semibold">Load stack &amp; open Architect</p>
              <p className="mt-0.5 text-caption opacity-80">
                Applies <strong>{stackLabel}</strong> ({compoundCount} compounds) and opens the Builder
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
        </div>
      </button>

      <GlassPanel depth="mid" className="glass-hover rounded-xl">
        <Link href={buildShopPresetUrl(preset)} className="focus-ring block w-full rounded-xl p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShoppingBag className="mt-0.5 h-5 w-5 shrink-0 text-accent-amber" aria-hidden="true" />
              <div>
                <p className="text-body-sm font-semibold">Shop verified picks</p>
                <p className="mt-0.5 text-caption text-muted-foreground">
                  COA checklist filtered to <strong>{stackLabel}</strong> — affiliate links disclosed, commission
                  never influences listings
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </div>
        </Link>
      </GlassPanel>

      <GlassPanel depth="mid" className="glass-hover rounded-xl">
        <Link href={primary.href} className="focus-ring block w-full rounded-xl p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-5 w-5 shrink-0 text-accent-cyan" aria-hidden="true" />
              <div>
                <p className="text-body-sm font-semibold">{primary.cta}</p>
                <p className="mt-0.5 text-caption text-muted-foreground">{primary.title}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </div>
        </Link>
      </GlassPanel>

      <GlassPanel depth="mid" className="glass-hover rounded-xl">
        <Link href="/brief" className="focus-ring block w-full rounded-xl p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-accent-violet" aria-hidden="true" />
              <div>
                <p className="text-body-sm font-semibold">Read Protocol Brief</p>
                <p className="mt-0.5 text-caption text-muted-foreground">
                  PMID-curated research mapped to your stack compounds
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </div>
        </Link>
      </GlassPanel>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={copyLink}
          className="focus-ring glass flex items-center justify-center gap-2 rounded-xl py-3 text-caption text-muted-foreground transition hover:text-foreground"
        >
          <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
          {copied ? 'Link copied' : 'Copy result link'}
        </button>
        <Link
          href="/"
          className="focus-ring glass flex items-center justify-center gap-2 rounded-xl py-3 text-caption text-muted-foreground transition hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Retake questionnaire
        </Link>
      </div>

      <div className="glass-deep glass-plane-mid rounded-xl border border-accent-violet/20 p-4">
        <p className="mb-2 text-body-sm font-semibold">Get the weekly Protocol Brief</p>
        {subscribed ? (
          <p className="flex items-center gap-2 text-caption text-accent-emerald">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Subscribed — PMID research mapped to {stackLabel}
          </p>
        ) : (
          <form onSubmit={subscribe} className="flex flex-col gap-2">
            {error && (
              <p role="alert" className="flex items-center gap-1.5 text-caption text-accent-rose">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail
                  className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="focus-ring w-full rounded-lg border border-border bg-card py-2 pl-8 pr-2 text-caption"
                  aria-label="Email for Protocol Brief"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring shrink-0 rounded-lg border border-accent-violet/30 bg-accent-violet/20 px-3 py-2 text-caption font-semibold text-accent-violet hover:bg-accent-violet/30 disabled:opacity-60"
              >
                {loading ? '…' : 'Subscribe'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
