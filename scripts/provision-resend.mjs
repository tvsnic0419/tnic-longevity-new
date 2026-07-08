#!/usr/bin/env node
/**
 * Provision Resend + Vercel for TNiC Protocol Brief.
 * Usage: RESEND_API_KEY=re_xxx node scripts/provision-resend.mjs
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const RESEND_API = 'https://api.resend.com';
const TEAM_ID = 'team_HC4fnCVpV9NCDbZMHHl1Pk5r';
const PROJECT_ID = 'prj_SMGpRy7Dgmk3UOyjgxdKqwBkvtcU';
const DOMAIN = 'send.tnic.help';
const FROM_EMAIL = 'TNiC Protocol Brief <brief@send.tnic.help>';
const AUDIENCE_NAME = 'TNiC Protocol Brief';
const FALLBACK_EMAIL = 'tvsnic0419@gmail.com';

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey?.startsWith('re_')) {
  console.error('Set RESEND_API_KEY=re_... before running.');
  process.exit(1);
}

function vercelToken() {
  const authPath = join(homedir(), 'AppData', 'Roaming', 'xdg.data', 'com.vercel.cli', 'auth.json');
  return JSON.parse(readFileSync(authPath, 'utf8')).token;
}

async function resend(path, init = {}) {
  const res = await fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? `Resend ${res.status}`);
  return data;
}

async function vercel(path, init = {}) {
  const token = vercelToken();
  const url = path.includes('?') ? `${path}&teamId=${TEAM_ID}` : `${path}?teamId=${TEAM_ID}`;
  const res = await fetch(`https://api.vercel.com${url}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.failed) throw new Error(JSON.stringify(data));
  return data;
}

async function ensureDomain() {
  const list = await resend('/domains');
  const existing = (list.data ?? []).find((d) => d.name === DOMAIN);
  if (existing) {
    console.log(`Domain exists: ${DOMAIN} (${existing.status})`);
    return existing.id;
  }
  const created = await resend('/domains', {
    method: 'POST',
    body: JSON.stringify({ name: DOMAIN, region: 'us-east-1' }),
  });
  console.log(`Created domain: ${DOMAIN}`);
  return created.id;
}

async function addDnsRecords(domainId) {
  const domain = await resend(`/domains/${domainId}`);
  const records = domain.records ?? [];
  const existing = await vercel(`/v4/domains/tnic.help/records`);
  const have = new Set((existing.records ?? []).map((r) => `${r.type}:${r.name}:${r.value}`));

  for (const rec of records) {
    if (rec.status === 'verified') continue;
    const name = rec.name?.replace(`.${DOMAIN}`, '').replace(DOMAIN, '') ?? rec.name;
    const shortName = name === DOMAIN ? '' : name.replace(`.tnic.help`, '');
    const body = {
      name: shortName,
      type: rec.type,
      value: rec.value,
      ttl: 60,
    };
    if (rec.type === 'MX' && rec.priority) body.mxPriority = rec.priority;
    const key = `${rec.type}:${shortName}:${rec.value}`;
    if (have.has(key)) {
      console.log(`DNS skip: ${rec.type} ${shortName || '@'}`);
      continue;
    }
    await vercel('/v4/domains/tnic.help/records', { method: 'POST', body: JSON.stringify(body) });
    console.log(`DNS added: ${rec.type} ${shortName || '@'}`);
  }
}

async function verifyDomain(domainId) {
  for (let i = 0; i < 12; i++) {
    await resend(`/domains/${domainId}/verify`, { method: 'POST' });
    const d = await resend(`/domains/${domainId}`);
    console.log(`Verify attempt ${i + 1}: ${d.status}`);
    if (d.status === 'verified') return true;
    await new Promise((r) => setTimeout(r, 10000));
  }
  return false;
}

async function ensureAudience() {
  const list = await resend('/audiences');
  const existing = (list.data ?? []).find((a) => a.name === AUDIENCE_NAME);
  if (existing) {
    console.log(`Audience exists: ${existing.id}`);
    return existing.id;
  }
  const created = await resend('/audiences', {
    method: 'POST',
    body: JSON.stringify({ name: AUDIENCE_NAME }),
  });
  console.log(`Created audience: ${created.id}`);
  return created.id;
}

async function setVercelEnv(key, value) {
  try {
    await vercel(`/v10/projects/${PROJECT_ID}/env`, {
      method: 'POST',
      body: JSON.stringify({
        key,
        value,
        type: key.includes('SECRET') || key === 'RESEND_API_KEY' ? 'encrypted' : 'plain',
        target: ['production'],
      }),
    });
    console.log(`Vercel env set: ${key}`);
  } catch (e) {
    if (String(e).includes('already exists')) {
      console.log(`Vercel env exists: ${key}`);
    } else {
      throw e;
    }
  }
}

async function main() {
  const domainId = await ensureDomain();
  await addDnsRecords(domainId);
  const verified = await verifyDomain(domainId);
  if (!verified) console.warn('Domain not verified yet — emails may fail until DNS propagates.');
  const audienceId = await ensureAudience();
  await setVercelEnv('RESEND_API_KEY', apiKey);
  await setVercelEnv('RESEND_FROM_EMAIL', FROM_EMAIL);
  await setVercelEnv('RESEND_AUDIENCE_ID', audienceId);
  await setVercelEnv('BRIEF_FALLBACK_EMAIL', FALLBACK_EMAIL);
  console.log('\nDone. Redeploy production: npx vercel --prod');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});