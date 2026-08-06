import type { Metadata } from 'next';
import { consumerFAQ } from './data';
import { PRIORITY_INDEX_PATHS } from './index-priority';
import { SITE, LONGEVITY_KEYWORDS, SOCIAL_PROFILES, EDITORIAL_AUTHOR } from './site';
import type { SourceCitation } from './types';
import { citationRegistry } from './trust';

/**
 * Route segments that ship their own `opengraph-image` file (see
 * `find app -name opengraph-image.tsx`). For these, we must NOT set
 * `openGraph.images` in the metadata object: in this Next.js setup an explicit
 * metadata image wins over the colocated file, so setting one would replace the
 * page's custom social image with the generic default. Every other page gets
 * the brand-default image below so it still has a link preview.
 */
const SEGMENTS_WITH_OWN_OG_IMAGE = new Set([
  '/',
  '/brief',
  '/compound-engine',
  '/elite-8',
  '/faq',
  '/labs',
  '/learn',
  '/library',
  '/products',
  '/shop',
  '/stacks',
  '/tools',
  '/trust',
]);

function hasOwnOgImage(path: string): boolean {
  const p = path || '/';
  if (SEGMENTS_WITH_OWN_OG_IMAGE.has(p)) return true;
  // Dynamic/nested segments with their own opengraph-image files.
  return (
    p.startsWith('/library/') ||
    p.startsWith('/club/') ||
    p.startsWith('/scorecard/')
  );
}

export function buildPageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE.url}${path}`;
  const ogImage = `${SITE.url}/opengraph-image`;
  const useDefaultImage = !hasOwnOgImage(path);
  return {
    title,
    description,
    keywords: [...LONGEVITY_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.fullName,
      locale: SITE.locale,
      type: 'website',
      ...(useDefaultImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.fullName }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(useDefaultImage ? { images: [ogImage] } : {}),
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.fullName,
    alternateName: SITE.name,
    description:
      'Evidence-based longevity education with hallmarks library, evidence comparisons, supplement stack tools, biomarker tracking, and PubMed-cited protocols.',
    url: SITE.url,
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/library?q={search_term_string}`,
        description:
          'Search hallmarks, compounds, synergy guides, evidence comparisons (e.g. NMN vs NR), and Protocol Brief headlines.',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildItemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TNiC Priority Longevity Guides',
    description: 'High-intent evidence guides and comparisons for healthspan optimization.',
    itemListElement: PRIORITY_INDEX_PATHS.map((path, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: path === '/' ? 'Home' : path.replace(/^\//, '').replace(/\//g, ' › '),
      url: `${SITE.url}${path === '/' ? '' : path}`,
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    alternateName: SITE.fullName,
    url: SITE.url,
    logo: `${SITE.url}/icon-512.png`,
    description: 'Independent educational longevity platform — not a medical provider or supplement retailer.',
    knowsAbout: [
      'Hallmarks of aging',
      'Longevity supplements',
      'Healthspan',
      'NAD+ metabolism',
      'Evidence-based nutrition',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: SITE.contactEmail,
      url: `${SITE.url}/contact`,
    },
    sameAs: [...SOCIAL_PROFILES],
  };
}

/** Root layout metadata — canonical URL, RSS discovery, optional Search Console verification */
export function buildRootMetadata(): Metadata {
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: SITE.fullName,
      template: `%s | ${SITE.name}`,
    },
    description:
      'Transformative Nutrition in Cell-Health. Learn the 12 Hallmarks of Aging and explore an independent, PubMed-backed library of nutrients and compounds — graded by human evidence, with the doses studied and how to buy well. Private, local-first, free.',
    keywords: [...LONGEVITY_KEYWORDS],
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    openGraph: {
      title: SITE.fullName,
      description:
        'Transformative Nutrition in Cell-Health — an independent, PubMed-backed library grading the nutrients and compounds that act on the 12 hallmarks of aging by strength of human evidence.',
      type: 'website',
      locale: SITE.locale,
      siteName: SITE.fullName,
      url: SITE.url,
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE.twitter,
      creator: SITE.twitter,
      title: SITE.fullName,
      description: 'Transformative Nutrition in Cell-Health — evidence-graded nutrients and compounds for the 12 hallmarks of aging.',
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: SITE.url,
      types: {
        'application/rss+xml': SITE.briefRssUrl,
      },
    },
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  };
}

/** Generic FAQPage builder. `items` are composed from already-authored content
 * (verdicts, when-to-choose lists, summaries) — never new medical claims. */
export function buildFaqPageSchema(items: { question: string; answer: string }[]) {
  const entities = items.filter((f) => f.question && f.answer);
  if (entities.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entities.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function buildFaqSchema() {
  // consumerFAQ is a non-empty static list, so this never returns null.
  return buildFaqPageSchema(consumerFAQ.map((f) => ({ question: f.question, answer: f.answer })))!;
}

const PMID_IN_BODY = /\bPMID:?\s?(\d{7,8})\b/g;
const citationByPmid = new Map(
  citationRegistry.filter((c) => c.pmid).map((c) => [c.pmid as string, c]),
);

/**
 * Harvest every study cited in a deep-dive's prose into JSON-LD `citation`
 * entries. Replaces the old fragile id-prefix match (which left most compounds
 * with an empty citation array). PMIDs that exist in the curated citation
 * registry get full metadata (title, authors, journal, year); the rest still
 * ship a valid PubMed-linked ScholarlyArticle so every studied claim is
 * machine-traceable. Works for any content type — compounds, hallmarks,
 * peptides, synergies, lifestyle, guides.
 */
export function getCitationsFromBody(body: string | null | undefined): SourceCitation[] {
  if (!body) return [];
  const seen = new Set<string>();
  const out: SourceCitation[] = [];
  for (const match of body.matchAll(PMID_IN_BODY)) {
    const pmid = match[1];
    if (seen.has(pmid)) continue;
    seen.add(pmid);
    const known = citationByPmid.get(pmid);
    out.push(
      known ?? {
        id: `pmid-${pmid}`,
        title: '',
        journal: '',
        year: 0,
        pmid,
        type: 'clinical' as const,
      },
    );
  }
  return out;
}

/** schema.org ScholarlyArticle node — omits fields we don't have. */
function toScholarlyArticle(c: SourceCitation) {
  const node: Record<string, unknown> = { '@type': 'ScholarlyArticle' };
  if (c.title) node.name = c.title;
  if (c.authors) node.author = c.authors;
  if (c.year) node.datePublished = String(c.year);
  if (c.journal) node.isPartOf = { '@type': 'Periodical', name: c.journal };
  if (c.pmid) {
    node.identifier = { '@type': 'PropertyValue', propertyID: 'PMID', value: c.pmid };
    node.url = `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/`;
  } else if (c.doi) {
    node.identifier = { '@type': 'PropertyValue', propertyID: 'DOI', value: c.doi };
    node.url = `https://doi.org/${c.doi}`;
  }
  return node;
}

/**
 * The independent-reviewer signal (schema.org `reviewedBy`). Emitted ONLY when a
 * real named reviewer is supplied via frontmatter — the schema code path exists
 * so a future reviewer lights up automatically, but nothing is claimed today.
 */
function reviewedByNode(reviewer?: string) {
  const name = reviewer?.trim();
  if (!name) return {};
  return { reviewedBy: { '@type': 'Person', name } };
}

export function buildMedicalWebPageSchema({
  title,
  description,
  path,
  dateModified,
  evidenceTier,
  citations = [],
  reviewer,
}: {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
  evidenceTier?: string;
  citations?: SourceCitation[];
  /** Independent clinical reviewer name; when unset, no reviewedBy is emitted. */
  reviewer?: string;
}) {
  const url = `${SITE.url}${path}`;
  const lastReviewed = dateModified ?? new Date().toISOString().split('T')[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: title,
    headline: title,
    description,
    url,
    dateModified: lastReviewed,
    lastReviewed,
    author: { '@type': 'Organization', name: EDITORIAL_AUTHOR.name, url: EDITORIAL_AUTHOR.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    ...reviewedByNode(reviewer),
    medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
    about: {
      '@type': 'MedicalEntity',
      name: title,
      description: evidenceTier ? `Evidence tier ${evidenceTier} longevity intervention` : undefined,
    },
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    citation: citations.map(toScholarlyArticle),
  };
}

export function buildArticleSchema({
  title,
  description,
  path,
  dateModified,
  evidenceTier,
  citations = [],
  reviewer,
}: {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
  evidenceTier?: string;
  citations?: SourceCitation[];
  /** Independent clinical reviewer name; when unset, no reviewedBy is emitted. */
  reviewer?: string;
}) {
  const lastReviewed = dateModified ?? new Date().toISOString().split('T')[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE.url}${path}`,
    dateModified: lastReviewed,
    author: { '@type': 'Organization', name: EDITORIAL_AUTHOR.name, url: EDITORIAL_AUTHOR.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    ...reviewedByNode(reviewer),
    about: {
      '@type': 'Thing',
      name: 'Longevity Science',
      description: evidenceTier ? `Evidence tier ${evidenceTier}` : undefined,
    },
    isAccessibleForFree: true,
    educationalUse: 'Longevity education — not medical advice',
    ...(citations.length > 0 ? { citation: citations.map(toScholarlyArticle) } : {}),
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function buildSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TNiC — Transformative Nutrition in Cell-Health',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Privacy-first, PubMed-backed nutrition library for cell-health: a searchable, evidence-graded catalogue of nutrients and compounds for the 12 hallmarks of aging, plus local biomarker tracking and evidence tools.',
    url: SITE.url,
    featureList: [
      'Stack synergy simulator',
      'Protocol recommendation engine',
      'Biomarker trend dashboard',
      'Intervention impact ranking',
      'Healthspan and defense scan',
      'Local-only data with export kit',
    ],
  };
}

export function buildCollectionPageSchema(input: {
  name: string;
  description: string;
  path: string;
  itemCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: `${SITE.url}${input.path}`,
    numberOfItems: input.itemCount,
    isAccessibleForFree: true,
    inLanguage: 'en-US',
  };
}

export function serializeJsonLd(...schemas: object[]) {
  return schemas.map((schema, i) => (
    { key: i, schema }
  ));
}

export function buildHowToSchema({
  name,
  description,
  path,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  path: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url: `${SITE.url}${path}`,
    ...(totalTime && { totalTime }),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
    tool: [
      { '@type': 'HowToTool', name: 'Stack Architect (TNiC)' },
      { '@type': 'HowToTool', name: 'Longevity OS Dashboard' },
    ],
    supply: [
      { '@type': 'HowToSupply', name: 'PubMed account (free)' },
      { '@type': 'HowToSupply', name: 'Baseline lab results (recommended)' },
    ],
  };
}

export function buildProductListSchema(
  products: Array<{
    name: string;
    description: string;
    brand: string;
    url: string;
    evidenceTier?: string;
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Evidence-Verified Longevity Supplements',
    description: 'One recommended product per evidence-graded compound. Zero pay-for-placement. Every link goes to the manufacturer.',
    url: `${SITE.url}/products`,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.description,
        brand: { '@type': 'Brand', name: p.brand },
        url: p.url,
        ...(p.evidenceTier && {
          additionalProperty: {
            '@type': 'PropertyValue',
            name: 'Evidence Tier',
            value: p.evidenceTier,
          },
        }),
        offers: { '@type': 'Offer', availability: 'https://schema.org/InStock' },
      },
    })),
  };
}

export function buildGuidePageSchema({
  title,
  description,
  path,
  keywords = [],
  faqs = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  faqs?: { question: string; answer: string }[];
}) {
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url: `${SITE.url}${path}`,
      author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      dateModified: new Date().toISOString().split('T')[0],
      keywords: [...LONGEVITY_KEYWORDS, ...keywords].join(', '),
      isAccessibleForFree: true,
      educationalUse: 'Longevity education — not medical advice',
    },
  ];
  if (faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }
  return schemas;
}