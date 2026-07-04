import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildOrganizationSchema, buildRootMetadata } from './seo';
import { SOCIAL_PROFILES } from './site';

describe('seo', () => {
  const original = { ...process.env };

  beforeEach(() => {
    process.env = { ...original };
  });

  afterEach(() => {
    process.env = original;
  });

  it('buildOrganizationSchema includes public social profiles in sameAs', () => {
    expect(buildOrganizationSchema().sameAs).toEqual([...SOCIAL_PROFILES]);
  });

  it('buildRootMetadata exposes RSS alternate feed', () => {
    const alternates = buildRootMetadata().alternates;
    expect(alternates?.types?.['application/rss+xml']).toMatch(/\/brief\/feed\.xml$/);
  });

  it('buildRootMetadata includes Google verification when env is set', () => {
    process.env.GOOGLE_SITE_VERIFICATION = 'abc123token';
    expect(buildRootMetadata().verification).toEqual({ google: 'abc123token' });
  });

  it('buildRootMetadata omits Google verification when env is unset', () => {
    delete process.env.GOOGLE_SITE_VERIFICATION;
    expect(buildRootMetadata().verification).toBeUndefined();
  });
});