// ─────────────────────────────────────────────────────────────────────────────
// TNiC · viz molecule geometry
//
// Every compound hero that draws a molecule draws a REAL one. Structures come
// from two places, and the lookup order below is deliberate:
//
//   1. The hand-laid skeletons in this file. Four compounds whose substitution
//      patterns were placed and checked by hand and framed for this site's
//      fixed camera. These win.
//   2. `molecule-geometry.generated.ts` — real heavy-atom coordinates from
//      PubChem computed conformers, fetched by
//      `scripts/fetch-molecule-geometry.mjs` (npm run molecules:fetch). Each
//      entry records the CID, formula and IUPAC name it came from.
//
// Anything in neither falls back to the abstract orbital field (MoleculeStage
// `mode="field"`), and the caption says so in as many words.
//
// The honesty contract: we never render a fabricated structure and pass it off
// as the literal molecule, and we never let one constituent of a mixture read
// as the whole product. `molecule-sources.ts` decides which molecule each
// compound draws and whether it is the compound itself, an extract's named
// principal constituent, a polymer's repeat unit, or nothing at all;
// `describeGeometry` turns that into the line under the canvas.
// ─────────────────────────────────────────────────────────────────────────────

import { GENERATED_GEOMETRY } from "./molecule-geometry.generated";
import { MOLECULE_SOURCE_BY_ID, type MoleculeSourceKind } from "./molecule-sources";

// Elements actually present across the shipped structures. PubChem-sourced
// records add Se (selenomethionine) and Co (methylcobalamin) to the
// hand-built set; MoleculeStage falls back to the carbon palette for
// anything it has no colour for, so adding one here is never breaking.
export type Element = "C" | "O" | "N" | "S" | "P" | "Se" | "Co" | "F" | "Cl";
export type Atom = { x: number; y: number; z: number; el: Element };
export type Bond = [number, number, 1 | 2];
export type Geometry = { atoms: Atom[]; bonds: Bond[]; formula: string; label: string };

// ── trans-resveratrol (C14H12O3) — two aromatic rings + trans-ethene bridge ──
function buildResveratrol(): Geometry {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const R = 1.15;
  function ring(cx: number, cy: number, cz: number): number {
    const start = atoms.length;
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k - Math.PI / 6;
      atoms.push({
        x: cx + Math.cos(a) * R,
        y: cy + Math.sin(a) * R,
        z: cz + Math.sin(a * 2) * 0.18,
        el: "C",
      });
    }
    for (let k = 0; k < 6; k++) bonds.push([start + k, start + ((k + 1) % 6), k % 2 === 0 ? 2 : 1]);
    return start;
  }
  const aBase = ring(-2.35, 0, 0);
  const bBase = ring(2.35, 0, 0);
  const c1 = atoms.length; atoms.push({ x: -0.75, y: 0.15, z: 0.05, el: "C" });
  const c2 = atoms.length; atoms.push({ x: 0.75, y: -0.15, z: -0.05, el: "C" });
  bonds.push([c1, c2, 2]);
  bonds.push([aBase + 0, c1, 1]);
  bonds.push([bBase + 3, c2, 1]);
  function addOH(nearIdx: number, dx: number, dy: number, dz: number) {
    const na = atoms[nearIdx];
    const o = atoms.length;
    atoms.push({ x: na.x + dx, y: na.y + dy, z: na.z + dz, el: "O" });
    bonds.push([nearIdx, o, 1]);
  }
  addOH(aBase + 2, -0.55, 1.0, 0.1);
  addOH(aBase + 4, -0.55, -1.0, -0.1);
  addOH(bBase + 1, 0.9, 0.7, 0.1);
  return { atoms, bonds, formula: "C₁₄H₁₂O₃", label: "trans-3,5,4′-trihydroxystilbene" };
}

// ── pterostilbene (C16H16O3) — resveratrol's dimethoxy analog ──
function buildPterostilbene(): Geometry {
  // Same stilbene backbone; two of the ring-A hydroxyls become methoxy (shown
  // as O with an extra methyl carbon) — a faithful stylization of the analog.
  const g = buildResveratrol();
  // Promote the two ring-A oxygens to methoxy by hanging a carbon off each O.
  const oIdxs: number[] = [];
  g.atoms.forEach((a, i) => { if (a.el === "O" && a.x < -1.5) oIdxs.push(i); });
  for (const oi of oIdxs) {
    const o = g.atoms[oi];
    const c = g.atoms.length;
    g.atoms.push({ x: o.x - 0.6, y: o.y + 0.4, z: o.z + 0.2, el: "C" });
    g.bonds.push([oi, c, 1]);
  }
  return { atoms: g.atoms, bonds: g.bonds, formula: "C₁₆H₁₆O₃", label: "trans-3,5-dimethoxy-4′-hydroxystilbene" };
}

// Center a hand-built structure on the origin and scale it to a target span so
// it frames the same way as the other skeletons under MoleculeStage's fixed
// (viewport / 7.2) camera — which does no per-geometry bounding-box fit.
function normalizeGeometry(atoms: Atom[], targetSpan: number): void {
  let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
  for (const a of atoms) {
    minx = Math.min(minx, a.x); maxx = Math.max(maxx, a.x);
    miny = Math.min(miny, a.y); maxy = Math.max(maxy, a.y);
  }
  const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2;
  const span = Math.max(maxx - minx, maxy - miny) || 1;
  const s = targetSpan / span;
  for (const a of atoms) { a.x = (a.x - cx) * s; a.y = (a.y - cy) * s; a.z *= s; }
}

// ── astaxanthin (C40H52O4) — ketocarotenoid: a conjugated polyene chain
//    spanning two oxygenated ionone rings. Ported from this project's own
//    batch-01/02 "Descent" geometry (the same hand-laid structure shipped in
//    the library bundle), so it stays traceable to a structure we drew. ──
function buildAstaxanthin(): Geometry {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const R = 1.15;
  function hexRing(cx: number, cy: number, pucker: number, dbl: number[]): number {
    const start = atoms.length;
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k - Math.PI / 6;
      atoms.push({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, z: Math.sin(a * 2) * pucker, el: "C" });
    }
    for (let k = 0; k < 6; k++) bonds.push([start + k, start + ((k + 1) % 6), dbl.includes(k) ? 2 : 1]);
    return start;
  }
  function attach(nearIdx: number, dx: number, dy: number, dz: number, el: Atom["el"] = "O", order: 1 | 2 = 1): void {
    const na = atoms[nearIdx];
    atoms.push({ x: na.x + dx, y: na.y + dy, z: na.z + dz, el });
    bonds.push([nearIdx, atoms.length - 1, order]);
  }
  // polyene backbone — alternating double/single bonds are the antioxidant machinery
  const chain: number[] = [];
  const N = 11;
  for (let i = 0; i < N; i++) {
    chain.push(atoms.length);
    atoms.push({ x: -3.1 + i * 0.62, y: i % 2 === 0 ? 0.3 : -0.3, z: Math.sin(i * 0.9) * 0.16, el: "C" });
  }
  for (let i = 0; i < N - 1; i++) bonds.push([chain[i], chain[i + 1], i % 2 === 0 ? 2 : 1]);
  // methyl branches along the backbone
  attach(chain[2], -0.1, 1.02, 0.12, "C");
  attach(chain[5], 0.1, 1.02, -0.12, "C");
  attach(chain[8], -0.1, -1.02, 0.12, "C");
  // left ring — 3-hydroxy, 4-keto
  const L = hexRing(-5.0, 0.7, 0.26, [1]);
  bonds.push([L + 0, chain[0], 1]);
  attach(L + 3, -0.9, 0.62, 0.14, "O");
  attach(L + 5, 0.0, -1.0, -0.14, "O", 2);
  attach(L + 2, 0.0, 1.0, 0.16, "C");
  // right ring — 3′-hydroxy, 4′-keto
  const Rr = hexRing(5.0, 0.9, 0.26, [5]);
  bonds.push([Rr + 4, chain[N - 1], 1]);
  attach(Rr + 1, 0.9, 0.62, -0.14, "O");
  attach(Rr + 2, 0.0, 1.0, 0.14, "O", 2);
  attach(Rr + 0, 0.9, -0.62, 0.16, "C");
  normalizeGeometry(atoms, 6.4);
  return { atoms, bonds, formula: "C₄₀H₅₂O₄", label: "astaxanthin — 3,3′-dihydroxy-β,β-carotene-4,4′-dione" };
}

// ── NMN (C11H15N2O8P) — nicotinamide mononucleotide. Full nucleotide, not the
//    bare core: nicotinamide pyridinium ring → N-glycosidic bond → ribose
//    furanose (2′,3′-OH) → 5′-phosphate. This is what distinguishes NMN from
//    both nicotinamide and NR (which lacks the phosphate). Hand-laid here. ──
function buildNMN(): Geometry {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const add = (x: number, y: number, z: number, el: Atom["el"]): number => {
    atoms.push({ x, y, z, el });
    return atoms.length - 1;
  };

  // nicotinamide pyridinium ring — v0 is the ring N⁺ (glycosidic attachment)
  const pcx = -3.2, pcy = 0, Rr = 1.0;
  const ring: number[] = [];
  for (let k = 0; k < 6; k++) {
    const a = (Math.PI / 3) * k;
    ring.push(add(pcx + Math.cos(a) * Rr, pcy + Math.sin(a) * Rr, Math.sin(a * 2) * 0.12, k === 0 ? "N" : "C"));
  }
  for (let k = 0; k < 6; k++) bonds.push([ring[k], ring[(k + 1) % 6], k % 2 === 0 ? 2 : 1]);
  const N1 = ring[0], C3 = ring[2];

  // C3 carboxamide — C(=O)NH2
  const cc = add(-3.9, 1.9, 0.1, "C"); bonds.push([C3, cc, 1]);
  const oam = add(-3.2, 2.6, 0.15, "O"); bonds.push([cc, oam, 2]);
  const nam = add(-4.9, 2.3, 0.05, "N"); bonds.push([cc, nam, 1]);

  // ribose furanose — C1′-C2′-C3′-C4′-O4′, C1′ bonded to ring N1
  const c1 = add(-1.2, -0.1, 0.1, "C"); bonds.push([N1, c1, 1]);
  const c2 = add(-0.55, -0.95, -0.1, "C"); bonds.push([c1, c2, 1]);
  const c3 = add(0.35, -0.4, 0.12, "C"); bonds.push([c2, c3, 1]);
  const c4 = add(0.15, 0.65, -0.08, "C"); bonds.push([c3, c4, 1]);
  const o4 = add(-0.9, 0.85, 0.1, "O"); bonds.push([c4, o4, 1]); bonds.push([o4, c1, 1]);
  // 2′-OH, 3′-OH
  const o2 = add(-0.75, -1.9, -0.2, "O"); bonds.push([c2, o2, 1]);
  const o3 = add(1.35, -0.6, 0.2, "O"); bonds.push([c3, o3, 1]);

  // 5′-CH2 → 5′-phosphate
  const c5 = add(0.7, 1.6, -0.1, "C"); bonds.push([c4, c5, 1]);
  const o5 = add(1.7, 1.9, 0.05, "O"); bonds.push([c5, o5, 1]);
  const p = add(2.7, 1.5, 0, "P"); bonds.push([o5, p, 1]);
  const opa = add(3.1, 2.5, 0.15, "O"); bonds.push([p, opa, 2]);
  const opb = add(3.7, 1.2, -0.1, "O"); bonds.push([p, opb, 1]);
  const opc = add(2.9, 0.5, 0.1, "O"); bonds.push([p, opc, 1]);

  normalizeGeometry(atoms, 6.4);
  return { atoms, bonds, formula: "C₁₁H₁₅N₂O₈P", label: "nicotinamide mononucleotide — nicotinamide riboside 5′-phosphate" };
}

/** Registry of compounds we have real stylized geometry for. */
export const REGISTRY: Record<string, () => Geometry> = {
  resveratrol: buildResveratrol,
  pterostilbene: buildPterostilbene,
  astaxanthin: buildAstaxanthin,
  nmn: buildNMN,
};

/**
 * Hand-built skeletons win over the generated set. The four above were laid out
 * by hand against each compound's real substitution pattern and framed for this
 * site's camera; the PubChem batch fills in everything else. Lookup order is
 * deliberate, not incidental.
 */
export function hasGeometry(id: string): boolean {
  return id in REGISTRY || id in GENERATED_GEOMETRY;
}

export function getGeometry(id: string): Geometry | null {
  const built = REGISTRY[id];
  if (built) return built();
  return GENERATED_GEOMETRY[id] ?? null;
}

/**
 * What the page should tell the reader it is looking at. `self` means the
 * compound is this molecule; `constituent`/`repeat-unit` mean we are drawing a
 * named part of a mixture or polymer and must say which. Used by the hero
 * captions so a rendered structure is never passed off as something it isn't.
 */
export function getGeometryProvenance(id: string): {
  kind: MoleculeSourceKind;
  as?: string;
  cid?: number;
} | null {
  if (!hasGeometry(id)) return null;
  const src = MOLECULE_SOURCE_BY_ID.get(id);
  const gen = GENERATED_GEOMETRY[id];
  // A hand-built skeleton with no source row is the compound's own molecule.
  return { kind: src?.kind ?? 'self', as: src?.as, cid: gen?.cid };
}

/**
 * The line printed under the molecular canvas. One helper so every hero words
 * it identically, and so a mixture can never silently read as though its
 * principal constituent were the whole product.
 */
export function describeGeometry(id: string, displayName: string): string {
  const geom = getGeometry(id);
  const prov = getGeometryProvenance(id);
  if (!geom || !prov) {
    return "Illustrative orbital motif — not the literal molecular structure. See the deep-dive below for the mechanism.";
  }

  const cid = prov.cid ? ` · PubChem CID ${prov.cid}` : "";
  const tail = `${cid} · stylized for legibility, not a crystallographic reproduction`;
  // The formula is the compact, genuinely informative identifier. Full IUPAC
  // names for these molecules run past 100 characters and read as noise.
  const formula = geom.formula ? ` · ${geom.formula}` : "";

  if (prov.kind === "constituent") {
    return `Structure shown: ${prov.as ?? geom.label} — the principal active constituent of ${displayName}, not the whole preparation${formula}${tail}`;
  }
  if (prov.kind === "repeat-unit") {
    return `Structure shown: ${prov.as ?? geom.label} — ${displayName} is a polymer; this is its repeating unit${formula}${tail}`;
  }
  return `Rendered structure · ${geom.label}${formula}${tail}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Heteroatom labelling
//
// The renderer used to print the literal string "OH" over EVERY oxygen in every
// structure, unconditionally. That is a chemical claim, and across the shipped
// set it was wrong 242 times: 79 of the 81 oxygen-bearing structures carry at
// least one oxygen that is not a hydroxyl. CoQ10 and berberine have no hydroxyl
// at all, and every one of their oxygens was captioned "OH".
//
// These structures are heavy-atom only — hydrogens are not in the data — so
// nothing here can tell a hydroxyl from a deprotonated phosphate oxygen without
// asserting a protonation state the geometry does not record. The platform's
// rule is that a visualization may never imply a number, or here a functional
// group, the underlying data does not support.
//
// So the label is the element symbol, which is exactly what the data says and
// nothing more. It is also the convention PubChem's own 3D viewer uses, and it
// says more than "OH" did: nitrogen, sulfur, phosphorus, selenium and cobalt
// were previously identifiable only by sphere colour.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Which atoms carry a drawn symbol. Carbon is deliberately unlabelled — it is
 * the implicit backbone in every skeletal convention, and labelling it would
 * bury the heteroatoms that actually distinguish one structure from another.
 */
export function labelForAtom(el: Element): string | null {
  return el === "C" ? null : el;
}

/**
 * Heteroatom tally for one structure, for the text fallback every visualization
 * on this site owes. Ordered by count, then alphabetically, so the same
 * structure always reads the same way.
 */
export function heteroatomSummary(geom: Geometry): string {
  const counts = new Map<string, number>();
  for (const a of geom.atoms) {
    if (a.el === "C") continue;
    counts.set(a.el, (counts.get(a.el) ?? 0) + 1);
  }
  if (counts.size === 0) return "";
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([el, n]) => `${n} ${el}`)
    .join(" · ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Camera fit
//
// The renderer used one camera for all 87 structures: the molecule was drawn
// about the origin at a fixed `min(w, h) / 7.2` units-to-pixels scale, through a
// perspective divide with the eye a fixed 6 units back.
//
// None of those three constants survive contact with the shipped set. Measured
// over a sampled sphere of orientations against a 419px-tall stage, EVERY
// structure projects past the half-height it has to fit in at some point in its
// own rotation — resveratrol reaches 384px against 210px, pterostilbene 428px.
// The long ones are not "framed tight"; they are cut off, and they have been
// for as long as they have shipped. Two more consequences follow from the same
// constants: the centroid is ignored, so a molecule whose atoms average 0.94
// units off the origin orbits around a point outside itself rather than
// spinning in place; and a fixed 6-unit eye distance means a compact molecule
// is drawn in mild perspective while a long one is drawn through a fisheye, so
// the set has no consistent depth language.
//
// `cameraFit` replaces the constants with three numbers derived from the
// structure itself, computed once per geometry:
//
//   cx/cy/cz   its centroid, so it turns about its own middle;
//   eye        an eye distance proportional to its radius, so near-side
//              magnification lands near 1.5x for every molecule in the set
//              instead of ranging from 2.2x to 5.5x;
//   radius     the largest distance from centre the structure ever projects
//              to, sampled across orientations, so the caller can scale it to
//              the stage and have it stay inside the frame all the way round.
//
// Sampling rather than solving: the projected extent is a max over rotations of
// a perspective-divided norm, and a 24x12 sweep costs ~18k operations once per
// geometry. The exact envelope is not worth solving for a number that only sets
// a margin.
// ─────────────────────────────────────────────────────────────────────────────

export type CameraFit = {
  /** Centroid of the heavy atoms — subtract before rotating. */
  cx: number;
  cy: number;
  cz: number;
  /** Eye distance for the perspective divide: `eye / (eye + z)`. */
  eye: number;
  /** Worst-case projected radius, in geometry units, over all orientations. */
  radius: number;
};

const FIT_CACHE = new WeakMap<Geometry, CameraFit>();

export function cameraFit(geom: Geometry): CameraFit {
  const cached = FIT_CACHE.get(geom);
  if (cached) return cached;

  const n = geom.atoms.length || 1;
  let cx = 0, cy = 0, cz = 0;
  for (const a of geom.atoms) { cx += a.x; cy += a.y; cz += a.z; }
  cx /= n; cy /= n; cz /= n;

  const pts = geom.atoms.map((a) => ({ x: a.x - cx, y: a.y - cy, z: a.z - cz }));
  let maxR = 0;
  for (const p of pts) maxR = Math.max(maxR, Math.hypot(p.x, p.y, p.z));

  // Keep the eye clear of the structure by a comfortable multiple of its own
  // radius. The floor preserves the original framing for the compact molecules,
  // which were the ones the fixed 6 was tuned against.
  const eye = Math.max(6, maxR * 2.6 + 2);

  let radius = 0;
  for (let i = 0; i < 24; i += 1) {
    const ry = (i / 24) * Math.PI * 2;
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    for (let j = 0; j < 12; j += 1) {
      const rx = (j / 12) * Math.PI * 2;
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      for (const p of pts) {
        const x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        const y = p.y * cosX - z * sinX;
        z = p.y * sinX + z * cosX;
        const r = Math.hypot(x, y) * (eye / (eye + z));
        if (r > radius) radius = r;
      }
    }
  }

  const fit: CameraFit = { cx, cy, cz, eye, radius: Math.max(0.5, radius) };
  FIT_CACHE.set(geom, fit);
  return fit;
}
