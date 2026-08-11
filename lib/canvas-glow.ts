// Cached radial-glow sprites for the site's 2D-canvas animations.
//
// Per-frame `createRadialGradient()` + `arc()` + `fill()` is the dominant cost
// in the Descent shimmer field and every MoleculeStage: a fresh gradient object
// is allocated and rasterized for *every particle on every frame* (200+ in the
// shimmer, one per atom in the molecule). That is what makes those loops hitch.
//
// Baking each distinct glow to a small offscreen canvas once and blitting it
// with `drawImage` — scaled to the particle's radius and modulated with
// `globalAlpha` — is the standard fix: a `drawImage` of a cached bitmap is far
// cheaper than rasterizing a gradient, and its cost no longer scales the way
// live gradients do. The sprite is rendered once at a fixed reference
// resolution (the "lower quality, done once" trade) and reused every frame, so
// the frame rate stays high and steady instead of dropping as particles
// multiply. Visually indistinguishable — a scaled radial-gradient bitmap and a
// live radial gradient look the same at these soft, sub-pixel-exact sizes.

/** Reference glow diameter in CSS px. Sprites are drawn scaled, so this only
 *  sets the baked resolution, not the on-screen size. 128 keeps a crisp falloff
 *  even when a particle is scaled up past it. */
const SPRITE_SIZE = 128;

type RGB = readonly [number, number, number];

/**
 * A soft radial glow — full-strength core fading to fully transparent at the
 * rim — baked to an offscreen canvas. Draw with {@link blitGlow}.
 *
 * `coreAlpha` sets the center opacity baked into the sprite; per-frame opacity
 * (twinkle, depth) is applied on top via `globalAlpha` at blit time, so one
 * baked sprite serves every brightness of the same color.
 */
export function makeGlowSprite(rgb: RGB, coreAlpha = 1): HTMLCanvasElement {
  const s = SPRITE_SIZE;
  const cv = document.createElement('canvas');
  cv.width = s;
  cv.height = s;
  const c = cv.getContext('2d')!;
  const half = s / 2;
  const g = c.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${coreAlpha})`);
  g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  c.fillStyle = g;
  c.fillRect(0, 0, s, s);
  return cv;
}

/**
 * Blit a cached glow sprite centered at (x, y) with on-screen radius `rad`,
 * modulated to `alpha`. Restores the previous `globalAlpha` so callers can
 * blit in a loop without bookkeeping.
 */
export function blitGlow(
  ctx: CanvasRenderingContext2D,
  sprite: CanvasImageSource,
  x: number,
  y: number,
  rad: number,
  alpha: number,
): void {
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
  ctx.drawImage(sprite, x - rad, y - rad, rad * 2, rad * 2);
  ctx.globalAlpha = prev;
}

/**
 * A tiny LRU-free cache of glow sprites keyed by rounded color, for loops whose
 * tint animates slowly (the shimmer palette cross-fade, a compound's signature
 * hue). A new sprite is baked only when the rounded color actually changes —
 * a handful of times across a color transition, not once per frame.
 */
export function createGlowCache(): (rgb: RGB, coreAlpha?: number) => HTMLCanvasElement {
  const cache = new Map<string, HTMLCanvasElement>();
  return (rgb: RGB, coreAlpha = 1) => {
    const key = `${rgb[0]}|${rgb[1]}|${rgb[2]}|${coreAlpha}`;
    let sprite = cache.get(key);
    if (!sprite) {
      sprite = makeGlowSprite(rgb, coreAlpha);
      cache.set(key, sprite);
    }
    return sprite;
  };
}
