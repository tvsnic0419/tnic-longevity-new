#!/usr/bin/env node
/**
 * fetch-molecule-geometry.mjs — real molecular structures, from PubChem.
 *
 * Reads components/viz/molecule-sources.ts (the curated "which molecule does
 * this compound actually render" map), resolves every entry against PubChem,
 * downloads its computed 3D conformer, and writes the heavy-atom skeleton into
 * components/viz/molecule-geometry.generated.ts.
 *
 * Why fetch rather than draw: a hand-laid structure is a claim, and a wrong
 * one is indistinguishable from a right one to almost every reader. PubChem is
 * the authoritative public record, so the generated file records the CID,
 * molecular formula and IUPAC name behind every structure and anyone can check
 * it.
 *
 * Hydrogens are dropped — the existing hand-built skeletons are heavy-atom
 * ball-and-stick and the renderer is tuned for that density.
 *
 * Usage:  node scripts/fetch-molecule-geometry.mjs [--only=id,id]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCES = path.join(ROOT, 'components', 'viz', 'molecule-sources.ts');
const OUT = path.join(ROOT, 'components', 'viz', 'molecule-geometry.generated.ts');

const PUG = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const DELAY_MS = 350; // PubChem asks for <= 5 requests/sec; this is well under.
const TARGET_SPAN = 6.4; // matches the hand-built skeletons' framing

/** Elements the renderer has a palette for; anything else still draws, as carbon. */
const KNOWN_ELEMENTS = new Set(['C', 'O', 'N', 'S', 'P', 'SE', 'CO', 'MG', 'ZN', 'FE', 'CA', 'I', 'CL', 'F', 'B', 'NA', 'K']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pug(urlPath, { text = false } = {}) {
  const url = `${PUG}${urlPath}`;
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'tnic-molecule-geometry/1.0' } });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return text ? await res.text() : await res.json();
    } catch (err) {
      lastErr = err;
      await sleep(700 * 2 ** attempt);
    }
  }
  throw new Error(`PubChem request failed: ${urlPath} — ${lastErr?.message}`);
}

/**
 * Parse the curated source list straight out of the TS module. Reading the
 * literal rather than importing it keeps this script dependency-free (no
 * TS loader) while still failing loudly if the shape drifts.
 */
async function readSources() {
  const text = await fs.readFile(SOURCES, 'utf8');
  const body = text.slice(text.indexOf('MOLECULE_SOURCES: MoleculeSource[] = ['));
  const end = body.indexOf('\n];');
  const rows = body.slice(0, end).matchAll(/\{\s*id:\s*'([^']+)',\s*kind:\s*'([^']+)'(.*?)\},?\n/gs);
  const out = [];
  for (const m of rows) {
    const [, id, kind, rest] = m;
    const grab = (key) => {
      const r = new RegExp(`${key}:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)")`).exec(rest);
      return r ? (r[1] ?? r[2]).replace(/\\'/g, "'") : undefined;
    };
    out.push({ id, kind, query: grab('query'), as: grab('as') });
  }
  if (!out.length) throw new Error('No sources parsed — did molecule-sources.ts change shape?');
  return out;
}

/**
 * Resolve a query to a single CID plus the identity fields we record.
 * A `cid:NNN` query pins an exact record — used only where a name is genuinely
 * ambiguous (polymer repeat units, mostly) and the CID has been checked by hand.
 */
async function resolve(query) {
  const pinned = /^cid:(\d+)$/.exec(query.trim());
  const route = pinned
    ? `/compound/cid/${pinned[1]}`
    : `/compound/name/${encodeURIComponent(query)}`;
  const props = await pug(`${route}/property/MolecularFormula,IUPACName,Title/JSON`);
  const p = props?.PropertyTable?.Properties?.[0];
  if (!p?.CID) return null;
  return {
    cid: p.CID,
    formula: p.MolecularFormula ?? '',
    iupac: p.IUPACName ?? '',
    // PubChem's preferred title is the readable name ("Berberine"). IUPAC names
    // for these run to 100+ characters and are useless in a caption, so the
    // title becomes the label and the IUPAC name is kept for auditing.
    title: p.Title ?? '',
  };
}

/**
 * PubChem V2000 SDF → atoms + bonds. Prefers the computed 3D conformer; a few
 * large or flexible records have none, in which case the 2D layout is used and
 * flagged (it still renders correctly, just flat before the z-jitter).
 */
function parseSdf(sdf) {
  const lines = sdf.split('\n');
  const counts = lines[3];
  if (!counts) return null;
  const nAtoms = parseInt(counts.slice(0, 3), 10);
  const nBonds = parseInt(counts.slice(3, 6), 10);
  if (!Number.isFinite(nAtoms) || !Number.isFinite(nBonds)) return null;

  const raw = [];
  for (let i = 0; i < nAtoms; i += 1) {
    const l = lines[4 + i];
    raw.push({
      x: parseFloat(l.slice(0, 10)),
      y: parseFloat(l.slice(10, 20)),
      z: parseFloat(l.slice(20, 30)),
      el: l.slice(31, 34).trim().toUpperCase(),
    });
  }

  // Drop hydrogens, then remap bond indices onto the surviving heavy atoms.
  const keep = [];
  const remap = new Map();
  raw.forEach((a, i) => {
    if (a.el === 'H') return;
    remap.set(i, keep.length);
    keep.push(a);
  });

  const bonds = [];
  for (let i = 0; i < nBonds; i += 1) {
    const l = lines[4 + nAtoms + i];
    const a = parseInt(l.slice(0, 3), 10) - 1;
    const b = parseInt(l.slice(3, 6), 10) - 1;
    const order = parseInt(l.slice(6, 9), 10);
    if (!remap.has(a) || !remap.has(b)) continue; // bond to a dropped hydrogen
    // Aromatic (4) and higher orders render as single; the renderer only
    // distinguishes single from double.
    bonds.push([remap.get(a), remap.get(b), order === 2 ? 2 : 1]);
  }

  return { atoms: keep, bonds };
}

/** Centre on the origin and scale to the same span as the hand-built skeletons. */
function normalise(atoms) {
  if (!atoms.length) return;
  let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity, minz = Infinity, maxz = -Infinity;
  for (const a of atoms) {
    minx = Math.min(minx, a.x); maxx = Math.max(maxx, a.x);
    miny = Math.min(miny, a.y); maxy = Math.max(maxy, a.y);
    minz = Math.min(minz, a.z); maxz = Math.max(maxz, a.z);
  }
  const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, cz = (minz + maxz) / 2;
  const span = Math.max(maxx - minx, maxy - miny) || 1;
  const s = TARGET_SPAN / span;
  for (const a of atoms) {
    a.x = (a.x - cx) * s;
    a.y = (a.y - cy) * s;
    a.z = (a.z - cz) * s;
  }
}

/** Flat 2D records get a deterministic pucker so they don't spin as a disc. */
function jitterZ(atoms) {
  const flat = atoms.every((a) => Math.abs(a.z) < 1e-6);
  if (!flat) return false;
  for (const a of atoms) {
    const n = Math.sin(a.x * 12.9898 + a.y * 78.233) * 43758.5453;
    a.z = (n - Math.floor(n) - 0.5) * 0.4;
  }
  return true;
}

const r3 = (n) => Math.round(n * 1000) / 1000;

async function main() {
  const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7)?.split(',');
  const sources = (await readSources()).filter(
    (s) => s.kind !== 'none' && (!only || only.includes(s.id)),
  );

  // The generated file is written whole, so a filtered run would silently drop
  // every structure it didn't fetch. Keep --only as a spot-check tool and make
  // it refuse to touch the file rather than truncate it.
  if (only) {
    process.stderr.write(
      'NOTE: --only is a spot-check. It prints the identity table and exits ' +
        'without writing, so it cannot truncate the generated file.\n',
    );
  }

  process.stderr.write(`Resolving ${sources.length} structures from PubChem…\n`);

  const results = [];
  const failures = [];

  for (const src of sources) {
    try {
      const id = await resolve(src.query);
      if (!id) {
        failures.push({ ...src, reason: 'name did not resolve to a CID' });
        process.stderr.write(`  ✗ ${src.id} — "${src.query}" did not resolve\n`);
        await sleep(DELAY_MS);
        continue;
      }

      let sdf = await pug(`/compound/cid/${id.cid}/SDF?record_type=3d`, { text: true });
      let dims = '3d';
      if (!sdf) {
        await sleep(DELAY_MS);
        sdf = await pug(`/compound/cid/${id.cid}/SDF?record_type=2d`, { text: true });
        dims = '2d';
      }
      if (!sdf) {
        failures.push({ ...src, reason: 'no SDF record' });
        process.stderr.write(`  ✗ ${src.id} — CID ${id.cid} has no SDF\n`);
        await sleep(DELAY_MS);
        continue;
      }

      const parsed = parseSdf(sdf);
      if (!parsed || parsed.atoms.length < 2) {
        failures.push({ ...src, reason: 'SDF parsed to fewer than 2 heavy atoms' });
        process.stderr.write(`  ✗ ${src.id} — unparseable SDF\n`);
        await sleep(DELAY_MS);
        continue;
      }

      normalise(parsed.atoms);
      const puckered = jitterZ(parsed.atoms);

      const unknown = [...new Set(parsed.atoms.map((a) => a.el))].filter(
        (e) => !KNOWN_ELEMENTS.has(e),
      );

      results.push({
        ...src,
        ...id,
        dims,
        puckered,
        unknown,
        atoms: parsed.atoms,
        bonds: parsed.bonds,
      });

      process.stderr.write(
        `  ✓ ${src.id.padEnd(22)} CID ${String(id.cid).padEnd(10)} ${id.formula.padEnd(16)} ` +
          `${parsed.atoms.length} atoms ${dims}${unknown.length ? ` [unmapped: ${unknown}]` : ''}\n`,
      );
    } catch (err) {
      failures.push({ ...src, reason: err.message });
      process.stderr.write(`  ✗ ${src.id} — ${err.message}\n`);
    }
    await sleep(DELAY_MS);
  }

  // ── emit ──────────────────────────────────────────────────────────────────
  const L = [];
  L.push('// AUTOGENERATED by scripts/fetch-molecule-geometry.mjs — do not edit by hand.');
  L.push('//');
  L.push('// Real heavy-atom coordinates from PubChem computed conformers. Each entry');
  L.push('// records the CID, molecular formula and IUPAC name it came from, so any');
  L.push('// structure on the site can be checked against the public record.');
  L.push('//');
  L.push('// Regenerate:  npm run molecules:fetch');
  L.push('');
  L.push("import type { Geometry } from './molecule';");
  L.push('');
  L.push('export interface GeneratedGeometry extends Geometry {');
  L.push('  cid: number;');
  L.push('  iupac: string;');
  L.push("  /** '3d' = PubChem computed conformer; '2d' = flat layout, z-puckered for rotation. */");
  L.push("  dims: '3d' | '2d';");
  L.push('}');
  L.push('');
  L.push('export const GENERATED_GEOMETRY: Record<string, GeneratedGeometry> = {');

  for (const r of results) {
    const atoms = r.atoms
      .map((a) => `{x:${r3(a.x)},y:${r3(a.y)},z:${r3(a.z)},el:'${a.el === 'H' ? 'C' : titleCase(a.el)}'}`)
      .join(',');
    const bonds = r.bonds.map((b) => `[${b[0]},${b[1]},${b[2]}]`).join(',');
    L.push(`  ${JSON.stringify(r.id)}: {`);
    L.push(`    cid: ${r.cid},`);
    L.push(`    formula: ${JSON.stringify(subscriptFormula(r.formula))},`);
    // Some records have no common title and PubChem returns the literal
    // "CID 12345" — useless in a caption, so fall back to the curated name.
    const label = !r.title || /^CID \d+$/.test(r.title) ? r.query : r.title;
    L.push(`    label: ${JSON.stringify(label)},`);
    L.push(`    iupac: ${JSON.stringify(r.iupac)},`);
    L.push(`    dims: '${r.dims}',`);
    L.push(`    atoms: [${atoms}],`);
    L.push(`    bonds: [${bonds}],`);
    L.push('  },');
  }

  L.push('};');
  L.push('');
  if (!only) await fs.writeFile(OUT, L.join('\n'), 'utf8');

  process.stderr.write(
    `\n${only ? 'Checked' : 'Wrote'} ${results.length} structures` +
      `${only ? '' : ` to ${path.relative(ROOT, OUT)}`}` +
      `${failures.length ? `, ${failures.length} unresolved` : ''}\n`,
  );
  if (failures.length) {
    process.stderr.write('\nUnresolved (these keep the orbital field):\n');
    for (const f of failures) process.stderr.write(`  ${f.id} — ${f.query} — ${f.reason}\n`);
  }

  // Identity table for human review — a wrong molecule is as bad as a wrong citation.
  process.stdout.write('\n| compound | CID | formula | resolved name |\n|---|---|---|---|\n');
  for (const r of results) {
    process.stdout.write(
      `| ${r.id} | ${r.cid} | ${r.formula} | ${(r.iupac || '').slice(0, 70)} |\n`,
    );
  }
}

function titleCase(el) {
  return el.charAt(0) + el.slice(1).toLowerCase();
}

/** C5H6O5 → C₅H₆O₅, matching the hand-built skeletons' display style. */
function subscriptFormula(f) {
  const subs = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  return f.replace(/\d/g, (d) => subs[d]);
}

main().catch((err) => {
  process.stderr.write(`${err.stack ?? err}\n`);
  process.exit(1);
});
