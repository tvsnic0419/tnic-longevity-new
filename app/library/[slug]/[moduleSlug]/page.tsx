import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LibraryModuleDetail } from '@/components/library/LibraryModuleDetail';
import { CompoundStickyBar } from '@/components/library/CompoundStickyBar';
import { CompoundIntelligenceMatrix } from '@/components/library/CompoundIntelligenceMatrix';
import { getBuyerGuideByModuleSlug } from '@/lib/buyer-guides';
import { getProductPick } from '@/lib/product-picks';
import { CompoundHero, type CompoundHeroData } from '@/components/viz/CompoundHero';
import { ModuleHero, type ModuleHeroData } from '@/components/viz/ModuleHero';
import { StructuredData } from '@/components/seo/StructuredData';
import { compounds } from '@/lib/data';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import {
  getAllModuleParams,
  getModuleBySlug,
  getModulePath,
  libraryCategoryMeta,
  type LibraryModuleCategory,
} from '@/lib/library-modules';
import { loadMdx } from '@/lib/mdx';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildMedicalWebPageSchema,
  getCitationsFromBody,
} from '@/lib/seo';
import { evidenceTagDefinitions } from '@/lib/trust';
import { getComparisonsForCompound } from '@/lib/comparison-relations';
import { resolveCompound as resolveEngineCompound } from '@/lib/compound-engine-data';
import { buildEngineStackUrl } from '@/lib/stack-url';
import { getGuideForCompound, getRelatedCompounds } from '@/lib/library-graph';
import { getPathwaysForCompound } from '@/lib/pathways';
import { seoRoutes } from '@/lib/seo-routes';

const VALID_CATEGORIES = Object.keys(libraryCategoryMeta) as LibraryModuleCategory[];

export function generateStaticParams() {
  return getAllModuleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}): Promise<Metadata> {
  const { slug: category, moduleSlug } = await params;
  if (!VALID_CATEGORIES.includes(category as LibraryModuleCategory)) return { title: 'Not Found' };
  const mod = getModuleBySlug(category as LibraryModuleCategory, moduleSlug);
  if (!mod) return { title: 'Not Found' };
  const path = getModulePath(mod);
  return seoRoutes.module({
    title: mod.title,
    summary: mod.summary,
    path,
    categoryLabel: libraryCategoryMeta[mod.category].label,
  });
}

export default async function LibraryModulePage({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug: category, moduleSlug } = await params;
  if (!VALID_CATEGORIES.includes(category as LibraryModuleCategory)) notFound();

  const mod = getModuleBySlug(category as LibraryModuleCategory, moduleSlug);
  if (!mod) notFound();

  const mdx = loadMdx(mod.mdxSlug, mod.category);
  const path = getModulePath(mod);
  const comparisons =
    mod.category === 'compounds' ? getComparisonsForCompound(mod.slug) : [];
  const guide = mod.category === 'compounds' ? getGuideForCompound(mod.slug) : undefined;
  const relatedCompounds =
    mod.category === 'compounds' ? getRelatedCompounds(mod.slug) : [];
  // Pathways this compound engages — resolved server-side so the pathway
  // registry stays out of the deep-dive client bundle.
  const compoundPathways =
    mod.category === 'compounds'
      ? getPathwaysForCompound(mod.slug).map((p) => ({ slug: p.slug, name: p.name }))
      : [];

  // "See how this scores" only appears when the engine has actually curated this
  // compound. Resolved here rather than in the client component so the engine's
  // scoring dataset stays out of every deep-dive's bundle.
  const engineCompound =
    mod.category === 'compounds' ? resolveEngineCompound(mod.slug) : null;
  const engineHref = engineCompound
    ? buildEngineStackUrl([engineCompound.id])
    : undefined;

  // Cinematic overture for compound pages — real fields joined from lib/data.ts.
  const heroCompound =
    mod.category === 'compounds' && mod.compoundId
      ? compounds.find((c) => c.id === mod.compoundId)
      : undefined;
  const heroData: CompoundHeroData | null = heroCompound
    ? {
        id: heroCompound.id,
        name: heroCompound.name,
        pathway: heroCompound.pathway,
        mechanism: heroCompound.mechanism,
        evidence: heroCompound.evidence,
        dose: heroCompound.dose,
        timing: heroCompound.timing,
        bioavailability: heroCompound.bioavailability,
        studyCount: heroCompound.studies.length,
        synergyCount: heroCompound.synergies.length,
        hallmarks: heroCompound.hallmarks
          .map((hid) => hallmarkLibrary.find((h) => h.id === hid)?.title ?? hid)
          .filter(Boolean),
      }
    : null;

  // Visual parity: the 28 "library-only" compounds have no lib/data.ts entry
  // (so no CompoundHero), and synergy stacks never do. Give them a lighter
  // overture built only from module fields — evidence tier, a live PMID count
  // from the body, and hallmarks — so every compound and synergy page opens
  // with a consistent hero. (Lifestyle/guide pages keep their own treatment —
  // the molecular motif doesn't fit them.)
  const moduleHeroData: ModuleHeroData | null =
    (mod.category === 'compounds' || mod.category === 'synergies') && !heroData
      ? {
          id: mod.slug,
          title: mod.title,
          kicker: mod.tagline.split('—')[0].trim() || 'Compound Deep-Dive',
          summary: mod.summary,
          evidenceTier: mod.evidenceTier,
          studyCount: new Set(
            (mdx?.body.match(/\bPMID:?\s*(\d{7,8})\b/g) ?? []).map((m) => m.replace(/\D/g, '')),
          ).size,
          hallmarks: mod.relatedHallmarkIds
            .map((hid) => hallmarkLibrary.find((h) => h.id === hid)?.title)
            .filter((t): t is string => Boolean(t)),
        }
      : null;

  const breadcrumbItems = [
    { name: 'Library', path: '/library' },
    { name: libraryCategoryMeta[mod.category].label, path: `/library#content-modules` },
    { name: mod.title, path },
  ];
  const breadcrumb = buildBreadcrumbSchema(breadcrumbItems);
  const reviewer = mdx?.frontmatter.reviewer;
  // Every study cited in the deep-dive body, harvested into JSON-LD citations.
  const citations = getCitationsFromBody(mdx?.body);

  // FAQ composed from already-authored fields (summary, evidence tier, and the
  // studied dose when this compound has a dataset entry) — no new claims.
  const tierDef = evidenceTagDefinitions[mod.evidenceTier];
  const faq =
    mod.category === 'compounds'
      ? buildFaqPageSchema([
          { question: `What does ${mod.title} do?`, answer: mod.summary },
          {
            question: `How strong is the evidence for ${mod.title}?`,
            answer: `TNiC grades ${mod.title} as ${tierDef.label}. ${tierDef.description}`,
          },
          ...(heroCompound?.dose
            ? [
                {
                  question: `What dose of ${mod.title} is studied?`,
                  answer: `${heroCompound.dose}${heroCompound.timing ? ` — ${heroCompound.timing}` : ''}.`,
                },
              ]
            : []),
        ])
      : null;

  const schemas =
    mod.category === 'compounds'
      ? [
          buildMedicalWebPageSchema({
            title: mod.title,
            description: mod.summary,
            path,
            dateModified: mdx?.frontmatter.last_updated,
            evidenceTier: mod.evidenceTier,
            citations,
            reviewer,
          }),
          breadcrumb,
          ...(faq ? [faq] : []),
        ]
      : [
          buildArticleSchema({
            title: mod.title,
            description: mod.summary,
            path,
            dateModified: mdx?.frontmatter.last_updated,
            evidenceTier: mod.evidenceTier,
            citations,
            reviewer,
          }),
          breadcrumb,
        ];

  // Sticky conversion rail (compounds only): does a verified pick / buyer guide
  // actually exist for this compound? Computed here — same sources the detail
  // body uses — so the rail's "See the verified pick" only appears when there is
  // one to jump to. Otherwise the rail's primary action is building a stack.
  const isCompound = mod.category === 'compounds';
  const stickyHasPick =
    isCompound &&
    Boolean(getBuyerGuideByModuleSlug(mod.slug) || (mod.compoundId && getProductPick(mod.compoundId)));
  const stickyStackHref = mod.compoundId
    ? `/stacks?stack=${mod.compoundId}&from=deep-dive`
    : undefined;

  return (
    <>
      <StructuredData schemas={schemas} />
      {heroData && <CompoundHero {...heroData} />}
      {moduleHeroData && <ModuleHero {...moduleHeroData} />}
      {isCompound && (stickyHasPick || stickyStackHref) && (
        <CompoundStickyBar
          name={mod.title}
          tier={mod.evidenceTier}
          pathway={heroCompound?.pathway}
          hasPick={stickyHasPick}
          stackHref={stickyStackHref}
        />
      )}
      {engineCompound && <CompoundIntelligenceMatrix compound={engineCompound} />}
      <LibraryModuleDetail
        module={mod}
        mdxBody={mdx?.body ?? null}
        comparisons={comparisons}
        guide={guide}
        relatedCompounds={relatedCompounds}
        engineHref={engineHref}
        pathways={compoundPathways}
        lastUpdated={mdx?.frontmatter.last_updated}
        author={mdx?.frontmatter.author}
        reviewer={reviewer}
      />
    </>
  );
}