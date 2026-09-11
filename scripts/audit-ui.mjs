#!/usr/bin/env node
/**
 * audit-ui.mjs — empirical UI audit: axe-core violations plus layout and
 * typography measurements, across representative pages at desktop and phone
 * widths.
 *
 * Built because the visual work in this repo had been reviewed by reading the
 * code, and reading the code does not tell you that `.text-micro` renders on
 * 753 elements of /library, or that 427 tap targets on that page are under the
 * 24px minimum STYLE_GUIDE already mandates. Both were found by measuring.
 *
 * Usage:
 *   npm run build && npx next start -p 3212
 *   BASE=http://127.0.0.1:3212 npm run audit:ui
 *
 * Two caveats worth knowing before acting on the output:
 *
 *  - Colour-contrast results for BELOW-THE-FOLD elements can be false
 *    positives. axe measures what is painted at that instant, and a scroll
 *    reveal caught mid-fade composites toward the background — one run here
 *    reported an emerald label at 1.49:1 whose real computed colour was
 *    rgb(52,211,153) at opacity 1, comfortably passing. Confirm any contrast
 *    hit against getComputedStyle before changing a token.
 *  - `minFont` is dominated by SVG data-visualisation labels (chart axes,
 *    molecule atom labels), which are a different system from the HTML type
 *    scale. Read the histogram, not just the minimum.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3000';
const PAGES = [
  '/',
  '/library',
  '/library/compounds/nmn',
  '/library/compare/nmn-vs-nr',
  '/smoker-defense-stack',
  '/supplement-guides',
  '/trust',
  '/stacks',
  '/library/mitochondrial-dysfunction',
];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
];

const axeSrc = await fs.readFile('node_modules/axe-core/axe.min.js', 'utf8');

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

const violations = new Map(); // ruleId -> {impact, help, nodes:[], pages:Set}
const layout = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
      await page.addScriptTag({ content: axeSrc });
      const res = await page.evaluate(async () =>
        // Colour-contrast needs real rendering, so run the full default ruleset.
        // @ts-ignore
        await window.axe.run(document, { resultTypes: ['violations'] }),
      );
      for (const v of res.violations) {
        if (!violations.has(v.id)) {
          violations.set(v.id, { impact: v.impact, help: v.help, nodes: [], pages: new Set() });
        }
        const e = violations.get(v.id);
        e.pages.add(`${vp.name}${path}`);
        for (const n of v.nodes.slice(0, 3)) {
          e.nodes.push({ page: path, vp: vp.name, target: n.target.join(' '), summary: (n.failureSummary ?? '').slice(0, 220) });
        }
      }

      // Layout health: horizontal overflow and tap-target size are the two
      // things that make a site feel broken on a phone.
      const m = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const overflow = [];
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > docW + 2) {
            const cs = getComputedStyle(el);
            if (cs.position === 'fixed' || cs.overflowX === 'auto' || cs.overflowX === 'scroll') return;
            overflow.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 70), over: Math.round(r.right - docW) });
          }
        });
        let small = 0;
        document.querySelectorAll('a,button,[role="button"],input,select').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24)) small += 1;
        });
        // Smallest rendered font actually painted on the page.
        let minFont = 99;
        document.querySelectorAll('body *').forEach((el) => {
          if (!el.textContent?.trim()) return;
          if (el.children.length) return;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs && fs < minFont) minFont = fs;
        });
        return {
          scrollW: document.documentElement.scrollWidth,
          clientW: docW,
          overflow: overflow.slice(0, 6),
          smallTargets: small,
          minFont,
        };
      });
      layout.push({ vp: vp.name, path, ...m });
      process.stderr.write(`  ${vp.name.padEnd(8)} ${path.padEnd(40)} axe:${res.violations.length} overflow:${m.overflow.length} smallTap:${m.smallTargets} minFont:${m.minFont}px\n`);
    } catch (err) {
      process.stderr.write(`  ✗ ${vp.name} ${path} — ${err.message.slice(0, 100)}\n`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();

console.log('\n=== AXE VIOLATIONS (deduped by rule) ===');
const sorted = [...violations.entries()].sort((a, b) => {
  const rank = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  return (rank[a[1].impact] ?? 9) - (rank[b[1].impact] ?? 9) || b[1].pages.size - a[1].pages.size;
});
for (const [id, v] of sorted) {
  console.log(`\n[${(v.impact ?? '?').toUpperCase()}] ${id} — ${v.help}`);
  console.log(`  pages affected: ${v.pages.size}  (${[...v.pages].slice(0, 5).join(', ')})`);
  for (const n of v.nodes.slice(0, 2)) {
    console.log(`    ${n.vp} ${n.page} → ${n.target}`);
    console.log(`      ${n.summary.replace(/\n/g, ' | ')}`);
  }
}

console.log('\n=== LAYOUT ===');
for (const l of layout) {
  const bad = l.scrollW > l.clientW + 2;
  if (bad || l.overflow.length || l.smallTargets > 0 || l.minFont < 12) {
    console.log(`${l.vp} ${l.path}: scroll ${l.scrollW}/${l.clientW}${bad ? ' HORIZONTAL SCROLL' : ''} smallTap=${l.smallTargets} minFont=${l.minFont}px`);
    for (const o of l.overflow) console.log(`   overflow +${o.over}px  <${o.tag}> ${o.cls}`);
  }
}
