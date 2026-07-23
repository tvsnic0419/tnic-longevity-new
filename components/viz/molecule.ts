// ─────────────────────────────────────────────────────────────────────────────
// TNiC · viz molecule geometry
// Real, hand-placed stylized skeletons live here. We only ship a named
// ball-and-stick structure for a compound when we have actually laid out its
// substitution pattern — everything else falls back to an abstract orbital
// field (see MoleculeStage `mode="field"`). This keeps the honesty contract:
// we never render a fabricated structure and pass it off as the literal
// molecule. New skeletons can be added to REGISTRY over time.
// ─────────────────────────────────────────────────────────────────────────────

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

/** Registry of compounds we have real stylized geometry for. */
export const REGISTRY: Record<string, () => Geometry> = {
  resveratrol: buildResveratrol,
  pterostilbene: buildPterostilbene,
};

export function hasGeometry(id: string): boolean {
  return id in REGISTRY;
}

export function getGeometry(id: string): Geometry | null {
  const b = REGISTRY[id];
  return b ? b() : null;
}
