import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const TEAM_ID = 'team_HC4fnCVpV9NCDbZMHHl1Pk5r';
export const PROJECT_ID = 'prj_SMGpRy7Dgmk3UOyjgxdKqwBkvtcU';
export const DOMAIN = 'tnic.help';
export const SITE_URL = 'https://tnic.help';

export function vercelToken() {
  const authPath = join(homedir(), 'AppData', 'Roaming', 'xdg.data', 'com.vercel.cli', 'auth.json');
  return JSON.parse(readFileSync(authPath, 'utf8')).token;
}

export async function vercel(path, init = {}) {
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

export async function listDnsRecords() {
  const data = await vercel(`/v4/domains/${DOMAIN}/records`);
  return data.records ?? [];
}

export async function addDnsTxt(value) {
  const records = await listDnsRecords();
  const exists = records.some((r) => r.type === 'TXT' && r.value === value);
  if (exists) {
    console.log(`DNS TXT already present: ${value.slice(0, 40)}…`);
    return;
  }
  await vercel(`/v4/domains/${DOMAIN}/records`, {
    method: 'POST',
    body: JSON.stringify({ name: '', type: 'TXT', value, ttl: 60 }),
  });
  console.log(`DNS TXT added: ${value.slice(0, 40)}…`);
}

export async function upsertVercelEnv(key, value, { encrypted = false, targets = ['production'] } = {}) {
  const existing = await vercel(`/v10/projects/${PROJECT_ID}/env`);
  const match = (existing.envs ?? []).find((e) => e.key === key && e.target?.includes('production'));

  if (match) {
    await vercel(`/v10/projects/${PROJECT_ID}/env/${match.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ value, type: encrypted ? 'encrypted' : 'plain', target: targets }),
    });
    console.log(`Vercel env updated: ${key}`);
    return;
  }

  await vercel(`/v10/projects/${PROJECT_ID}/env`, {
    method: 'POST',
    body: JSON.stringify({
      key,
      value,
      type: encrypted ? 'encrypted' : 'plain',
      target: targets,
    }),
  });
  console.log(`Vercel env set: ${key}`);
}

export async function triggerProductionDeploy() {
  const project = await vercel(`/v9/projects/${PROJECT_ID}`);
  const repo = project.link?.repo;
  if (!repo) throw new Error('Project not linked to git — deploy manually');

  const deployments = await vercel(`/v6/deployments?projectId=${PROJECT_ID}&limit=1`);
  const latest = deployments.deployments?.[0];
  if (!latest?.meta?.githubCommitSha) throw new Error('No recent git deployment found');

  await vercel('/v13/deployments', {
    method: 'POST',
    body: JSON.stringify({
      name: project.name,
      project: PROJECT_ID,
      target: 'production',
      gitSource: {
        type: 'github',
        repo,
        ref: project.link.productionBranch ?? 'main',
        sha: latest.meta.githubCommitSha,
      },
    }),
  });
  console.log('Production redeploy triggered');
}