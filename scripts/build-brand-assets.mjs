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

/** The brand's dark ground. App icons are opaque — platforms composite them on
 *  arbitrary wallpapers, so a transparent icon is at the mercy of the backdrop. */
const PLATE = { r: 2, g: 8, b: 17, alpha: 1 };

/**
 * Icon set. `inset` is the emblem's height as a fraction of the canvas.
 *
 * `radius` is the corner rounding as a fraction of canvas width; `null` means
 * full-bleed square, which is what a maskable icon must be — the platform
 * applies its own mask and will crop to an inscribed circle on some launchers.
 * That is why the maskable variant is inset much further: everything outside
 * the middle ~80% is treated as losable.
 */
const ICONS = [
  { file: 'public/icon-192.png', size: 192, inset: 0.72, radius: 0.22 },
  { file: 'public/icon-512.png', size: 512, inset: 0.72, radius: 0.22 },
  { file: 'public/icon-maskable-512.png', size: 512, inset: 0.56, radius: null },
  { file: 'app/icon.png', size: 512, inset: 0.72, radius: 0.22 },
];

/** Sizes packed into favicon.ico. 16/32 are what browsers actually request. */
const FAVICON_SIZES = [16, 32, 48];

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

/**
 * Compose one app icon: the emblem centred on the brand plate, optionally with
 * rounded corners. The emblem is sized by height (it is taller than it is wide)
 * so `inset` means the same thing regardless of the mark's aspect.
 */
async function renderIcon(emblemPng, { size, inset, radius }) {
  const mark = await sharp(emblemPng)
    .resize({ height: Math.round(size * inset), fit: 'inside', kernel: 'lanczos3' })
    .toBuffer();
  const markMeta = await sharp(mark).metadata();

  let plate = sharp({ create: { width: size, height: size, channels: 4, background: PLATE } })
    .composite([
      {
        input: mark,
        top: Math.round((size - markMeta.height) / 2),
        left: Math.round((size - markMeta.width) / 2),
      },
    ]);

  if (radius !== null) {
    const r = Math.round(size * radius);
    const mask = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/></svg>`,
    );
    plate = sharp(await plate.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }]);
  }

  return plate.png({ compressionLevel: 9, effort: 10 }).toBuffer();
}

/**
 * Pack PNGs into an .ico. The format allows PNG-encoded entries outright
 * (Vista+), which every browser in scope reads, so there is no need to emit
 * legacy BMP/DIB bitmaps.
 */
function packIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 encodes 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette count
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

async function main() {
  const check = process.argv.includes('--check');
  const src = await loadSource();
  let drift = false;

  const emit = async (relPath, buf, note = '') => {
    const dest = path.join(ROOT, relPath);
    const label = `${relPath.padEnd(30)} ${(buf.length / 1024).toFixed(0)}KB  ${sha(buf)}${note}`;
    if (check) {
      const current = existsSync(dest) ? await readFile(dest) : null;
      const same = current && current.equals(buf);
      if (!same) drift = true;
      console.log(`${same ? 'ok    ' : 'DRIFT '} ${label}`);
    } else {
      await writeFile(dest, buf);
      console.log(`wrote  ${label}`);
    }
  };

  let emblemPng = null;
  for (const target of TARGETS) {
    const buf = await render(target, src);
    const meta = await sharp(buf).metadata();
    if (target.name === 'tnic-emblem.png') emblemPng = buf;
    await emit(path.relative(ROOT, path.join(OUT_DIR, target.name)), buf, `  ${meta.width}×${meta.height}`);
  }

  // App icons, all cut from the same emblem so tab, launcher and header agree.
  for (const icon of ICONS) {
    await emit(icon.file, await renderIcon(emblemPng, icon), `  ${icon.size}×${icon.size}`);
  }

  const faviconPngs = await Promise.all(
    FAVICON_SIZES.map(async (size) => ({
      size,
      buf: await renderIcon(emblemPng, { size, inset: 0.82, radius: 0.18 }),
    })),
  );
  await emit('app/favicon.ico', packIco(faviconPngs), `  ${FAVICON_SIZES.join('/')}`);

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
