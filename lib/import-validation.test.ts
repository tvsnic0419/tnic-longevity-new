import { describe, expect, it, vi } from 'vitest';
import { stackPresets } from '@/lib/presets';
import {
  validateChecklist,
  validateHallmarkNotes,
  validateLabs,
  validateMilestones,
  validatePlatformImport,
  validateProfile,
  validateStack,
} from '@/lib/import-validation';

const STARTER_STACK = stackPresets.starter.ids;

describe('validateProfile', () => {
  it('clamps numeric fields to safe ranges', () => {
    const result = validateProfile({
      age: 200,
      stress: -10,
      sleep: 'bad',
      exercise: 150,
      scanned: true,
    });

    expect(result).toEqual({
      age: 120,
      stress: 0,
      sleep: 60,
      exercise: 100,
      scanned: true,
    });
  });

  it('returns null for non-object input', () => {
    expect(validateProfile(null)).toBeNull();
    expect(validateProfile('profile')).toBeNull();
  });
});

describe('validateStack', () => {
  it('keeps only known compound ids', () => {
    expect(validateStack(['nmn', 'fake-compound', 'glynac'])).toEqual(['nmn', 'glynac']);
  });

  it('falls back to starter preset when input is not an array', () => {
    expect(validateStack(undefined)).toEqual([...STARTER_STACK]);
  });

  it('returns empty array when every id is invalid', () => {
    expect(validateStack(['not-real', 'also-fake'])).toEqual([]);
  });
});

describe('validateLabs', () => {
  it('accepts markerId and legacy biomarker alias', () => {
    const { labs, warnings } = validateLabs([
      { markerId: 'gsh', value: 5.2, date: '2026-01-15', id: 'lab-1' },
      { biomarker: 'nad', value: 72, date: '2026-02-01' },
    ]);

    expect(warnings).toEqual([]);
    expect(labs).toHaveLength(2);
    expect(labs[0]).toMatchObject({ markerId: 'gsh', value: 5.2, date: '2026-01-15', id: 'lab-1' });
    expect(labs[1]).toMatchObject({ markerId: 'nad', value: 72, date: '2026-02-01' });
    expect(labs[1].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it('warns on unknown markers and invalid values', () => {
    const { labs, warnings } = validateLabs([
      { markerId: 'unknown', value: 1, date: '2026-01-01' },
      { markerId: 'gsh', value: NaN, date: '2026-01-01' },
      { markerId: 'gsh', value: 4, date: 'bad-date' },
    ]);

    expect(labs).toEqual([]);
    expect(warnings).toEqual([
      'labs[0]: unknown marker "unknown"',
      'labs[1]: invalid value',
      'labs[2]: invalid date',
    ]);
  });

  it('reports truncation when lab count exceeds limit', () => {
    const rows = Array.from({ length: 501 }, (_, i) => ({
      markerId: 'gsh',
      value: 4 + i * 0.001,
      date: '2026-01-01',
      id: `lab-${i}`,
    }));

    const { labs, warnings } = validateLabs(rows);

    expect(labs).toHaveLength(500);
    expect(warnings).toContain('labs: truncated to 500 entries');
  });
});

describe('validateChecklist', () => {
  it('trims and drops empty checklist items', () => {
    expect(validateChecklist(['  AM dose  ', '', 42, 'PM dose'])).toEqual(['AM dose', 'PM dose']);
  });
});

describe('validateHallmarkNotes', () => {
  it('normalizes note entries and clamps status', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-16T12:00:00Z'));

    const notes = validateHallmarkNotes({
      mito: { status: 500, notes: '  felt better  ', updatedAt: 'not-a-date' },
      bad: 'nope',
    });

    expect(notes.mito).toEqual({
      status: 100,
      notes: '  felt better  ',
      updatedAt: '2026-06-16T12:00:00.000Z',
    });
    expect(notes.bad).toBeUndefined();

    vi.useRealTimers();
  });
});

describe('validateMilestones', () => {
  it('keeps only well-formed milestone records', () => {
    const milestones = validateMilestones([
      {
        id: 'm-1',
        kind: 'stack-built',
        title: 'Stack architected',
        desc: 'Three compounds selected',
        date: '2026-03-01',
        auto: true,
      },
      {
        id: 'm-2',
        kind: 'not-real',
        title: 'Bad',
        desc: 'Bad',
        date: '2026-03-01',
        auto: true,
      },
    ]);

    expect(milestones).toHaveLength(1);
    expect(milestones[0].kind).toBe('stack-built');
  });
});

describe('validatePlatformImport', () => {
  it('accepts a realistic TNiC export payload', () => {
    const result = validatePlatformImport({
      stack: ['nmn', 'glynac'],
      profile: { age: 52, stress: 40, sleep: 75, exercise: 55, scanned: true },
      labs: [{ markerId: 'gsh', value: 5.1, date: '2026-01-10', id: 'a' }],
      checklist: ['Take AM stack'],
      hallmarkNotes: { mito: { status: 70, notes: 'Good energy', updatedAt: '2026-01-01' } },
      milestones: [
        {
          id: 'm-1',
          kind: 'onboarding-complete',
          title: 'Initialized',
          desc: 'Setup done',
          date: '2026-01-01',
          auto: true,
        },
      ],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.stack).toEqual(['nmn', 'glynac']);
    expect(result.data.profile?.age).toBe(52);
    expect(result.data.labs).toHaveLength(1);
    expect(result.data.checklist).toEqual(['Take AM stack']);
    expect(result.data.hallmarkNotes?.mito?.status).toBe(70);
    expect(result.data.milestones).toHaveLength(1);
    expect(result.warnings).toEqual([]);
  });

  it('rejects non-object payloads', () => {
    expect(validatePlatformImport(null)).toEqual({
      ok: false,
      errors: ['Invalid import format'],
    });
  });

  it('rejects imports with only invalid stack ids', () => {
    const result = validatePlatformImport({ stack: ['totally-fake'] });

    expect(result).toEqual({
      ok: false,
      errors: ['No valid compound IDs in stack'],
    });
  });

  it('warns when labs are present but none are importable', () => {
    const result = validatePlatformImport({
      profile: { age: 45 },
      labs: [{ markerId: 'unknown', value: 1, date: '2026-01-01' }],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.labs).toEqual([]);
    expect(result.warnings).toContain('labs[0]: unknown marker "unknown"');
    expect(result.warnings).toContain('No valid lab entries found — labs were not imported');
  });

  it('rejects empty recognized payloads', () => {
    expect(validatePlatformImport({ exportedAt: '2026-06-16' })).toEqual({
      ok: false,
      errors: ['Import file contains no recognized data'],
    });
  });

  it('rejects invalid profile objects', () => {
    expect(validatePlatformImport({ profile: 'bad' })).toEqual({
      ok: false,
      errors: ['Invalid profile data'],
    });
  });
});