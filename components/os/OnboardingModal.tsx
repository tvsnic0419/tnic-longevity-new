'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Target, Zap, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';
import { stackPresets, type PresetKey } from '@/lib/presets';
import {
  isOnboardingComplete,
  setOnboardingComplete,
  type UserMilestone,
} from '@/lib/milestone-engine';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils';

const SESSION_DISMISSED_KEY = 'tnic_onboarding_dismissed';

const goals: { key: PresetKey; icon: typeof Target; accent: string }[] = [
  { key: 'starter', icon: Sparkles, accent: 'border-accent-emerald' },
  { key: 'nrf2', icon: Zap, accent: 'border-accent-cyan' },
  { key: 'mito', icon: Target, accent: 'border-accent-violet' },
  { key: 'hybrid', icon: Sparkles, accent: 'border-accent-amber' },
];

interface OnboardingModalProps {
  onComplete?: (milestone: UserMilestone) => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const pathname = usePathname();
  const { applyPreset, setProfile, addMilestone } = usePlatform();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<PresetKey>('starter');
  const [age, setAge] = useState(48);
  const [sleep, setSleep] = useState(60);

  useEffect(() => {
    // Only trigger on homepage — never block /library, /stack, /labs, etc.
    if (pathname !== '/') return;
    if (isOnboardingComplete()) return;
    if (sessionStorage.getItem(SESSION_DISMISSED_KEY)) return;
    // Delay so the hero is visible first
    const t = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(t);
  }, [pathname]);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_DISMISSED_KEY, '1');
    setOpen(false);
  }, []);

  const finish = useCallback(() => {
    applyPreset(goal);
    setProfile({ age, sleep, scanned: false });
    setOnboardingComplete();
    const milestone: UserMilestone = {
      id: `onboarding-complete-${Date.now()}`,
      kind: 'onboarding-complete',
      title: 'Longevity OS initialized',
      desc: `Started with ${stackPresets[goal].label} preset.`,
      date: new Date().toISOString().slice(0, 10),
      auto: true,
    };
    addMilestone(milestone);
    onComplete?.(milestone);
    setOpen(false);
  }, [applyPreset, goal, age, sleep, setProfile, addMilestone, onComplete]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Longevity OS"
        className="relative w-full max-w-md glass rounded-2xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-label text-accent-emerald">Welcome</p>
              <h2 className="text-xl font-bold mt-1">Initialize your Longevity OS</h2>
              <p className="text-body-sm text-muted-foreground mt-1">
                60-second setup — pick a goal, tune basics, land on your dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Skip setup, explore the site"
              className="shrink-0 mt-0.5 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          {step === 0 && (
            <>
              <p className="text-sm font-medium">Primary goal</p>
              <div className="grid grid-cols-2 gap-2">
                {goals.map(({ key, icon: Icon, accent }) => {
                  const preset = stackPresets[key];
                  const active = goal === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setGoal(key)}
                      className={cn(
                        'focus-ring rounded-xl border p-3 text-left transition-colors',
                        active ? `${accent} bg-muted/30` : 'border-border hover:border-accent-cyan/30',
                      )}
                    >
                      <Icon className="w-4 h-4 text-accent-cyan mb-2" aria-hidden="true" />
                      <p className="text-sm font-semibold">{preset.label}</p>
                      <p className="text-caption text-muted-foreground mt-0.5">{preset.desc}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Slider label="Age" value={age} min={25} max={85} onChange={setAge} unit=" yrs" />
              <Slider
                label="Sleep quality"
                value={sleep}
                min={0}
                max={100}
                onChange={setSleep}
                unit="%"
              />
              <p className="text-caption text-muted-foreground">
                Run the defense scan later from the dashboard for biological age.
              </p>
            </>
          )}
        </div>

        <div className="border-t border-border px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 w-6 rounded-full',
                    i === step ? 'bg-accent-emerald' : 'bg-border',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore first →
            </button>
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
                Back
              </Button>
            )}
            {step < 1 ? (
              <Button size="sm" icon={ArrowRight} onClick={() => setStep(1)}>
                Continue
              </Button>
            ) : (
              <Button size="sm" theme="emerald" onClick={finish}>
                Open dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}