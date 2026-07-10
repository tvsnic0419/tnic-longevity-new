import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { authorityProfiles, getAuthorityProfile, getAuthorityCitations } from './authority-profiles';
import { getModuleBySlug } from './library-modules';
import { getCitationById } from './trust';

/** Read the `last_updated` value from a compound MDX file's frontmatter. */
function mdxLastUpdated(slug: string): string | undefined {
  const body = readFileSync(resolve(process.cwd(), 'content/compounds', `${slug}.mdx`), 'utf8');
  return body.match(/^last_updated:\s*(\S+)/m)?.[1];
}

/** Read the `evidence_tier` value from a compound MDX file's frontmatter. */
function mdxEvidenceTier(slug: string): string | undefined {
  const body = readFileSync(resolve(process.cwd(), 'content/compounds', `${slug}.mdx`), 'utf8');
  return body.match(/^evidence_tier:\s*(\S+)/m)?.[1];
}

const slugs = authorityProfiles.map((p) => p.moduleSlug);

describe('authority profiles — flagship compound depth', () => {
  it('covers the OTC Elite-8 compounds that have a library page', () => {
    expect(slugs.sort()).toEqual(
      ['glynac', 'nmn', 'pterostilbene', 'rapamycin', 'spermidine', 'taurine'].sort(),
    );
  });

  it.each(slugs)('%s resolves to a real compound module page', (slug) => {
    const moduleEntry = getModuleBySlug('compounds', slug);
    expect(moduleEntry, `${slug} has no compound module`).toBeDefined();
  });

  it.each(slugs)('%s references only real citations (no fabrication)', (slug) => {
    const profile = getAuthorityProfile(slug)!;
    for (const id of profile.humanEvidenceCitationIds) {
      expect(getCitationById(id), `${slug} references missing citation ${id}`).toBeDefined();
    }
    // Every resolved citation must carry a PMID (or DOI) — no citation without a source.
    for (const c of getAuthorityCitations(profile)) {
      expect(Boolean(c.pmid || c.doi), `${c.id} has no PMID/DOI`).toBe(true);
    }
  });

  it.each(slugs)('%s states at least one honest evidence boundary', (slug) => {
    const profile = getAuthorityProfile(slug)!;
    expect(profile.boundaries.length).toBeGreaterThan(0);
    for (const b of profile.boundaries) {
      expect(b.trim().length, `${slug} has an empty boundary`).toBeGreaterThan(0);
    }
  });

  it.each(slugs)('%s last-reviewed date matches its MDX frontmatter', (slug) => {
    const profile = getAuthorityProfile(slug)!;
    expect(profile.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(profile.lastReviewed, `${slug} lastReviewed drifted from MDX`).toBe(mdxLastUpdated(slug));
  });

  it.each(slugs)('%s evidence grade matches its MDX frontmatter', (slug) => {
    const profile = getAuthorityProfile(slug)!;
    expect(profile.evidenceTier, `${slug} tier drifted from MDX`).toBe(mdxEvidenceTier(slug));
  });
});
