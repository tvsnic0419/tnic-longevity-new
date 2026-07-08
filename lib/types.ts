import type { LucideIcon } from 'lucide-react';

export type StackGoal = 'nrf2' | 'mito' | 'hybrid' | 'sirt1' | 'autophagy' | 'longevity';

export type CostTier = 'budget' | 'moderate' | 'premium' | 'clinical';

export type SimplicityTier = 'minimal' | 'moderate' | 'advanced' | 'clinical';

export type EvidenceTier = 'A' | 'B' | 'C';

/** User-facing evidence labels for content blocks and journey entries */
export type EvidenceLevel = 'Strong' | 'Moderate' | 'Mechanistic' | 'Personal' | 'Emerging';

export type CitationType = 'clinical' | 'review' | 'preclinical' | 'guideline' | 'meta-analysis';

export type JourneyMilestoneType = 'personal' | 'experiment' | 'protocol' | 'platform';

export type UpdateCategory = 'feature' | 'evidence' | 'safety' | 'content' | 'design';

export interface SourceCitation {
  id: string;
  title: string;
  authors?: string;
  journal: string;
  year: number;
  pmid?: string;
  doi?: string;
  url?: string;
  type: CitationType;
  summary?: string;
}

export interface JourneyMilestone {
  date: string;
  title: string;
  type: JourneyMilestoneType;
  desc: string;
  metric: string | null;
  evidenceTier?: EvidenceTier;
  citationIds?: string[];
  personal?: boolean;
}

export interface UpdateHistoryEntry {
  date: string;
  version: string;
  title: string;
  category: UpdateCategory;
  changes: string[];
}

export interface DisclaimerBlock {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'legal';
  body: string;
  appliesTo: string[];
}

export interface StudyRef {
  title: string;
  journal: string;
  year: number;
  pmid: string;
}

export interface Compound {
  id: string;
  name: string;
  brand: string;
  pathway: string;
  mechanism: string;
  desc: string;
  badge: StackGoal;
  bioavailability: number;
  evidence: EvidenceTier;
  dose: string;
  timing: 'AM' | 'PM' | 'AM/PM';
  synergies: string[];
  hallmarks: string[];
  studies: StudyRef[];
}

export interface Biomarker {
  id: string;
  name: string;
  unit: string;
  optimal: string;
  critical: string;
  desc: string;
  compounds: string[];
}

export interface ResearchArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  tag: string;
  summary: string;
  pmid: string;
  impact: 'breakthrough' | 'clinical' | 'preclinical';
}

export interface Competitor {
  name: string;
  focus: string;
  strengths: string[];
  gaps: string[];
  tnicAdvantage: string;
}

export interface ProtocolBlock {
  time: string;
  period: 'AM' | 'PM' | 'Weekly';
  action: string;
  compounds: string[];
  rationale: string;
}

export interface Hallmark {
  id: string;
  title: string;
  desc: string;
  coverage: number;
  icon: LucideIcon;
  intervention: string;
}

export interface HallmarkIntervention {
  id: string;
  name: string;
  category: 'compound' | 'lifestyle' | 'clinical' | 'emerging';
  evidence: EvidenceTier;
  rank: number;
  impact: number;
  description: string;
  compoundId?: string;
  pmid?: string;
  tnicAvailable: boolean;
}

export interface HallmarkLibraryEntry {
  id: string;
  slug: string;
  number: number;
  title: string;
  tagline: string;
  summary: string;
  mechanism: string;
  keyMolecules?: string[];
  whyItMatters: string;
  visual: 'dna' | 'telomere' | 'epigenetic' | 'protein' | 'autophagy' | 'mito' | 'senescence' | 'stem' | 'signaling' | 'inflammation' | 'gut' | 'nutrient';
  coverage: number;
  biomarkers: string[];
  interventions: HallmarkIntervention[];
  personalPrompts: string[];
  relatedCompoundIds: string[];
  mdxSlug: string;
}

export interface PathwayNode {
  id: string;
  label: string;
  x: number;
  y: number;
  genes: number;
  summary: string;
  cascade: string[];
}

export interface RoadmapItem {
  phase: string;
  title: string;
  desc: string;
  specs: string[];
  active: boolean;
}

export type NextUpStatus = 'shipped' | 'in_progress' | 'planned';

export interface NextUpItem {
  id: string;
  title: string;
  desc: string;
  status: NextUpStatus;
  sprint?: string;
  href?: string;
  tags?: string[];
}

export interface EvidenceStandard {
  tier: EvidenceTier;
  label: string;
  criteria: string[];
  example: string;
}

export interface SafetyNote {
  compoundId: string;
  cautions: string[];
  avoidIf: string[];
  consultIf: string[];
}

export interface FAQItem {
  id: string;
  category: 'safety' | 'science' | 'products' | 'getting-started';
  question: string;
  answer: string;
}

export interface GlossaryTerm {
  term: string;
  simple: string;
  why: string;
}

export interface OutcomeMilestone {
  week: string;
  title: string;
  expectations: string[];
  realistic: boolean;
}

export interface RedFlag {
  flag: string;
  why: string;
  action: string;
}