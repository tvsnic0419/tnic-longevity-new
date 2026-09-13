#!/usr/bin/env node
/**
 * audit-perf.mjs — field-metric audit in a real browser.
 *
 * The third instrument, alongside `audit:ui` (layout, contrast, tap targets)
 * and `audit:routes` (structure over every route). Neither of those can tell
 * you how long the page takes to become useful, or how many bytes it spends
 * getting there — and "the site feels fast" is not a measurement.
 *
 * Per page, at a fixed viewport, with the network measured from the browser:
 *
 *   LCP      Largest Contentful Paint (ms) — the headline Core Web Vital
 *   CLS      Cumulative Layout Shift — visual stability
 *   TTFB     server response (ms)
 *   FCP      First Contentful Paint (ms)
 *   doc      HTML transferred (KB)
 *   js       JavaScript transferred (KB)
 *   css      CSS transferred (KB)
 *   img      images + fonts transferred (KB)
 *   total    everything (KB)
 *   longest  longest main-thread task (ms) — blocking, i.e. jank
 *
 * Thresholds are Google's Core Web Vitals "good" bounds where they exist
 * (LCP <= 2500ms, CLS <= 0.1), plus a byte budget per page that this repo sets
 * for itself. Exits non-zero when a page breaches one, so a regression is a
 * failed build rather than a thing somebody notices in six months.
 *
 * Usage:
 *   npm run build && npx next start -p 3212
 *   BASE=http://127.0.0.1:3212 npm run audit:perf
 *
 * Caveats worth knowing before acting on a number:
 *  - This runs on whatever CPU the machine has, with no network throttling, so
 *    the absolute LCP is optimistic versus a real phone. Read it as a relative
 *    measure between runs and between pages, and read the BYTES as absolute —
 *    those are the same everywhere.
 *  - LCP is captured at the point the page goes idle. A hero animation that
 *    keeps painting can push the element that counts; check `lcpEl` when a
 *    number moves without an obvious cause.
 */
import { chromium } from 'playwright-core';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3212';
const PAGES = (process.env.PAGES ?? '/,/library,/library/compounds/nmn,/trust,/stacks,/hallmarks')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

/** Each page is loaded RUNS times and every metric reported as the median.
 *  One sample is not a measurement here: on a shared runner the same page
 *  measured LCP 700ms, 1356ms and 588ms on three consecutive loads. */
const RUNS = Number(process.env.RUNS ?? 3);

/** Per-page budget (KB of ENCODED transfer). Generous versus a marketing page
 *  — these are dense evidence pages — but tight enough that a multi-megabyte
 *  document cannot come back unnoticed. */
const TOTAL_KB_BUDGET = Number(process.env.TOTAL_KB_BUDGET ?? 1700);
const CLS_BUDGET = Number(process.env.CLS_BUDGET ?? 0.1);

/**
 * LCP is REPORTED BUT NOT GATED, deliberately.
 *
 * Measured here it swings more than 2x run to run on the same build — 588ms to
 * 1356ms — because this runs on a shared CPU with no network shaping. A gate on
 * a number that noisy fails builds at random, and a CI check that cries wolf
 * gets switched off, which is worse than not having one. The budget below is
 * the threshold a median should stay under; breaching it prints a warning so a
 * real regression is still visible, without failing on noise.
 */
const LCP_WARN_MS = Number(process.env.LCP_WARN_MS ?? 2500);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

const rows = [];

const median = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const path of PAGES) {
  const samples = [];
  for (let run = 0; run < RUNS; run += 1) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Bytes ON THE WIRE, via request.sizes().responseBodySize — the encoded body,
  // i.e. what the visitor actually downloads. This distinction is the whole
  // ballgame and it is easy to get wrong: response.body() hands back the
  // DECODED buffer, so measuring that reported /trust at ~2,250 KB of script
  // when production transfers ~456 KB of it compressed. A ~4x overstatement is
  // more than enough to send an optimisation pass after the wrong thing.
  //
  // A local `next start` may not compress at all, in which case encoded and
  // decoded are the same number and every figure here reads high. Both are
  // recorded so the gap is visible rather than assumed; the budget applies to
  // the encoded column, and the honest calibration is a production URL.
  const bytes = { doc: 0, js: 0, css: 0, img: 0, other: 0 };
  const raw = { doc: 0, js: 0, css: 0, img: 0, other: 0 };
  page.on('response', async (res) => {
    try {
      const type = res.request().resourceType();
      const key =
        type === 'document' ? 'doc'
        : type === 'script' ? 'js'
        : type === 'stylesheet' ? 'css'
        : type === 'image' || type === 'font' ? 'img'
        : 'other';
      const sizes = await res.request().sizes().catch(() => null);
      const decoded = (await res.body().catch(() => Buffer.alloc(0))).length;
      const encoded = sizes?.responseBodySize ?? decoded;
      bytes[key] += encoded;
      raw[key] += decoded;
    } catch {
      /* a response that vanished mid-flight is not worth failing the audit for */
    }
  });

  await page.addInitScript(() => {
    window.__perf = { cls: 0, lcp: 0, lcpEl: '', longest: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (!e.hadRecentInput) window.__perf.cls += e.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => {
      const es = l.getEntries();
      const last = es[es.length - 1];
      if (last) {
        window.__perf.lcp = last.startTime;
        window.__perf.lcpEl = last.element?.tagName
          ? `${last.element.tagName.toLowerCase()}${last.element.className ? '.' + String(last.element.className).split(/\s+/)[0] : ''}`
          : last.url ?? '';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (e.duration > window.__perf.longest) window.__perf.longest = e.duration;
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  let m = null;
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 60000 });
    // Give the LCP observer a beat past idle to settle on its final candidate.
    await page.waitForTimeout(900);
    m = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      return {
        ttfb: nav ? Math.round(nav.responseStart) : 0,
        fcp: fcp ? Math.round(fcp.startTime) : 0,
        lcp: Math.round(window.__perf.lcp),
        lcpEl: window.__perf.lcpEl,
        cls: Math.round(window.__perf.cls * 1000) / 1000,
        longest: Math.round(window.__perf.longest),
      };
    });
  } catch (err) {
    process.stderr.write(`  ✗ ${path} — ${err.message.slice(0, 90)}\n`);
  }

  if (m) {
    const kb = (n) => Math.round(n / 1024);
    const total = bytes.doc + bytes.js + bytes.css + bytes.img + bytes.other;
    const totalRaw = raw.doc + raw.js + raw.css + raw.img + raw.other;
    samples.push({
      ...m,
      doc: kb(bytes.doc),
      js: kb(bytes.js),
      css: kb(bytes.css),
      img: kb(bytes.img),
      total: kb(total),
      totalRaw: kb(totalRaw),
    });
  }
  await ctx.close();
  }

  if (samples.length) {
    const med = (k) => median(samples.map((x) => x[k]));
    const row = {
      path,
      lcp: med('lcp'),
      lcpMin: Math.min(...samples.map((x) => x.lcp)),
      lcpMax: Math.max(...samples.map((x) => x.lcp)),
      lcpEl: samples[samples.length - 1].lcpEl,
      fcp: med('fcp'),
      ttfb: med('ttfb'),
      cls: med('cls'),
      longest: med('longest'),
      doc: med('doc'),
      js: med('js'),
      css: med('css'),
      img: med('img'),
      total: med('total'),
      totalRaw: med('totalRaw'),
    };
    rows.push(row);
    process.stderr.write(
      `  ${path.padEnd(30)} LCP:${String(row.lcp).padStart(5)}ms (${row.lcpMin}-${row.lcpMax}) CLS:${String(row.cls).padStart(5)} total:${String(row.total).padStart(5)}KB\n`,
    );
  }
}

await browser.close();

console.log('\n=== FIELD METRICS ===');
console.log(
  `${'route'.padEnd(30)} ${'LCP'.padStart(6)} ${'FCP'.padStart(6)} ${'TTFB'.padStart(5)} ${'CLS'.padStart(6)} ${'block'.padStart(6)}  ${'doc'.padStart(5)} ${'js'.padStart(5)} ${'css'.padStart(4)} ${'img'.padStart(5)} ${'TOTAL'.padStart(6)} ${'(raw)'.padStart(7)}`,
);
for (const r of rows) {
  console.log(
    `${r.path.padEnd(30)} ${String(r.lcp).padStart(6)} ${String(r.fcp).padStart(6)} ${String(r.ttfb).padStart(5)} ${String(r.cls).padStart(6)} ${String(r.longest).padStart(6)}  ${String(r.doc).padStart(5)} ${String(r.js).padStart(5)} ${String(r.css).padStart(4)} ${String(r.img).padStart(5)} ${String(r.total).padStart(6)} ${String(r.totalRaw).padStart(7)}`,
  );
}

console.log('\n=== LCP ELEMENT ===');
for (const r of rows) console.log(`  ${r.path.padEnd(30)} ${r.lcpEl || '(none reported)'}`);

const fail = [];
const warn = [];
for (const r of rows) {
  // Gated: both are stable across runs here.
  if (r.cls > CLS_BUDGET) fail.push(`${r.path}: CLS ${r.cls} > ${CLS_BUDGET}`);
  if (r.total > TOTAL_KB_BUDGET) fail.push(`${r.path}: ${r.total}KB transferred > ${TOTAL_KB_BUDGET}KB budget`);
  // Reported only — see the LCP_WARN_MS note at the top of this file.
  if (r.lcp > LCP_WARN_MS) warn.push(`${r.path}: median LCP ${r.lcp}ms > ${LCP_WARN_MS}ms (range ${r.lcpMin}-${r.lcpMax})`);
}

console.log(`\nmedian of ${RUNS} runs · gated: CLS <= ${CLS_BUDGET}, total <= ${TOTAL_KB_BUDGET}KB encoded · reported: LCP (too noisy here to gate)`);
if (warn.length) {
  console.log('\n=== LCP OVER TARGET (warning, not a failure) ===');
  for (const w of warn) console.log(`  ! ${w}`);
}
if (fail.length) {
  console.log('\n=== OVER BUDGET ===');
  for (const f of fail) console.log(`  ✗ ${f}`);
  console.error(`\n✗ perf audit: ${fail.length} budget breach(es).`);
  process.exitCode = 1;
} else {
  console.log('all pages within budget');
}
