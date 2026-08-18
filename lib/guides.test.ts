import { describe, it, expect } from 'vitest';
import {
  SUPPLEMENT_GUIDES,
  getSiblingGuides,
  getCompoundSlugsForGuide,
  getCompoundLinksForGuide,
  getHallmarksForGuide,
} from './guides';
import { getMappedGuideHrefs } from './library-graph';
import { libraryModules } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';

/**
 * Coverage guard for the supplement-guide graph. These assertions make guide
 * orphaning a CI failure: adding a compound→guide mapping without a registry
 * entry, renaming a guide route on one side only, or pointing a guide at a
 * compound with no page all fail here instead of shipping a dead cross-link.
 */

const compoundModuleSlugs = new Set(
  libraryModules.filter((m) => m.category === 'compounds').map((m) => m.slug),
);

describe('supplement guide registry coherence', () => {
  it('has unique guide routes', () => {
    const hrefs = SUPPLEMENT_GUIDES.map((g) => g.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('has exactly one master guide', () => {
    expect(SUPPLEMENT_GUIDES.filter((g) => g.isMaster)).toHaveLength(1);
  });

  it('every compound→guide route maps back to a registry entry', () => {
    const registered = new Set(SUPPLEMENT_GUIDES.map((g) => g.href));
    for (const href of getMappedGuideHrefs()) {
      expect(registered, `guide route ${href} is referenced by the compound→guide map but missing from SUPPLEMENT_GUIDES`).toContain(href);
    }
  });

  it('every non-master guide covers at least one real compound module', () => {
    for (const guide of SUPPLEMENT_GUIDES) {
      if (guide.isMaster) continue;
      const slugs = getCompoundSlugsForGuide(guide.href);
      expect(slugs.length, `${guide.href} covers no compound (not wired into the compound→guide map)`).toBeGreaterThan(0);
      for (const slug of slugs) {
        expect(compoundModuleSlugs, `${guide.href} covers "${slug}" which has no /library/compounds page`).toContain(slug);
      }
    }
  });

  it('every guide carries complete presentation metadata', () => {
    for (const guide of SUPPLEMENT_GUIDES) {
      expect(guide.label.length, `${guide.href} missing label`).toBeGreaterThan(0);
      expect(guide.short.length, `${guide.href} missing short`).toBeGreaterThan(0);
      expect(guide.description.length, `${guide.href} missing description`).toBeGreaterThan(0);
      expect(guide.badge.length, `${guide.href} missing badge`).toBeGreaterThan(0);
      expect(guide.pills.length, `${guide.href} should have quick-fact pills`).toBeGreaterThan(0);
    }
  });
});

describe('getHallmarksForGuide', () => {
  const hallmarkSlugs = new Set(hallmarkLibrary.map((h) => h.slug));

  it('resolves every non-master guide to real, ordered hallmark pages', () => {
    for (const guide of SUPPLEMENT_GUIDES) {
      if (guide.isMaster) continue;
      const hallmarks = getHallmarksForGuide(guide.href);
      expect(hallmarks.length, `${guide.href} targets no hallmark`).toBeGreaterThan(0);
      const numbers = hallmarks.map((h) => h.number);
      expect(numbers, `${guide.href} hallmarks should be ordered by number`).toEqual([...numbers].sort((a, b) => a - b));
      for (const h of hallmarks) {
        expect(hallmarkSlugs, `${guide.href} links hallmark "${h.slug}" that has no page`).toContain(h.slug);
      }
    }
  });
});

describe('getCompoundLinksForGuide', () => {
  it('resolves every non-master guide to real, tier-sorted compound pages that match its slug set', () => {
    for (const guide of SUPPLEMENT_GUIDES) {
      if (guide.isMaster) continue;
      const links = getCompoundLinksForGuide(guide.href);
      const slugs = getCompoundSlugsForGuide(guide.href);
      // One link per covered compound that has a page (all do, per the guard above).
      expect(links.length, `${guide.href} derived no compound links`).toBe(slugs.length);
      const tiers = links.map((l) => l.evidence);
      expect(tiers, `${guide.href} compound links should be tier-sorted`).toEqual([...tiers].sort());
      for (const l of links) {
        expect(compoundModuleSlugs, `${guide.href} links compound "${l.slug}" with no page`).toContain(l.slug);
        expect(l.name.length, `${l.slug} missing display name`).toBeGreaterThan(0);
      }
    }
  });
});

describe('getSiblingGuides', () => {
  it('never returns the current guide and leads with the master hub', () => {
    for (const guide of SUPPLEMENT_GUIDES) {
      const siblings = getSiblingGuides(guide.href);
      expect(siblings.map((s) => s.href)).not.toContain(guide.href);
      if (!guide.isMaster) {
        expect(siblings[0]?.isMaster, `${guide.href} should surface the master guide first`).toBe(true);
      }
    }
  });
});
