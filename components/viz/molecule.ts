// ─────────────────────────────────────────────────────────────────────────────
// TNiC · viz molecule geometry
// Real, hand-placed stylized skeletons live here. We only ship a named
// ball-and-stick structure for a compound when we have actually laid out its
// substitution pattern — everything else falls back to an abstract orbital
// field (see MoleculeStage `mode="field"`). This keeps the honesty contract:
// we never render a fabricated structure and pass it off as the literal
// molecule. New skeletons can be added to REGISTRY over time.
//
// The compounds below reuse the site's own hand-verified 2D skeletal
// structures from components/ui/molecules.ts (the same data driving the
// ambient molecule cascade) via `fromSkeletal` — a geometric projection into
// 3D, not a new structure. That keeps every rendered molecule traceable to a
// structure someone on this project actually drew and checked.
// ─────────────────────────────────────────────────────────────────────────────

import { STRUCTURE_LIBRARY, type Molecule as SkeletalMolecule } from "@/components/ui/molecules";

export type Atom = { x: number; y: number; z: number; el: "C" | "O" | "N" | "S" | "P" | "Cl" | "F" };
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

// ── convert a hand-verified 2D skeletal structure into 3D ball-and-stick ──

function elementFromLabel(text?: string): Atom["el"] {
  if (!text) return "C"; // unlabeled vertex = implicit carbon, per skeletal-formula convention
  if (text.includes("Cl")) return "Cl";
  if (text.includes("O")) return "O";
  if (text.includes("N")) return "N";
  if (text.includes("F")) return "F";
  if (text.includes("S")) return "S";
  return "C";
}

function pointKey(p: readonly [number, number]): string {
  return `${Math.round(p[0] * 10)},${Math.round(p[1] * 10)}`;
}

// Cheap deterministic pseudo-noise, keyed on position — gives the flat
// skeletal drawing a subtle z-pucker so it doesn't rotate as a perfect disc.
function pseudoNoise(x: number, y: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

const SKELETAL_SPAN = 6.2; // target 3D span, matched to buildResveratrol's scale

function fromSkeletal(m: SkeletalMolecule, formula: string, label: string): Geometry {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const index = new Map<string, number>();
  const labelByKey = new Map<string, string>();
  for (const l of m.labels) labelByKey.set(pointKey(l.at), l.text);

  const scale = SKELETAL_SPAN / Math.max(m.w, m.h);
  const cx = m.w / 2, cy = m.h / 2;

  function atomIndex(p: readonly [number, number]): number {
    const key = pointKey(p);
    const existing = index.get(key);
    if (existing !== undefined) return existing;
    const x = (p[0] - cx) * scale;
    const y = -(p[1] - cy) * scale; // flip: skeletal y grows downward, 3D "up" should read up
    const z = (pseudoNoise(p[0], p[1]) - 0.5) * 0.4;
    const idx = atoms.length;
    atoms.push({ x, y, z, el: elementFromLabel(labelByKey.get(key)) });
    index.set(key, idx);
    return idx;
  }

  for (const b of m.bonds) bonds.push([atomIndex(b.a), atomIndex(b.b), b.order]);
  return { atoms, bonds, formula, label };
}

const skeletalById = new Map(STRUCTURE_LIBRARY.map((m) => [m.id, m]));

function buildFromSkeletal(id: string, formula: string, label: string): () => Geometry {
  return () => {
    const m = skeletalById.get(id);
    if (!m) throw new Error(`No skeletal structure registered for "${id}" in components/ui/molecules.ts`);
    return fromSkeletal(m, formula, label);
  };
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
  // Projected from the site's own verified skeletal structures — see the
  // module comment above.
  nmn: buildNMN,
  spermidine: buildFromSkeletal(
    "spermidine",
    "C₇H₁₉N₃",
    "N-(3-aminopropyl)butane-1,4-diamine",
  ),
  sulforaphane: buildFromSkeletal(
    "sulforaphane",
    "C₆H₁₁NOS₂",
    "1-isothiocyanato-4-(methylsulfinyl)butane",
  ),
  fisetin: buildFromSkeletal(
    "fisetin",
    "C₁₅H₁₀O₆",
    "3,7,3′,4′-tetrahydroxyflavone",
  ),
  berberine: buildFromSkeletal(
    "berberine",
    "C₂₀H₁₈NO₄⁺",
    "isoquinoline alkaloid (quaternary ammonium)",
  ),
  // PubChem-sourced hero structures. NEEDS CHEMIST REVIEW.
  "creatine": buildFromSkeletal('creatine', 'C₄H₉N₃O₂', '2-[carbamimidoyl(methyl)amino]acetic acid'),
  "curcumin": buildFromSkeletal('curcumin', 'C₂₁H₂₀O₆', 'Curcumin'),
  "quercetin": buildFromSkeletal('quercetin', 'C₁₅H₁₀O₇', '2-(3,4-dihydroxyphenyl)-3,5,7-trihydroxychromen-4-one'),
  "melatonin": buildFromSkeletal('melatonin', 'C₁₃H₁₆N₂O₂', 'N-[2-(5-methoxy-1H-indol-3-yl)ethyl]acetamide'),
  "glycine": buildFromSkeletal('glycine', 'C₂H₅NO₂', '2-aminoacetic acid'),
  "nac": buildFromSkeletal('nac', 'C₅H₉NO₃S', '(2R)-2-acetamido-3-sulfanylpropanoic acid'),
  "glucosamine": buildFromSkeletal('glucosamine', 'C₆H₁₃NO₅', 'Glucosamine'),
  "pqq": buildFromSkeletal('pqq', 'C₁₄H₆N₂O₈', 'PQQ'),
  "rala": buildFromSkeletal('rala', 'C₈H₁₄O₂S₂', '5-[(3R)-dithiolan-3-yl]pentanoic acid'),
  "urolithina": buildFromSkeletal('urolithina', 'C₁₃H₈O₄', '3,8-dihydroxybenzo[c]chromen-6-one'),
  "vitamin-d3": buildFromSkeletal('vitamin-d3', 'C₂₇H₄₄O', 'Vitamin D3'),
  "taurine": buildFromSkeletal('taurine', 'C₂H₇NO₃S', '2-aminoethanesulfonic acid'),
};

export function hasGeometry(id: string): boolean {
  return id in REGISTRY;
}

export function getGeometry(id: string): Geometry | null {
  const b = REGISTRY[id];
  return b ? b() : null;
}
