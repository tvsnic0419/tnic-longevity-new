#!/usr/bin/env node
/**
 * Derive the web brand assets from the master TNiC render.
 *
 * Source of truth: `public/brand/tnic-transformative-lockup.png` — the 1672×941
 * presentation render (emblem + NIC wordmark, flanked by molecule diagrams,
 * rule + tagline below, all on a dark textured field). That file is the
 * artwork; it is never edited here, only read.
 *
 * The render is not directly usable as site chrome: it is 16:9, carries a baked
 * background, and its molecule/tagline framing is illegible below ~200px. This
 * script cuts the two elements that actually function as a mark —
 *
 *   tnic-lockup.png  emblem + NIC wordmark  (nav, footer)
 *   tnic-emblem.png  emblem alone           (compact nav, app icons)
 *
 * — and lifts them off the background onto real alpha.
 *
 * Method, and why: the background is near-black (measured L≈2–4 at the corners,
 * peaking around L≈43 in the textured centre vignette), while the mark's own
 * content — brushed-silver letterforms, neon strand, leaves — sits well above
 * that. So alpha is a luminance ramp from LO to HI: everything at or below the
 * measured background ceiling goes fully transparent, everything above HI stays
 * fully opaque, and the band between them feathers the glow instead of
 * hard-keying it. RGB is left untouched, so the metal gradients and the strand's
 * bloom survive intact.
 *
 * A luminance ramp alone would also keep the decorative elements that share the
 * frame (the rule's green diamond at x≈826–860, glow spill from the right
 * molecule). ELEMENTS below bounds each kept element explicitly; anything
 * outside every box is dropped regardless of brightness. The boxes are padded
 * past the measured content edges so each element keeps its own glow halo, and
 * every box edge falls in background, so masking leaves no visible seam.
 *
 * Coordinates are measured from the source render and are only valid for it.
 * Re-derive them (not guess them) if the render is ever replaced.
 *
 * Usage: node scripts/build-brand-assets.mjs [--check]
 *   --check  rebuild into a temp dir and diff against the committed assets,
 *            failing if they differ. Intended for CI / pre-commit sanity.
 */

import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'public/brand/tnic-transformative-lockup.png');
const OUT_DIR = path.join(ROOT, 'public/brand');

/** Alpha ramp bounds, in perceptual luminance (0–255). See header note. */
const LO = 40;
const HI = 95;

/**
 * Element boxes in source-image pixel coordinates, padded past the measured
 * content edges so each element keeps its glow. Measured content extents:
 * emblem x 402–810 / y 201–642, wordmark x 834–1302 / y 354–575.
 */
const EMBLEM = { x0: 394, x1: 818, y0: 193, y1: 650 };
const WORDMARK = { x0: 828, x1: 1304, y0: 346, y1: 583 };

/** Output width in px. Generous relative to render size — next/image downsizes. */
const TARGETS = [
  { name: 'tnic-lockup.png', boxes: [EMBLEM, WORDMARK], width: 760 },
  { name: 'tnic-emblem.png', boxes: [EMBLEM], width: 400 },
];

const within = (box, x, y) => x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1;

async function loadSource() {
  if (!existsSync(SRC)) {
    throw new Error(`Master render missing: ${path.relative(ROOT, SRC)}`);
  }
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

async function render({ boxes, width: targetWidth }, src) {
  const { data, width: W, channels: C } = src;
  const x0 = Math.min(...boxes.map((b) => b.x0));
  const x1 = Math.max(...boxes.map((b) => b.x1));
  const y0 = Math.min(...boxes.map((b) => b.y0));
  const y1 = Math.max(...boxes.map((b) => b.y1));
  const cw = x1 - x0 + 1;
  const ch = y1 - y0 + 1;

  const out = Buffer.alloc(cw * ch * 4); // zero-filled: fully transparent by default
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const sx = x + x0;
      const sy = y + y0;
      if (!boxes.some((b) => within(b, sx, sy))) continue;
      const si = (sy * W + sx) * C;
      const lum = 0.2126 * data[si] + 0.7152 * data[si + 1] + 0.0722 * data[si + 2];
      const alpha = Math.max(0, Math.min(1, (lum - LO) / (HI - LO)));
      const di = (y * cw + x) * 4;
      out[di] = data[si];
      out[di + 1] = data[si + 1];
      out[di + 2] = data[si + 2];
      out[di + 3] = Math.round(alpha * 255);
    }
  }

  return sharp(out, { raw: { width: cw, height: ch, channels: 4 } })
    .resize({ width: targetWidth, fit: 'inside', kernel: 'lanczos3' })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
}

const sha = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 12);

async function main() {
  const check = process.argv.includes('--check');
  const src = await loadSource();
  let drift = false;

  for (const target of TARGETS) {
    const buf = await render(target, src);
    const dest = path.join(OUT_DIR, target.name);
    const meta = await sharp(buf).metadata();
    const label = `${target.name.padEnd(18)} ${meta.width}×${meta.height}  ${(buf.length / 1024).toFixed(0)}KB  ${sha(buf)}`;

    if (check) {
      const current = existsSync(dest) ? await readFile(dest) : null;
      const same = current && current.equals(buf);
      if (!same) drift = true;
      console.log(`${same ? 'ok    ' : 'DRIFT '} ${label}`);
    } else {
      await writeFile(dest, buf);
      console.log(`wrote  ${label}`);
    }
  }

  if (check && drift) {
    console.error('\nCommitted brand assets differ from the script output.');
    console.error('Run: node scripts/build-brand-assets.mjs');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
