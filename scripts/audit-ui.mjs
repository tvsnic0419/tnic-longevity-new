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
      // Colour-contrast needs real rendering, so run the full default ruleset.
      // `axe` is attached to window by the injected script above; bracket access
      // keeps this plain JS without needing a ts-comment escape hatch.
      const res = await page.evaluate(async () =>
        window['axe'].run(document, { resultTypes: ['violations'] }),
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
        // Tap-target sizing, split into the two groups WCAG 2.2 AA 2.5.8 treats
        // differently. The raw count conflates them and is therefore not
        // actionable: on /library it read 135, of which 120 were PMID and
        // glossary links sitting inside sentences — targets the success
        // criterion explicitly exempts ("inline: the target is in a sentence
        // or its size is otherwise constrained by the line-height of
        // non-target text"). Shrinking those would mean setting prose on a
        // 24px leading. What is actionable is the standalone controls.
        const isInlineInText = (el, rect) => {
          if (el.tagName !== 'A') return false;
          // The criterion's own wording: exempt when "the target is in a
          // sentence or its size is otherwise constrained by the line-height of
          // non-target text". An inline-level box IS line-height constrained —
          // any inline-flex/inline-block/flex link has been given a box of its
          // own and is a styled control, so it is not exempt.
          if (getComputedStyle(el).display !== 'inline') return false;
          // ...and it must fit inside its own line box — the literal test the
          // criterion describes, and the one signal that survives every markup
          // shape prose links appear in (wrapped in a <span>, in a table cell,
          // in an MDX paragraph). Anything with padding of its own exceeds the
          // line box and stays in scope.
          //
          // Known limitation, stated so nobody reads a pass as more than it is:
          // a *standalone* action left as a bare inline <a> — no padding, no
          // inline-flex — is indistinguishable from a word in a sentence by
          // this test and will be exempted. The gate catches styled controls
          // that shrank, which is where regressions actually come from; it is
          // not a substitute for reaching for `.action-link` on a new action.
          const lh = parseFloat(getComputedStyle(el).lineHeight);
          return Number.isFinite(lh) && rect.height <= lh + 1;
        };
        // A control inside a <label> is hit through the label, so the label is
        // the real target (a 14px checkbox in a 44px label is not a 14px tap).
        const coveredByLabel = (el) => {
          const lab = el.closest('label');
          if (!lab || lab === el) return false;
          const lr = lab.getBoundingClientRect();
          return lr.height >= 24 && lr.width >= 24;
        };
        // A link whose ::before is stretched over its whole card (the
        // stretched-link idiom) is hit anywhere on the card.
        const stretched = (el) => {
          const before = getComputedStyle(el, '::before');
          return before.position === 'absolute' && before.inset !== 'auto' && before.content !== 'none';
        };
        let small = 0;
        const actionable = [];
        document.querySelectorAll('a,button,[role="button"],input,select').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (!(r.width > 0 && r.height > 0)) return;
          if (r.height >= 24 && r.width >= 24) return;
          small += 1;
          if (el.closest('.sr-only') || el.classList.contains('sr-only')) return;
          if (isInlineInText(el, r) || coveredByLabel(el) || stretched(el)) return;
          actionable.push({
            text: (el.textContent ?? '').trim().slice(0, 34) || `<${el.tagName.toLowerCase()}>`,
            size: `${Math.round(r.width)}x${Math.round(r.height)}`,
            cls: (el.className || '').toString().slice(0, 60),
          });
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
          actionableTargets: actionable,
          minFont,
        };
      });
      layout.push({ vp: vp.name, path, ...m });
      process.stderr.write(`  ${vp.name.padEnd(8)} ${path.padEnd(40)} axe:${res.violations.length} overflow:${m.overflow.length} smallTap:${m.smallTargets} (actionable:${m.actionableTargets.length}) minFont:${m.minFont}px\n`);
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
    console.log(`${l.vp} ${l.path}: scroll ${l.scrollW}/${l.clientW}${bad ? ' HORIZONTAL SCROLL' : ''} smallTap=${l.smallTargets} actionable=${l.actionableTargets.length} minFont=${l.minFont}px`);
    for (const o of l.overflow) console.log(`   overflow +${o.over}px  <${o.tag}> ${o.cls}`);
  }
}

// ── Tap-target gate ──
// Only the actionable group gates. Inline links in running text, controls hit
// through a ≥24px <label>, stretched-link card titles and sr-only skip links
// are all excluded above, so anything left here is a standalone control that
// renders under the 24px hard minimum STYLE_GUIDE §4 already mandates.
console.log('\n=== ACTIONABLE SUB-24px CONTROLS ===');
const offenders = new Map(); // signature -> {n, pages:Set, size, text}
for (const l of layout) {
  for (const a of l.actionableTargets) {
    const key = `${a.text}|${a.cls}`;
    if (!offenders.has(key)) offenders.set(key, { n: 0, pages: new Set(), size: a.size, text: a.text, cls: a.cls });
    const e = offenders.get(key);
    e.n += 1;
    e.pages.add(`${l.vp}${l.path}`);
  }
}
if (offenders.size === 0) {
  console.log('  none');
} else {
  for (const [, v] of [...offenders.entries()].sort((a, b) => b[1].n - a[1].n)) {
    console.log(`  ${String(v.n).padStart(4)}×  ${v.size.padEnd(9)} "${v.text}"`);
    console.log(`        ${v.cls}`);
    console.log(`        ${[...v.pages].slice(0, 4).join(', ')}${v.pages.size > 4 ? ` +${v.pages.size - 4} more` : ''}`);
  }
}
const totalActionable = layout.reduce((n, l) => n + l.actionableTargets.length, 0);
const budget = Number(process.env.MAX_SMALL_TAPS ?? 0);
console.log(`\nactionable sub-24px controls: ${totalActionable} (budget ${budget})`);
if (totalActionable > budget) {
  console.error(`\n✗ tap-target gate: ${totalActionable} actionable controls under 24px, budget is ${budget}.`);
  process.exitCode = 1;
}
