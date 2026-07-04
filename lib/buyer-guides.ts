export interface BuyerGuideChecklist {
  id: string;
  label: string;
  detail: string;
}

export interface BuyerGuideDoseAnchor {
  label: string;
  dose: string;
  pmid?: string;
  note?: string;
}

export interface CompoundBuyerGuide {
  compoundId: string;
  title: string;
  tagline: string;
  /** What the label must say — form chemistry matters */
  formRequirements: string[];
  coaDemands: BuyerGuideChecklist[];
  doseAnchors: BuyerGuideDoseAnchor[];
  redFlags: string[];
  /** Neutral sourcing note — no brand endorsements */
  sourcingNote: string;
  relatedCompareSlug?: string;
}

export const compoundBuyerGuides: CompoundBuyerGuide[] = [
  {
    compoundId: 'nmn',
    title: 'NMN buyer guide',
    tagline: 'NAD+ precursor — verify stabilized form and trial-matched dose',
    formRequirements: [
      'β-Nicotinamide mononucleotide (NMN), not nicotinamide riboside (NR) unless you chose NR intentionally',
      'Stabilized capsule or cold-chain if label requires refrigeration',
      'No niacin (nicotinic acid) masquerading as NAD+ support — flushing means wrong molecule',
    ],
    coaDemands: [
      { id: 'purity', label: '≥98% purity', detail: 'Third-party HPLC on batch; identity confirmed as β-NMN' },
      { id: 'heavy-metals', label: 'Heavy metals panel', detail: 'Lead, arsenic, cadmium, mercury within USP limits' },
      { id: 'micro', label: 'Microbial limits', detail: 'TPC, yeast/mold, E. coli absent' },
      { id: 'nad-metabolite', label: 'Optional NAD metabolite assay', detail: 'Some labs verify NMN → NAD+ conversion in vitro' },
    ],
    doseAnchors: [
      { label: 'Igarashi RCT', dose: '250 mg/day', pmid: '36482258', note: '12 weeks, raised blood NAD+' },
      { label: 'Liao RCT', dose: '250 mg/day', pmid: '33443990', note: '12 weeks, metabolite elevation' },
      { label: 'Common titration', dose: '250 → 500 mg/day', note: 'Week 12 if flat NAD+ index' },
    ],
    redFlags: [
      'Proprietary blend hiding actual NMN mg per capsule',
      'NR sold as "NMN alternative" without disclosing different molecule',
      'Dose below 200 mg with "clinical strength" marketing',
      'No batch COA or expired certificate (>12 months old)',
      'Combined high-dose NR + NMN without physician oversight',
    ],
    sourcingNote:
      'TNiC does not sell or affiliate. Demand batch-specific COA from any supplier. Match published trial doses before judging efficacy.',
    relatedCompareSlug: 'nmn-vs-nr',
  },
  {
    compoundId: 'nr',
    title: 'NR (Nicotinamide Riboside) buyer guide',
    tagline: 'NAD+ precursor alternative — verify NR-Cl identity and trial-matched dose',
    formRequirements: [
      'Nicotinamide riboside chloride (NR-Cl) — not generic "NAD+ booster" blends',
      'Declared NR mg per capsule — not hidden in proprietary NAD+ complex',
      'Not β-NMN mislabeled as "NAD+ precursor" without naming the molecule',
    ],
    coaDemands: [
      { id: 'identity', label: 'NR-Cl identity', detail: 'HPLC confirms nicotinamide riboside chloride, not niacin' },
      { id: 'purity', label: '≥98% purity', detail: 'Third-party batch COA dated within 12 months' },
      { id: 'heavy-metals', label: 'Heavy metals panel', detail: 'Lead, arsenic, cadmium within USP limits' },
      { id: 'nad-proof', label: 'Optional NAD+ metabolite retest', detail: 'Week-4 blood NAD+ index to confirm response' },
    ],
    doseAnchors: [
      { label: 'Martens RCT', dose: '1000 mg/day', pmid: '29514064', note: 'Elevated whole-blood NAD+' },
      { label: 'Common consumer range', dose: '300–500 mg/day', note: 'Start mid-range; titrate at week 12' },
      { label: 'TNiC compare anchor', dose: 'See NMN vs NR table', note: 'Match one precursor — not both high-dose' },
    ],
    redFlags: [
      'NR + NMN combo products without physician oversight label',
      'Niacin (flush form) sold as NAD+ support',
      'Dose below 250 mg with "clinical strength" marketing',
      'No batch COA or expired certificate',
      'Switching from NMN without week-4 NAD+ baseline to compare response',
    ],
    sourcingNote:
      'Choose NR if your physician prefers NR literature or you have proven NR response. TNiC stacks default to NMN — substitution is manual in Lab Hub notes.',
    relatedCompareSlug: 'nmn-vs-nr',
  },
  {
    compoundId: 'glynac',
    title: 'GlyNAC buyer guide',
    tagline: 'Dual-precursor glutathione — ratio and elemental weights matter',
    formRequirements: [
      'Combined glycine + N-acetylcysteine (NAC) in one product OR separate verified doses',
      'Elemental glycine and NAC weights — not "proprietary blend"',
      'NAC as free acid or stable salt; avoid racemic mystery powders',
    ],
    coaDemands: [
      { id: 'ratio', label: '1:1 glycine:NAC ratio', detail: 'Matches Kumar trial design (600 mg + 600 mg)' },
      { id: 'identity', label: 'Identity confirmation', detail: 'FTIR or HPLC for both actives' },
      { id: 'sulfur', label: 'Sulfur odor acceptable', detail: 'Fresh NAC smells — extreme rancidity suggests degradation' },
      { id: 'fillers', label: 'Excipient disclosure', detail: 'No hidden niacin or alpha-lipoic acid "boosters" changing stack math' },
    ],
    doseAnchors: [
      { label: 'Kumar RCT', dose: '600 mg glycine + 600 mg NAC', pmid: '34129059', note: '24 weeks, restored GSH' },
      { label: 'Follow-up trial', dose: 'Same ratio', pmid: '36656670', note: 'Mitochondrial function improved' },
      { label: 'Entry titration', dose: '300+300 → 600+600', note: 'GI tolerance week 1–2' },
    ],
    redFlags: [
      'Liposomal glutathione marketed as equivalent — different molecule, weaker human longevity data',
      'NAC-only product labeled "glutathione support" without glycine',
      'Underdosed glycine (<400 mg) with inflated NAC',
      'No GSH retest plan — buying blind without week-12 draw',
    ],
    sourcingNote:
      'The evidence unit is GlyNAC together. If buying separately, weigh both on a scale and log combined dose.',
    relatedCompareSlug: 'glynac-vs-liposomal-glutathione',
  },
  {
    compoundId: 'sulforaphane',
    title: 'Sulforaphane buyer guide',
    tagline: 'NRF2 switch — glucoraphanin + myrosinase activation is non-negotiable',
    formRequirements: [
      'Glucoraphanin (GR) content in mg OR verified sulforaphane yield',
      'Myrosinase enzyme co-packaged OR explicit sprout/extract with active myrosinase',
      'Broccoli seed extract alone without conversion pathway is insufficient',
    ],
    coaDemands: [
      { id: 'gr-content', label: 'Glucoraphanin per serving', detail: '10–35 mg GR aligns with human NRF2 activation studies' },
      { id: 'myrosinase', label: 'Myrosinase activity', detail: 'Must convert GR → sulforaphane in gut or capsule' },
      { id: 'stability', label: 'Stability data', detail: 'Isothiocyanates degrade — check manufacture date' },
      { id: 'nitrile', label: 'Low nitrile byproducts', detail: 'Quality extracts minimize inactive nitriles' },
    ],
    doseAnchors: [
      { label: 'Airway NRF2 study', dose: '~40 μmol SFN dose equivalent', pmid: '27356680', note: 'Broccoli sprout extract' },
      { label: 'Practical GR range', dose: '10–35 mg glucoraphanin', note: 'With active myrosinase' },
      { label: 'Stack pairing', dose: 'AM with GlyNAC', note: 'Substrate before gene switch' },
    ],
    redFlags: [
      'Broccoli powder with no GR/mysrosinase quantification',
      'Curcumin-only NRF2 claim — different pathway, weaker KEAP1 covalent modification',
      'Proprietary "SFN complex" with undisclosed mg',
      'Expecting CRP drop in <4 weeks without lifestyle compliance',
    ],
    sourcingNote:
      'Heat destroys myrosinase in cooked broccoli. Supplements must solve the conversion problem explicitly.',
    relatedCompareSlug: 'sulforaphane-vs-curcumin',
  },
  {
    compoundId: 'resveratrol',
    title: 'Trans-resveratrol buyer guide',
    tagline: 'SIRT1 activator — trans isomer, fat pairing, PM timing',
    formRequirements: [
      'Trans-resveratrol ≥98% — not cis-resveratrol dominant',
      'Micronized or lipid-resolved for absorption',
      'Not red wine extract with unknown resveratrol fraction',
    ],
    coaDemands: [
      { id: 'trans', label: 'Trans-resveratrol %', detail: 'HPLC trans vs cis ratio on batch' },
      { id: 'purity', label: '≥98% purity', detail: 'Emodin and heavy metals within spec' },
      { id: 'dose', label: 'Per-capsule dose stated', detail: '150–500 mg trans-resveratrol per PM dose' },
      { id: 'stability', label: 'Light protection', detail: 'Opaque packaging — photodegradation to cis form' },
    ],
    doseAnchors: [
      { label: 'SIRT1 pairing', dose: '150–500 mg PM', note: 'With fat-containing meal' },
      { label: 'With NMN', dose: 'NMN AM + resveratrol PM', note: 'Fuel before activator' },
      { label: 'Trial-informed ceiling', dose: '≤500 mg/day', note: 'Higher doses rarely improve outcomes in humans' },
    ],
    redFlags: [
      'Polygonum cuspidatum extract with no trans% disclosure',
      'Combined with high-dose quercetin without interaction awareness',
      'Taken fasted AM — poor absorption, GI distress',
      'Pterostilbene sold as identical — see compare guide',
    ],
    sourcingNote:
      'Resveratrol activates SIRT1; NMN fuels it. Buy both to trial standard only if running the SIRT1 pair stack.',
    relatedCompareSlug: 'resveratrol-vs-pterostilbene',
  },
  {
    compoundId: 'cakg',
    title: 'Ca-AKG buyer guide',
    tagline: 'Alpha-ketoglutarate — calcium salt stability and TCA/epigenetic dose',
    formRequirements: [
      'Calcium alpha-ketoglutarate (Ca-AKG) — not plain AKG powder confused with sports beta-alanine products',
      'Elemental AKG dose per serving in grams',
      'Stable salt form with low moisture exposure',
    ],
    coaDemands: [
      { id: 'akg-content', label: 'AKG content per serving', detail: '1–2 g AKG equivalent per day in mouse/human discussions' },
      { id: 'ca-ratio', label: 'Calcium balance', detail: 'Factor total daily calcium if on other Ca supplements' },
      { id: 'purity', label: '≥98% purity', detail: 'Identity as calcium 2-oxopentanedioate' },
      { id: 'batch', label: 'Batch COA', detail: 'Mouse lifespan paper used specific purity — demand same rigor' },
    ],
    doseAnchors: [
      { label: 'Mouse lifespan', dose: '~1–2 g AKG equivalent', pmid: '33027664', note: 'Median lifespan extension' },
      { label: 'Human pilot', dose: '1–2 g/day Ca-AKG', pmid: '38247127', note: 'Middle-aged adults' },
      { label: 'Stack timing', dose: 'AM with breakfast', note: 'Pairs with NMN in NAD+ Mito Stack' },
    ],
    redFlags: [
      'AKG bundled in underdosed "longevity blends"',
      'Confusion with glutamine or glutamate products',
      'No epigenetic clock or AKG metabolite retest at 6 months',
      'Stacking with warfarin or calcium channel blockers without physician review',
    ],
    sourcingNote:
      'Ca-AKG is accessed via the NAD+ Mito Stack synergy guide — not a standalone TNiC toggle. Verify dose against stack math.',
    relatedCompareSlug: 'nrf2-triad-vs-mito-stack',
  },
  {
    compoundId: 'tudca',
    title: 'TUDCA buyer guide',
    tagline: 'ER stress chaperone — verify TUDCA identity and hepatoprotection panel',
    formRequirements: [
      'Tauroursodeoxycholic acid (TUDCA) — not UDCA alone unless intentional',
      'Vegan capsule if bile acid sourcing matters to you',
      'Powder or capsule with mg per serving — not "liver support blend"',
    ],
    coaDemands: [
      { id: 'identity', label: 'TUDCA identity', detail: 'HPLC confirms taurine-conjugated UDCA' },
      { id: 'purity', label: '≥98% purity', detail: 'Bile acid contaminants below spec' },
      { id: 'heavy', label: 'Heavy metals', detail: 'Especially important for bile-derived sources' },
      { id: 'micro', label: 'Microbial limits', detail: 'Standard USP panel' },
    ],
    doseAnchors: [
      { label: 'Entry dose', dose: '250–500 mg/day', note: 'Titrate GI tolerance' },
      { label: 'Common range', dose: '500–1000 mg/day', note: '8–12 week proteostasis trial' },
      { label: 'Ceiling', dose: '≤1500 mg/day', note: 'Loose stool = reduce dose' },
    ],
    redFlags: [
      'Generic "liver detox" blend with undisclosed TUDCA mg',
      'UDCA substituted without label clarity',
      'No baseline ALT/AST before 8-week trial',
      'Gallstone history without physician clearance',
    ],
    sourcingNote:
      'TUDCA is library-only on TNiC. Run liver panel at baseline and week 8 — see elevated TUDCA module.',
  },
  {
    compoundId: 'rapamycin',
    title: 'Rapamycin sourcing guide (Rx only)',
    tagline: 'Prescription sirolimus — physician-managed, never research-chemical DIY',
    formRequirements: [
      'Pharmaceutical sirolimus (Rapamune or equivalent) via licensed prescriber',
      'Never "research grade" rapamycin for human consumption',
      'Verified tablet strength (mg) from pharmacy — not compounded mystery doses',
    ],
    coaDemands: [
      { id: 'rx', label: 'Valid prescription', detail: 'Off-label longevity use still requires licensed prescriber' },
      { id: 'lot', label: 'Pharmacy lot traceability', detail: 'Standard drug supply chain — not supplement COA' },
      { id: 'dose', label: 'Documented pulse schedule', detail: 'Weekly pulse common in longevity discussions — physician sets' },
      { id: 'monitor', label: 'Monitoring plan signed', detail: 'CBC, lipids, glucose, infection vigilance' },
    ],
    doseAnchors: [
      { label: 'Mouse lifespan', dose: 'Continuous low dose', pmid: '19587683', note: 'Not directly translatable to humans' },
      { label: 'Human pulse (discussion)', dose: '3–6 mg weekly', note: 'Physician-supervised only — not TNiC recommendation' },
      { label: 'Mannick immune study', dose: 'Low-dose mTOR inhibition', pmid: '25540326', note: 'Different paradigm than transplant dosing' },
    ],
    redFlags: [
      'Any non-pharmacy source offering sirolimus',
      'Continuous daily dosing without immunosuppression monitoring',
      'Skipping CBC/lipids because "longevity dose is low"',
      'Live vaccines during active rapamycin use',
    ],
    sourcingNote:
      'TNiC documents evidence for physician conversations only. The only acceptable source is a licensed prescriber and pharmacy.',
  },
  {
    compoundId: 'taurine',
    title: 'Taurine Buyer Guide',
    tagline: 'A declining sulfonic amino acid — the sourcing bar is purity and dose',
    formRequirements: [
      'Label must say: taurine (free-form amino acid)',
      'Avoid "taurine blend" — verify 100% taurine, no creatine or BCAA mix',
      'Vegan certifiable (synthetic from isethionic acid) — verify if critical',
    ],
    coaDemands: [
      { id: 't-id', label: 'Identity test', detail: 'HPLC or amino acid analysis confirming taurine' },
      { id: 't-purity', label: '≥99% purity', detail: 'No sulfuric acid residuals from synthesis' },
      { id: 't-heavy-metals', label: 'Heavy metals panel', detail: 'Lead, arsenic, mercury, cadmium — all ≤USP limits' },
      { id: 't-microbio', label: 'Microbial limits', detail: 'Total aerobic count ≤1000 CFU/g' },
    ],
    doseAnchors: [
      { label: 'Human longevity range', dose: '1–4g daily', note: 'Singh 2023 Science context — human-applicable supplemental range' },
      { label: 'Entry dose', dose: '1g daily', note: 'Start here and assess tolerance for 2 weeks before increasing' },
    ],
    redFlags: [
      'Dose below 500mg per serving (sub-therapeutic)',
      'Combined with energy drink ingredients (caffeine, B vitamins at extreme doses)',
      'No manufacturing country listed (taurine purity varies by source)',
    ],
    sourcingNote:
      'Taurine is cheap and widely available — purity is the only real concern. Prioritize brands with USP verification or NSF certification.',
  },
  {
    compoundId: 'spermidine',
    title: 'Spermidine Buyer Guide',
    tagline: 'Standardized wheat germ extract — the only validated source',
    formRequirements: [
      'Label must say: spermidine from wheat germ extract (not synthetic)',
      'Milligram dose per serving must be explicit — "proprietary blend" is unacceptable',
      'pTeroPure® or Primeadine® standardization preferred',
    ],
    coaDemands: [
      { id: 'sp-id', label: 'Identity (spermidine)', detail: 'HPLC confirmation of spermidine content — not just polyamine blend' },
      { id: 'sp-dose', label: 'Per-capsule mg confirmed', detail: 'Spermidine content per dose verified to label claim' },
      { id: 'sp-wheat', label: 'Wheat germ source verified', detail: 'Whole wheat germ vs isolated polyamine extract — both acceptable' },
      { id: 'sp-gluten', label: 'Gluten residual if celiac', detail: 'Wheat germ extract may retain trace gluten — request gluten test if sensitive' },
    ],
    doseAnchors: [
      { label: 'Madeo 2021 (Cortex)', dose: '0.9mg/day spermidine', pmid: '33932338', note: 'Memory improvement in older adults — wheat germ extract at this dose' },
      { label: 'Dietary reference', dose: '1–6mg daily', note: 'Range from dietary sources; supplement at the low end is sufficient' },
    ],
    redFlags: [
      'Dose not listed in mg per capsule — "proprietary" is a red flag here',
      'Labeled as "polyamine complex" without individual compound quantities',
      'Claims to "contain spermidine" without HPLC verification certificate',
    ],
    sourcingNote:
      'Most Westerners can close their dietary gap with 1–2 tbsp wheat germ daily (~1mg spermidine). Supplement only if dietary consistency is impractical.',
    relatedCompareSlug: 'nmn-vs-spermidine',
  },
  {
    compoundId: 'pterostilbene',
    title: 'Pterostilbene Buyer Guide',
    tagline: 'pTeroPure® is the research-grade standard — verify the form',
    formRequirements: [
      'Label must say: pterostilbene (not blueberry extract without mg quantification)',
      'pTeroPure® (ChromaDex licensed) preferred for standardization',
      'Avoid "pterostilbene equivalent" without verified chemistry — many blueberry extracts are misrepresented',
    ],
    coaDemands: [
      { id: 'pts-id', label: 'Identity (pterostilbene)', detail: 'HPLC confirming trans-pterostilbene — the active form' },
      { id: 'pts-dose', label: 'Dose per capsule confirmed', detail: '50–100mg pterostilbene verified (not estimate from berry extract)' },
      { id: 'pts-res', label: 'Not combined with resveratrol above 50mg', detail: 'High-dose resveratrol + pterostilbene may raise LDL in some individuals — keep resveratrol ≤250mg when combining' },
    ],
    doseAnchors: [
      { label: '2014 human blood pressure RCT', dose: '100mg/day', pmid: '24103935', note: 'Dose used in first human intervention — blood pressure reduction confirmed' },
      { label: 'Typical protocol range', dose: '50–150mg daily', note: 'Most adults start at 50mg; 100mg matches the one published RCT' },
    ],
    redFlags: [
      'Listed as "blueberry extract standardized to X% stilbenes" without explicit pterostilbene mg — unreliable dosing',
      'Combined with very high-dose resveratrol (>500mg) — LDL elevation risk',
      'No third-party COA available for request',
    ],
    sourcingNote:
      'Pterostilbene pairs with resveratrol in the SIRT1 stack. Prioritize pTeroPure®-licensed products for verified chemistry.',
    relatedCompareSlug: 'resveratrol-vs-pterostilbene',
  },
  {
    compoundId: 'berberine',
    title: 'Berberine HCl Buyer Guide',
    tagline: 'Hydrochloride salt, pure chemistry — avoid proprietary blends',
    formRequirements: [
      'Label must say: berberine HCl (hydrochloride salt — the form used in all major RCTs)',
      'Dihydroberberine (DHB) is an acceptable alternative with 5× higher bioavailability at lower doses',
      'Avoid "berberine complex" or "berberine phytosome" without mg disclosure',
    ],
    coaDemands: [
      { id: 'bbr-id', label: 'Identity (berberine HCl)', detail: 'HPLC confirming berberine hydrochloride — not generic alkaloid mixture' },
      { id: 'bbr-purity', label: '≥97% berberine HCl', detail: 'Common berberine products dilute with other alkaloids — verify purity' },
      { id: 'bbr-metals', label: 'Heavy metals panel', detail: 'Berberine is often sourced from Chinese herbs — heavy metals verification essential' },
      { id: 'bbr-micro', label: 'Microbial limits', detail: 'Soil-grown botanicals require full microbial panel' },
    ],
    doseAnchors: [
      { label: 'Zhang 2008 metformin-equivalent RCT', dose: '500mg TID (1,500mg/day)', pmid: '18396172', note: 'Three-times-daily dosing with meals — most studied protocol' },
      { label: 'Meta-analysis (27 RCTs)', dose: '500–1,500mg/day', pmid: '26507383', note: 'Full dose range across studies — all TID with meals' },
    ],
    redFlags: [
      'Single 500mg daily dose — TID dosing is required for plasma level maintenance',
      'Berberine sourced without country of origin listed (heavy metal risk from unverified sources)',
      'Taken with CYP3A4 substrates (cyclosporine, some statins) without physician review',
    ],
    sourcingNote:
      'Pharmaceutical-grade berberine HCl is widely available from clinical supplement brands. Request COA showing heavy metal screen — this is the key differentiator.',
    relatedCompareSlug: 'berberine-vs-metformin',
  },
  {
    compoundId: 'urolithina',
    title: 'Urolithin A (Mitopure) Buyer Guide',
    tagline: 'Only Mitopure has Phase 2 human RCT backing — standardization matters',
    formRequirements: [
      'Label must say: urolithin A (specific molecule — not ellagitannin or pomegranate extract)',
      'Mitopure® by Amazentis/Timeline Nutrition is the only form with Phase 2 RCT data',
      'Standardized to specific urolithin A content — not estimated from pomegranate precursors',
    ],
    coaDemands: [
      { id: 'ua-id', label: 'Identity (urolithin A)', detail: 'HPLC confirming urolithin A — not urolithin B or ellagic acid' },
      { id: 'ua-dose', label: '500mg per serving verified', detail: 'Phase 2 RCT dose was exactly 500mg — verify per-capsule content' },
      { id: 'ua-purity', label: '≥95% urolithin A', detail: 'Mitopure is >98% pure — other brands should meet at minimum 95%' },
    ],
    doseAnchors: [
      { label: 'Ryu 2022 Phase 2 RCT', dose: '500mg/day', pmid: '35391504', note: '4-month RCT in adults ≥65 — muscle function, mitochondrial gene expression improved' },
      { label: 'Andreux 2019 Phase 1', dose: '250–2,000mg tested', pmid: '31230029', note: '500mg was the optimal dose — dose-ranging confirmed' },
    ],
    redFlags: [
      'Pomegranate extract instead of purified urolithin A — gut conversion highly variable (~30–40% of adults cannot convert)',
      'Dose below 500mg (sub-RCT-equivalent)',
      'No certificate of analysis available for the specific batch',
    ],
    sourcingNote:
      'Timeline Nutrition (Mitopure) is the only brand with direct Phase 2 human trial data. Generic urolithin A is acceptable if HPLC-verified ≥95% purity and 500mg dose.',
    relatedCompareSlug: 'urolithin-a-vs-coq10',
  },
  {
    compoundId: 'coq10',
    title: 'CoQ10 Buyer Guide',
    tagline: 'Ubiquinol (reduced form) — not ubiquinone in adults over 40',
    formRequirements: [
      'Label must say: ubiquinol (not ubiquinone or "CoQ10" without form specification)',
      'Ubiquinone is acceptable for under-40s but ubiquinol preferred for >40 due to declining conversion capacity',
      'KANEKA QH® is the pharmaceutical-grade ubiquinol used in clinical trials',
    ],
    coaDemands: [
      { id: 'coq-id', label: 'Identity (ubiquinol or CoQ10)', detail: 'HPLC confirming correct form — ubiquinol peak vs ubiquinone peak are distinguishable' },
      { id: 'coq-stability', label: 'Oxidation stability test', detail: 'Ubiquinol oxidizes to ubiquinone in storage — request oxidation test on shelf-stable sample' },
      { id: 'coq-dose', label: '100–200mg verified', detail: 'Per-capsule content confirmed — label accuracy issues are common in CoQ10 products' },
    ],
    doseAnchors: [
      { label: 'Q-SYMBIO trial (heart failure)', dose: '300mg/day CoQ10', pmid: '24359983', note: 'Reduced MACE in heart failure patients at 300mg over 2 years' },
      { label: 'Standard protocol dose', dose: '100–200mg ubiquinol', note: 'Statin users: 100mg immediately; increase to 200mg if myalgia persists' },
    ],
    redFlags: [
      'Ubiquinone sold as "superior CoQ10" in adults over 40 — the conversion argument',
      'No oil-based capsule (CoQ10 is fat-soluble — dry powder tabs have poor absorption)',
      'Dose below 60mg (sub-therapeutic for clinical benefit)',
      'Warfarin users without physician coordination — CoQ10 may reduce warfarin effect',
    ],
    sourcingNote:
      'KANEKA QH® is the gold standard — ask the brand if they use KANEKA-sourced ubiquinol. Oil-filled softgels outperform dry powder capsules regardless of brand.',
    relatedCompareSlug: 'urolithin-a-vs-coq10',
  },
  {
    compoundId: 'omega3',
    title: 'Omega-3 Buyer Guide',
    tagline: 'rTG form, IFOS certified, oxidation tested — three non-negotiables',
    formRequirements: [
      'Label must say: re-esterified triglyceride (rTG) or specify triglyceride form',
      'Ethyl ester (EE) form is less bioavailable and more prone to oxidation — avoid unless no rTG available',
      'EPA + DHA mg per serving must be explicit — total fish oil mg is meaningless',
    ],
    coaDemands: [
      { id: 'om-ifos', label: 'IFOS 5-star certification', detail: 'International Fish Oil Standards — independent testing for oxidation, purity, and label accuracy' },
      { id: 'om-tots', label: 'TOTOX score ≤19.5', detail: 'Total oxidation measure (TOTOX = 2×peroxide value + anisidine value) — oxidized fish oil is pro-inflammatory' },
      { id: 'om-epadha', label: 'EPA + DHA per softgel confirmed', detail: 'At least 1g combined EPA+DHA per serving; REDUCE-IT used 4g/day icosapentaenoic acid' },
      { id: 'om-contam', label: 'PCBs and heavy metals ≤EU limits', detail: 'Cold-water fish concentrate toxins — request full contamination panel' },
    ],
    doseAnchors: [
      { label: 'REDUCE-IT trial', dose: '4g EPA/day (prescription Vascepa)', pmid: '30145934', note: '25% reduction in cardiovascular events — high-dose EPA only, not combined EPA+DHA' },
      { label: 'General longevity protocol', dose: '2–4g EPA+DHA daily', note: 'Target omega-3 index ≥8% in red blood cells — test at baseline and 12 weeks' },
    ],
    redFlags: [
      'TOTOX score >19.5 or not disclosed — oxidized omega-3 is net pro-inflammatory',
      'Ethyl ester form without disclosure — lower bioavailability, higher oxidation risk',
      'Total "fish oil" mg without EPA/DHA breakdown — meaningless dosing claim',
      'No IFOS certification or equivalent third-party oxidation testing',
    ],
    sourcingNote:
      'Check your omega-3 index (OmegaQuant fingerprick test) before and after 12 weeks to confirm absorption. rTG form + IFOS 5-star is the minimum bar.',
  },
];

export function getBuyerGuide(compoundId: string): CompoundBuyerGuide | undefined {
  return compoundBuyerGuides.find((g) => g.compoundId === compoundId);
}

export function getBuyerGuideByModuleSlug(slug: string): CompoundBuyerGuide | undefined {
  return compoundBuyerGuides.find((g) => g.compoundId === slug);
}