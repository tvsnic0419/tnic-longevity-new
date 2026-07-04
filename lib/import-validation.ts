import { biomarkers, compounds } from '@/lib/data';
import { DEFAULT_HALLMARK_ENTRY, type HallmarkNotesMap } from '@/lib/hallmark-notes';
import type { LabEntry } from '@/lib/labs';
import type { UserMilestone, UserMilestoneKind } from '@/lib/milestone-engine';
import { stackPresets } from '@/lib/presets';
import type { ProfileStored } from '@/lib/privacy';
import { validateLabEntry, type LabEntryStored } from '@/lib/privacy';

const DEFAULT_STACK = stackPresets.starter.ids;

const DEFAULT_PROFILE: ProfileStored = {
  age: 48,
  stress: 55,
  sleep: 60,
  exercise: 45,
  scanned: false,
};

const VALID_MARKER_IDS = new Set(biomarkers.map((b) => b.id));

const MILESTONE_KINDS = new Set<UserMilestoneKind>([
  'first-compound',
  'stack-built',
  'defense-scanned',
  'labs-baseline',
  'labs-retest',
  'synergy-70',
  'hallmark-5',
  'onboarding-complete',
]);

const MAX_STACK_SIZE = 30;
const MAX_LABS = 500;
const MAX_CHECKLIST_ITEMS = 50;
const MAX_NOTE_LENGTH = 4000;
const MAX_MILESTONES = 50;

export interface ValidatedImportData {
  stack?: string[];
  profile?: ProfileStored;
  labs?: LabEntry[];
  checklist?: string[];
  hallmarkNotes?: HallmarkNotesMap;
  milestones?: UserMilestone[];
}

export type ImportResult =
  | { ok: true; data: ValidatedImportData; warnings: string[] }
  | { ok: false; errors: string[] };

function clamp(val: unknown, min: number, max: number, fallback: number): number {
  if (typeof val !== 'number' || !Number.isFinite(val)) return fallback;
  return Math.max(min, Math.min(max, val));
}

function isValidDateString(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}/.test(str);
}

export function validateProfile(raw: unknown): ProfileStored | null {
  if (!raw || typeof raw !== 'object') return null;

  const p = raw as Record<string, unknown>;

  return {
    age: clamp(p.age, 18, 120, DEFAULT_PROFILE.age),
    stress: clamp(p.stress, 0, 100, DEFAULT_PROFILE.stress),
    sleep: clamp(p.sleep, 0, 100, DEFAULT_PROFILE.sleep),
    exercise: clamp(p.exercise, 0, 100, DEFAULT_PROFILE.exercise),
    scanned: typeof p.scanned === 'boolean' ? p.scanned : DEFAULT_PROFILE.scanned,
  };
}

export function validateStack(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [...DEFAULT_STACK];

  return raw
    .filter(
      (id): id is string =>
        typeof id === 'string' && compounds.some((c) => c.id === id),
    )
    .slice(0, MAX_STACK_SIZE);
}

export function validateLabs(raw: unknown): { labs: LabEntry[]; warnings: string[] } {
  const warnings: string[] = [];
  if (!Array.isArray(raw)) return { labs: [], warnings };

  const labs: LabEntry[] = [];

  raw.slice(0, MAX_LABS).forEach((entry, i) => {
    if (!entry || typeof entry !== 'object') {
      warnings.push(`labs[${i}]: skipped invalid entry`);
      return;
    }

    const e = entry as Record<string, unknown>;
    const markerId =
      typeof e.markerId === 'string'
        ? e.markerId
        : typeof e.biomarker === 'string'
          ? e.biomarker
          : null;

    if (!markerId || !VALID_MARKER_IDS.has(markerId)) {
      warnings.push(`labs[${i}]: unknown marker "${String(markerId ?? '')}"`);
      return;
    }

    if (typeof e.value !== 'number' || !Number.isFinite(e.value)) {
      warnings.push(`labs[${i}]: invalid value`);
      return;
    }

    if (!isValidDateString(e.date)) {
      warnings.push(`labs[${i}]: invalid date`);
      return;
    }

    const normalized: LabEntryStored = {
      id: typeof e.id === 'string' && e.id.length > 0 ? e.id : crypto.randomUUID(),
      markerId,
      value: e.value,
      date: e.date as string,
    };

    if (!validateLabEntry(normalized)) {
      warnings.push(`labs[${i}]: failed validation`);
      return;
    }

    labs.push(normalized);
  });

  if (raw.length > MAX_LABS) {
    warnings.push(`labs: truncated to ${MAX_LABS} entries`);
  }

  return { labs, warnings };
}

export function validateChecklist(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim().slice(0, 200))
    .slice(0, MAX_CHECKLIST_ITEMS);
}

export function validateHallmarkNotes(raw: unknown): HallmarkNotesMap {
  if (!raw || typeof raw !== 'object') return {};

  const result: HallmarkNotesMap = {};

  for (const [hallmarkId, entry] of Object.entries(raw as Record<string, unknown>)) {
    if (!entry || typeof entry !== 'object') continue;

    const e = entry as Record<string, unknown>;
    const notes = typeof e.notes === 'string' ? e.notes.slice(0, MAX_NOTE_LENGTH) : '';
    const updatedAt =
      typeof e.updatedAt === 'string' && isValidDateString(e.updatedAt)
        ? e.updatedAt
        : new Date().toISOString();

    result[hallmarkId] = {
      status: clamp(e.status, 0, 100, DEFAULT_HALLMARK_ENTRY.status),
      notes,
      updatedAt,
    };
  }

  return result;
}

export function validateMilestones(raw: unknown): UserMilestone[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((entry): entry is UserMilestone => {
      if (!entry || typeof entry !== 'object') return false;
      const m = entry as Record<string, unknown>;
      return (
        typeof m.id === 'string' &&
        typeof m.kind === 'string' &&
        MILESTONE_KINDS.has(m.kind as UserMilestoneKind) &&
        typeof m.title === 'string' &&
        typeof m.desc === 'string' &&
        typeof m.date === 'string' &&
        isValidDateString(m.date) &&
        typeof m.auto === 'boolean'
      );
    })
    .map((m) => ({
      id: m.id.slice(0, 80),
      kind: m.kind,
      title: m.title.slice(0, 120),
      desc: m.desc.slice(0, 300),
      date: m.date.slice(0, 10),
      auto: m.auto,
    }))
    .slice(0, MAX_MILESTONES);
}

export function validatePlatformImport(rawData: unknown): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawData || typeof rawData !== 'object') {
    return { ok: false, errors: ['Invalid import format'] };
  }

  const data = rawData as Record<string, unknown>;
  const validated: ValidatedImportData = {};

  if (data.stack !== undefined) {
    const stack = validateStack(data.stack);
    if (Array.isArray(data.stack) && data.stack.length > 0 && stack.length === 0) {
      errors.push('No valid compound IDs in stack');
    } else {
      validated.stack = stack;
      if (Array.isArray(data.stack) && stack.length < data.stack.length) {
        warnings.push('Some stack compound IDs were invalid and removed');
      }
    }
  }

  if (data.profile !== undefined) {
    const profile = validateProfile(data.profile);
    if (!profile) {
      errors.push('Invalid profile data');
    } else {
      validated.profile = profile;
    }
  }

  if (data.labs !== undefined) {
    const { labs, warnings: labWarnings } = validateLabs(data.labs);
    validated.labs = labs;
    warnings.push(...labWarnings);
    if (Array.isArray(data.labs) && data.labs.length > 0 && labs.length === 0) {
      warnings.push('No valid lab entries found — labs were not imported');
    }
  }

  if (data.checklist !== undefined) {
    validated.checklist = validateChecklist(data.checklist);
  }

  if (data.hallmarkNotes !== undefined) {
    validated.hallmarkNotes = validateHallmarkNotes(data.hallmarkNotes);
  }

  if (data.milestones !== undefined) {
    validated.milestones = validateMilestones(data.milestones);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (
    validated.stack === undefined &&
    validated.profile === undefined &&
    validated.labs === undefined &&
    validated.checklist === undefined &&
    validated.hallmarkNotes === undefined &&
    validated.milestones === undefined
  ) {
    return { ok: false, errors: ['Import file contains no recognized data'] };
  }

  return { ok: true, data: validated, warnings };
}