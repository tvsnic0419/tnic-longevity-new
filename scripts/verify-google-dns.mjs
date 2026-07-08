#!/usr/bin/env node
/**
 * Add Google Search Console DNS TXT record via Vercel.
 * Usage: node scripts/verify-google-dns.mjs "google-site-verification=XXXX"
 */
import { addDnsTxt } from './lib/vercel.mjs';

const token = process.argv[2]?.trim() || process.env.GOOGLE_DNS_TXT?.trim();
if (!token?.startsWith('google-site-verification=')) {
  console.error('Usage: node scripts/verify-google-dns.mjs "google-site-verification=YOUR_TOKEN"');
  process.exit(1);
}

await addDnsTxt(token);
console.log('\nDNS TXT added. In Search Console, click Verify, then submit sitemap: sitemap.xml');