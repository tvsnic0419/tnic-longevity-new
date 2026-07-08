import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compounds } from './data';
import { citationRegistry } from './trust';

const COMPOUNDS_DIR = resolve(process.cwd(), 'content/compounds');
const ALL_CONTENT_DIRS = ['compounds', 'hallmarks', 'synergies', 'lifestyle', 'guides'].map((d) =>
  resolve(process.cwd(), 'content', d),
);

function readMdx(dir: string): { slug: string; body: string }[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace('.mdx', ''), body: readFileSync(resolve(dir, f), 'utf8') }));
}

/** Mirrors slugify() in components/library/MdxRenderer.tsx — keep in sync. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const compoundDocs = readMdx(COMPOUNDS_DIR);
const allDocs = ALL_CONTENT_DIRS.flatMap(readMdx);

describe('content depth — every compound reaches the full-guide standard', () => {
  it.each(compoundDocs.map((d) => d.slug))('%s has a Monitoring section', (slug) => {
    const doc = compoundDocs.find((d) => d.slug === slug)!;
    expect(/^##.*monitoring/im.test(doc.body), `${slug} is missing a Monitoring section`).toBe(true);
  });

  it.each(compoundDocs.map((d) => d.slug))('%s has a Safety / red-flag section', (slug) => {
    const doc = compoundDocs.find((d) => d.slug === slug)!;
    const hasSafety = /^##.*(safety|red flag)/im.test(doc.body) || /:::redflag/.test(doc.body);
    expect(hasSafety, `${slug} is missing a Safety / red-flag section`).toBe(true);
  });

  it.each(compoundDocs.map((d) => d.slug))('%s has a Synergies / stack-integration section', (slug) => {
    const doc = compoundDocs.find((d) => d.slug === slug)!;
    expect(
      /^##.*(synerg|stack integration)/im.test(doc.body),
      `${slug} is missing a Synergies / stack-integration section`,
    ).toBe(true);
  });
});

describe('citation integrity', () => {
  it('no compound lists the same study PMID twice', () => {
    for (const compound of compounds) {
      const pmids = (compound.studies ?? []).map((s) => s.pmid).filter(Boolean);
      const unique = new Set(pmids);
      expect(unique.size, `${compound.id} has duplicate study PMIDs: ${pmids.join(', ')}`).toBe(
        pmids.length,
      );
    }
  });

  it('every PMID cited in prose is a well-formed 7–8 digit id', () => {
    for (const doc of allDocs) {
      for (const match of doc.body.matchAll(/\bPMID:?\s?(\d+)\b/g)) {
        const digits = match[1];
        expect(
          digits.length >= 7 && digits.length <= 8,
          `${doc.slug}.mdx has malformed PMID "${match[0]}"`,
        ).toBe(true);
      }
    }
  });

  it('the taurine Science paper uses one canonical PMID everywhere', () => {
    const CANONICAL = '37289866';
    const STALE = '37289930';
    const taurineCitation = citationRegistry.find((c) => c.id === 'c-taurine-2023');
    expect(taurineCitation?.pmid).toBe(CANONICAL);
    for (const doc of allDocs) {
      expect(doc.body.includes(STALE), `${doc.slug}.mdx still references stale PMID ${STALE}`).toBe(
        false,
      );
    }
  });
});

describe('internal link integrity', () => {
  it('every in-page anchor link points to a heading in the same document', () => {
    for (const doc of allDocs) {
      // Collect heading ids (## / ###) outside directive blocks.
      const ids = new Set<string>();
      let inDirective = false;
      for (const line of doc.body.split('\n')) {
        if (line.startsWith(':::')) {
          inDirective = !inDirective;
          continue;
        }
        if (inDirective) continue;
        const h = line.match(/^#{2,3}\s+(.*)$/);
        if (h) ids.add(slugify(h[1].trim()));
      }
      for (const link of doc.body.matchAll(/\]\((#[^)]+)\)/g)) {
        const anchor = link[1].slice(1);
        expect(ids.has(anchor), `${doc.slug}.mdx links to missing anchor #${anchor}`).toBe(true);
      }
    }
  });

  it('no inline markdown link has an empty href', () => {
    for (const doc of allDocs) {
      for (const link of doc.body.matchAll(/\[[^\]]+\]\(([^)]*)\)/g)) {
        expect(link[1].trim().length, `${doc.slug}.mdx has an empty link href`).toBeGreaterThan(0);
      }
    }
  });
});
