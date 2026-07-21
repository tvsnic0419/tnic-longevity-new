/**
 * Molecular geometry model for the site-wide structure cascade.
 * ─────────────────────────────────────────────────────────────
 * Each intervention is described as atoms (2-D skeletal coordinates) + bonds.
 * Ring vertices are computed, not hand-typed, so hexagons/pentagons are
 * geometrically exact. Coordinates live in a local ~0–120 unit space; the
 * cascade scales/positions instances via CSS. Heteroatoms carry a tiny label
 * (O/N/S); carbons are implicit vertices, as in real skeletal formulae.
 *
 * These are the actual compounds featured across the library — resveratrol,
 * the nicotinamide (NAD⁺) core, spermidine, sulforaphane, fisetin, berberine —
 * drawn as authentic line structures, not decorative squiggles.
 */

export type Pt = readonly [number, number];
export type Bond = { a: Pt; b: Pt; order: 1 | 2 };
export type Label = { at: Pt; text: string };

export interface Molecule {
  id: string;
  name: string;
  /** Local bounding box the instance is normalized against. */
  w: number;
  h: number;
  bonds: Bond[];
  labels: Label[];
}

/** n-gon vertices, flat-top by default (rot in radians offsets the first vertex). */
function ring(cx: number, cy: number, r: number, n = 6, rot = 0): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = rot + (i * 2 * Math.PI) / n;
    return [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))] as Pt;
  });
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Aromatic ring: perimeter single bonds + alternating inner double bonds. */
function aromatic(v: Pt[]): Bond[] {
  const bonds: Bond[] = [];
  for (let i = 0; i < v.length; i++) {
    const a = v[i];
    const b = v[(i + 1) % v.length];
    bonds.push({ a, b, order: i % 2 === 0 ? 2 : 1 });
  }
  return bonds;
}

/** Single-bond polyline through a list of points. */
function chain(pts: Pt[], orders?: (1 | 2)[]): Bond[] {
  const bonds: Bond[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    bonds.push({ a: pts[i], b: pts[i + 1], order: orders?.[i] ?? 1 });
  }
  return bonds;
}

const R = 15; // canonical ring radius / bond length

// ── Resveratrol — trans-3,5,4'-trihydroxystilbene ────────────────────────────
function resveratrol(): Molecule {
  const A = ring(28, 45, R); // ring A
  const B = ring(96, 45, R); // ring B
  // vinyl bridge: A[0] (right vertex) → c1 → c2 (=double) → B[3] (left vertex)
  const c1: Pt = [51, 37];
  const c2: Pt = [66, 37];
  const oA2: Pt = [A[2][0] - 9, A[2][1] + 9];
  const oA4: Pt = [A[4][0] - 9, A[4][1] - 9];
  const oB: Pt = [B[0][0] + 11, B[0][1]];
  const bonds: Bond[] = [
    ...aromatic(A),
    ...aromatic(B),
    { a: A[0], b: c1, order: 1 },
    { a: c1, b: c2, order: 2 },
    { a: c2, b: B[3], order: 1 },
    // 3,5-diOH on ring A (meta)
    { a: A[2], b: oA2, order: 1 },
    { a: A[4], b: oA4, order: 1 },
    // 4'-OH on ring B (para)
    { a: B[0], b: oB, order: 1 },
  ];
  const labels: Label[] = [
    { at: oA2, text: 'HO' },
    { at: oA4, text: 'HO' },
    { at: oB, text: 'OH' },
  ];
  return { id: 'resveratrol', name: 'Resveratrol', w: 120, h: 90, bonds, labels };
}

// ── Nicotinamide — pyridine-3-carboxamide (NAD⁺ core) ────────────────────────
function nicotinamide(): Molecule {
  const P = ring(40, 45, R); // pyridine ring, N at P[4] (upper-left)
  // carboxamide off P[0] (right vertex): C(=O)-NH2
  const cC: Pt = [P[0][0] + 13, P[0][1] + 6];
  const oO: Pt = [cC[0], cC[1] + 13];
  const nN: Pt = [cC[0] + 13, cC[1] - 6];
  const bonds: Bond[] = [
    ...aromatic(P),
    { a: P[0], b: cC, order: 1 },
    { a: cC, b: oO, order: 2 },
    { a: cC, b: nN, order: 1 },
  ];
  const labels: Label[] = [
    { at: P[4], text: 'N' },
    { at: oO, text: 'O' },
    { at: nN, text: 'NH₂' },
  ];
  return { id: 'nicotinamide', name: 'Nicotinamide', w: 90, h: 80, bonds, labels };
}

// ── Spermidine — N-(3-aminopropyl)butane-1,4-diamine (polyamine) ─────────────
function spermidine(): Molecule {
  // zig-zag chain: H2N-(CH2)3-NH-(CH2)4-NH2
  const y0 = 40;
  const dx = 13;
  const amp = 9;
  const n = 10; // vertices
  const pts: Pt[] = Array.from({ length: n }, (_, i) => [
    round(8 + i * dx),
    round(y0 + (i % 2 === 0 ? 0 : amp)),
  ]);
  const bonds = chain(pts);
  const labels: Label[] = [
    { at: pts[0], text: 'H₂N' },
    { at: pts[4], text: 'N' }, // secondary amine (approx mid-chain)
    { at: pts[n - 1], text: 'NH₂' },
  ];
  return { id: 'spermidine', name: 'Spermidine', w: 8 + n * dx + 20, h: 70, bonds, labels };
}

// ── Sulforaphane — 1-isothiocyanato-4-(methylsulfinyl)butane ─────────────────
function sulforaphane(): Molecule {
  // CH3-S(=O)-(CH2)4-N=C=S
  const y0 = 40;
  const amp = 9;
  const pts: Pt[] = [
    [8, y0], // CH3
    [21, y0 + amp], // S
    [34, y0], // CH2
    [47, y0 + amp],
    [60, y0],
    [73, y0 + amp], // CH2 → N
    [86, y0], // N
    [99, y0 + amp], // C (central of N=C=S)
    [112, y0], // S
  ];
  const oO: Pt = [pts[1][0], pts[1][1] + 13]; // S=O off the sulfinyl S
  const bonds: Bond[] = [
    ...chain(pts, [1, 1, 1, 1, 1, 1, 2, 2]), // last two are the cumulated N=C=S diene
    { a: pts[1], b: oO, order: 2 },
  ];
  const labels: Label[] = [
    { at: pts[1], text: 'S' },
    { at: oO, text: 'O' },
    { at: pts[6], text: 'N' },
    { at: pts[8], text: 'S' },
  ];
  return { id: 'sulforaphane', name: 'Sulforaphane', w: 130, h: 70, bonds, labels };
}

// ── Fisetin — 3,7,3',4'-tetrahydroxyflavone (fused chromone + phenyl) ─────────
function fisetin(): Molecule {
  // Benzopyran-4-one: benzene ring (A) fused to pyranone ring (C).
  const A = ring(30, 55, R); // benzo ring
  // Pyranone ring shares edge A[0]-A[5] (right side). Build C ring off that edge.
  // Shared vertices: A[5] (top-right) and A[0] (right).
  const o1: Pt = [A[5][0] + 13, A[5][1] - 7]; // ring O
  const c2: Pt = [o1[0] + 14, o1[1] + 6]; // C2 (bears phenyl)
  const c3: Pt = [c2[0], c2[1] + 15]; // C3 (bears 3-OH)
  const c4: Pt = [A[0][0] + 13, A[0][1] + 6]; // C4 (carbonyl)
  const oxo: Pt = [c4[0] - 2, c4[1] + 14];
  // Phenyl ring B off C2
  const B = ring(c2[0] + 24, c2[1] - 6, R);
  const oh3: Pt = [c3[0] + 11, c3[1] + 5];
  const oh7: Pt = [A[3][0] - 11, A[3][1]];
  const oh4p: Pt = [B[0][0] + 11, B[0][1]];
  const oh3p: Pt = [B[1][0] + 5, B[1][1] + 11];
  const bonds: Bond[] = [
    ...aromatic(A),
    // pyranone ring
    { a: A[5], b: o1, order: 1 },
    { a: o1, b: c2, order: 1 },
    { a: c2, b: c3, order: 2 },
    { a: c3, b: c4, order: 1 },
    { a: c4, b: A[0], order: 1 },
    { a: c4, b: oxo, order: 2 },
    // C2 → phenyl
    { a: c2, b: B[3], order: 1 },
    ...aromatic(B),
    // hydroxyls: 3-OH (c3), 7-OH (ring A), 3',4'-diOH (ring B)
    { a: c3, b: oh3, order: 1 },
    { a: A[3], b: oh7, order: 1 },
    { a: B[0], b: oh4p, order: 1 },
    { a: B[1], b: oh3p, order: 1 },
  ];
  const labels: Label[] = [
    { at: o1, text: 'O' },
    { at: oxo, text: 'O' },
    { at: oh3, text: 'OH' },
    { at: oh7, text: 'HO' },
    { at: oh4p, text: 'OH' },
    { at: oh3p, text: 'OH' },
  ];
  return { id: 'fisetin', name: 'Fisetin', w: 120, h: 100, bonds, labels };
}

// ── Berberine — isoquinoline alkaloid (polycyclic centerpiece) ───────────────
function berberine(): Molecule {
  // Simplified but faithful tetracyclic skeleton: dioxole-fused ring (A),
  // ring B, quaternary N bridge, and dimethoxy-bearing ring D.
  const A = ring(28, 55, R); // benzodioxole aromatic
  const B = ring(58, 55, R);
  const C = ring(88, 55, R);
  const D = ring(118, 55, R);
  // methylenedioxy bridge across ring A (A[3]-A[4] side)
  const mO1: Pt = [A[3][0] - 9, A[3][1] + 6];
  const mO2: Pt = [A[4][0] - 9, A[4][1] - 6];
  const mC: Pt = [(mO1[0] + mO2[0]) / 2 - 8, (mO1[1] + mO2[1]) / 2];
  // two methoxy groups off ring D
  const oD1: Pt = [D[0][0] + 9, D[0][1] - 4];
  const oD2: Pt = [D[1][0] + 5, D[1][1] + 9];
  const bonds: Bond[] = [
    ...aromatic(A),
    ...aromatic(B),
    ...aromatic(C),
    ...aromatic(D),
    // ring fusions
    { a: A[0], b: B[3], order: 1 },
    { a: B[0], b: C[3], order: 1 },
    { a: C[0], b: D[3], order: 1 },
    // methylenedioxy
    { a: A[3], b: mO1, order: 1 },
    { a: A[4], b: mO2, order: 1 },
    { a: mO1, b: mC, order: 1 },
    { a: mO2, b: mC, order: 1 },
    // methoxy groups
    { a: D[0], b: oD1, order: 1 },
    { a: D[1], b: oD2, order: 1 },
  ];
  const labels: Label[] = [
    { at: mO1, text: 'O' },
    { at: mO2, text: 'O' },
    { at: B[5], text: 'N⁺' },
    { at: oD1, text: 'O' },
    { at: oD2, text: 'O' },
  ];
  return { id: 'berberine', name: 'Berberine', w: 150, h: 95, bonds, labels };
}

export const MOLECULES: Molecule[] = [
  resveratrol(),
  nicotinamide(),
  spermidine(),
  sulforaphane(),
  fisetin(),
  berberine(),
];
