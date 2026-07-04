#!/usr/bin/env node
/**
 * Request Google indexing for priority URLs via Search Console UI.
 * Requires an authenticated Chrome session (verify GSC first in browser).
 *
 * Usage: node scripts/request-gsc-indexing.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { PRIORITY_INDEX_URLS } from './lib/seo-constants.mjs';

const TIMEOUT = 180_000;
const PROFILE_DIR = join(homedir(), '.tnic-gsc-profile');
const GSC = 'https://search.google.com/search-console';
const PROPERTY = 'https://tnic.help/';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function launchBrowser() {
  mkdirSync(PROFILE_DIR, { recursive: true });
  try {
    return await chromium.launchPersistentContext(PROFILE_DIR, {
      channel: 'chrome',
      headless: false,
      viewport: null,
      args: ['--start-maximized'],
    });
  } catch (err) {
    if (!String(err).includes('already in use')) throw err;
    const alt = join(homedir(), '.tnic-gsc-profile-tmp');
    mkdirSync(alt, { recursive: true });
    return await chromium.launchPersistentContext(alt, {
      channel: 'chrome',
      headless: false,
      viewport: null,
      args: ['--start-maximized'],
    });
  }
}

async function waitForGsc(page) {
  await page.goto(GSC, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
  const deadline = Date.now() + TIMEOUT;
  while (Date.now() < deadline) {
    if (page.url().includes('search-console') && !page.url().includes('accounts.google.com')) return;
    if (page.url().includes('accounts.google.com')) {
      console.log('Sign in to Google in the browser, then wait…');
    }
    await sleep(2000);
  }
  throw new Error('Not signed in to Search Console — log in manually and re-run.');
}

async function requestIndexing(page, url) {
  const resource = encodeURIComponent(PROPERTY);
  await page.goto(`${GSC}?resource_id=${resource}`, { waitUntil: 'domcontentloaded', timeout: TIMEOUT }).catch(() => {});

  const inspect = page.locator(
    'input[aria-label*="Inspect" i], input[placeholder*="Inspect" i], input[type="search"]',
  ).first();

  if (!(await inspect.count())) {
    console.log(`Skip (no inspect box): ${url}`);
    return;
  }

  await inspect.fill(url);
  await page.keyboard.press('Enter');
  await sleep(3500);

  const btn = page.getByRole('button', { name: /request indexing/i });
  if (await btn.count()) {
    await btn.first().click({ timeout: 8000 });
    await sleep(1500);
    console.log(`Requested: ${url}`);
    return;
  }

  console.log(`Already indexed or queued: ${url}`);
}

async function main() {
  const context = await launchBrowser();
  const page = context.pages()[0] ?? (await context.newPage());
  page.setDefaultTimeout(TIMEOUT);

  try {
    await waitForGsc(page);
    console.log(`Requesting indexing for ${PRIORITY_INDEX_URLS.length} priority URLs…`);
    for (const url of PRIORITY_INDEX_URLS) {
      await requestIndexing(page, url);
      await sleep(1200);
    }
    console.log('\nDone. Submit sitemap in GSC if not already: sitemap.xml');
  } finally {
    await context.close();
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});