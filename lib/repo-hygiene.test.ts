import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guards that keep the public GitHub tree safe for a sponsor or counsel to
 * open. Commercial outreach lists, commission tables, and session logs are
 * not product documentation — they do not belong at the repo root, and
 * target lists must not ship in the public tree at all.
 */
const BANNED_PUBLIC_PATHS = [
  'docs/SPONSOR_OUTREACH.md',
  'docs/sponsor-outreach-tracker.xlsx',
] as const;

const REQUIRED_ROOT_DOCS = ['README.md', 'LICENSE', 'STYLE_GUIDE.md', 'NOTES-COMPOUND-LIBRARY.md'] as const;

const REVIEW_STOPS = [
  '/',
  '/library',
  '/library/evidence',
  '/library/compounds/glynac',
  '/trust/methodology',
  '/trust/sponsorship',
] as const;

describe('public-tree hygiene for sponsor review', () => {
  it('does not publish internal commercial outreach', () => {
    for (const rel of BANNED_PUBLIC_PATHS) {
      expect(existsSync(resolve(process.cwd(), rel)), rel).toBe(false);
    }
  });

  it('keeps the product contracts at the root', () => {
    for (const rel of REQUIRED_ROOT_DOCS) {
      expect(existsSync(resolve(process.cwd(), rel)), rel).toBe(true);
    }
  });

  it('parks session logs under docs/internal, not the root', () => {
    expect(existsSync(resolve(process.cwd(), 'REDESIGN-PROGRESS.md'))).toBe(false);
    expect(existsSync(resolve(process.cwd(), 'docs/internal/REDESIGN-PROGRESS.md'))).toBe(true);
    expect(existsSync(resolve(process.cwd(), 'docs/README.md'))).toBe(true);
  });
});

describe('partnerships page is a sponsor-review brief', () => {
  const src = readFileSync(resolve(process.cwd(), 'app/partnerships/page.tsx'), 'utf8');

  it('derives platform numbers from registries, not literals', () => {
    expect(src).toContain('platformStats');
    expect(src).toContain("from '@/lib/platform-stats'");
  });

  it('renders inventory from the slot catalog', () => {
    expect(src).toContain('SPONSOR_SLOT_CATALOG');
    expect(src).toContain('getActiveSponsor');
  });

  it('ships the six-stop review path as live internal links', () => {
    for (const href of REVIEW_STOPS) {
      expect(src.includes(`href: '${href}'`) || src.includes(`href="${href}"`), href).toBe(true);
    }
  });
});
