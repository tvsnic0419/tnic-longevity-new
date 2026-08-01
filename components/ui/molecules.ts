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


// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURE_LIBRARY — structures for compound-page heroes (getGeometry), kept
// SEPARATE from MOLECULES so the ambient cascade stays curated. PubChem-sourced
// (record_type=2d), heavy atoms only. Each NEEDS CHEMIST REVIEW before trust.
// ─────────────────────────────────────────────────────────────────────────────
export const STRUCTURE_LIBRARY: Molecule[] = [
  ...MOLECULES,
  creatine(),
  curcumin(),
  quercetin(),
  melatonin(),
  glycine(),
  nac(),
  glucosamine(),
  pqq(),
  rala(),
  urolithina(),
  vitamind3(),
  taurine(),
];

// ── Creatine (C₄H₉N₃O₂) ────────────────────────────────────────────
// PubChem CID 586 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function creatine(): Molecule {
  const bonds: Bond[] = [
    { a: [12, 38], b: [34.5, 51], order: 1 },
    { a: [34.5, 77], b: [34.5, 51], order: 2 },
    { a: [79.6, 51], b: [57, 38], order: 1 },
    { a: [79.6, 51], b: [79.6, 77], order: 1 },
    { a: [79.6, 51], b: [102.1, 38], order: 1 },
    { a: [124.6, 51], b: [102.1, 38], order: 1 },
    { a: [102.1, 12], b: [102.1, 38], order: 2 },
    { a: [57, 38], b: [34.5, 51], order: 1 },
  ];
  const labels: Label[] = [
    { at: [12, 38], text: 'O' },
    { at: [34.5, 77], text: 'O' },
    { at: [79.6, 51], text: 'N' },
    { at: [124.6, 51], text: 'N' },
    { at: [102.1, 12], text: 'N' },
  ];
  return { id: 'creatine', name: 'Creatine', w: 136.6, h: 89, bonds, labels };
}

// ── Curcumin (C₂₁H₂₀O₆) ────────────────────────────────────────────
// PubChem CID 969516 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function curcumin(): Molecule {
  const bonds: Bond[] = [
    { a: [34.5, 298], b: [57, 285], order: 1 },
    { a: [34.5, 298], b: [12, 285], order: 1 },
    { a: [192.1, 25], b: [192.1, 51], order: 1 },
    { a: [192.1, 25], b: [169.6, 12], order: 1 },
    { a: [79.6, 324], b: [79.6, 298], order: 1 },
    { a: [237.2, 51], b: [214.6, 64], order: 1 },
    { a: [79.6, 168], b: [102.1, 181], order: 2 },
    { a: [102.1, 129], b: [124.6, 142], order: 2 },
    { a: [79.6, 246], b: [57, 259], order: 2 },
    { a: [79.6, 246], b: [102.1, 259], order: 1 },
    { a: [79.6, 246], b: [79.6, 220], order: 1 },
    { a: [169.6, 90], b: [169.6, 64], order: 2 },
    { a: [169.6, 90], b: [192.1, 103], order: 1 },
    { a: [169.6, 90], b: [147.1, 103], order: 1 },
    { a: [124.6, 168], b: [102.1, 181], order: 1 },
    { a: [124.6, 168], b: [124.6, 142], order: 1 },
    { a: [57, 259], b: [57, 285], order: 1 },
    { a: [169.6, 64], b: [192.1, 51], order: 1 },
    { a: [57, 285], b: [79.6, 298], order: 2 },
    { a: [192.1, 51], b: [214.6, 64], order: 2 },
    { a: [102.1, 259], b: [102.1, 285], order: 2 },
    { a: [192.1, 103], b: [214.6, 90], order: 2 },
    { a: [79.6, 220], b: [102.1, 207], order: 2 },
    { a: [147.1, 103], b: [147.1, 129], order: 2 },
    { a: [79.6, 298], b: [102.1, 285], order: 1 },
    { a: [214.6, 64], b: [214.6, 90], order: 1 },
    { a: [102.1, 181], b: [102.1, 207], order: 1 },
    { a: [124.6, 142], b: [147.1, 129], order: 1 },
  ];
  const labels: Label[] = [
    { at: [34.5, 298], text: 'O' },
    { at: [192.1, 25], text: 'O' },
    { at: [79.6, 324], text: 'O' },
    { at: [237.2, 51], text: 'O' },
    { at: [79.6, 168], text: 'O' },
    { at: [102.1, 129], text: 'O' },
  ];
  return { id: 'curcumin', name: 'Curcumin', w: 249.2, h: 336, bonds, labels };
}

// ── Quercetin (C₁₅H₁₀O₇) ───────────────────────────────────────────
// PubChem CID 5280343 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function quercetin(): Molecule {
  const bonds: Bond[] = [
    { a: [103.8, 90.9], b: [81.3, 77.9], order: 1 },
    { a: [103.8, 90.9], b: [126.3, 77.9], order: 1 },
    { a: [148.8, 38.9], b: [126.3, 51.9], order: 1 },
    { a: [58.3, 12], b: [58, 38], order: 1 },
    { a: [103.8, 12.9], b: [103.8, 38.9], order: 2 },
    { a: [12, 91.5], b: [34.5, 78.4], order: 1 },
    { a: [171.3, 155.9], b: [171.3, 129.9], order: 1 },
    { a: [216.4, 129.9], b: [193.9, 116.9], order: 1 },
    { a: [81.3, 51.9], b: [81.3, 77.9], order: 1 },
    { a: [81.3, 51.9], b: [103.8, 38.9], order: 1 },
    { a: [81.3, 51.9], b: [58, 38], order: 2 },
    { a: [81.3, 77.9], b: [58, 91.8], order: 2 },
    { a: [126.3, 77.9], b: [148.8, 90.9], order: 1 },
    { a: [126.3, 77.9], b: [126.3, 51.9], order: 2 },
    { a: [148.8, 90.9], b: [148.8, 116.9], order: 2 },
    { a: [148.8, 90.9], b: [171.3, 77.9], order: 1 },
    { a: [126.3, 51.9], b: [103.8, 38.9], order: 1 },
    { a: [58, 38], b: [34.5, 51.4], order: 1 },
    { a: [58, 91.8], b: [34.5, 78.4], order: 1 },
    { a: [34.5, 78.4], b: [34.5, 51.4], order: 2 },
    { a: [148.8, 116.9], b: [171.3, 129.9], order: 1 },
    { a: [171.3, 77.9], b: [193.9, 90.9], order: 2 },
    { a: [171.3, 129.9], b: [193.9, 116.9], order: 2 },
    { a: [193.9, 90.9], b: [193.9, 116.9], order: 1 },
  ];
  const labels: Label[] = [
    { at: [103.8, 90.9], text: 'O' },
    { at: [148.8, 38.9], text: 'O' },
    { at: [58.3, 12], text: 'O' },
    { at: [103.8, 12.9], text: 'O' },
    { at: [12, 91.5], text: 'O' },
    { at: [171.3, 155.9], text: 'O' },
    { at: [216.4, 129.9], text: 'O' },
  ];
  return { id: 'quercetin', name: 'Quercetin', w: 228.4, h: 167.9, bonds, labels };
}

// ── Melatonin (C₁₃H₁₆N₂O₂) ─────────────────────────────────────────
// PubChem CID 896 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function melatonin(): Molecule {
  const bonds: Bond[] = [
    { a: [34.5, 91.8], b: [57, 104.8], order: 1 },
    { a: [34.5, 91.8], b: [12, 104.8], order: 1 },
    { a: [211.1, 56.1], b: [193.7, 36.7], order: 2 },
    { a: [126.7, 138.7], b: [102.1, 130.8], order: 1 },
    { a: [126.7, 138.7], b: [141.8, 117.8], order: 1 },
    { a: [168.3, 42.1], b: [160.2, 66.8], order: 1 },
    { a: [168.3, 42.1], b: [193.7, 36.7], order: 1 },
    { a: [126.7, 96.9], b: [102.1, 104.8], order: 1 },
    { a: [126.7, 96.9], b: [134.7, 72.2], order: 1 },
    { a: [126.7, 96.9], b: [141.8, 117.8], order: 2 },
    { a: [102.1, 104.8], b: [102.1, 130.8], order: 2 },
    { a: [102.1, 104.8], b: [79.6, 91.8], order: 1 },
    { a: [134.7, 72.2], b: [160.2, 66.8], order: 1 },
    { a: [102.1, 130.8], b: [79.6, 143.8], order: 1 },
    { a: [79.6, 91.8], b: [57, 104.8], order: 2 },
    { a: [79.6, 143.8], b: [57, 130.8], order: 2 },
    { a: [57, 104.8], b: [57, 130.8], order: 1 },
    { a: [193.7, 36.7], b: [201.8, 12], order: 1 },
  ];
  const labels: Label[] = [
    { at: [34.5, 91.8], text: 'O' },
    { at: [211.1, 56.1], text: 'O' },
    { at: [126.7, 138.7], text: 'N' },
    { at: [168.3, 42.1], text: 'N' },
  ];
  return { id: 'melatonin', name: 'Melatonin', w: 223.1, h: 155.8, bonds, labels };
}

// ── Glycine (C₂H₅NO₂) ──────────────────────────────────────────────
// PubChem CID 750 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function glycine(): Molecule {
  const bonds: Bond[] = [
    { a: [12, 12], b: [34.5, 25], order: 1 },
    { a: [34.5, 51], b: [34.5, 25], order: 2 },
    { a: [79.6, 25], b: [57, 12], order: 1 },
    { a: [57, 12], b: [34.5, 25], order: 1 },
  ];
  const labels: Label[] = [
    { at: [12, 12], text: 'O' },
    { at: [34.5, 51], text: 'O' },
    { at: [79.6, 25], text: 'N' },
  ];
  return { id: 'glycine', name: 'Glycine', w: 91.6, h: 63, bonds, labels };
}

// ── N-acetylcysteine (C₅H₉NO₃S) ────────────────────────────────────
// PubChem CID 12035 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function nac(): Molecule {
  const bonds: Bond[] = [
    { a: [102.1, 90], b: [79.6, 77], order: 1 },
    { a: [124.6, 51], b: [102.1, 38], order: 1 },
    { a: [102.1, 12], b: [102.1, 38], order: 2 },
    { a: [34.5, 77], b: [34.5, 51], order: 2 },
    { a: [79.6, 51], b: [57, 38], order: 1 },
    { a: [57, 38], b: [34.5, 51], order: 1 },
    { a: [79.6, 51], b: [79.6, 77], order: 1 },
    { a: [79.6, 51], b: [102.1, 38], order: 1 },
    { a: [34.5, 51], b: [12, 38], order: 1 },
  ];
  const labels: Label[] = [
    { at: [102.1, 90], text: 'S' },
    { at: [124.6, 51], text: 'O' },
    { at: [102.1, 12], text: 'O' },
    { at: [34.5, 77], text: 'O' },
    { at: [57, 38], text: 'N' },
  ];
  return { id: 'nac', name: 'N-acetylcysteine', w: 136.6, h: 102, bonds, labels };
}

// ── Glucosamine (C₆H₁₃NO₅) ─────────────────────────────────────────
// PubChem CID 439213 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function glucosamine(): Molecule {
  const bonds: Bond[] = [
    { a: [57, 38], b: [34.5, 51], order: 1 },
    { a: [57, 38], b: [79.6, 51], order: 1 },
    { a: [57, 90], b: [57, 116], order: 1 },
    { a: [34.5, 77], b: [12, 90], order: 1 },
    { a: [102.1, 38], b: [79.6, 51], order: 1 },
    { a: [12, 12], b: [12, 38], order: 1 },
    { a: [79.6, 77], b: [102.1, 90], order: 1 },
    { a: [57, 90], b: [34.5, 77], order: 1 },
    { a: [57, 90], b: [79.6, 77], order: 1 },
    { a: [34.5, 77], b: [34.5, 51], order: 1 },
    { a: [79.6, 77], b: [79.6, 51], order: 1 },
    { a: [34.5, 51], b: [12, 38], order: 1 },
  ];
  const labels: Label[] = [
    { at: [57, 38], text: 'O' },
    { at: [57, 116], text: 'O' },
    { at: [12, 90], text: 'O' },
    { at: [102.1, 38], text: 'O' },
    { at: [12, 12], text: 'O' },
    { at: [102.1, 90], text: 'N' },
  ];
  return { id: 'glucosamine', name: 'Glucosamine', w: 114.1, h: 128, bonds, labels };
}

// ── PQQ (C₁₄H₆N₂O₈) ────────────────────────────────────────────────
// PubChem CID 1024 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function pqq(): Molecule {
  const bonds: Bond[] = [
    { a: [113.3, 156.2], b: [113.3, 130.2], order: 2 },
    { a: [158.3, 130.2], b: [135.8, 117.2], order: 2 },
    { a: [89.9, 12.4], b: [90.2, 38.4], order: 1 },
    { a: [12, 126.7], b: [25, 104.2], order: 1 },
    { a: [67.8, 51.6], b: [90.2, 38.4], order: 2 },
    { a: [12, 81.7], b: [25, 104.2], order: 2 },
    { a: [182.3, 12], b: [182.2, 38], order: 1 },
    { a: [204.7, 51.1], b: [182.2, 38], order: 2 },
    { a: [66.2, 83.3], b: [90.8, 91.2], order: 1 },
    { a: [66.2, 83.3], b: [51, 104.2], order: 1 },
    { a: [159.5, 78], b: [135.8, 91.2], order: 1 },
    { a: [159.5, 78], b: [159.7, 50.9], order: 2 },
    { a: [90.8, 91.2], b: [113.3, 78.2], order: 1 },
    { a: [90.8, 91.2], b: [90.8, 117.2], order: 2 },
    { a: [113.3, 78.2], b: [135.8, 91.2], order: 2 },
    { a: [113.3, 78.2], b: [112.9, 51.1], order: 1 },
    { a: [90.8, 117.2], b: [66.2, 125.1], order: 1 },
    { a: [90.8, 117.2], b: [113.3, 130.2], order: 1 },
    { a: [135.8, 91.2], b: [135.8, 117.2], order: 1 },
    { a: [112.9, 51.1], b: [136.2, 37.4], order: 2 },
    { a: [112.9, 51.1], b: [90.2, 38.4], order: 1 },
    { a: [66.2, 125.1], b: [51, 104.2], order: 2 },
    { a: [51, 104.2], b: [25, 104.2], order: 1 },
    { a: [113.3, 130.2], b: [135.8, 117.2], order: 1 },
    { a: [136.2, 37.4], b: [159.7, 50.9], order: 1 },
    { a: [159.7, 50.9], b: [182.2, 38], order: 1 },
  ];
  const labels: Label[] = [
    { at: [113.3, 156.2], text: 'O' },
    { at: [158.3, 130.2], text: 'O' },
    { at: [89.9, 12.4], text: 'O' },
    { at: [12, 126.7], text: 'O' },
    { at: [67.8, 51.6], text: 'O' },
    { at: [12, 81.7], text: 'O' },
    { at: [182.3, 12], text: 'O' },
    { at: [204.7, 51.1], text: 'O' },
    { at: [66.2, 83.3], text: 'N' },
    { at: [159.5, 78], text: 'N' },
  ];
  return { id: 'pqq', name: 'PQQ', w: 216.7, h: 168.2, bonds, labels };
}

// ── R-alpha-lipoic acid (C₈H₁₄O₂S₂) ────────────────────────────────
// PubChem CID 6112 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function rala(): Molecule {
  const bonds: Bond[] = [
    { a: [165.2, 55.4], b: [186.2, 40.1], order: 1 },
    { a: [165.2, 55.4], b: [144.1, 40.1], order: 1 },
    { a: [186.2, 40.1], b: [178.2, 15.4], order: 1 },
    { a: [12, 12], b: [31.3, 29.4], order: 1 },
    { a: [25.9, 54.8], b: [31.3, 29.4], order: 2 },
    { a: [144.1, 40.1], b: [119.4, 48.1], order: 1 },
    { a: [144.1, 40.1], b: [152.2, 15.4], order: 1 },
    { a: [119.4, 48.1], b: [100.1, 30.7], order: 1 },
    { a: [152.2, 15.4], b: [178.2, 15.4], order: 1 },
    { a: [100.1, 30.7], b: [75.4, 38.8], order: 1 },
    { a: [75.4, 38.8], b: [56, 21.4], order: 1 },
    { a: [56, 21.4], b: [31.3, 29.4], order: 1 },
  ];
  const labels: Label[] = [
    { at: [165.2, 55.4], text: 'S' },
    { at: [186.2, 40.1], text: 'S' },
    { at: [12, 12], text: 'O' },
    { at: [25.9, 54.8], text: 'O' },
  ];
  return { id: 'rala', name: 'R-alpha-lipoic acid', w: 198.2, h: 67.4, bonds, labels };
}

// ── Urolithin A (C₁₃H₈O₄) ──────────────────────────────────────────
// PubChem CID 5488186 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function urolithina(): Molecule {
  const bonds: Bond[] = [
    { a: [126.3, 91.8], b: [126.3, 65.8], order: 1 },
    { a: [126.3, 91.8], b: [103.8, 104.8], order: 1 },
    { a: [12, 105.4], b: [34.5, 92.3], order: 1 },
    { a: [103.8, 130.8], b: [103.8, 104.8], order: 2 },
    { a: [172.7, 12.6], b: [150.2, 25.5], order: 1 },
    { a: [81.3, 65.8], b: [103.8, 52.8], order: 1 },
    { a: [81.3, 65.8], b: [81.3, 91.8], order: 2 },
    { a: [81.3, 65.8], b: [58, 51.9], order: 1 },
    { a: [103.8, 52.8], b: [126.3, 65.8], order: 2 },
    { a: [103.8, 52.8], b: [103.4, 25.7], order: 1 },
    { a: [81.3, 91.8], b: [58, 105.7], order: 1 },
    { a: [81.3, 91.8], b: [103.8, 104.8], order: 1 },
    { a: [126.3, 65.8], b: [150, 52.6], order: 1 },
    { a: [58, 51.9], b: [34.5, 65.3], order: 2 },
    { a: [103.4, 25.7], b: [126.7, 12], order: 2 },
    { a: [58, 105.7], b: [34.5, 92.3], order: 2 },
    { a: [150, 52.6], b: [150.2, 25.5], order: 2 },
    { a: [34.5, 65.3], b: [34.5, 92.3], order: 1 },
    { a: [126.7, 12], b: [150.2, 25.5], order: 1 },
  ];
  const labels: Label[] = [
    { at: [126.3, 91.8], text: 'O' },
    { at: [12, 105.4], text: 'O' },
    { at: [103.8, 130.8], text: 'O' },
    { at: [172.7, 12.6], text: 'O' },
  ];
  return { id: 'urolithina', name: 'Urolithin A', w: 184.7, h: 142.8, bonds, labels };
}

// ── Vitamin D3 (C₂₇H₄₄O) ───────────────────────────────────────────
// PubChem CID 5280795 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function vitamind3(): Molecule {
  const bonds: Bond[] = [
    { a: [34.5, 267.1], b: [12, 280.1], order: 1 },
    { a: [102.1, 124.1], b: [126.7, 116.2], order: 1 },
    { a: [102.1, 124.1], b: [102.1, 150.1], order: 1 },
    { a: [102.1, 124.1], b: [79.6, 111.1], order: 1 },
    { a: [102.1, 124.1], b: [102.1, 98.1], order: 1 },
    { a: [126.7, 116.2], b: [141.8, 137.1], order: 1 },
    { a: [126.7, 116.2], b: [134.7, 91.5], order: 1 },
    { a: [102.1, 150.1], b: [126.7, 158.1], order: 1 },
    { a: [102.1, 150.1], b: [79.6, 163.1], order: 1 },
    { a: [141.8, 137.1], b: [126.7, 158.1], order: 1 },
    { a: [79.6, 111.1], b: [57, 124.1], order: 1 },
    { a: [134.7, 91.5], b: [160.2, 86.1], order: 1 },
    { a: [134.7, 91.5], b: [117.4, 72.2], order: 1 },
    { a: [79.6, 163.1], b: [57, 150.1], order: 1 },
    { a: [79.6, 163.1], b: [79.6, 189.1], order: 2 },
    { a: [57, 124.1], b: [57, 150.1], order: 1 },
    { a: [160.2, 86.1], b: [168.3, 61.4], order: 1 },
    { a: [79.6, 189.1], b: [57, 202.1], order: 1 },
    { a: [168.3, 61.4], b: [193.7, 56.1], order: 1 },
    { a: [193.7, 56.1], b: [201.8, 31.4], order: 1 },
    { a: [57, 202.1], b: [57, 228.1], order: 2 },
    { a: [201.8, 31.4], b: [227.2, 26], order: 1 },
    { a: [201.8, 31.4], b: [184.4, 12], order: 1 },
    { a: [57, 228.1], b: [34.5, 241.1], order: 1 },
    { a: [57, 228.1], b: [79.6, 241.1], order: 1 },
    { a: [34.5, 241.1], b: [34.5, 267.1], order: 1 },
    { a: [79.6, 241.1], b: [79.6, 267.1], order: 1 },
    { a: [79.6, 241.1], b: [102.1, 228.1], order: 2 },
    { a: [34.5, 267.1], b: [57, 280.1], order: 1 },
    { a: [79.6, 267.1], b: [57, 280.1], order: 1 },
  ];
  const labels: Label[] = [
    { at: [12, 280.1], text: 'O' },
  ];
  return { id: 'vitamin-d3', name: 'Vitamin D3', w: 239.2, h: 292.1, bonds, labels };
}

// ── Taurine (C₂H₇NO₃S) ─────────────────────────────────────────────
// PubChem CID 1123 2D coords, heavy atoms only. NEEDS CHEMIST REVIEW.
function taurine(): Molecule {
  const bonds: Bond[] = [
    { a: [34.5, 34.5], b: [12, 47.5], order: 1 },
    { a: [34.5, 34.5], b: [21.5, 12], order: 2 },
    { a: [34.5, 34.5], b: [47.5, 57], order: 2 },
    { a: [34.5, 34.5], b: [57, 21.5], order: 1 },
    { a: [102.1, 21.5], b: [79.6, 34.5], order: 1 },
    { a: [57, 21.5], b: [79.6, 34.5], order: 1 },
  ];
  const labels: Label[] = [
    { at: [34.5, 34.5], text: 'S' },
    { at: [12, 47.5], text: 'O' },
    { at: [21.5, 12], text: 'O' },
    { at: [47.5, 57], text: 'O' },
    { at: [102.1, 21.5], text: 'N' },
  ];
  return { id: 'taurine', name: 'Taurine', w: 114.1, h: 69, bonds, labels };
}

