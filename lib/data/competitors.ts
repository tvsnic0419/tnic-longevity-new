/* Split out of the former monolithic lib/data.ts. Keeping these datasets in
   focused modules stops a client component that needs one export from pulling
   the entire content library into its bundle. */


export const competitors = [
  {
    name: 'Blueprint (Bryan Johnson)',
    focus: 'Personal protocol & biomarker optimization',
    strengths: ['Celebrity credibility', 'Detailed daily routine', 'Biomarker percentiles'],
    gaps: ['Single-person protocol', 'No interactive tools', 'Expensive product lock-in'],
    tnicAdvantage: 'TNiC generalizes Blueprint-level intelligence into interactive tools anyone can use — stack architect, synergy scoring, and hallmark mapping.',
  },
  {
    name: 'DoNotAge.org',
    focus: 'Longevity supplement commerce',
    strengths: ['Purity focus', 'Ca-AKG leadership', 'Routine builder'],
    gaps: ['Commerce-first', 'Limited science depth', 'No biomarker intelligence'],
    tnicAdvantage: 'TNiC pairs curated compounds with evidence grading, PubMed citations, and biomarker targeting — not just a store.',
  },
  {
    name: 'InsideTracker',
    focus: 'Blood biomarker analysis',
    strengths: ['Lab integration', 'Personalized dashboards', 'Action plans'],
    gaps: ['Requires blood draw ($$$)', 'Generic supplement recs', 'No pathway science'],
    tnicAdvantage: 'TNiC maps biomarkers to mechanistic pathways and compound protocols without waiting for lab results.',
  },
  {
    name: 'Lifespan.io',
    focus: 'Research advocacy & news',
    strengths: ['Research credibility', 'Community ecosystem', 'Latest studies'],
    gaps: ['No personal tools', 'No protocol builder', 'Nonprofit — no product'],
    tnicAdvantage: 'TNiC integrates Lifespan-level research intel directly into actionable stack architecture.',
  },
  {
    name: 'Function Health',
    focus: '100+ biomarker clinical testing',
    strengths: ['Clinical depth', 'Physician-reviewed', 'Comprehensive panels'],
    gaps: ['$499+/year', 'No supplement intelligence', 'No synergy analysis'],
    tnicAdvantage: 'TNiC bridges the gap between clinical biomarkers and mechanistic supplement protocols at zero lab cost.',
  },
  {
    name: 'Examine.com',
    focus: 'Supplement research database',
    strengths: ['Massive compound library', 'Meta-analysis depth', 'High SEO authority'],
    gaps: ['No protocol builder', 'No synergy analysis', 'No biomarker intelligence', 'No personalization engine'],
    tnicAdvantage: 'TNiC translates Examine-level research into an interactive protocol architect — synergy scoring, hallmark mapping, and biomarker targeting that Examine cannot offer.',
  },
  {
    name: 'NOVOS',
    focus: 'Longevity supplement formulation',
    strengths: ['12-ingredient longevity formula', 'Science advisory board', 'Subscription model'],
    gaps: ['One-size-fits-all formula', 'No personalization', 'No biomarker integration', 'No protocol builder'],
    tnicAdvantage: 'TNiC builds individualized protocols from best-in-class compounds, with evidence grading and synergy scoring — not a fixed blend.',
  },
  {
    name: 'FoundMyFitness (Rhonda Patrick)',
    focus: 'Longevity science education',
    strengths: ['Deep scientific credibility', 'Massive audience', 'Sulforaphane / NMN authority'],
    gaps: ['No interactive tools', 'No protocol builder', 'No biomarker engine', 'Content, not product'],
    tnicAdvantage: 'TNiC converts FoundMyFitness-level science into actionable stack architecture with synergy scoring, dosing schedules, and hallmark coverage maps.',
  },
];
