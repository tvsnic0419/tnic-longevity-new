#!/usr/bin/env node
/**
 * verify-molecules.mjs — is every rendered structure the RIGHT molecule?
 *
 * `fetch-molecule-geometry.mjs` trusts PubChem's name resolver. That resolver is
 * good, but "did this name return the compound I meant?" is a different question
 * from "did it return something", and a plausible structure for the wrong
 * molecule is the failure nobody catches by eye.
 *
 * Four independent checks per shipped structure:
 *
 *   IDENTITY   the curated query appears in PubChem's own synonym list for the
 *              CID we stored. This is the real check — PubChem's synonyms are
 *              authoritative, so a name that isn't there means we resolved to a
 *              different compound.
 *   ATOM COUNT heavy atoms parsed out of the stored molecular formula must equal
 *              the number of atoms in the geometry. Catches a truncated or
 *              mis-parsed SDF.
 *   BONDS      no self-bonds, every index in range.
 *   FRAGMENTS  how many disconnected pieces the graph has. A salt or co-crystal
 *              renders as floating fragments, which usually means we should be
 *              drawing the active ion rather than the whole record.
 *
 * Usage:  node scripts/verify-molecules.mjs [--json]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GENERATED = path.join(ROOT, 'components', 'viz', 'molecule-geometry.generated.ts');
const SOURCES = path.join(ROOT, 'components', 'viz', 'molecule-sources.ts');

const PUG = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const DELAY_MS = 350;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pug(urlPath) {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(`${PUG}${urlPath}`, {
        headers: { 'User-Agent': 'tnic-molecule-audit/1.0' },
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      await sleep(700 * 2 ** attempt);
    }
  }
  throw new Error(`PubChem failed: ${urlPath} — ${lastErr?.message}`);
}

const norm = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/** Pull the shipped structures straight out of the generated module. */
async function readGenerated() {
  const text = await fs.readFile(GENERATED, 'utf8');
  const out = [];
  const blocks = text.matchAll(
    /"([^"]+)":\s*\{\s*cid:\s*(\d+),\s*(parts:\s*\[.*?\],\s*)?formula:\s*"([^"]*)",\s*label:\s*"((?:[^"\\]|\\.)*)",\s*iupac:\s*"((?:[^"\\]|\\.)*)",\s*dims:\s*'([^']+)',\s*atoms:\s*\[(.*?)\],\s*bonds:\s*\[((?:\[\d+,\d+,\d\],?)*)\],/gs,
  );
  for (const m of blocks) {
    const [, id, cid, partsRaw, formula, label, , dims, atomsRaw, bondsRaw] = m;
    const partCount = partsRaw ? (partsRaw.match(/"cid":/g) ?? []).length : 0;
    const atoms = [...atomsRaw.matchAll(/el:'([A-Za-z]+)'/g)].map((a) => a[1]);
    const bonds = [...bondsRaw.matchAll(/\[(\d+),(\d+),(\d)\]/g)].map((b) => [
      Number(b[1]),
      Number(b[2]),
    ]);
    out.push({ id, cid: Number(cid), formula, label, dims, atoms, bonds, partCount });
  }
  if (!out.length) throw new Error('Parsed no structures — did the generated file change shape?');
  return out;
}

async function readSources() {
  const text = await fs.readFile(SOURCES, 'utf8');
  const body = text.slice(text.indexOf('MOLECULE_SOURCES: MoleculeSource[] = ['));
  const rows = body.slice(0, body.indexOf('\n];')).matchAll(
    /\{\s*id:\s*'([^']+)',\s*kind:\s*'([^']+)'(.*?)\},?\n/gs,
  );
  const map = new Map();
  for (const m of rows) {
    const [, id, kind, rest] = m;
    const q = /query:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/.exec(rest);
    map.set(id, { id, kind, query: q ? (q[1] ?? q[2]).replace(/\\'/g, "'") : undefined });
  }
  return map;
}

/** "C₂₀H₁₈NO₄+" → heavy-atom count (hydrogens excluded, as the geometry is). */
function heavyAtomsFromFormula(formula) {
  const subs = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  const plain = formula.replace(/[₀-₉]/g, (d) => subs[d]);
  let total = 0;
  for (const m of plain.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    const el = m[1];
    if (!el) continue;
    const n = m[2] ? Number(m[2]) : 1;
    if (el === 'H') continue; // hydrogens are stripped from the geometry
    total += n;
  }
  return total;
}

/** Count disconnected pieces — a salt or co-crystal shows up as more than one. */
function fragmentCount(atomCount, bonds) {
  const parent = Array.from({ length: atomCount }, (_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const [a, b] of bonds) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }
  return new Set(Array.from({ length: atomCount }, (_, i) => find(i))).size;
}

async function main() {
  const structures = await readGenerated();
  const sources = await readSources();

  process.stderr.write(`Auditing ${structures.length} shipped structures against PubChem…\n`);

  const rows = [];
  for (const s of structures) {
    const src = sources.get(s.id);
    const row = { ...s, query: src?.query, kind: src?.kind, problems: [] };

    // ── ATOM COUNT ──────────────────────────────────────────────────────────
    const expected = heavyAtomsFromFormula(s.formula);
    row.expectedAtoms = expected;
    if (expected !== s.atoms.length) {
      row.problems.push(
        `atom count ${s.atoms.length} != ${expected} heavy atoms in ${s.formula}`,
      );
    }

    // ── BONDS ───────────────────────────────────────────────────────────────
    const selfBonds = s.bonds.filter(([a, b]) => a === b).length;
    const oor = s.bonds.filter(
      ([a, b]) => a >= s.atoms.length || b >= s.atoms.length || a < 0 || b < 0,
    ).length;
    if (selfBonds) row.problems.push(`${selfBonds} self-bond(s)`);
    if (oor) row.problems.push(`${oor} out-of-range bond index`);

    // ── FRAGMENTS ───────────────────────────────────────────────────────────
    row.fragments = fragmentCount(s.atoms.length, s.bonds);
    // A composite draws several molecules on purpose, so its expected fragment
    // count is the number of parts. Anything else should be one connected graph.
    const expectedFragments = s.partCount > 0 ? s.partCount : 1;
    if (row.fragments !== expectedFragments) {
      row.problems.push(
        `${row.fragments} disconnected fragments, expected ${expectedFragments}` +
          (s.partCount ? '' : ' — likely a salt/co-crystal record'),
      );
    }

    // ── IDENTITY ────────────────────────────────────────────────────────────
    // A pinned cid: query is a deliberate hand-check, so there's no name to match.
    if (src?.query && !/^cid:/.test(src.query) && src.kind !== 'composite') {
      const syn = await pug(`/compound/cid/${s.cid}/synonyms/JSON`);
      const list = syn?.InformationList?.Information?.[0]?.Synonym ?? [];
      row.synonymCount = list.length;
      const want = norm(src.query);
      const hit = list.some((x) => norm(x) === want);
      if (!hit) {
        // Near-miss is still worth distinguishing from a flat miss.
        const partial = list.slice(0, 40).find((x) => norm(x).includes(want) || want.includes(norm(x)));
        row.problems.push(
          `query "${src.query}" is NOT an exact PubChem synonym of CID ${s.cid}` +
            (partial ? ` (closest: "${partial}")` : ''),
        );
        row.identityHard = !partial;
      }
      await sleep(DELAY_MS);
    }

    rows.push(row);
    if (row.problems.length) {
      process.stderr.write(`  ✗ ${s.id.padEnd(20)} ${row.problems.join(' · ')}\n`);
    }
  }

  const bad = rows.filter((r) => r.problems.length);
  const clean = rows.length - bad.length;

  process.stdout.write(`\n## Molecule audit\n\n`);
  process.stdout.write(`- structures audited: **${rows.length}**\n`);
  process.stdout.write(`- clean: **${clean}**\n`);
  process.stdout.write(`- flagged: **${bad.length}**\n\n`);

  if (bad.length) {
    process.stdout.write('| compound | CID | formula | atoms | frags | problem |\n');
    process.stdout.write('|---|---:|---|---:|---:|---|\n');
    for (const r of bad) {
      process.stdout.write(
        `| ${r.id} | ${r.cid} | ${r.formula} | ${r.atoms.length}/${r.expectedAtoms} | ` +
          `${r.fragments} | ${r.problems.join('; ')} |\n`,
      );
    }
  }

  if (process.argv.includes('--json')) {
    await fs.writeFile(
      path.join(ROOT, 'reports', 'molecule-audit.json'),
      JSON.stringify(rows, null, 2),
    );
  }

  process.exitCode = bad.some((r) => r.identityHard) ? 1 : 0;
}

main().catch((err) => {
  process.stderr.write(`${err.stack ?? err}\n`);
  process.exit(2);
});
