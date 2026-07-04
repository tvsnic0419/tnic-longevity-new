#!/usr/bin/env node
/**
 * Sign into Resend via GitHub, create API key, provision DNS + Vercel env.
 * Opens a visible browser — approve GitHub if prompted.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TIMEOUT = 180_000;

async function main() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
    args: ['--start-maximized'],
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(TIMEOUT);

  try {
    console.log('Opening Resend signup…');
    await page.goto('https://resend.com/signup', { waitUntil: 'networkidle' });

    const github = page.getByRole('button', { name: /github/i });
    if (await github.count()) {
      console.log('Clicking GitHub sign-in…');
      await github.first().click();
    }

    // Wait through GitHub OAuth (user may need to approve once)
    console.log('Waiting for Resend dashboard (approve GitHub if prompted)…');
    await page.waitForURL(/resend\.com\/(?!signup|login)/, { timeout: TIMEOUT }).catch(async () => {
      const url = page.url();
      if (url.includes('github.com')) {
        console.log('On GitHub — waiting for authorization…');
        await page.waitForURL(/resend\.com/, { timeout: TIMEOUT });
      }
    });

    console.log(`Authenticated at: ${page.url()}`);
    await page.goto('https://resend.com/api-keys', { waitUntil: 'networkidle' });

    const createBtn = page.getByRole('button', { name: /create api key/i });
    if (await createBtn.count()) {
      await createBtn.first().click();
      const nameInput = page.locator('input').filter({ hasNot: page.locator('[type=password]') }).first();
      await nameInput.fill('TNiC Production');
      await page.getByRole('button', { name: /add|create|save/i }).last().click();
      await page.waitForTimeout(3000);
    }

    const body = await page.content();
    const token = body.match(/re_[A-Za-z0-9_]{10,}/)?.[0];
    if (!token) {
      throw new Error('No API key found — sign in at resend.com/api-keys and create one named TNiC Production');
    }

    console.log('API key captured — provisioning…');
    writeFileSync(join(tmpdir(), 'tnic-resend-api-key.txt'), token, 'utf8');

    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['scripts/provision-resend.mjs'], {
        cwd: process.cwd(),
        env: { ...process.env, RESEND_API_KEY: token },
        stdio: 'inherit',
        shell: true,
      });
      child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`provision exit ${code}`))));
    });

    console.log('Redeploying production…');
    await new Promise((resolve, reject) => {
      const deploy = spawn('npx', ['vercel', '--prod', '--yes'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: true,
      });
      deploy.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`deploy exit ${code}`))));
    });
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});