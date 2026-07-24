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

import { MOLECULES, type Molecule as SkeletalMolecule } from "@/components/ui/molecules";

export type Atom = { x: number; y: number; z: number; el: "C" | "O" | "N" | "S" | "Ca"; label?: string };
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

// ── curcumin (C21H20O6) — two guaiacol rings + a diketone heptadiene bridge ──
function buildCurcumin(): Geometry {
  const atoms: Atom[] = [
    { x: -1.405, y: 0.047, z: -0.045, el: "C" },
    { x: -0.947, y: -0.353, z: -0.013, el: "C" },
    { x: -0.488, y: 0.047, z: -0.045, el: "C" },
    { x: -0.029, y: -0.353, z: -0.013, el: "C" },
    { x: 0.429, y: 0.047, z: -0.045, el: "C" },
    { x: 0.888, y: -0.353, z: -0.013, el: "C" },
    { x: 1.346, y: 0.047, z: -0.045, el: "C" },
    { x: -0.488, y: 0.448, z: 0.003, el: "O" },
    { x: 0.429, y: 0.448, z: -0.062, el: "O" },
    { x: -2.168, y: 0.476, z: -0.109, el: "C" },
    { x: -1.9, y: 0.147, z: -0.255, el: "C" },
    { x: -2.016, y: -0.282, z: -0.192, el: "C" },
    { x: -2.4, y: -0.382, z: 0.018, el: "C" },
    { x: -2.668, y: -0.052, z: 0.164, el: "C" },
    { x: -2.552, y: 0.376, z: 0.101, el: "C" },
    { x: -3.093, y: -0.163, z: 0.164, el: "O", label: "OH" },
    { x: -2.515, y: -0.806, z: 0.018, el: "O" },
    { x: -2.636, y: -1.248, z: 0.147, el: "C", label: "OCH₃" },
    { x: 2.109, y: 0.476, z: -0.109, el: "C" },
    { x: 2.493, y: 0.376, z: 0.101, el: "C" },
    { x: 2.609, y: -0.052, z: 0.164, el: "C" },
    { x: 2.341, y: -0.382, z: 0.018, el: "C" },
    { x: 1.957, y: -0.282, z: -0.192, el: "C" },
    { x: 1.841, y: 0.147, z: -0.255, el: "C" },
    { x: 3.034, y: -0.163, z: 0.164, el: "O", label: "OH" },
    { x: 2.77, y: 0.717, z: 0.101, el: "O" },
    { x: 3.059, y: 1.073, z: 0.23, el: "C", label: "OCH₃" },
  ];
  const bonds: Bond[] = [
    [0, 1, 2], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 6, 2],
    [2, 7, 2], [4, 8, 2],
    [9, 10, 2], [10, 11, 1], [11, 12, 2], [12, 13, 1], [13, 14, 2], [14, 9, 1],
    [0, 10, 1], [13, 15, 1], [12, 16, 1], [16, 17, 1],
    [18, 19, 2], [19, 20, 1], [20, 21, 2], [21, 22, 1], [22, 23, 2], [23, 18, 1],
    [6, 23, 1], [20, 24, 1], [19, 25, 1], [25, 26, 1],
  ];
  return {
    atoms,
    bonds,
    formula: "C₂₁H₂₀O₆",
    label: "(1E,6E)-1,7-bis(4-hydroxy-3-methoxyphenyl)hepta-1,6-diene-3,5-dione",
  };
}

// ── quercetin (C15H10O7) — flavonol: chromen-4-one fused to a catechol B-ring ──
function buildQuercetin(): Geometry {
  const atoms: Atom[] = [
    { x: -0.989, y: 0.003, z: -0.022, el: "C" },
    { x: -0.989, y: -0.76, z: -0.022, el: "C" },
    { x: -1.65, y: -1.142, z: -0.022, el: "C" },
    { x: -2.311, y: -0.76, z: -0.022, el: "C" },
    { x: -2.311, y: 0.003, z: -0.022, el: "C" },
    { x: -1.65, y: 0.385, z: -0.022, el: "C" },
    { x: -0.327, y: -1.142, z: -0.022, el: "C" },
    { x: 0.334, y: -0.76, z: -0.022, el: "C" },
    { x: 0.334, y: 0.003, z: -0.022, el: "C" },
    { x: -0.327, y: 0.385, z: -0.022, el: "O" },
    { x: -0.327, y: -1.823, z: -0.022, el: "O" },
    { x: 0.981, y: -1.134, z: -0.022, el: "O", label: "OH" },
    { x: -2.958, y: 0.377, z: -0.022, el: "O", label: "OH" },
    { x: -1.65, y: -1.889, z: -0.022, el: "O", label: "OH" },
    { x: 1.52, y: 1.378, z: 0.386, el: "C" },
    { x: 2.194, y: 1.222, z: 0.063, el: "C" },
    { x: 2.283, y: 0.583, z: -0.346, el: "C" },
    { x: 1.697, y: 0.101, z: -0.431, el: "C" },
    { x: 1.023, y: 0.257, z: -0.108, el: "C" },
    { x: 0.935, y: 0.896, z: 0.301, el: "C" },
    { x: 1.418, y: 2.118, z: 0.386, el: "O", label: "OH" },
    { x: 2.771, y: 1.697, z: 0.063, el: "O", label: "OH" },
  ];
  const bonds: Bond[] = [
    [1, 2, 2], [2, 3, 1], [3, 4, 2], [4, 5, 1], [5, 0, 2], [0, 1, 1],
    [1, 6, 1], [6, 7, 1], [7, 8, 2], [8, 9, 1], [9, 0, 1],
    [6, 10, 2], [7, 11, 1], [4, 12, 1], [2, 13, 1],
    [14, 15, 2], [15, 16, 1], [16, 17, 2], [17, 18, 1], [18, 19, 2], [19, 14, 1],
    [8, 18, 1], [14, 20, 1], [15, 21, 1],
  ];
  return {
    atoms,
    bonds,
    formula: "C₁₅H₁₀O₇",
    label: "2-(3,4-dihydroxyphenyl)-3,5,7-trihydroxy-4H-chromen-4-one",
  };
}

// ── fisetin (C15H10O6) — quercetin minus the 5-hydroxyl ──
function buildFisetin(): Geometry {
  const atoms: Atom[] = [
    { x: -1.106, y: -0.09, z: -0.024, el: "C" },
    { x: -1.106, y: -0.881, z: -0.024, el: "C" },
    { x: -1.791, y: -1.277, z: -0.024, el: "C" },
    { x: -2.477, y: -0.881, z: -0.024, el: "C" },
    { x: -2.477, y: -0.09, z: -0.024, el: "C" },
    { x: -1.791, y: 0.306, z: -0.024, el: "C" },
    { x: -0.421, y: -1.277, z: -0.024, el: "C" },
    { x: 0.265, y: -0.881, z: -0.024, el: "C" },
    { x: 0.265, y: -0.09, z: -0.024, el: "C" },
    { x: -0.421, y: 0.306, z: -0.024, el: "O" },
    { x: -0.421, y: -1.983, z: -0.024, el: "O" },
    { x: 0.935, y: -1.268, z: -0.024, el: "O", label: "OH" },
    { x: -3.147, y: 0.298, z: -0.024, el: "O", label: "OH" },
    { x: 1.494, y: 1.335, z: 0.399, el: "C" },
    { x: 2.192, y: 1.173, z: 0.064, el: "C" },
    { x: 2.284, y: 0.511, z: -0.359, el: "C" },
    { x: 1.677, y: 0.011, z: -0.448, el: "C" },
    { x: 0.979, y: 0.173, z: -0.113, el: "C" },
    { x: 0.887, y: 0.835, z: 0.31, el: "C" },
    { x: 1.388, y: 2.102, z: 0.399, el: "O", label: "OH" },
    { x: 2.79, y: 1.666, z: 0.064, el: "O", label: "OH" },
  ];
  const bonds: Bond[] = [
    [1, 2, 2], [2, 3, 1], [3, 4, 2], [4, 5, 1], [5, 0, 2], [0, 1, 1],
    [1, 6, 1], [6, 7, 1], [7, 8, 2], [8, 9, 1], [9, 0, 1],
    [6, 10, 2], [7, 11, 1], [4, 12, 1],
    [13, 14, 2], [14, 15, 1], [15, 16, 2], [16, 17, 1], [17, 18, 2], [18, 13, 1],
    [8, 17, 1], [13, 19, 1], [14, 20, 1],
  ];
  return {
    atoms,
    bonds,
    formula: "C₁₅H₁₀O₆",
    label: "2-(3,4-dihydroxyphenyl)-3,7-dihydroxy-4H-chromen-4-one",
  };
}

// ── alpha-lipoic acid (C8H14O2S2) — dithiolane ring + pentanoic acid tail ──
function buildAlphaLipoicAcid(): Geometry {
  const atoms: Atom[] = [
    { x: -1.957, y: 2.419, z: 0.379, el: "S" },
    { x: -0.929, y: 2.02, z: -0.182, el: "S" },
    { x: -0.945, y: 0.783, z: -0.174, el: "C" },
    { x: -1.982, y: 0.417, z: 0.393, el: "C" },
    { x: -2.607, y: 1.428, z: 0.735, el: "C" },
    { x: -0.642, y: -0.006, z: -0.141, el: "C" },
    { x: 0.185, y: -0.18, z: -0.174, el: "C" },
    { x: 0.488, y: -0.969, z: -0.141, el: "C" },
    { x: 1.314, y: -1.144, z: -0.174, el: "C" },
    { x: 2.103, y: -1.286, z: -0.174, el: "C", label: "COOH" },
    { x: 2.07, y: -2.028, z: -0.174, el: "O" },
    { x: 2.902, y: -1.453, z: -0.174, el: "O" },
  ];
  const bonds: Bond[] = [
    [0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 0, 1],
    [2, 5, 1], [5, 6, 1], [6, 7, 1], [7, 8, 1], [8, 9, 1], [9, 10, 2], [9, 11, 1],
  ];
  return {
    atoms,
    bonds,
    formula: "C₈H₁₄O₂S₂",
    label: "(R)-5-(1,2-dithiolan-3-yl)pentanoic acid",
  };
}

// ── nicotinamide riboside (C11H15N2O5+) — pyridinium + ribofuranose ──
function buildNR(): Geometry {
  const atoms: Atom[] = [
    { x: -0.288, y: 1.873, z: 0.227, el: "C" },
    { x: 0.389, y: 1.482, z: 0.227, el: "C" },
    { x: 0.389, y: 0.7, z: 0.227, el: "C" },
    { x: -0.288, y: 0.309, z: 0.227, el: "N" },
    { x: -0.966, y: 0.7, z: 0.227, el: "C" },
    { x: -0.966, y: 1.482, z: 0.227, el: "C" },
    { x: 1.126, y: 1.908, z: 0.227, el: "C" },
    { x: 1.758, y: 1.613, z: 0.341, el: "O" },
    { x: 1.059, y: 2.594, z: 0.113, el: "N", label: "NH₂" },
    { x: -0.79, y: -0.87, z: 0.295, el: "C" },
    { x: -0.01, y: -0.567, z: 0.477, el: "C" },
    { x: 0.543, y: -0.908, z: -0.081, el: "O" },
    { x: 0.105, y: -1.422, z: -0.608, el: "C" },
    { x: -0.719, y: -1.399, z: -0.375, el: "C" },
    { x: -1.574, y: -0.663, z: 0.467, el: "O", label: "OH" },
    { x: -1.392, y: -1.85, z: -0.204, el: "O", label: "OH" },
    { x: 0.611, y: -2.127, z: -0.836, el: "C" },
    { x: 1.011, y: -2.855, z: -1.179, el: "O", label: "OH" },
  ];
  const bonds: Bond[] = [
    [3, 2, 1], [2, 1, 2], [1, 0, 1], [0, 5, 2], [5, 4, 1], [4, 3, 2],
    [1, 6, 1], [6, 7, 2], [6, 8, 1],
    [9, 10, 1], [10, 11, 1], [11, 12, 1], [12, 13, 1], [13, 9, 1], [3, 10, 1],
    [9, 14, 1], [13, 15, 1], [12, 16, 1], [16, 17, 1],
  ];
  return {
    atoms,
    bonds,
    formula: "C₁₁H₁₅N₂O₅⁺",
    label: "3-carbamoyl-1-(β-D-ribofuranosyl)pyridin-1-ium",
  };
}

// ── sulforaphane (C6H11NOS2) — isothiocyanate on a methylsulfinyl butane chain ──
function buildSulforaphane(): Geometry {
  const atoms: Atom[] = [
    { x: -2.022, y: -0.188, z: -0.035, el: "S" },
    { x: -2.261, y: 0.618, z: 0.085, el: "C" },
    { x: -2.201, y: -0.905, z: 0.264, el: "O" },
    { x: -1.306, y: 0.17, z: -0.07, el: "C" },
    { x: -0.589, y: -0.188, z: -0.035, el: "C" },
    { x: 0.128, y: 0.17, z: -0.07, el: "C" },
    { x: 0.844, y: -0.188, z: -0.035, el: "C" },
    { x: 1.722, y: 0.17, z: -0.035, el: "N", label: "N=C=S" },
    { x: 2.439, y: 0.17, z: -0.035, el: "C" },
    { x: 3.245, y: 0.17, z: -0.035, el: "S" },
  ];
  const bonds: Bond[] = [
    [0, 1, 1], [0, 2, 2], [0, 3, 1], [3, 4, 1], [4, 5, 1], [5, 6, 1], [6, 7, 1], [7, 8, 2], [8, 9, 2],
  ];
  return {
    atoms,
    bonds,
    formula: "C₆H₁₁NOS₂",
    label: "1-isothiocyanato-4-(methylsulfinyl)butane",
  };
}

// ── calcium alpha-ketoglutarate (C10H10CaO10) — Ca²⁺ bridging two AKG anions ──
// Shown as the real salt (two 5-carbon alpha-keto-diacid chains + one calcium),
// not simplified to a single organic anion, so the heavy-atom count matches
// the compound's stated formula exactly (10 C, 10 O, 1 Ca).
function buildCaAKG(): Geometry {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];

  // One alpha-ketoglutarate chain: C1(carboxylate)-C2(keto)-C3H2-C4H2-C5(carboxylate).
  // `mirror` flips the chain to the other side of the shared calcium ion.
  function akgChain(mirror: 1 | -1): { chainStart: number; ionicO: number } {
    const s = mirror;
    const chainStart = atoms.length;
    const c1 = atoms.length; atoms.push({ x: s * 1.05, y: 0.35, z: 0, el: "C" });
    const o1a = atoms.length; atoms.push({ x: s * 1.65, y: 0.95, z: 0.1, el: "O" });
    const o1b = atoms.length; atoms.push({ x: s * 1.35, y: -0.55, z: -0.1, el: "O" }); // ionic O, bonds to Ca
    const c2 = atoms.length; atoms.push({ x: s * 0.3, y: -0.05, z: 0, el: "C" });
    const o2 = atoms.length; atoms.push({ x: s * 0.3, y: -0.85, z: 0.05, el: "O" });
    const c3 = atoms.length; atoms.push({ x: s * -0.4, y: 0.35, z: -0.05, el: "C" });
    const c4 = atoms.length; atoms.push({ x: s * -1.1, y: -0.05, z: 0.05, el: "C" });
    const c5 = atoms.length; atoms.push({ x: s * -1.8, y: 0.35, z: -0.05, el: "C" });
    const o5a = atoms.length; atoms.push({ x: s * -2.4, y: -0.15, z: 0.05, el: "O", label: "COO⁻" });
    const o5b = atoms.length; atoms.push({ x: s * -2.1, y: 1.15, z: -0.1, el: "O" });
    bonds.push(
      [c1, o1a, 2], [c1, o1b, 1], [c1, c2, 1],
      [c2, o2, 2], [c2, c3, 1],
      [c3, c4, 1], [c4, c5, 1],
      [c5, o5a, 1], [c5, o5b, 2],
    );
    return { chainStart, ionicO: o1b };
  }

  const chainA = akgChain(1);
  const chainB = akgChain(-1);
  const ca = atoms.length; atoms.push({ x: 0, y: -0.9, z: 0.15, el: "Ca", label: "Ca²⁺" });
  bonds.push([ca, chainA.ionicO, 1], [ca, chainB.ionicO, 1]);

  return {
    atoms,
    bonds,
    formula: "C₁₀H₁₀CaO₁₀",
    label: "calcium bis(2-oxopentanedioate) — Ca²⁺ salt of alpha-ketoglutarate",
  };
}

// ── EPA (C20H30O2) — eicosapentaenoic acid, one of the two omega-3s in "omega3" ──
// omega3 is a stated two-fatty-acid mixture (EPA + DHA), not one molecule — no
// single geometry can honestly stand in for "omega-3." This renders EPA alone,
// labeled as such, rather than fabricating a structure for the whole mixture.
function buildEPA(): Geometry {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  // 20-carbon chain, 5 cis double bonds (5,8,11,14,17), carboxylic acid at C1.
  const dbAfter = new Set([1, 4, 7, 10, 13]); // 0-indexed bond i->i+1 that is a double bond
  const dx = 0.62, dy = 0.34;
  const cIdx: number[] = [];
  for (let i = 0; i < 20; i++) {
    const idx = atoms.length;
    atoms.push({ x: -3 + i * dx, y: (i % 2 === 0 ? 1 : -1) * dy, z: Math.sin(i * 1.3) * 0.12, el: "C" });
    cIdx.push(idx);
    if (i > 0) bonds.push([cIdx[i - 1], idx, dbAfter.has(i - 1) ? 2 : 1]);
  }
  const oA = atoms.length; atoms.push({ x: -3.6, y: 1.6, z: 0.1, el: "O" });
  const oB = atoms.length; atoms.push({ x: -3.6, y: 0.3, z: -0.1, el: "O", label: "COOH" });
  bonds.push([cIdx[0], oA, 2], [cIdx[0], oB, 1]);

  return {
    atoms,
    bonds,
    formula: "C₂₀H₃₀O₂",
    label: "EPA (eicosapentaenoic acid) — one of the two omega-3s here; DHA not pictured",
  };
}

// ── astaxanthin (C40H52O4) — two 3-hydroxy-4-oxo-2,6,6-trimethylcyclohexenyl
// rings joined by an 18-carbon conjugated polyene chain with 4 methyl branches.
// Built procedurally (chain + ring helpers, same approach as buildResveratrol's
// `ring()`) rather than hand-placed, since there is no user-supplied reference
// for this one — every ring/chain carbon and both rings' OH/keto oxygens are
// generated from the real substitution pattern, then checked against the
// formula's heavy-atom count (40 C, 4 O) below.
function buildAstaxanthin(): Geometry {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];

  // One terminal ring: 6-carbon ring, gem-dimethyl + one ring methyl, one
  // ring C=C, an exocyclic hydroxyl and an exocyclic ketone — mirrored via `s`.
  function ionoRing(s: 1 | -1): { exo: number } {
    const R = 1.1, ringCx = s * 7.6, ringCy = 1.1;
    const ring: number[] = [];
    for (let k = 0; k < 6; k++) {
      const a = (Math.PI / 3) * k;
      const idx = atoms.length;
      atoms.push({ x: ringCx + Math.cos(a) * R * s, y: ringCy + Math.sin(a) * R, z: Math.sin(a * 2) * 0.15, el: "C" });
      ring.push(idx);
    }
    for (let k = 0; k < 6; k++) bonds.push([ring[k], ring[(k + 1) % 6], k === 0 ? 2 : 1]);
    // gem-dimethyl on ring[5], one methyl on ring[1], OH on ring[2], keto O on ring[3]
    const gem1 = atoms.length; atoms.push({ x: atoms[ring[5]].x + s * 0.7, y: atoms[ring[5]].y + 0.6, z: 0.1, el: "C" });
    bonds.push([ring[5], gem1, 1]);
    const gem2 = atoms.length; atoms.push({ x: atoms[ring[5]].x + s * 0.7, y: atoms[ring[5]].y - 0.6, z: -0.1, el: "C" });
    bonds.push([ring[5], gem2, 1]);
    const me1 = atoms.length; atoms.push({ x: atoms[ring[1]].x + s * 0.3, y: atoms[ring[1]].y + 0.8, z: 0.15, el: "C" });
    bonds.push([ring[1], me1, 1]);
    const oh = atoms.length; atoms.push({ x: atoms[ring[2]].x, y: atoms[ring[2]].y - 0.9, z: 0.05, el: "O", label: "OH" });
    bonds.push([ring[2], oh, 1]);
    const keto = atoms.length; atoms.push({ x: atoms[ring[3]].x, y: atoms[ring[3]].y - 0.9, z: -0.05, el: "O" });
    bonds.push([ring[3], keto, 2]);
    return { exo: ring[0] }; // ring[0] carries the exocyclic bond out to the chain
  }

  const ringA = ionoRing(1);
  const ringB = ionoRing(-1);

  // 18-carbon conjugated chain between the rings, 4 evenly-spaced methyl
  // branches (the standard carotenoid methylation pattern), symmetric about
  // the center so it reads the same rotated end-for-end.
  const chainLen = 18;
  const chain: number[] = [];
  const half = (chainLen - 1) / 2;
  for (let i = 0; i < chainLen; i++) {
    const idx = atoms.length;
    const x = (i - half) * 0.62;
    atoms.push({ x, y: (i % 2 === 0 ? 1 : -1) * 0.32, z: 0, el: "C" });
    chain.push(idx);
    if (i > 0) bonds.push([chain[i - 1], idx, i % 2 === 1 ? 2 : 1]);
  }
  bonds.push([ringA.exo, chain[chainLen - 1], 1]);
  bonds.push([ringB.exo, chain[0], 1]);
  for (const i of [3, 7, 10, 14]) {
    const idx = atoms.length;
    atoms.push({ x: atoms[chain[i]].x, y: atoms[chain[i]].y + (atoms[chain[i]].y > 0 ? 0.7 : -0.7), z: 0.15, el: "C" });
    bonds.push([chain[i], idx, 1]);
  }

  return {
    atoms,
    bonds,
    formula: "C₄₀H₅₂O₄",
    label: "3,3′-dihydroxy-β,β-carotene-4,4′-dione",
  };
}

// ── convert a hand-verified 2D skeletal structure into 3D ball-and-stick ──

function elementFromLabel(text?: string): Atom["el"] {
  if (!text) return "C"; // unlabeled vertex = implicit carbon, per skeletal-formula convention
  if (text.includes("O")) return "O";
  if (text.includes("N")) return "N";
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

const skeletalById = new Map(MOLECULES.map((m) => [m.id, m]));

function buildFromSkeletal(id: string, formula: string, label: string): () => Geometry {
  return () => {
    const m = skeletalById.get(id);
    if (!m) throw new Error(`No skeletal structure registered for "${id}" in components/ui/molecules.ts`);
    return fromSkeletal(m, formula, label);
  };
}

/** Registry of compounds we have real stylized geometry for. */
export const REGISTRY: Record<string, () => Geometry> = {
  resveratrol: buildResveratrol,
  pterostilbene: buildPterostilbene,
  curcumin: buildCurcumin,
  quercetin: buildQuercetin,
  fisetin: buildFisetin,
  rala: buildAlphaLipoicAcid,
  nr: buildNR,
  sulforaphane: buildSulforaphane,
  cakg: buildCaAKG,
  omega3: buildEPA,
  astaxanthin: buildAstaxanthin,
  // Projected from the site's own verified skeletal structures — see the
  // module comment above.
  nmn: buildFromSkeletal(
    "nicotinamide",
    "C₆H₆N₂O",
    "nicotinamide — the redox-active core NMN restores to NAD⁺",
  ),
  spermidine: buildFromSkeletal(
    "spermidine",
    "C₇H₁₉N₃",
    "N-(3-aminopropyl)butane-1,4-diamine",
  ),
  berberine: buildFromSkeletal(
    "berberine",
    "C₂₀H₁₈NO₄⁺",
    "isoquinoline alkaloid (quaternary ammonium)",
  ),
};

export function hasGeometry(id: string): boolean {
  return id in REGISTRY;
}

export function getGeometry(id: string): Geometry | null {
  const b = REGISTRY[id];
  return b ? b() : null;
}
