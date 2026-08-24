import { describe, expect, it } from 'vitest';
import {
  SPONSORS,
  getActiveSponsor,
  isSponsorActive,
  type Sponsor,
  type SponsorSlotId,
} from '@/lib/sponsors';

const VALID_SLOTS: SponsorSlotId[] = ['brief', 'tools', 'library', 'partnerships'];

function fixture(overrides: Partial<Sponsor> = {}): Sponsor {
  return {
    id: 'acme',
    slot: 'brief',
    name: 'Acme Labs',
    tagline: 'At-home testing.',
    cta: 'Visit Acme',
    href: 'https://example.com/tnic',
    ...overrides,
  };
}

describe('sponsor flight window', () => {
  it('treats a placement with no end date as always active', () => {
    expect(isSponsorActive(fixture())).toBe(true);
  });

  it('is active on/through the end date and inactive after', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    expect(isSponsorActive(fixture({ runsUntil: '2026-12-31' }), now)).toBe(true);
    expect(isSponsorActive(fixture({ runsUntil: '2026-06-15' }), now)).toBe(true);
    expect(isSponsorActive(fixture({ runsUntil: '2026-01-01' }), now)).toBe(false);
  });

  it('treats an unparseable end date as inactive (fail closed)', () => {
    expect(isSponsorActive(fixture({ runsUntil: 'whenever' }))).toBe(false);
  });
});

describe('getActiveSponsor', () => {
  it('returns undefined for an unsold slot (default: all slots unsold)', () => {
    for (const slot of VALID_SLOTS) {
      expect(getActiveSponsor(slot)).toBeUndefined();
    }
  });
});

describe('SPONSORS inventory integrity', () => {
  it('is an array', () => {
    expect(Array.isArray(SPONSORS)).toBe(true);
  });

  // Guards any placement added later — no http links, no missing fields,
  // no duplicate ids, no unknown slots.
  it('every placement is well-formed', () => {
    const ids = new Set<string>();
    for (const s of SPONSORS) {
      expect(s.href.startsWith('https://'), `${s.id} must use https`).toBe(true);
      expect(VALID_SLOTS).toContain(s.slot);
      for (const field of ['id', 'name', 'tagline', 'cta'] as const) {
        expect(s[field]?.trim().length, `${s.id} missing ${field}`).toBeGreaterThan(0);
      }
      expect(ids.has(s.id), `duplicate sponsor id ${s.id}`).toBe(false);
      ids.add(s.id);
    }
  });
});
