#!/usr/bin/env node
/**
 * Google Search Console: verify tnic.help, submit sitemap, request indexing.
 * Uses OAuth bearer tokens captured from an authenticated Chrome session.
 *
 * Usage: node scripts/provision-search-console.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { addDnsTxt, upsertVercelEnv } from './lib/vercel.mjs';
import { PRIORITY_INDEX_URLS } from './lib/seo-constants.mjs';

const TIMEOUT = 120_000;
const SIGNIN_HINT =
  'Google blocks automated sign-in. Use DNS instead:\n' +
  '  1. Search Console → add domain tnic.help → DNS verification\n' +
  '  2. node scripts/verify-google-dns.mjs "google-site-verification=TOKEN"';
const PROFILE_DIR = process.env.CHROME_USER_DATA?.trim() || join(homedir(), '.tnic-gsc-profile');
const GSC_HOME = 'https://search.google.com/search-console';
const DOMAIN = 'tnic.help';
const SITE_ENTRY = `sc-domain:${DOMAIN}`;
const URL_PREFIX = 'https://tnic.help/';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function captureBearerToken(page) {
  const tokens = new Set();
  page.on('request', (request) => {
    const auth = request.headers().authorization;
    if (auth?.startsWith('Bearer ')) tokens.add(auth.slice(7));
  });
  return tokens;
}

function googleCredentials() {
  const email = process.env.GOOGLE_EMAIL?.trim();
  const password = process.env.GOOGLE_PASSWORD?.trim();
  if (!email || !password) return null;
  return { email, password };
}

async function tryGoogleSignIn(page) {
  const creds = googleCredentials();
  if (!creds) return false;

  const url = page.url();
  if (!url.includes('accounts.google.com') && !url.includes('signin')) return false;

  console.log(`Signing in as ${creds.email}…`);

  const emailInput = page.locator('#identifierId, input[type="email"]:visible').first();
  if (await emailInput.count()) {
    await emailInput.fill(creds.email);
    await page.locator('#identifierNext, button:has-text("Next")').first().click({ timeout: 10_000 }).catch(() => page.keyboard.press('Enter'));
    await page.waitForURL(/password|challenge|search-console|signin\/v2\/challenge/, { timeout: 30_000 }).catch(() => {});
    await sleep(2000);
  }

  const passwordInput = page.locator('input[name="Passwd"]:visible, input[type="password"]:visible').first();
  if (await passwordInput.count()) {
    await passwordInput.fill(creds.password);
    await page.locator('#passwordNext, button:has-text("Next")').first().click({ timeout: 10_000 }).catch(() => page.keyboard.press('Enter'));
    await sleep(5000);
  }

  if (page.url().includes('challenge') || page.url().includes('signin/v2/challenge')) {
    console.log('Complete 2FA or security prompt in the browser window…');
  }

  return true;
}

async function waitForGoogleAuth(page) {
  const deadline = Date.now() + TIMEOUT;
  let attemptedSignIn = false;

  while (Date.now() < deadline) {
    const url = page.url();
    if (url.includes('search.google.com/search-console') && !url.includes('accounts.google.com')) {
      return;
    }
    if (url.includes('accounts.google.com') || url.includes('signin') || url.includes('challenge')) {
      if (!attemptedSignIn) attemptedSignIn = await tryGoogleSignIn(page);
      else console.log('Waiting for Google sign-in to finish in browser…');
    }
    await sleep(2000);
  }
  throw new Error(`Google sign-in timed out.\n${SIGNIN_HINT}`);
}

async function pickToken(tokens) {
  for (const token of tokens) {
    const res = await fetch('https://www.googleapis.com/siteVerification/v1/webResource', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200 || res.status === 401) {
      if (res.status === 200) return token;
    }
  }
  return [...tokens].at(-1) ?? null;
}

async function googleApi(token, path, init = {}) {
  const res = await fetch(`https://www.googleapis.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`Google API ${path} → ${res.status}: ${text.slice(0, 300)}`);
  }
  return data;
}

async function verifyDomainDns(token) {
  const { token: dnsToken } = await googleApi(token, '/siteVerification/v1/token', {
    method: 'POST',
    body: JSON.stringify({
      verificationMethod: 'DNS_TXT',
      site: { type: 'INET_DOMAIN', identifier: DOMAIN },
    }),
  });

  console.log(`DNS verification token: ${dnsToken}`);
  await addDnsTxt(dnsToken);
  console.log('Waiting 45s for DNS propagation…');
  await sleep(45_000);

  await googleApi(
    token,
    '/siteVerification/v1/webResource?verificationMethod=DNS_TXT',
    {
      method: 'POST',
      body: JSON.stringify({
        site: { type: 'INET_DOMAIN', identifier: DOMAIN },
      }),
    },
  );
  console.log(`Domain verified: ${DOMAIN}`);
}

async function ensureSearchConsoleSite(token) {
  const encoded = encodeURIComponent(SITE_ENTRY);
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encoded}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    console.log(`Search Console property added: ${SITE_ENTRY}`);
    return;
  }
  const list = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
  const sites = (list.siteEntry ?? []).map((s) => s.siteUrl);
  if (sites.some((s) => s.includes(DOMAIN))) {
    console.log(`Search Console property exists: ${sites.find((s) => s.includes(DOMAIN))}`);
    return;
  }
  throw new Error(`Could not add Search Console property: ${res.status}`);
}

async function submitSitemapApi(token) {
  const site = encodeURIComponent(SITE_ENTRY);
  const feed = encodeURIComponent('https://tnic.help/sitemap.xml');
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/sitemaps/${feed}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sitemap submit failed: ${res.status} ${text.slice(0, 200)}`);
  }
  console.log('Sitemap submitted: https://tnic.help/sitemap.xml');
}

async function requestIndexingApi(token, url) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inspectionUrl: url,
      siteUrl: URL_PREFIX,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.log(`Inspect skip ${url}: ${data.error?.message ?? res.status}`);
    return;
  }
  const verdict = data.inspectionResult?.indexStatusResult?.verdict ?? 'unknown';
  console.log(`Inspected ${url}: ${verdict}`);
}

async function fallbackHtmlVerification(page) {
  await page.goto('https://www.google.com/webmasters/verification/verification', {
    waitUntil: 'domcontentloaded',
    timeout: TIMEOUT,
  }).catch(() => {});

  const body = await page.locator('body').innerText().catch(() => '');
  const meta = body.match(/content="([A-Za-z0-9_-]{20,})"/)?.[1];
  if (!meta) return false;

  await upsertVercelEnv('GOOGLE_SITE_VERIFICATION', meta);
  console.log('Set GOOGLE_SITE_VERIFICATION — redeploy from git to activate meta tag.');
  return true;
}

async function launchBrowser() {
  const opts = {
    channel: 'chrome',
    headless: false,
    viewport: null,
    args: ['--start-maximized'],
  };
  mkdirSync(PROFILE_DIR, { recursive: true });
  try {
    return await chromium.launchPersistentContext(PROFILE_DIR, opts);
  } catch (err) {
    if (!String(err).includes('already in use')) throw err;
    const alt = join(homedir(), '.tnic-gsc-profile-tmp');
    mkdirSync(alt, { recursive: true });
    console.warn('Chrome profile locked — using temporary profile. Prefer: node scripts/verify-google-dns.mjs');
    return await chromium.launchPersistentContext(alt, opts);
  }
}

async function main() {
  if (!googleCredentials() && !process.env.FORCE_GSC_BROWSER) {
    console.error(SIGNIN_HINT);
    process.exit(1);
  }
  console.log('Launching Chrome for Search Console…');
  const context = await launchBrowser();

  const page = context.pages()[0] ?? (await context.newPage());
  page.setDefaultTimeout(TIMEOUT);
  const tokens = captureBearerToken(page);

  try {
    await page.goto('https://accounts.google.com/signin/v2/identifier?continue=' + encodeURIComponent(GSC_HOME), {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT,
    });
    await waitForGoogleAuth(page);
    await page.goto(GSC_HOME, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });

    // Trigger API calls so we capture a bearer token
    await page.goto(`${GSC_HOME}?resource_id=${encodeURIComponent(SITE_ENTRY)}`, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT,
    }).catch(() => {});
    await sleep(5000);

    const token = await pickToken(tokens);
    if (!token) throw new Error('No Google API token captured — browse Search Console and re-run.');

    console.log('Captured Google API token — verifying domain…');
    try {
      await verifyDomainDns(token);
    } catch (err) {
      console.warn(`DNS API verify failed (${err.message}) — trying UI fallback…`);
      const html = await fallbackHtmlVerification(page);
      if (!html) throw err;
    }

    await ensureSearchConsoleSite(token);
    await submitSitemapApi(token);

    for (const url of PRIORITY_INDEX_URLS) {
      await requestIndexingApi(token, url);
      await sleep(800);
    }

    console.log('\nSearch Console setup complete.');
  } finally {
    await context.close();
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});