/**
 * Affiliate-tagging engine.
 *
 * The affiliate redirect layer (`/api/go/[productId]`) sends visitors to a
 * product's `affiliateUrl ?? purchaseUrl`. Historically those destinations
 * carried no affiliate identifier, so qualified outbound clicks — the
 * platform's stated primary revenue signal — earned nothing.
 *
 * This module attaches the operator's affiliate identifier to a destination
 * URL just before the redirect fires. It is:
 *  - **config-driven** — Amazon via `AMAZON_ASSOCIATES_TAG`, every other
 *    program via a single `TNIC_AFFILIATE_RULES` JSON env var, so new programs
 *    are added without a code change;
 *  - **safe by default** — with nothing configured it is a pure no-op and the
 *    redirect behaves exactly as before;
 *  - **idempotent** — it never overwrites a parameter a destination already
 *    carries (e.g. a hand-built Amazon link that already has a `tag`, or a
 *    full network deep-link pasted into a pick's `affiliateUrl`);
 *  - **total** — it never throws; on any parse problem it returns the input
 *    unchanged, because the redirect is the contract, not the tagging.
 *
 * Edge-safe: uses only `URL`, `process.env`, and `JSON` — no Node built-ins.
 *
 * Programs whose tracking is a *different* URL rather than a query parameter
 * (ShareASale / Impact / CJ / Refersion deep links) are handled the normal
 * way: paste the full tracking URL into the pick's `affiliateUrl`
 * (`lib/product-picks.ts`); this engine then leaves it untouched.
 */

export interface AffiliateRule {
  /** Human-readable program name — for docs, tests, and debugging. */
  label: string;
  /** Predicate over the destination hostname (already lower-cased). */
  match: (host: string) => boolean;
  /** Query parameter that carries the affiliate id (e.g. `tag`, `rcode`). */
  param: string;
  /** The affiliate id/value to set. */
  value: string;
}

/** A rule as authored in the `TNIC_AFFILIATE_RULES` JSON env var. */
export interface AffiliateRuleConfig {
  /** Registrable domain to match, e.g. `iherb.com` (also matches subdomains). */
  domain: string;
  /** Query parameter that carries the affiliate id, e.g. `rcode`. */
  param: string;
  /** The affiliate id/value to set. */
  value: string;
}

/** Matches amazon.<tld> across storefronts (amazon.com, amazon.co.uk, …). */
const AMAZON_HOST = /(^|\.)amazon\.[a-z]{2,3}(\.[a-z]{2,3})?$/;

/** True when `host` is `domain` or a subdomain of it. */
function hostMatchesDomain(host: string, domain: string): boolean {
  const d = domain.toLowerCase().replace(/^\.+/, '');
  return host === d || host.endsWith(`.${d}`);
}

/** Parse `TNIC_AFFILIATE_RULES` (JSON array) into rules; malformed → []. */
function parseRuleConfig(raw: string | undefined): AffiliateRule[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  const rules: AffiliateRule[] = [];
  for (const entry of parsed) {
    if (!entry || typeof entry !== 'object') continue;
    const { domain, param, value } = entry as Record<string, unknown>;
    if (
      typeof domain !== 'string' ||
      typeof param !== 'string' ||
      typeof value !== 'string' ||
      !domain.trim() ||
      !param.trim() ||
      !value.trim()
    ) {
      continue;
    }
    const d = domain.trim();
    rules.push({
      label: d,
      match: (host) => hostMatchesDomain(host, d),
      param: param.trim(),
      value: value.trim(),
    });
  }
  return rules;
}

// Memoize env parsing so we don't re-parse the JSON on every redirect. Keyed on
// the raw strings so a config change (e.g. across deployments) is picked up.
let cacheKey: string | null = null;
let cachedRules: AffiliateRule[] = [];

/**
 * Build the active rule set from environment variables. Exposed (and accepting
 * an explicit env bag) so tests can exercise it without mutating the process.
 */
export function affiliateRulesFromEnv(
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): AffiliateRule[] {
  const amazonTag = env.AMAZON_ASSOCIATES_TAG?.trim();
  const rulesJson = env.TNIC_AFFILIATE_RULES;

  const key = `${amazonTag ?? ''}::${rulesJson ?? ''}`;
  if (key === cacheKey) return cachedRules;

  const rules: AffiliateRule[] = [];
  if (amazonTag) {
    rules.push({
      label: 'Amazon Associates',
      match: (host) => AMAZON_HOST.test(host),
      param: 'tag',
      value: amazonTag,
    });
  }
  rules.push(...parseRuleConfig(rulesJson));

  cacheKey = key;
  cachedRules = rules;
  return rules;
}

/**
 * Return `rawUrl` with the operator's affiliate id attached when a rule
 * matches the destination host and the parameter is not already present.
 * Returns the input unchanged when nothing matches or the URL can't be parsed.
 */
export function applyAffiliateTag(
  rawUrl: string,
  rules: AffiliateRule[] = affiliateRulesFromEnv(),
): string {
  if (rules.length === 0) return rawUrl;

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  const host = url.hostname.toLowerCase();
  let changed = false;

  for (const rule of rules) {
    if (!rule.match(host)) continue;
    // Idempotent: never clobber a value the destination already carries.
    if (url.searchParams.has(rule.param)) continue;
    url.searchParams.set(rule.param, rule.value);
    changed = true;
  }

  return changed ? url.toString() : rawUrl;
}
