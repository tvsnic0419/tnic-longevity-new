import { describe, expect, it } from 'vitest';
import {
  applyAffiliateTag,
  affiliateRulesFromEnv,
  type AffiliateRule,
} from '@/lib/affiliate';

const amazonRule: AffiliateRule = {
  label: 'Amazon Associates',
  match: (host) => /(^|\.)amazon\.[a-z]{2,3}(\.[a-z]{2,3})?$/.test(host),
  param: 'tag',
  value: 'tnic-20',
};

const iherbRule: AffiliateRule = {
  label: 'iHerb',
  match: (host) => host === 'iherb.com' || host.endsWith('.iherb.com'),
  param: 'rcode',
  value: 'ABC123',
};

describe('applyAffiliateTag', () => {
  it('is a no-op when no rules are configured', () => {
    const url = 'https://www.amazon.com/dp/B000';
    expect(applyAffiliateTag(url, [])).toBe(url);
  });

  it('appends the Amazon tag to an amazon.com link', () => {
    const out = applyAffiliateTag('https://www.amazon.com/dp/B000', [amazonRule]);
    expect(new URL(out).searchParams.get('tag')).toBe('tnic-20');
  });

  it('matches amazon across storefront TLDs', () => {
    for (const host of ['amazon.com', 'www.amazon.co.uk', 'smile.amazon.de']) {
      const out = applyAffiliateTag(`https://${host}/dp/B000`, [amazonRule]);
      expect(new URL(out).searchParams.get('tag')).toBe('tnic-20');
    }
  });

  it('does not match look-alike hosts', () => {
    for (const host of ['notamazon.com', 'amazonaws.com', 'evil-amazon.com.phish.io']) {
      const url = `https://${host}/x`;
      expect(applyAffiliateTag(url, [amazonRule])).toBe(url);
    }
  });

  it('is idempotent — never overwrites an id the link already carries', () => {
    const url = 'https://www.amazon.com/dp/B000?tag=other-20';
    expect(applyAffiliateTag(url, [amazonRule])).toBe(url);
  });

  it('preserves existing query parameters when adding the tag', () => {
    const out = applyAffiliateTag('https://www.amazon.com/dp/B000?th=1', [amazonRule]);
    const params = new URL(out).searchParams;
    expect(params.get('th')).toBe('1');
    expect(params.get('tag')).toBe('tnic-20');
  });

  it('applies a generic per-domain rule to the domain and its subdomains', () => {
    for (const host of ['iherb.com', 'www.iherb.com']) {
      const out = applyAffiliateTag(`https://${host}/pr/x/123`, [iherbRule]);
      expect(new URL(out).searchParams.get('rcode')).toBe('ABC123');
    }
  });

  it('leaves non-matching hosts untouched', () => {
    const url = 'https://www.thorne.com/products/dp/resveracel';
    expect(applyAffiliateTag(url, [amazonRule, iherbRule])).toBe(url);
  });

  it('returns unparseable input unchanged (never throws)', () => {
    expect(applyAffiliateTag('not a url', [amazonRule])).toBe('not a url');
  });
});

describe('affiliateRulesFromEnv', () => {
  it('returns no rules when nothing is configured', () => {
    expect(affiliateRulesFromEnv({})).toEqual([]);
  });

  it('builds an Amazon rule from AMAZON_ASSOCIATES_TAG', () => {
    const rules = affiliateRulesFromEnv({ AMAZON_ASSOCIATES_TAG: 'tnic-21' });
    expect(rules).toHaveLength(1);
    expect(rules[0]).toMatchObject({ param: 'tag', value: 'tnic-21' });
    expect(rules[0].match('www.amazon.com')).toBe(true);
  });

  it('parses per-program rules from TNIC_AFFILIATE_RULES JSON', () => {
    const rules = affiliateRulesFromEnv({
      TNIC_AFFILIATE_RULES:
        '[{"domain":"iherb.com","param":"rcode","value":"ABC123"}]',
    });
    expect(rules).toHaveLength(1);
    expect(rules[0]).toMatchObject({ param: 'rcode', value: 'ABC123' });
    expect(rules[0].match('www.iherb.com')).toBe(true);
    expect(rules[0].match('example.com')).toBe(false);
  });

  it('combines Amazon and JSON rules', () => {
    const rules = affiliateRulesFromEnv({
      AMAZON_ASSOCIATES_TAG: 'tnic-22',
      TNIC_AFFILIATE_RULES: '[{"domain":"iherb.com","param":"rcode","value":"X"}]',
    });
    expect(rules).toHaveLength(2);
  });

  it('ignores malformed JSON and incomplete entries', () => {
    expect(affiliateRulesFromEnv({ TNIC_AFFILIATE_RULES: 'not json' })).toEqual([]);
    expect(
      affiliateRulesFromEnv({
        TNIC_AFFILIATE_RULES: '[{"domain":"iherb.com"},{"param":"x","value":"y"}]',
      }),
    ).toEqual([]);
  });
});
