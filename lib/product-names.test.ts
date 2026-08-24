import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEPRECATED_ALIASES } from './product-names';

/**
 * Canonical-names guard.
 *
 * `lib/product-names.ts` is the single source of truth for TNiC's product /
 * tool / dashboard labels. Every string that used to drift ("My Longevity
 * OS", "Stack Builder", etc.) must now be re-exported from that file — the
 * DEPRECATED_ALIASES list names each retired literal.
 *
 * This test greps the source tree for those literals and fails if any appear
 * outside a small allowlist:
 *   - `lib/product-names.ts` itself (defines / documents them)
 *   - test files (they may assert on the retired string as regression tests)
 *   - the `next.config.ts` redirects block (referenced by name in the comment)
 *   - Markdown docs (docs/, README, CHANGELOG) that record historical decisions
 *   - `content/**` MDX bodies — long-form editorial content pinned to the
 *     public URL of the moment they were written; edited via content
 *     workflow, not the design-system boundary
 *   - build/output directories (`.next`, `node_modules`, `dist`)
 */
const ALLOWED_FILE_PATTERNS: RegExp[] = [
  /^lib\/product-names\.ts$/,
  /\.test\.ts$/,
  /^next\.config\.ts$/,
  /^(docs|README|CHANGELOG|AGENTS|NOTES|STYLE_GUIDE|INTEGRATION_STRATEGY|SEO_STRATEGY|ELEVATION-CHECKLIST)/i,
  /^(docs|content)\//,
  /\.md$/,
  /\.mdx$/,
  /^\.next\//,
  /^node_modules\//,
  /^dist\//,
  /^\.git\//,
];

const SCAN_DIRS = ['app', 'components', 'lib'];
const SCAN_EXTENSIONS = /\.(ts|tsx)$/;

function walk(dir: string, root: string, out: string[]): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(root, full);
    if (ALLOWED_FILE_PATTERNS.some((p) => p.test(rel))) continue;
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, root, out);
    } else if (SCAN_EXTENSIONS.test(entry)) {
      out.push(full);
    }
  }
}

function findMatches(needle: string): { file: string; line: number }[] {
  const root = process.cwd();
  const files: string[] = [];
  for (const dir of SCAN_DIRS) {
    walk(resolve(root, dir), root, files);
  }
  const hits: { file: string; line: number }[] = [];
  for (const file of files) {
    const rel = relative(root, file);
    if (ALLOWED_FILE_PATTERNS.some((p) => p.test(rel))) continue;
    const text = readFileSync(file, 'utf8');
    const lines = text.split('\n');
    lines.forEach((ln, i) => {
      if (ln.includes(needle)) hits.push({ file: rel, line: i + 1 });
    });
  }
  return hits;
}

describe('canonical product names', () => {
  for (const alias of DEPRECATED_ALIASES) {
    it(`no source file outside the allowlist uses the retired literal "${alias}"`, () => {
      const hits = findMatches(alias);
      if (hits.length > 0) {
        const rendered = hits
          .map((h) => `  - ${h.file}:${h.line}`)
          .join('\n');
        throw new Error(
          `Found ${hits.length} occurrence(s) of "${alias}". Import the canonical constant from lib/product-names.ts instead:\n${rendered}`,
        );
      }
      expect(hits).toEqual([]);
    });
  }
});
