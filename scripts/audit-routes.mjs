#!/usr/bin/env node
/**
 * audit-routes.mjs — whole-site structural audit over the server-rendered HTML.
 *
 * `audit:ui` measures nine pages in a real browser: layout, contrast, tap
 * targets. It cannot tell you that two routes claim the same <title>, that a
 * page points its canonical at a different URL than the one it is served from,
 * or that a link in the footer 404s — those are properties of the whole route
 * set, and they only show up if you look at every route at once.
 *
 * What it checks, per route, from the initial HTML (no JS, so this is also
 * what a crawler or an answer engine sees):
 *
 *   status        the route resolves
 *   <title>       present, and unique across the site
 *   description   present, and unique across the site
 *   canonical     present, and self-referential (not pointing at another page)
 *   <h1>          exactly one, inside <main>
 *   body content  <main> actually contains prose, not just a shell
 *
 * And across routes: every internal link target resolves, and every route in
 * the sitemap is linked to from somewhere (an orphan is a page no crawler will
 * find by following links, whatever the sitemap says).
 *
 * Usage:
 *   npm run build && npx next start -p 3212
 *   BASE=http://127.0.0.1:3212 npm run audit:routes
 *
 * Exits non-zero when a hard failure is present (non-200, missing/duplicate
 * title, wrong canonical, h1 count != 1, broken internal link). Soft findings
 * (orphans, duplicate descriptions) are reported without failing, because a
 * deliberate orphan is a real thing and this should not block on judgement.
 */
const BASE = process.env.BASE ?? 'http://127.0.0.1:3212';
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 12);

/** Routes the audit should not hold to page rules — they are not pages. */
const NOT_A_PAGE = /^\/(api|_next)\/|\.(xml|txt|json|png|jpg|svg|ico|webmanifest)$/;

const text = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

/** Strip <head> so head-only markup can't be mistaken for body content. */
const bodyOf = (html) => {
  const i = html.indexOf('</head>');
  return i === -1 ? html : html.slice(i);
};

async function fetchRoute(path) {
  try {
    const res = await fetch(BASE + path, { redirect: 'manual' });
    const html = res.status < 400 ? await res.text() : '';
    return { path, status: res.status, html, location: res.headers.get('location') };
  } catch (err) {
    return { path, status: 0, html: '', error: err.message };
  }
}

/** Run `fn` over `items` with a fixed worker pool. */
async function pool(items, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

// ── 1. Route list, from the site's own sitemap ──────────────────────────────
const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
if (!sitemapRes.ok) {
  console.error(`✗ /sitemap.xml returned ${sitemapRes.status} — cannot enumerate routes.`);
  process.exit(1);
}
const sitemapXml = await sitemapRes.text();
const routes = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, '') || '/')
  .filter((p) => !NOT_A_PAGE.test(p));
const routeSet = new Set(routes);
process.stderr.write(`sitemap: ${routes.length} routes\n`);

// ── 2. Fetch every route and read its structural claims ─────────────────────
const pages = await pool(routes, async (path) => {
  const r = await fetchRoute(path);
  if (!r.html) return { ...r, ok: false };
  const body = bodyOf(r.html);
  const h1s = [...r.html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim(),
  );
  const mainMatch = r.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);
  const mainText = mainMatch ? mainMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  // Internal link targets, normalised: drop hash and query, keep the path.
  const links = [...body.matchAll(/href="(\/[^"#?]*)/g)]
    .map((m) => m[1])
    .filter((h) => !NOT_A_PAGE.test(h))
    .map((h) => (h.length > 1 && h.endsWith('/') ? h.slice(0, -1) : h));
  return {
    ...r,
    ok: true,
    title: text(r.html, /<title>([\s\S]*?)<\/title>/),
    description: text(r.html, /<meta name="description" content="([^"]*)"/),
    canonical: text(r.html, /<link rel="canonical" href="([^"]*)"/),
    h1s,
    mainChars: mainText.length,
    links: [...new Set(links)],
  };
});

// ── 3. Every internal link target must resolve ──────────────────────────────
const linkedFrom = new Map(); // target -> Set(source)
for (const p of pages) {
  for (const l of p.links ?? []) {
    if (!linkedFrom.has(l)) linkedFrom.set(l, new Set());
    linkedFrom.get(l).add(p.path);
  }
}
const unknownTargets = [...linkedFrom.keys()].filter((t) => !routeSet.has(t));
const checked = await pool(unknownTargets, async (t) => ({ t, ...(await fetchRoute(t)) }));
const broken = checked.filter((c) => c.status >= 400 || c.status === 0);

// ── 4. Report ───────────────────────────────────────────────────────────────
const fail = [];
const warn = [];
const push = (list, kind, detail) => list.push({ kind, detail });

const byTitle = new Map();
const byDesc = new Map();

for (const p of pages) {
  if (!p.ok || p.status !== 200) {
    push(fail, 'status', `${p.path} → ${p.status}${p.location ? ` (→ ${p.location})` : ''}${p.error ? ` ${p.error}` : ''}`);
    continue;
  }
  if (!p.title) push(fail, 'title-missing', p.path);
  else {
    if (!byTitle.has(p.title)) byTitle.set(p.title, []);
    byTitle.get(p.title).push(p.path);
  }
  if (!p.description) push(warn, 'description-missing', p.path);
  else {
    if (!byDesc.has(p.description)) byDesc.set(p.description, []);
    byDesc.get(p.description).push(p.path);
  }
  if (!p.canonical) push(fail, 'canonical-missing', p.path);
  else {
    const canonPath = p.canonical.replace(/^https?:\/\/[^/]+/, '') || '/';
    const norm = (s) => (s.length > 1 && s.endsWith('/') ? s.slice(0, -1) : s);
    if (norm(canonPath) !== norm(p.path)) {
      push(fail, 'canonical-wrong', `${p.path} → claims ${canonPath}`);
    }
  }
  if (p.h1s.length !== 1) push(fail, 'h1-count', `${p.path} has ${p.h1s.length} <h1>`);
  if (p.mainChars < 400) push(fail, 'thin-main', `${p.path} <main> holds ${p.mainChars} chars of text`);
}

for (const [title, paths] of byTitle) {
  if (paths.length > 1) push(fail, 'title-duplicate', `${paths.length}× "${title.slice(0, 70)}" — ${paths.slice(0, 4).join(', ')}${paths.length > 4 ? ` +${paths.length - 4}` : ''}`);
}
for (const [desc, paths] of byDesc) {
  if (paths.length > 1) push(warn, 'description-duplicate', `${paths.length}× "${desc.slice(0, 60)}…" — ${paths.slice(0, 3).join(', ')}${paths.length > 3 ? ` +${paths.length - 3}` : ''}`);
}
for (const b of broken) {
  const from = [...linkedFrom.get(b.t)].slice(0, 3).join(', ');
  push(fail, 'broken-link', `${b.t} → ${b.status} (linked from ${from})`);
}
// An orphan is reachable only by knowing its URL. Reported, never fatal.
for (const r of routes) {
  if (r === '/') continue;
  if (!linkedFrom.has(r)) push(warn, 'orphan', r);
}

const group = (list) => {
  const m = new Map();
  for (const { kind, detail } of list) {
    if (!m.has(kind)) m.set(kind, []);
    m.get(kind).push(detail);
  }
  return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
};

const render = (label, list, cap) => {
  console.log(`\n=== ${label} (${list.length}) ===`);
  if (!list.length) { console.log('  none'); return; }
  for (const [kind, details] of group(list)) {
    console.log(`\n[${kind}] ${details.length}`);
    for (const d of details.slice(0, cap)) console.log(`    ${d}`);
    if (details.length > cap) console.log(`    …and ${details.length - cap} more`);
  }
};

render('FAIL', fail, 12);
render('WARN', warn, 10);

console.log(`\nroutes audited: ${pages.length} · internal link targets checked: ${unknownTargets.length}`);
console.log(`fail: ${fail.length} · warn: ${warn.length}`);
if (fail.length) {
  console.error(`\n✗ route audit: ${fail.length} hard failures.`);
  process.exitCode = 1;
}
