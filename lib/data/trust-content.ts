/* Split out of the former monolithic lib/data.ts. Keeping these datasets in
   focused modules stops a client component that needs one export from pulling
   the entire content library into its bundle. */


export const evidenceStandards = [
  {
    tier: 'A' as const,
    label: 'Tier A — Clinical Evidence',
    criteria: [
      'Human randomized or controlled trial published in peer-reviewed journal',
      'Measurable biomarker or healthspan outcome reported',
      'Replicated by independent research group or multi-trial consensus',
      'Safety profile established in human subjects',
    ],
    example: 'GlyNAC human trials showing restored glutathione in older adults (PMID: 35975308)',
  },
  {
    tier: 'B' as const,
    label: 'Tier B — Strong Mechanistic + Emerging Human Data',
    criteria: [
      'Well-characterized mechanism in human cell or tissue models',
      'At least one human pharmacokinetic or pilot study',
      'Consistent preclinical lifespan or healthspan data',
      'Used in established clinical or longevity protocols',
    ],
    example: 'R-ALA redox cycling with decades of clinical use but limited dedicated longevity trials',
  },
  {
    tier: 'C' as const,
    label: 'Tier C — Preclinical Promise',
    criteria: [
      'Strong animal or in-vitro mechanistic evidence only',
      'No human longevity outcome data yet',
      'Included only when mechanism aligns with mapped hallmark',
      'Flagged clearly — not recommended as stack foundation',
    ],
    example: 'Compounds with mouse lifespan data but no human trials — disclosed transparently',
  },
];

export const selectionCriteria = [
  { step: '01', title: 'Mechanism First', desc: 'Compound must target a mapped hallmark or defense pathway — not trend-driven inclusion.' },
  { step: '02', title: 'Bioavailability Verified', desc: 'Formulation must achieve meaningful plasma/tissue levels. Racemic or oxide forms excluded when superior alternatives exist.' },
  { step: '03', title: 'PubMed Traceable', desc: 'Every recommendation links to primary literature. Marketing claims without citations are rejected.' },
  { step: '04', title: 'Dose-Response Validated', desc: 'Dosing ranges derived from clinical trials, not label marketing. AM/PM timing based on absorption science.' },
  { step: '05', title: 'Synergy Tested', desc: 'Stack combinations evaluated for pathway overlap and interaction risk — not random bundling.' },
];

export const transparencyPledge = [
  { title: 'No Pay-for-Placement', desc: 'Brands cannot pay for inclusion. Compounds earn placement through evidence grading only.' },
  { title: 'Transparent Affiliate', desc: 'TNiC may earn a commission on verified picks via affiliate links — disclosed at every point of purchase. Commission never influences product selection or evidence tiers.' },
  { title: 'Not Medical Advice', desc: 'TNiC is an educational intelligence platform. Always consult your physician before starting any protocol.' },
  { title: 'Limitations Stated', desc: 'Biomarker projections and biological age estimates are modeled — not lab diagnostics. We say so clearly.' },
  { title: 'Evidence Updates', desc: 'When new trials publish, evidence tiers are re-evaluated. Outdated recommendations are revised publicly.' },
];

export const safetyNotes = [
  {
    compoundId: 'glynac',
    cautions: ['May lower blood pressure in some individuals', 'Sulfur odor from NAC is normal and harmless'],
    avoidIf: ['Active chemotherapy without oncologist approval'],
    consultIf: ['Kidney disease', 'Taking nitroglycerin', 'Pregnant or nursing'],
  },
  {
    compoundId: 'sulforaphane',
    cautions: ['Can cause mild GI discomfort on empty stomach', 'Take with food if sensitive'],
    avoidIf: ['Known cruciferous vegetable allergy'],
    consultIf: ['Thyroid conditions (high doses may affect iodine uptake)', 'Taking blood thinners'],
  },
  {
    compoundId: 'rala',
    cautions: ['May lower blood glucose — monitor if diabetic', 'R-form only; S-ALA is far less effective'],
    avoidIf: ['Thiamine deficiency (rare)'],
    consultIf: ['Diabetes medications', 'Chemotherapy', 'Thyroid medication'],
  },
  {
    compoundId: 'cakg',
    cautions: ['May cause mild GI effects at higher doses', 'Start low and titrate'],
    avoidIf: [],
    consultIf: ['Kidney stones history', 'Calcium-restricted diet', 'Pregnant or nursing'],
  },
  {
    compoundId: 'nmn',
    cautions: ['Generally well-tolerated in human trials', 'Quality varies enormously between brands — verify third-party testing'],
    avoidIf: [],
    consultIf: ['Active cancer treatment', 'Pregnant or nursing', 'Taking metformin (NAD+ pathway interaction — discuss with doctor)'],
  },
  {
    compoundId: 'nr',
    cautions: ['Generally well-tolerated in human trials', 'Do not combine high-dose NR with high-dose NMN without physician oversight — both converge on the same NAD+ pool'],
    avoidIf: [],
    consultIf: ['Active cancer treatment', 'Pregnant or nursing', 'Taking metformin (NAD+ pathway interaction — discuss with doctor)'],
  },
  {
    compoundId: 'resveratrol',
    cautions: ['Poor bioavailability in standard forms — trans-resveratrol with piperine or micellization preferred', 'May inhibit platelet aggregation'],
    avoidIf: ['Scheduled surgery within 2 weeks'],
    consultIf: ['Blood thinners (warfarin, aspirin)', 'Liver disease', 'Hormone-sensitive conditions'],
  },
  {
    compoundId: 'taurine',
    cautions: ['Generally well-tolerated; high doses may cause mild GI upset in sensitive individuals', 'Declines sharply with age — repletion is mechanistic, not a cure-all'],
    avoidIf: [],
    consultIf: ['Kidney disease', 'Pregnant or nursing', 'Taking lithium or hypotensive medications'],
  },
  {
    compoundId: 'spermidine',
    cautions: ['Wheat-germ extracts may contain gluten traces — verify label if celiac', 'Start low; autophagy induction can cause transient fatigue in some users'],
    avoidIf: ['Known wheat or polyamine sensitivity'],
    consultIf: ['Autoimmune conditions on immunomodulators', 'Pregnant or nursing'],
  },
  {
    compoundId: 'pterostilbene',
    cautions: ['May lower LDL and blood glucose at higher doses — monitor lipids if on statins', 'Methylated stilbenoid — pairs with NMN PM dosing like resveratrol'],
    avoidIf: ['Scheduled surgery within 2 weeks (platelet effects, similar to resveratrol)'],
    consultIf: ['Statins or lipid-lowering drugs', 'Diabetes medications', 'Blood thinners'],
  },
  {
    compoundId: 'berberine',
    cautions: ['Strongly lowers blood glucose — can cause hypoglycemia when stacked with diabetes drugs', 'Common GI effects (cramping, diarrhea) — split into TID doses with meals', 'Potent CYP3A4/P-gp inhibitor — can raise levels of many prescription drugs'],
    avoidIf: ['Pregnancy or nursing (may cross placenta / cause kernicterus in infants)'],
    consultIf: ['Any prescription medication (metabolized via CYP3A4)', 'Diabetes or blood-pressure medication', 'Liver or kidney disease'],
  },
  {
    compoundId: 'urolithina',
    cautions: ['Well-tolerated in human trials at 500–1000 mg', 'Direct Urolithin A supplementation bypasses variable gut-microbiome conversion'],
    avoidIf: [],
    consultIf: ['Pregnant or nursing', 'Active cancer treatment', 'Taking immunomodulating therapy'],
  },
  {
    compoundId: 'fisetin',
    cautions: ['Senolytic pulse dosing (2–3 consecutive days) is the studied protocol — not daily use', 'Poor bioavailability — liposomal or fat-based delivery preferred', 'May inhibit platelet aggregation and CYP enzymes at high pulse doses'],
    avoidIf: ['Scheduled surgery within 2 weeks', 'Pregnant or nursing'],
    consultIf: ['Blood thinners (warfarin, aspirin)', 'Chemotherapy', 'Any CYP-metabolized medication'],
  },
  {
    compoundId: 'coq10',
    cautions: ['Ubiquinol form preferred over ubiquinone for absorption after ~40', 'Take with a fat-containing meal', 'May modestly lower blood pressure'],
    avoidIf: [],
    consultIf: ['Warfarin (CoQ10 can reduce its anticoagulant effect)', 'Blood-pressure medication', 'Chemotherapy'],
  },
  {
    compoundId: 'omega3',
    cautions: ['High doses (>3 g/day) can increase bleeding time', 'Choose third-party-tested products for oxidation and heavy metals', 'Take with food to reduce reflux / fishy aftertaste'],
    avoidIf: ['Scheduled surgery within 1–2 weeks (bleeding risk)'],
    consultIf: ['Blood thinners (warfarin, aspirin, clopidogrel)', 'Known fish or shellfish allergy', 'Atrial fibrillation history'],
  },
  {
    compoundId: 'astaxanthin',
    cautions: ['Generally well tolerated at trial doses (2–12mg/day)', 'Mild, harmless carotenoid skin discoloration possible at sustained high intake', 'Choose natural Haematococcus pluvialis-derived extract — most human RCTs used this form, not synthetic astaxanthin'],
    avoidIf: [],
    consultIf: ['Blood thinners (mild antiplatelet effect reported)', 'Pregnant or nursing'],
  },
  {
    compoundId: 'creatine',
    cautions: ['Well-tolerated at 3–5g/day in long-term trials up to 30g/day for 5 years', 'Mild water retention is common and expected, not a red flag', 'Does not work without a resistance-training stimulus'],
    avoidIf: [],
    consultIf: ['Pre-existing kidney disease', 'Pregnant or nursing'],
  },
  {
    compoundId: 'curcumin',
    cautions: ['Poorly absorbed without an enhanced-bioavailability formulation (piperine, phytosome, or micellized)', 'Rare hepatotoxicity reported with some formulations', 'Piperine co-formulations increase CYP3A4-mediated drug absorption'],
    avoidIf: ['Active gallbladder disease or bile duct obstruction'],
    consultIf: ['Blood thinners (warfarin, aspirin, clopidogrel)', 'Iron supplementation (curcumin chelates iron)', 'Any CYP3A4-metabolized medication if using a piperine-combined form'],
  },
  {
    compoundId: 'glucosamine',
    cautions: ['Most products are shellfish-derived — verify sourcing if allergic', 'Sulfate form has better trial support than HCl for joint symptoms', 'Some case reports of altered INR when combined with warfarin'],
    avoidIf: ['Known shellfish allergy (unless a verified shellfish-free source)'],
    consultIf: ['Warfarin or other anticoagulants', 'Diabetes (theoretical minor effect on glucose/insulin sensitivity)'],
  },
  {
    compoundId: 'glycine',
    cautions: ['Generally well-tolerated even at 15g/day metabolic doses', 'PM sleep dose (3g) and metabolic dose (up to 15g/day) are separate protocols — do not assume one implies the other'],
    avoidIf: [],
    consultIf: ['Significant renal impairment (amino-acid load)', 'Taking clozapine (glycine acts on the same NMDA-glycine site and may reduce efficacy)'],
  },
  {
    compoundId: 'magnesium',
    cautions: ['Glycinate is gentler on the GI tract than oxide; threonate is the form with cognitive trial data', 'High doses can cause loose stools — reduce dose rather than stopping abruptly', 'Serum magnesium can look normal while intracellular stores are depleted'],
    avoidIf: ['Significant renal impairment (risk of hypermagnesemia)'],
    consultIf: ['Heart block or bradycardia', 'Taking fluoroquinolone or tetracycline antibiotics (magnesium reduces their absorption — separate dosing by 2+ hours)'],
  },
  {
    compoundId: 'melatonin',
    cautions: ['Can cause next-day grogginess, especially at doses above the ~4mg latency-benefit plateau', 'Supplement-grade content has been shown to deviate from label in independent testing — verify third-party testing', 'Fluvoxamine and some other medications sharply raise melatonin blood levels'],
    avoidIf: [],
    consultIf: ['Sedative or hypnotic medications', 'Autoimmune conditions (melatonin has immune-modulating effects)', 'Diabetes medications (may modestly affect glucose)'],
  },
  {
    compoundId: 'nac',
    cautions: ['Sulfur odor is normal and harmless', 'Oral bioavailability is low (~6–10%) — effect is on the glutathione pool, not plasma NAC', 'Aging-specific use should pair with glycine (GlyNAC), not be used alone'],
    avoidIf: [],
    consultIf: ['Taking nitroglycerin (NAC can potentiate nitrate-induced hypotension)', 'Blood thinners (thiol groups may add to bleeding risk)', 'Asthma (rare reports of bronchospasm, mainly with inhaled NAC)'],
  },
  {
    compoundId: 'pqq',
    cautions: ['Well-tolerated in the small human trials conducted so far', 'Evidence base is early-stage — no meta-analysis or hard-outcome trial exists yet', 'Several supporting trials are manufacturer-sponsored (BioPQQ) — factor that into confidence'],
    avoidIf: [],
    consultIf: ['Pregnant or nursing (no human safety data)'],
  },
  {
    compoundId: 'quercetin',
    cautions: ['Daily supportive dosing (500mg) is a different, lower-risk use case than the D+Q senolytic protocol', 'Quercetin inhibits CYP3A4/CYP2C9 and can raise levels of many prescription drugs', 'May have mild antiplatelet effects at higher doses'],
    avoidIf: ['Self-administering the D+Q senolytic protocol without a prescribing physician — dasatinib is a potent chemotherapy drug'],
    consultIf: ['Blood thinners (warfarin, aspirin)', 'Any CYP3A4/CYP2C9-metabolized medication', 'Scheduled surgery within 2 weeks'],
  },
  {
    compoundId: 'selenium',
    cautions: ['More is not better — selenoprotein synthesis saturates, and 200µg/day long-term dosing has been linked to increased type 2 diabetes risk in randomized trials', 'Garlic breath, brittle nails, or hair loss are classic early signs of excess', 'Correcting a documented deficiency and supplementing an already-replete person are opposite interventions'],
    avoidIf: ['Long-term intake above the RDA without a documented deficiency'],
    consultIf: ['Diabetes or prediabetes', 'Thyroid medication (selenium affects thyroid hormone conversion — coordinate monitoring)'],
  },
  {
    compoundId: 'vitamin-d3',
    cautions: ['Large hard-outcome trials (VITAL, D-Health) found no cancer or cardiovascular mortality benefit in already-sufficient adults', 'Take with a fat-containing meal for absorption', 'High-dose, high-calcium combinations raise hypercalcemia risk'],
    avoidIf: ['Sarcoidosis or other granulomatous disease (unregulated conversion to active hormone)', 'Hyperparathyroidism', 'History of kidney stones without physician guidance'],
    consultIf: ['Thiazide diuretics or digoxin', 'Kidney disease'],
  },
  {
    compoundId: 'vitamin-k2',
    cautions: ['Not a fracture or heart-attack drug — no trial shows reduced fracture or cardiovascular event rates', 'Take with the largest fat-containing meal', 'One RCT in osteopenic women found no BMD benefit despite carboxylation rising — evidence is mixed, not settled'],
    avoidIf: [],
    consultIf: ['Warfarin or other vitamin K antagonists (direct pharmacological antagonism — do not combine without physician coordination)', 'DOACs or other anticoagulants', 'Clotting disorders'],
  },
  {
    compoundId: 'zinc',
    cautions: ['Take with a light meal — zinc on an empty stomach frequently causes nausea', 'Practical maintenance dose (15–30mg) is well below the 45mg trial dose used for infection-reduction data', 'Chronic intake above the 40mg/day UL depletes copper, which can progress to anemia and neuropathy'],
    avoidIf: ['Chronic high-dose use (>40mg/day) without copper co-supplementation or physician monitoring'],
    consultIf: ['Taking fluoroquinolone or tetracycline antibiotics, or penicillamine (zinc reduces absorption — separate dosing)'],
  },
];

export const generalSafetyGuidance = [
  'Start one compound at a time. Add to your stack weekly to identify what your body responds to.',
  'Bring your TNiC stack export to your physician or pharmacist before combining with prescriptions.',
  'Pregnant, nursing, or under 18: longevity supplementation is not recommended without medical supervision.',
  'If you experience adverse effects, stop the most recently added compound and consult a professional.',
  'Lab testing (CBC, metabolic panel, hs-CRP) every 6–12 months is recommended for anyone on active protocols.',
];

export const outcomeMilestones = [
  {
    week: 'Week 1–2',
    title: 'Foundation Phase',
    expectations: ['Possible mild GI adjustment as body adapts', 'Subtle energy shifts — often too early for biomarker change', 'Focus on consistency, not results'],
    realistic: true,
  },
  {
    week: 'Week 4–6',
    title: 'Early Signals',
    expectations: ['Improved sleep quality or recovery (subjective)', 'Some users report clearer skin and reduced brain fog', 'Glutathione markers may begin shifting in responsive individuals'],
    realistic: true,
  },
  {
    week: 'Week 12',
    title: 'Measurable Territory',
    expectations: ['GlyNAC trials showed significant glutathione restoration at 24 weeks — early lab shifts possible at 12', 'Energy and exercise recovery often noticeably improved', 'Inflammation markers (hs-CRP) may trend downward', 'Ca-AKG human trial (PMID: 34847066) showed measurable epigenetic age reduction by week 12'],
    realistic: true,
  },
  {
    week: 'Week 24+',
    title: 'Clinical Benchmark',
    expectations: [
      'GlyNAC human trials: restored glutathione, improved mitochondrial function, reduced oxidative stress at this timepoint',
      'NAD+ restoration effects compound with consistent NMN dosing — PBMC NAD+ levels measurably elevated vs. baseline',
      'Ca-AKG: human trial (PMID: 34847066) showed mean 8-year epigenetic age reduction — full effect consolidates at 24 weeks',
      'Biological age estimates may show 1–3 year improvement with full protocol adherence and lifestyle pillars intact',
      'Retest baseline labs (hs-CRP, CBC, metabolic panel, optionally GSH + NAD+ metabolites) to quantify protocol impact',
    ],
    realistic: true,
  },
];

export const supplementRedFlags = [
  { flag: 'Proprietary blends hiding doses', why: 'You cannot verify effective amounts of active ingredients', action: 'Reject any product that does not list individual compound doses' },
  { flag: '"Clinically proven" without PMID', why: 'Marketing language without traceable evidence', action: 'Demand PubMed citation or independent third-party testing' },
  { flag: 'Racemic ALA sold as "Alpha Lipoic Acid"', why: 'S-enantiomer is biologically inert — you get half the effective dose', action: 'Insist on R-Alpha Lipoic Acid specifically' },
  { flag: 'NMN without purity certificate', why: 'NMN market is flooded with underdosed or contaminated products', action: 'Require COA (Certificate of Analysis) showing ≥99% purity' },
  { flag: 'Lifespan claims from mouse-only data', why: 'Mouse lifespan extension does not guarantee human outcomes', action: 'Weight preclinical data appropriately — prefer human trial evidence' },
  { flag: 'Stack of 20+ ingredients', why: 'Interaction risk increases; doses per ingredient are usually sub-therapeutic', action: 'Prefer focused 3–6 compound protocols with verified dosing' },
  { flag: 'No disclosure of evidence tier', why: 'Hiding whether evidence is human or animal is a transparency failure', action: 'Only trust sources that label Tier A / B / C — or equivalent — clearly' },
];

export const gettingStartedSteps = [
  { step: 1, title: 'Take The Nico Starter Questionnaire', desc: 'Answer questions about your goal, concern, age, experience, budget, and safety flags. Get a personalized stack preset and next OS step.', link: '/quiz' },
  { step: 2, title: 'Review Your Biomarkers', desc: 'See which longevity markers are most depleted for your profile. Understand what your stack needs to target.', link: '/labs?tab=input' },
  { step: 3, title: 'Build Your Stack', desc: 'Use the Stack Architect to toggle compounds. Watch synergy score and AM/PM dosing update in real time.', link: '/stacks' },
  { step: 4, title: 'Check Safety & Consult', desc: 'Review contraindications in the Trust Center. Export your protocol and bring it to your physician.', link: '/trust' },
  { step: 5, title: 'Track & Iterate', desc: 'Follow the outcomes timeline for realistic expectations. Re-scan every 90 days and adjust your stack.', link: '/learn?tab=outcomes' },
];
