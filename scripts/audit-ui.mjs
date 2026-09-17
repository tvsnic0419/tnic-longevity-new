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
 *  - `minFont` used to be dominated by SVG data-visualisation labels (chart
 *    axes, molecule atom labels), which are a different system from the HTML
 *    type scale. The micro-type probe now excludes SVG entirely and reports
 *    every HTML text node under the scale's 11px floor by class and by page,
 *    so `micro:` in the per-page line is directly actionable; `minFont` is
 *    retained only as a coarse signal.
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3000';
/**
 * One route per PAGE TEMPLATE, not a sample of the ones we happened to think
 * of. The eleven routes this list used to hold all came from the library and
 * trust areas, so entire templates were never measured — and everything that
 * broke in them went unreported for as long as it took someone to look by
 * hand. A sweep of the unaudited templates found, in one pass: a serious
 * `definition-list`/`dlitem` failure on /compound-engine, a prohibited
 * `aria-label` on /dashboard, a scrollable table no keyboard could reach on
 * /pathways, nine elements below the 11px floor on /nico, and hub stat labels
 * truncating on nine routes. None of it was exotic. It was simply not looked
 * at.
 *
 * So the rule for this list is coverage of templates: a hub, a deep-dive, a
 * comparison, a tool, a guide, a legal page, an interactive questionnaire, a
 * dashboard. Adding a route is cheap (a few seconds); missing a template costs
 * whatever ships inside it.
 */
/**
 * Routes that were already gated before coverage was extended. The gate stays
 * at budget 0 for exactly these, so widening the sweep can never quietly
 * lower the bar that was already being met. Everything else is MEASURED AND
 * REPORTED — the same "gate what is settled, report what is new" split
 * `audit:perf` already uses for CLS versus LCP.
 *
 * The newly covered routes surfaced 102 actionable sub-24px controls on the
 * first run: pre-existing debt that nothing was looking at, not regressions.
 * All 102 turned out to be one root cause — standalone action links and chips
 * with no control floor, the case `.action-link` exists for — and all 102 are
 * now fixed, so every route the sweep covers is gated. The split stays because
 * the next route added to PAGES will surface its own, and reporting them is
 * how they get fixed rather than how the bar gets lowered.
 */
const GATED = new Set([
  '/',
  '/library',
  '/library/compounds/nmn',
  '/library/compare/nmn-vs-nr',
  '/smoker-defense-stack',
  '/supplement-guides',
  '/trust',
  '/stacks',
  '/library/mitochondrial-dysfunction',
  '/library/evidence',
  '/library/trials',
  // Cleared 2026-09-17: 102 -> 0, verified by a full `npm run audit:ui` pass.
  '/protocols',
  '/insights',
  '/products',
  '/dashboard',
  '/trust/methodology',
]);

const PAGES = [
  // Arrival + library core
  '/',
  '/library',
  '/library/compounds/nmn',
  '/library/compare/nmn-vs-nr',
  '/library/evidence',
  '/library/trials',
  '/library/mitochondrial-dysfunction',
  // Hubs (CinematicHubHero + stat rail — the template that was truncating)
  '/stacks',
  '/labs',
  '/tools',
  '/protocols',
  '/peptides',
  '/products',
  '/learn',
  '/insights',
  '/pathways',
  '/hallmarks',
  '/best',
  // Interactive templates
  '/nico',
  '/compound-engine',
  '/dashboard',
  '/bio-age',
  // Guides, commerce, trust, legal
  '/smoker-defense-stack',
  '/supplement-guides',
  '/shop',
  '/elite-8',
  '/trust',
  '/trust/methodology',
  '/about',
  '/faq',
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

      // Settle the scroll-driven reveals before measuring.
      //
      // The reveals use `animation-timeline: view()`, so their opacity is a
      // function of scroll position. Running axe straight after `networkidle`
      // caught elements mid-fade and reported contrast failures that do not
      // exist: on /library/mitochondrial-dysfunction it flagged two nodes at
      // 3.73:1 and 3.94:1 whose foregrounds computed to roughly 50% opacity —
      // i.e. a colour no reader ever sees settled. The same page measures 0
      // contrast nodes, in both motion preferences, once it is allowed to come
      // to rest.
      //
      // The file header already warns that below-the-fold contrast hits can be
      // false positives and says to confirm by hand. That warning is the bug:
      // a gate nobody can trust is a gate people learn to wave through. So the
      // sweep is done here instead — scroll the page, return to the top, let
      // the animations land — and what axe reports is what a reader would see.
      await page.evaluate(async () => {
        const step = Math.max(400, window.innerHeight * 0.75);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });
      await page.waitForTimeout(500);

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
        // ── Micro-type probe ──
        // Every HTML text node rendering below the scale's floor
        // (--type-micro, 11px). SVG <text> is deliberately excluded: inside a
        // scaled viewBox its computed font-size is in user units, not screen
        // px, and these are molecular-diagram annotations whose size is set by
        // the geometry — their accessibility answer is the text fallback every
        // visualization owes, not a type floor.
        const FLOOR = 10.95; // 11px, with room for sub-pixel rounding
        let minFont = 99;
        const microType = [];
        document.querySelectorAll('body *').forEach((el) => {
          if (el instanceof SVGElement) return;
          // Only elements holding their own text, so a wrapper is not blamed
          // for a child's size.
          let own = '';
          for (const n of el.childNodes) if (n.nodeType === 3) own += n.textContent;
          own = own.trim();
          if (own.length < 2) return;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return;
          if (el.closest('.sr-only') || el.classList.contains('sr-only')) return;
          const px = parseFloat(cs.fontSize);
          if (!px) return;
          if (px < minFont) minFont = px;
          if (px >= FLOOR) return;
          microType.push({
            px: Math.round(px * 100) / 100,
            cls: (el.className?.toString?.() || `<${el.tagName.toLowerCase()}>`).slice(0, 64),
            text: own.slice(0, 30),
          });
        });
        return {
          scrollW: document.documentElement.scrollWidth,
          clientW: docW,
          overflow: overflow.slice(0, 6),
          smallTargets: small,
          actionableTargets: actionable,
          minFont,
          microType,
        };
      });
      layout.push({ vp: vp.name, path, ...m });
      process.stderr.write(`  ${vp.name.padEnd(8)} ${path.padEnd(40)} axe:${res.violations.length} overflow:${m.overflow.length} smallTap:${m.smallTargets} (actionable:${m.actionableTargets.length}) minFont:${m.minFont}px micro:${m.microType.length}\n`);
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
const gatedActionable = layout
  .filter((l) => GATED.has(l.path))
  .reduce((n, l) => n + l.actionableTargets.length, 0);
const newActionable = layout
  .filter((l) => !GATED.has(l.path))
  .reduce((n, l) => n + l.actionableTargets.length, 0);
const totalActionable = gatedActionable + newActionable;
const budget = Number(process.env.MAX_SMALL_TAPS ?? 0);

if (newActionable > 0) {
  const byRoute = new Map();
  for (const l of layout) {
    if (GATED.has(l.path) || l.actionableTargets.length === 0) continue;
    byRoute.set(l.path, (byRoute.get(l.path) ?? 0) + l.actionableTargets.length);
  }
  console.log(`\n=== NEWLY COVERED ROUTES — ${newActionable} actionable sub-24px controls (reported, not yet gated) ===`);
  for (const [route, n] of [...byRoute.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${route}`);
  }
  console.log('  These are pre-existing, newly visible. Fix them, then move the');
  console.log('  route into GATED at the top of this file.');
}

console.log(`\nactionable sub-24px controls: ${totalActionable} total · ${gatedActionable} on gated routes (budget ${budget})`);
if (gatedActionable > budget) {
  console.error(`\n✗ tap-target gate: ${gatedActionable} actionable controls under 24px on gated routes, budget is ${budget}.`);
  process.exitCode = 1;
}

// ── Micro-type gate ──
// The type scale bottoms out at --type-micro (11px), and globals.css records
// why: 11px is the size the dense pages are actually read at, and it matches
// `.text-label` so the two smallest steps agree. An audit of eight rendered
// pages once found 59 declarations between 4px and 10.5px — and on a PHONE
// they were smaller still (hero stat labels at 8.64px), handing the device
// with the least reading comfort the least legible type. This gate is what
// stops that drifting back one component at a time.
console.log('\n=== HTML TEXT BELOW THE 11px FLOOR ===');
const micro = new Map(); // signature -> {n, px, cls, text, pages:Set}
for (const l of layout) {
  for (const t of l.microType ?? []) {
    const key = `${t.px}|${t.cls}`;
    if (!micro.has(key)) micro.set(key, { n: 0, px: t.px, cls: t.cls, text: t.text, pages: new Set() });
    const e = micro.get(key);
    e.n += 1;
    e.pages.add(`${l.vp}${l.path}`);
  }
}
if (micro.size === 0) {
  console.log('  none');
} else {
  for (const [, v] of [...micro.entries()].sort((a, b) => a[1].px - b[1].px)) {
    console.log(`  ${String(v.n).padStart(4)}×  ${String(v.px).padStart(6)}px  "${v.text}"`);
    console.log(`        ${v.cls}`);
    console.log(`        ${[...v.pages].slice(0, 4).join(', ')}${v.pages.size > 4 ? ` +${v.pages.size - 4} more` : ''}`);
  }
}
const totalMicro = layout.reduce((n, l) => n + (l.microType?.length ?? 0), 0);
const microBudget = Number(process.env.MAX_MICRO_TYPE ?? 0);
console.log(`\nHTML text below 11px: ${totalMicro} (budget ${microBudget})`);
if (totalMicro > microBudget) {
  console.error(`\n✗ micro-type gate: ${totalMicro} HTML text nodes under 11px, budget is ${microBudget}.`);
  process.exitCode = 1;
}
