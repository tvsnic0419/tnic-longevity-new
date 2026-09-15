import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('journey rails integrity (audit 2026-09)', () => {
  it('keeps the Start → Explore → Decide → Verify journey rails dense and coherent', () => {
    // page-connections grew from a thin explore/trust/policy/about set into
    // four journey clusters mounted across major hubs. Pin the landmarks.
    const pageConnections = readFileSync(resolve(process.cwd(), 'lib/page-connections.ts'), 'utf8');
    const recommended = readFileSync(
      resolve(process.cwd(), 'components/ui/RecommendedNextSteps.tsx'),
      'utf8',
    );
    const paletteContext = readFileSync(
      resolve(process.cwd(), 'lib/command-palette-context.ts'),
      'utf8',
    );
    const eliteGrid = readFileSync(
      resolve(process.cwd(), 'components/home/HomeEliteGrid.tsx'),
      'utf8',
    );
    const labs = readFileSync(resolve(process.cwd(), 'app/labs/page.tsx'), 'utf8');
    const products = readFileSync(resolve(process.cwd(), 'app/products/page.tsx'), 'utf8');
    const protocols = readFileSync(resolve(process.cwd(), 'app/protocols/page.tsx'), 'utf8');
    const stacks = readFileSync(resolve(process.cwd(), 'app/stacks/page.tsx'), 'utf8');
    const dashboard = readFileSync(resolve(process.cwd(), 'app/dashboard/page.tsx'), 'utf8');
    const shop = readFileSync(resolve(process.cwd(), 'app/shop/page.tsx'), 'utf8');

    expect(pageConnections).toContain('START_CLUSTER');
    expect(pageConnections).toContain('DECIDE_CLUSTER');
    expect(pageConnections).toContain('VERIFY_CLUSTER');
    expect(pageConnections).toContain("title: 'Start here'");
    expect(pageConnections).toContain("label: 'Start with NICO'");
    expect(pageConnections).toContain("label: 'Verify stack'");
    expect(pageConnections).toContain('PAGE_CONNECTION_CLUSTER_IDS');

    // RecommendedNextSteps once linked "Build your first stack" to /dashboard.
    expect(recommended).toContain("href: '/stacks'");
    expect(recommended).not.toMatch(/title: 'Build your first stack'[\s\S]*?href: '\/dashboard'/);

    // Elite-8 palette context must not self-link the compare action.
    expect(paletteContext).toContain("href: '/library/compare'");
    expect(paletteContext).not.toContain(
      "item('ctx-elite8-compare', 'Head-to-head comparison', { href: '/elite-8'",
    );

    // Elite homepage cards must offer library → stacks → shop paths.
    expect(eliteGrid).toContain('Read evidence');
    expect(eliteGrid).toContain('Open in stacks');
    expect(eliteGrid).toContain('Verify stack');
    expect(eliteGrid).toContain('/shop?stack=');

    for (const [rel, src] of [
      ['labs', labs],
      ['products', products],
      ['protocols', protocols],
      ['stacks', stacks],
      ['dashboard', dashboard],
      ['shop', shop],
    ] as const) {
      expect(src, `${rel} must mount PageConnections`).toContain('PageConnections');
      expect(src, `${rel} must mount ContinueTrail`).toContain('ContinueTrail');
      expect(src, `${rel} must use clusterFrom`).toContain('clusterFrom(');
    }

    expect(labs).toContain("label: 'Start with NICO'");
    expect(stacks).toContain("label: 'Start with NICO'");
  });
});
