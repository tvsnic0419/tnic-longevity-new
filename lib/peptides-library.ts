import type { Peptide, PeptideCategory } from './types';
import type { ThemeAccent } from './design-system';

/**
 * Peptides get their own registry rather than folding into lib/data.ts's
 * `compounds` array — unlike oral supplements, every peptide here carries a
 * distinct legal-status axis (lib/types.ts PeptideLegalStatus) that has no
 * equivalent on Compound, and mixing the two would either force that field
 * onto every OTC compound or silently drop it for peptides.
 */

export const peptideCategoryMeta: Record<PeptideCategory, { label: string; description: string; theme: ThemeAccent }> = {
  repair: {
    label: 'Repair & Recovery',
    description: 'Tissue, gut, and skin repair — collagen synthesis, wound healing, angiogenesis.',
    theme: 'emerald',
  },
  metabolic: {
    label: 'Metabolic',
    description: 'GLP-1/GIP receptor agonists — glucose control, weight loss, cardiometabolic outcomes.',
    theme: 'amber',
  },
  immune: {
    label: 'Immune & Systemic',
    description: 'Immune modulation and systemic inflammatory tone.',
    theme: 'cyan',
  },
  'growth-axis': {
    label: 'Growth Hormone Axis',
    description: 'GH secretagogues — pulsatile GH/IGF-1 signaling.',
    theme: 'violet',
  },
  mitochondrial: {
    label: 'Mitochondrial & Cellular Signaling',
    description: 'Mitochondrial-derived peptides and cellular-stress signaling.',
    theme: 'rose',
  },
};

export const peptideLibrary: Peptide[] = [
  {
    id: 'bpc-157',
    slug: 'bpc-157',
    name: 'BPC-157',
    aliases: ['Body Protection Compound-157', 'PL 14736'],
    category: 'repair',
    tagline: 'A synthetic gastric-peptide fragment studied almost exclusively in animal models of tissue and gut repair.',
    summary:
      'BPC-157 is a synthetic 15-amino-acid fragment derived from a peptide found in human gastric juice. Decades of rat and mouse studies report accelerated healing of tendon, ligament, muscle, and gut-lining injuries. There are no completed human randomized controlled trials, and the FDA placed BPC-157 on its 2023 bulk-substances list that bars compounding pharmacies from dispensing it — meaning the legitimate US sourcing pathway that existed a few years ago no longer does.',
    evidenceTier: 'C',
    legalStatus: 'compounding-restricted',
    administrationRoute: 'Subcutaneous injection (research-chemical vendors); historically oral/compounded',
    outline: [
      'What BPC-157 is and why it circulates in longevity/recovery communities',
      'Mechanism — angiogenesis and growth-factor upregulation in rodent models',
      'Evidence summary — the preclinical case, and what is genuinely missing',
      'Legal status — why the compounding pathway closed in 2023',
      'Safety, red flags, and contraindications',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['proteostasis', 'dysbiosis'],
    relatedPeptideIds: ['ghk-cu'],
    mdxSlug: 'bpc-157',
  },
  {
    id: 'ghk-cu',
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    aliases: ['Copper Peptide', 'GHK-Copper', 'Copper Tripeptide-1'],
    category: 'repair',
    tagline: 'A naturally occurring copper-binding tripeptide with real human trial data for topical skin repair.',
    summary:
      'GHK-Cu is a naturally occurring tripeptide (Gly-His-Lys) that binds copper and declines sharply with age. Topical GHK-Cu has genuine published human trials showing improved skin firmness, collagen density, and wound healing — the strongest human evidence of any peptide on this list, but confined to cosmetic/dermatological endpoints. Injectable or systemic "anti-aging" use extrapolates from gene-expression and rodent data that has not been tested the same way in people.',
    evidenceTier: 'B',
    legalStatus: 'research-use-only',
    administrationRoute: 'Topical (cosmetic products, human trial data); subcutaneous injection (research-chemical vendors, no human trial data at this route)',
    outline: [
      'What GHK-Cu is — the copper-binding tripeptide behind decades of cosmetic patents',
      'Mechanism — copper transport, collagen/elastin synthesis, and broad gene-expression effects',
      'Evidence summary — real topical human trials vs. extrapolated systemic claims',
      'Practical use — where the evidence actually supports use',
      'Safety, red flags, and contraindications',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['proteostasis', 'communication'],
    relatedPeptideIds: ['bpc-157'],
    mdxSlug: 'ghk-cu',
  },
  {
    id: 'epithalon',
    slug: 'epithalon',
    name: 'Epithalon',
    aliases: ['Epitalon', 'Epithalamin (natural precursor)'],
    category: 'mitochondrial',
    tagline: 'A synthetic tetrapeptide studied in Russian aging research for telomerase activation and pineal/circadian regulation.',
    summary:
      'Epithalon (a synthetic version of the naturally occurring pineal peptide epithalamin) was developed and studied primarily by Vladimir Khavinson\'s group in St. Petersburg across several decades. Their published work reports telomerase activation in human cell culture and improved survival/biomarker trends in small, often methodologically thin human cohorts. Independent Western replication is minimal, and no large modern RCT exists.',
    evidenceTier: 'C',
    legalStatus: 'research-use-only',
    administrationRoute: 'Subcutaneous injection (research-chemical vendors)',
    outline: [
      'What Epithalon is and the Khavinson research program behind it',
      'Mechanism — telomerase activation and pineal/melatonin regulation',
      'Evidence summary — what the Russian cohort studies actually show, and their limits',
      'Practical use — why this stays a preclinical/exploratory-tier entry',
      'Safety, red flags, and contraindications',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['telomeres', 'epigenetic'],
    relatedPeptideIds: ['mots-c', 'humanin'],
    mdxSlug: 'epithalon',
  },
  {
    id: 'thymosin-alpha-1',
    slug: 'thymosin-alpha-1',
    name: 'Thymosin Alpha-1',
    aliases: ['Tα1', 'Zadaxin (branded)'],
    category: 'immune',
    tagline: 'An immune-modulating peptide with real regulatory approval abroad for hepatitis and as a cancer-treatment adjunct — not for longevity specifically.',
    summary:
      'Thymosin Alpha-1 is a naturally occurring thymic peptide with a genuinely unusual evidence profile among peptides: it is an approved prescription drug (branded Zadaxin) in roughly 35 countries for chronic hepatitis B/C and as an adjunct in some cancer and vaccine-response protocols — though not FDA-approved in the United States. That real regulatory and trial history is for immune modulation in specific disease contexts, not for "anti-aging" — the longevity framing is an extrapolation from its immune effects, not a studied endpoint itself.',
    evidenceTier: 'B',
    legalStatus: 'research-use-only',
    administrationRoute: 'Subcutaneous injection',
    outline: [
      'What Thymosin Alpha-1 is and where it is actually an approved drug',
      'Mechanism — T-cell modulation and innate immune signaling',
      'Evidence summary — real hepatitis/oncology trial data vs. the longevity extrapolation',
      'Practical use — immune-modulation context vs. general anti-aging framing',
      'Safety, red flags, and contraindications',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['inflammation', 'senescence'],
    relatedPeptideIds: ['glp1-longevity'],
    mdxSlug: 'thymosin-alpha-1',
  },
  {
    id: 'gh-secretagogues',
    slug: 'gh-secretagogues',
    name: 'Ipamorelin & CJC-1295',
    aliases: ['GH secretagogues', 'GHRP/GHRH stack'],
    category: 'growth-axis',
    tagline: 'A GHRP + GHRH-analog pair almost always stacked together to raise pulsatile growth hormone output.',
    summary:
      'Ipamorelin is a selective ghrelin-receptor agonist (a "GHRP") and CJC-1295 is a growth-hormone-releasing-hormone analog — different receptors, same goal: a larger, more natural pulse of endogenous GH and downstream IGF-1. Real endocrinology literature characterizes their GH/IGF-1 pharmacodynamics in humans, but no trial has tested long-term anti-aging outcomes, and elevated IGF-1 carries a real, debated theoretical cancer-risk signal from unrelated epidemiological literature that any user should weigh.',
    evidenceTier: 'B',
    legalStatus: 'research-use-only',
    administrationRoute: 'Subcutaneous injection',
    outline: [
      'What Ipamorelin and CJC-1295 are, and why they are stacked together',
      'Mechanism — ghrelin-receptor agonism (Ipamorelin) vs. GHRH-analog action (CJC-1295)',
      'Evidence summary — real GH/IGF-1 pharmacodynamic data vs. missing outcome trials',
      'Dosing patterns reported in the community (not a clinical protocol)',
      'Safety, red flags, and contraindications — including the IGF-1/cancer-risk question',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['nutrient', 'proteostasis'],
    relatedPeptideIds: ['glp1-longevity'],
    mdxSlug: 'gh-secretagogues',
  },
  {
    id: 'mots-c',
    slug: 'mots-c',
    name: 'MOTS-c',
    aliases: ['Mitochondrial ORF of the 12S rRNA type-c'],
    category: 'mitochondrial',
    tagline: 'A mitochondrial-genome-encoded peptide discovered by the Cohen lab, studied so far only in mice.',
    summary:
      'MOTS-c is one of a small class of "mitochondrial-derived peptides" encoded in mitochondrial DNA rather than the nuclear genome, discovered and characterized by Changhan David Lee and Pinchas Cohen\'s group at USC. Mouse studies report AMPK activation, improved insulin sensitivity, and exercise-mimetic metabolic effects. As of today there is no published human interventional trial of exogenous MOTS-c — everything sold is an unregulated research chemical with human dosing extrapolated entirely from animal pharmacokinetics.',
    evidenceTier: 'C',
    legalStatus: 'research-use-only',
    administrationRoute: 'Subcutaneous injection (research-chemical vendors)',
    outline: [
      'What MOTS-c is — a mitochondrial-DNA-encoded signaling peptide',
      'Mechanism — AMPK activation and exercise-mimetic metabolic effects in mice',
      'Evidence summary — the real mouse data, and the human trial gap',
      'Practical use — why this stays firmly exploratory-tier',
      'Safety, red flags, and contraindications',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['mito', 'nutrient'],
    relatedPeptideIds: ['humanin', 'epithalon'],
    mdxSlug: 'mots-c',
  },
  {
    id: 'glp1-longevity',
    slug: 'glp1-longevity',
    name: 'Semaglutide & Tirzepatide',
    aliases: ['Ozempic', 'Wegovy', 'Rybelsus', 'Mounjaro', 'Zepbound', 'GLP-1/GIP agonists'],
    category: 'metabolic',
    tagline: 'FDA-approved GLP-1/GIP receptor agonists with the largest human RCT evidence base of any peptide on this list — used off-label for longevity, not approved for it.',
    summary:
      'Semaglutide (GLP-1 receptor agonist) and tirzepatide (dual GLP-1/GIP agonist) are approved prescription drugs for type 2 diabetes and chronic weight management, backed by some of the largest cardiometabolic RCT programs ever run — the STEP and SURMOUNT trial programs, plus semaglutide\'s SELECT cardiovascular-outcomes trial in people without diabetes. That is genuinely Tier A evidence — for glycemic control, weight loss, and cardiovascular event reduction. "Longevity" is a real but separate extrapolation from those outcomes, not itself a primary trial endpoint, and both drugs are prescription-only.',
    evidenceTier: 'A',
    legalStatus: 'fda-approved-rx',
    administrationRoute: 'Subcutaneous injection (semaglutide also available oral as Rybelsus)',
    outline: [
      'What semaglutide and tirzepatide are, and how they differ (GLP-1 vs. dual GLP-1/GIP)',
      'Mechanism — incretin-receptor agonism, appetite regulation, and downstream metabolic effects',
      'Evidence summary — STEP, SURMOUNT, and the SELECT cardiovascular-outcomes trial',
      'The longevity extrapolation — what the trials show vs. what "anti-aging" claims add',
      'Safety, red flags, and contraindications',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['nutrient', 'inflammation'],
    relatedPeptideIds: ['thymosin-alpha-1', 'gh-secretagogues'],
    mdxSlug: 'glp1-longevity',
  },
  {
    id: 'humanin',
    slug: 'humanin',
    name: 'Humanin',
    aliases: ['MDP (mitochondrial-derived peptide)'],
    category: 'mitochondrial',
    tagline: 'A mitochondrial-derived peptide with observational human data linking circulating levels to aging, but no exogenous-administration trials.',
    summary:
      'Humanin is the first-discovered mitochondrial-derived peptide, also characterized substantially by Pinchas Cohen\'s group, with cytoprotective and anti-apoptotic effects in cell and mouse models. Human evidence here is genuinely different in kind from most peptides on this list: there are real observational studies correlating circulating humanin levels with age and specific diseases in people — but that is association, not intervention. No published trial has given people exogenous humanin and measured an outcome.',
    evidenceTier: 'C',
    legalStatus: 'research-use-only',
    administrationRoute: 'Subcutaneous injection (research-chemical vendors)',
    outline: [
      'What Humanin is — the first mitochondrial-derived peptide discovered',
      'Mechanism — cytoprotection and anti-apoptotic signaling in cell/mouse models',
      'Evidence summary — human observational correlation vs. zero interventional trials',
      'Practical use — why observational data cannot justify a dosing protocol',
      'Safety, red flags, and contraindications',
      'Personal tracking template',
    ],
    relatedHallmarkIds: ['mito', 'senescence'],
    relatedPeptideIds: ['mots-c', 'epithalon'],
    mdxSlug: 'humanin',
  },
];

export function getPeptideBySlug(slug: string): Peptide | undefined {
  return peptideLibrary.find((p) => p.slug === slug);
}

export function getAllPeptideSlugs(): string[] {
  return peptideLibrary.map((p) => p.slug);
}

export function getPeptidesByCategory(category: PeptideCategory): Peptide[] {
  return peptideLibrary.filter((p) => p.category === category);
}
