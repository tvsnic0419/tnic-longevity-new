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

/**
 * Light-theme palette — not an improvised second brand, but the exact
 * accent/background/text values already defined in app/globals.css's
 * `[data-theme="light"]` block (contrast-checked against white there). The
 * cinematic surfaces (Descent, CompoundHero, CinematicHubHero) previously
 * ignored the site's theme entirely; this gives them a genuine light variant
 * instead of staying dark-locked while the rest of the chrome flips.
 */
export const VIZ_LIGHT = {
  void: "#f8fafc",
  void2: "#eef2f7",
  panel: "#ffffff",
  panel2: "#f8fafc",
  line: "rgba(15,23,42,0.1)",
  ink: "#0f172a",
  muted: "#475569",
  faint: "#64748b",
  cyan: "#0891b2",
  indigo: "#7c3aed",
  violet: "#7c3aed",
  gold: "#d97706",
  rose: "#e11d48",
  amber: "#d97706",
  teal: "#059669",
} as const;

/** Light-theme accent hues as RGB triples — same source accents as VIZ_LIGHT. */
export const HUES_LIGHT: Record<string, RGB> = {
  cyan: [8, 145, 178],
  indigo: [124, 58, 237],
  violet: [124, 58, 237],
  gold: [217, 119, 6],
  rose: [225, 29, 72],
  amber: [217, 119, 6],
  teal: [5, 150, 105],
  emerald: [5, 150, 105],
};

/** Pick the palette/hue map for a resolved theme — the one branch point every cinematic component shares. */
export function paletteFor(theme: "dark" | "light") {
  return theme === "light"
    ? { viz: VIZ_LIGHT, hues: HUES_LIGHT }
    : { viz: VIZ, hues: HUES };
}

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
export function signatureHue(id: string, hues: Record<string, RGB> = HUES): RGB {
  const key = SIGNATURE_ORDER[hashString(id) % SIGNATURE_ORDER.length];
  return hues[key];
}

/** Evidence tier → accent color. Matches the site's grading language. */
export function tierColor(tier: string, viz: typeof VIZ | typeof VIZ_LIGHT = VIZ): string {
  switch (tier) {
    case "A": return viz.cyan;
    case "B": return viz.gold;
    case "C": return viz.violet;
    default:  return viz.muted;
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
