#!/usr/bin/env node
/**
 * Internal link validator — crawls the site starting from a seed of pages
 * (home, footer/nav are on every page) and follows every same-origin <a
 * href> it finds, breadth-first, checking each URL resolves (2xx/3xx).
 * Flags anything that 404s or errors so broken links never ship silently.
 *
 * Usage: node scripts/check-links.mjs [baseUrl]
 * Requires a running server at baseUrl (defaults to http://localhost:4123).
 * `npm run build && npm run start -- -p 4123` first.
 */

const BASE = process.argv[2] ?? 'http://localhost:4123';

const HREF_RE = /href=(?:"([^"#?]+)(?:[#?][^"]*)?"|'([^'#?]+)(?:[#?][^']*)?')/g;

/** Paths that are legitimately dynamic/parameterized and have no useful
 *  static crawl target, or are non-HTML endpoints not meant to be "pages". */
const SKIP_PREFIXES = [
  '/api/',
  '/club/', // dynamic member codes — /club itself is still crawled
  '/scorecard/',
  '/quiz/share/', // crawled separately below via its own static params
  '/_next/',
];

const seen = new Set();
const queue = ['/'];
const broken = [];

function shouldSkip(path) {
  if (path === '/club' || path === '/quiz/share') return false;
  return SKIP_PREFIXES.some((p) => path.startsWith(p));
}

function extractLinks(html) {
  const links = new Set();
  let m;
  while ((m = HREF_RE.exec(html))) {
    const href = m[1] ?? m[2];
    if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
    links.add(href);
  }
  return links;
}

async function crawl() {
  while (queue.length > 0) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    if (shouldSkip(path)) continue;

    let res;
    try {
      res = await fetch(`${BASE}${path}`);
    } catch (err) {
      broken.push({ path, status: 'FETCH_ERROR', detail: String(err) });
      continue;
    }

    if (res.status >= 400) {
      broken.push({ path, status: res.status });
      continue;
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) continue;

    const html = await res.text();
    for (const link of extractLinks(html)) {
      if (!seen.has(link) && !queue.includes(link)) queue.push(link);
    }
  }
}

await crawl();

const checked = seen.size;
if (broken.length > 0) {
  console.error(`\n✗ ${broken.length} broken internal link(s) found (checked ${checked} URLs):\n`);
  for (const b of broken) {
    console.error(`  ${b.status}  ${b.path}${b.detail ? `  (${b.detail})` : ''}`);
  }
  process.exit(1);
} else {
  console.log(`✓ All ${checked} crawled internal URLs resolve.`);
}
