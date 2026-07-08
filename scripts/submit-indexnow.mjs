#!/usr/bin/env node
/**
 * Notify Bing/Yandex/etc. of sitemap URLs via IndexNow.
 * Usage: node scripts/submit-indexnow.mjs
 */
import { INDEXNOW_KEY, PRIORITY_INDEX_URLS, SITE_URL } from './lib/seo-constants.mjs';

const KEY_URL = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function submitIndexNow(urls) {
  const body = {
    host: 'tnic.help',
    key: INDEXNOW_KEY,
    keyLocation: KEY_URL,
    urlList: urls,
  };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow: ${res.status} ${res.statusText}`);
  if (!res.ok && res.status !== 202) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `IndexNow failed: ${res.status}`);
  }
}

async function pingSearchEngines() {
  const encoded = encodeURIComponent(SITEMAP_URL);
  for (const base of [
    `https://www.google.com/ping?sitemap=${encoded}`,
    `https://www.bing.com/ping?sitemap=${encoded}`,
  ]) {
    const res = await fetch(base);
    console.log(`Ping ${new URL(base).hostname}: ${res.status}`);
  }
}

async function main() {
  const keyRes = await fetch(KEY_URL);
  if (!keyRes.ok) throw new Error(`IndexNow key file missing at ${KEY_URL}`);
  const keyBody = (await keyRes.text()).trim();
  if (keyBody !== INDEXNOW_KEY) throw new Error('IndexNow key file content mismatch');

  const urls = await fetchSitemapUrls();
  console.log(`Submitting ${PRIORITY_INDEX_URLS.length} priority URLs first…`);
  await submitIndexNow(PRIORITY_INDEX_URLS);

  const rest = urls.filter((u) => !PRIORITY_INDEX_URLS.includes(u));
  console.log(`Submitting ${rest.length} remaining URLs…`);
  const batchSize = 100;
  for (let i = 0; i < rest.length; i += batchSize) {
    await submitIndexNow(rest.slice(i, i + batchSize));
  }

  await pingSearchEngines();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});