// ─────────────────────────────────────────────────────────────────────────────
// TNiC · viz tokens — the single source of truth for the cinematic data-viz
// family. Every visualization (molecule stages, healthspan curves, synergy
// graphs, gauges) draws its palette, glow, stroke, and typography from here so
// the whole surface reads as one instrument, not seven. This is the spine of
// the Phase-4 "unified viz language" work.
// ─────────────────────────────────────────────────────────────────────────────

export type RGB = [number, number, number];

/** Core cinematic palette — mirrors the Descent scene and the STYLE_GUIDE accents. */
export const VIZ = {
  void: "#050710",
  void2: "#0a0e1e",
  panel: "#0e1426",
  panel2: "#131a30",
  line: "rgba(150,170,220,0.14)",
  ink: "#eef2fb",
  muted: "#96a0bc",
  faint: "#5a6482",
  // accents
  cyan: "#5fe3e0",
  indigo: "#8c8cf5",
  violet: "#b98cf0",
  gold: "#f0c46a",
  rose: "#f08a7a",
  amber: "#eaa24a",
  teal: "#57d4b0",
} as const;

/** Accent hues as RGB triples, for canvas gradients / glow math. */
export const HUES: Record<string, RGB> = {
  cyan: [95, 227, 224],
  indigo: [140, 140, 245],
  violet: [185, 140, 240],
  gold: [240, 196, 106],
  rose: [240, 138, 122],
  amber: [234, 162, 74],
  teal: [87, 212, 176],
  emerald: [52, 211, 153],
};

/** Curated signature-hue rotation — every compound gets a stable, on-brand color. */
const SIGNATURE_ORDER: Array<keyof typeof HUES> = [
  "cyan", "indigo", "violet", "teal", "gold", "rose", "amber",
];

/** Deterministic string hash → stable index. */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Stable signature hue for a compound/pathway id — always on-palette. */
export function signatureHue(id: string): RGB {
  const key = SIGNATURE_ORDER[hashString(id) % SIGNATURE_ORDER.length];
  return HUES[key];
}

/** Evidence tier → accent color. Matches the site's grading language. */
export function tierColor(tier: string): string {
  switch (tier) {
    case "A": return VIZ.cyan;
    case "B": return VIZ.gold;
    case "C": return VIZ.violet;
    default:  return VIZ.muted;
  }
}

export function rgba(c: RGB, a: number): string {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

/** Shared easing bank — one motion vocabulary across the viz family. */
export const EASE = {
  entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

/**
 * Font stacks — resolve to the site's self-hosted next/font faces via the CSS
 * variables set on <html> in app/layout.tsx (Phase 1). The literal fallbacks
 * keep the viz family legible even if a component renders outside that root.
 */
export const FONT = {
  display: "var(--font-display, 'Fraunces', Georgia, serif)",
  sans: "var(--font-sans, 'Inter', system-ui, sans-serif)",
  mono: "var(--font-mono, 'JetBrains Mono', ui-monospace, monospace)",
} as const;
