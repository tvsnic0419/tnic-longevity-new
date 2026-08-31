import { it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { compounds, safetyNotes } from './data';

interface AuditRow {
  id: string;
}

/**
 * The promoted set, read from the committed extraction audit — the record of
 * what scripts/promote-compounds.mjs pulled out of each deep-dive, and what it
 * skipped and why.
 */
const PROMOTED: string[] = (
  JSON.parse(readFileSync('scripts/.promote-audit.json', 'utf8')) as AuditRow[]
).map((r) => r.id);

// Anti-fabrication guardrail for compounds promoted out of the deep-dive
// library by scripts/promote-compounds.mjs. NOTES-COMPOUND-LIBRARY.md forbids
// promoting a module by inventing mechanism text, doses, bioavailability or
// PMIDs, so this asserts the stronger property: every safety-relevant value on
// a promoted compound appears verbatim in that compound's own published
// deep-dive. If someone hand-edits a dose or adds a bioavailability figure
// without a source, this fails.
it('every promoted field traces verbatim to its MDX', () => {
  const failures: string[] = [];
  let checked = 0;
  for (const c of compounds) {
    // Scoped to the promoted set. The original hand-authored entries predate
    // the deep-dives and were written independently, so they legitimately do
    // not mirror their MDX — this invariant is about the extraction pipeline.
    if (!PROMOTED.includes(c.id)) continue;
    const path = `content/compounds/${c.id}.mdx`;
    if (!existsSync(path)) { failures.push(`${c.id}: no MDX`); continue; }
    const src = readFileSync(path, 'utf8');
    const norm = (s: string) => s.replace(/[*_`\[\]]/g, '').replace(/\s+/g, ' ');
    const hay = norm(src);
    checked++;
    // dose must appear verbatim in the source
    if (!hay.includes(norm(c.dose))) failures.push(`${c.id}: dose not in MDX -> ${c.dose}`);
    // every PMID must appear in the source
    for (const s of c.studies) {
      if (!src.includes(s.pmid)) failures.push(`${c.id}: PMID ${s.pmid} not in MDX`);
    }
    // no fabricated bioavailability
    if (c.bioavailability != null) failures.push(`${c.id}: has bioavailability ${c.bioavailability}`);
    // safety bullets must appear in the source
    const sn = safetyNotes.find((n) => n.compoundId === c.id);
    if (!sn) failures.push(`${c.id}: no safety profile`);
    else for (const line of [...sn.cautions, ...sn.avoidIf, ...sn.consultIf]) {
      if (!hay.includes(norm(line))) failures.push(`${c.id}: safety line not in MDX -> ${line.slice(0, 50)}`);
    }
  }
  expect(checked).toBeGreaterThan(50);
  expect(failures.slice(0, 25)).toEqual([]);
});
