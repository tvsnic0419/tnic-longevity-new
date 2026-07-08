import { analyzeStack } from './stack-analysis';
import type { LabEntry } from './labs';
import type { Profile } from '@/context/PlatformContext';
import type { EvidenceLevel } from './types';

export type UserMilestoneKind =
  | 'first-compound'
  | 'stack-built'
  | 'defense-scanned'
  | 'labs-baseline'
  | 'labs-retest'
  | 'synergy-70'
  | 'hallmark-5'
  | 'onboarding-complete';

export interface UserMilestone {
  id: string;
  kind: UserMilestoneKind;
  title: string;
  desc: string;
  date: string;
  auto: boolean;
}

export interface MilestoneDetectInput {
  selected: string[];
  profile: Profile;
  labs: LabEntry[];
  prevLabsCount: number;
  existing: UserMilestone[];
}

const CATALOG: Record<
  UserMilestoneKind,
  { title: string; desc: string; evidence: EvidenceLevel }
> = {
  'first-compound': {
    title: 'First compound added',
    desc: 'You started building a personalized longevity stack.',
    evidence: 'Personal',
  },
  'stack-built': {
    title: 'Stack architected',
    desc: 'Three or more compounds selected — multi-pathway coverage active.',
    evidence: 'Personal',
  },
  'defense-scanned': {
    title: 'Defense scan complete',
    desc: 'Biological age and pathway priority calculated from your profile.',
    evidence: 'Personal',
  },
  'labs-baseline': {
    title: 'Baseline labs logged',
    desc: 'First biomarker entry — foundation for N=1 tracking.',
    evidence: 'Personal',
  },
  'labs-retest': {
    title: 'Retest logged',
    desc: 'Follow-up labs recorded — trend analysis unlocked.',
    evidence: 'Personal',
  },
  'synergy-70': {
    title: 'Synergy threshold reached',
    desc: 'Stack synergy score crossed 70 — strong complementary coverage.',
    evidence: 'Personal',
  },
  'hallmark-5': {
    title: 'Broad hallmark coverage',
    desc: 'Five or more hallmarks of aging addressed by your stack.',
    evidence: 'Personal',
  },
  'onboarding-complete': {
    title: 'Longevity OS initialized',
    desc: 'Onboarding complete — preset stack and dashboard ready.',
    evidence: 'Personal',
  },
};

function hasKind(milestones: UserMilestone[], kind: UserMilestoneKind): boolean {
  return milestones.some((m) => m.kind === kind);
}

function daysBetween(a: string, b: string): number {
  return Math.floor(
    (new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

function makeMilestone(kind: UserMilestoneKind): UserMilestone {
  const meta = CATALOG[kind];
  return {
    id: `${kind}-${Date.now()}`,
    kind,
    title: meta.title,
    desc: meta.desc,
    date: new Date().toISOString().slice(0, 10),
    auto: true,
  };
}

/** Detect new auto-milestones from platform state changes. Returns only newly earned items. */
export function detectNewMilestones(input: MilestoneDetectInput): UserMilestone[] {
  const { selected, profile, labs, prevLabsCount, existing } = input;
  const earned: UserMilestone[] = [];
  const analysis = analyzeStack(selected);

  if (selected.length >= 1 && !hasKind(existing, 'first-compound')) {
    earned.push(makeMilestone('first-compound'));
  }

  if (selected.length >= 3 && !hasKind(existing, 'stack-built')) {
    earned.push(makeMilestone('stack-built'));
  }

  if (profile.scanned && !hasKind(existing, 'defense-scanned')) {
    earned.push(makeMilestone('defense-scanned'));
  }

  if (labs.length >= 1 && prevLabsCount === 0 && !hasKind(existing, 'labs-baseline')) {
    earned.push(makeMilestone('labs-baseline'));
  }

  if (labs.length >= 2 && prevLabsCount < labs.length && !hasKind(existing, 'labs-retest')) {
    const sorted = [...labs].sort((a, b) => a.date.localeCompare(b.date));
    const earliest = sorted[0]?.date;
    const latest = sorted[sorted.length - 1]?.date;
    if (earliest && latest && daysBetween(earliest, latest) >= 14) {
      earned.push(makeMilestone('labs-retest'));
    }
  }

  if (analysis.score >= 70 && !hasKind(existing, 'synergy-70')) {
    earned.push(makeMilestone('synergy-70'));
  }

  if (analysis.hallmarkCount >= 5 && !hasKind(existing, 'hallmark-5')) {
    earned.push(makeMilestone('hallmark-5'));
  }

  return earned;
}

export function milestoneEvidenceLevel(kind: UserMilestoneKind): EvidenceLevel {
  return CATALOG[kind].evidence;
}

export const ONBOARDING_STORAGE_KEY = 'tnic-onboarding-complete';

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
}

export function setOnboardingComplete(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch {
    /* private browsing */
  }
}