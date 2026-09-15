import { describe, expect, it } from 'vitest';
import {
  PAGE_CONNECTION_CLUSTER_IDS,
  clusterFrom,
  type ClusterId,
} from './page-connections';

/**
 * Pins the Start / Explore / Decide / Verify journey rails added in the
 * audit-coherence-interlink pass. Cluster membership is intentional, not
 * generated — these guards fail if a major hub drops out of the bidirectional
 * graph or if the four journey clusters regress to the thin explore-only set.
 */
describe('page-connections journey clusters', () => {
  it('exposes the four journey clusters plus accountability rails', () => {
    expect(PAGE_CONNECTION_CLUSTER_IDS).toEqual(
      expect.arrayContaining(['start', 'explore', 'decide', 'verify', 'trust', 'policy', 'about']),
    );
    expect(PAGE_CONNECTION_CLUSTER_IDS).toHaveLength(7);
  });

  it('keeps major hubs reachable from complementary clusters', () => {
    const required: Record<ClusterId, string[]> = {
      start: ['/nico', '/library', '/elite-8', '/hallmarks', '/dashboard'],
      explore: ['/library', '/hallmarks', '/elite-8', '/pathways', '/library/compare'],
      decide: ['/stacks', '/protocols', '/tools', '/nico', '/elite-8'],
      verify: ['/shop', '/products', '/labs', '/trust', '/dashboard'],
      trust: ['/trust', '/trust/methodology', '/shop'],
      policy: ['/privacy', '/health-data'],
      about: ['/about', '/contact', '/trust'],
    };

    for (const [id, hrefs] of Object.entries(required) as [ClusterId, string[]][]) {
      const members = new Set(clusterFrom(id, '/__none__').members.map((m) => m.href));
      for (const href of hrefs) {
        expect(members.has(href), `${id} missing ${href}`).toBe(true);
      }
      expect(clusterFrom(id, '/__none__').members.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('excludes the current path from its own cluster', () => {
    const fromNico = clusterFrom('start', '/nico');
    expect(fromNico.members.some((m) => m.href === '/nico')).toBe(false);
    expect(fromNico.members.some((m) => m.href === '/library')).toBe(true);
  });

  it('uses coherent primary CTA labels on Start / Decide / Verify', () => {
    const startLabels = clusterFrom('start', '/__none__').members.map((m) => m.label);
    const decideLabels = clusterFrom('decide', '/__none__').members.map((m) => m.label);
    const verifyLabels = clusterFrom('verify', '/__none__').members.map((m) => m.label);
    expect(startLabels).toContain('Start with NICO');
    expect(startLabels).toContain('Explore the library');
    expect(decideLabels).toContain('Stack Architect');
    expect(verifyLabels).toContain('Verify stack');
  });
});
