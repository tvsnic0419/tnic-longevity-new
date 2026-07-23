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

export type Atom = { x: number; y: number; z: number; el: "C" | "O" | "N" | "S" };
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
};

export function hasGeometry(id: string): boolean {
  return id in REGISTRY;
}

export function getGeometry(id: string): Geometry | null {
  const b = REGISTRY[id];
  return b ? b() : null;
}
