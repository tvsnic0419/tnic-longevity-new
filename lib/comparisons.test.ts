import { describe, it, expect } from 'vitest';
import { evidenceComparisons } from './comparisons';
import { libraryModules, libraryCategoryMeta } from './library-modules';
import { hallmarkLibrary } from './hallmarks-library';

/**
 * Guard for the hand-authored `relatedHrefs` on each comparison. Nothing else
 * validated these, and three shipped as hard 404s (`/library/berberine`,
 * `/library/nad-mito-stack`, `/library/deregulated-nutrient-sensing`) plus one
 * mislabeled link. This asserts every `/library/*` relatedHref resolves to a
 * real route, mirroring app/library/[slug] and [slug]/[moduleSlug] resolution:
 * a category index, a hallmark page, a category/module page, or a compare page.
 */
const categorySlugs = Object.keys(libraryCategoryMeta);
const validLibraryPaths = new Set<string>();
for (const c of categorySlugs) validLibraryPaths.add(`/library/${c}`);
for (const h of hallmarkLibrary) validLibraryPaths.add(`/library/${h.slug}`);
for (const m of libraryModules) validLibraryPaths.add(`/library/${m.category}/${m.slug}`);
for (const cmp of evidenceComparisons) validLibraryPaths.add(`/library/compare/${cmp.slug}`);

describe('comparisons relatedHrefs', () => {
  it('every /library/* relatedHref resolves to a real library route', () => {
    const dead: string[] = [];
    for (const comp of evidenceComparisons) {
      for (const link of comp.relatedHrefs) {
        const path = link.href.split('#')[0]; // in-page anchors always resolve
        if (!path.startsWith('/library/')) continue;
        if (!validLibraryPaths.has(path)) {
          dead.push(`${comp.slug}: "${link.label}" -> ${link.href}`);
        }
      }
    }
    expect(dead, `dead /library links found:\n${dead.join('\n')}`).toEqual([]);
  });
});
