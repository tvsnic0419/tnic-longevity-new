// ─────────────────────────────────────────────────────────────────────────────
// TNiC · viz tokens — the single source of truth for the cinematic data-viz
// family. Every visualization (molecule stages, healthspan curves, synergy
// graphs, gauges) draws its palette, glow, stroke, and typography from here so
// the whole surface reads as one instrument, not seven. This is the spine of
// the Phase-4 "unified viz language" work.
// ─────────────────────────────────────────────────────────────────────────────

export type RGB = [number, number, number];

/**
 * Core cinematic palette — snapped to the site's canonical accent tokens
 * (app/globals.css `--accent-*`, `--color-bg-*`) so the viz family and the rest
 * of the UI read as one system. `indigo`/`gold`/`teal` are kept as named keys
 * for existing consumers but now alias the nearest site accent (violet / amber /
 * emerald) rather than a separate softer hue.
 */
export const VIZ = {
  void: "#020811",
  void2: "#080f1c",
  panel: "#0a111f",
  panel2: "#0e1729",
  line: "rgba(255,255,255,0.12)",
  ink: "#fafafa",
  muted: "#ced0d7",
  faint: "#7f8794",
  // accents — canonical site values
  cyan: "#00e0ff",
  indigo: "#c084fc",   // alias → violet (the site has no separate indigo accent)
  violet: "#c084fc",
  gold: "#fbbf24",     // alias → amber
  rose: "#f472b6",
  amber: "#fbbf24",
  teal: "#34d399",     // alias → emerald
  emerald: "#34d399",
} as const;

/** Accent hues as RGB triples, for canvas gradients / glow math. Canonical. */
export const HUES: Record<string, RGB> = {
  cyan: [0, 224, 255],
  indigo: [192, 132, 252],
  violet: [192, 132, 252],
  gold: [251, 191, 36],
  rose: [244, 114, 182],
  amber: [251, 191, 36],
  teal: [52, 211, 153],
  emerald: [52, 211, 153],
};

/** Curated signature-hue rotation — the five distinct site accents, so every
 *  compound gets a stable, on-brand color. */
const SIGNATURE_ORDER: Array<keyof typeof HUES> = [
  "cyan", "violet", "emerald", "amber", "rose",
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

/**
 * Evidence tier → accent color. Canonical grading language, matching
 * `EvidenceTag` / `evidenceTagDefinitions` (lib/trust.ts): A=emerald, B=cyan,
 * C=amber. Keep this in lockstep with that map — the hero medallion and the
 * evidence badge sit on the same page and must never disagree.
 */
export function tierColor(tier: string): string {
  switch (tier) {
    case "A": return VIZ.emerald;
    case "B": return VIZ.cyan;
    case "C": return VIZ.amber;
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
