/* ------------------------------------------------------------------ *
 *  TNiC · PROTOCOL — compound library
 *  Extracted to its own module so it can later be sourced from the
 *  live 55-compound catalog instead of duplicated inline.
 *
 *  New fields vs. the original inline library:
 *    slug     — links each card to its /library/[slug] deep dive
 *    intake   — "am" | "pm" | "meal" | "any"  → intake grouping in results
 *    synergy  — ids that pair well (surfaces a stack-synergy note)
 * ------------------------------------------------------------------ */

export const TIER = {
  Clinical: { c: "#4EE0D3", blurb: "Human RCT support" },
  Mechanistic: { c: "#8290F6", blurb: "Plausible mechanism, thinner trials" },
  Exploratory: { c: "#F2C879", blurb: "Early / preclinical signal" },
};

export const GOAL_LABELS = {
  cognition: "Cognition", sleep: "Sleep", energy: "Energy", longevity: "Longevity",
  stress: "Stress", physical: "Performance", metabolic: "Metabolic", immune: "Immune",
  mood: "Mood", joints: "Joints", gut: "Gut", skin: "Skin", cardio: "Cardiovascular",
  recovery: "Recovery", focus: "Focus",
};

export const SAFETY_LABEL = {
  pregnant: "pregnancy / nursing",
  blood_thinners: "blood thinners",
  thyroid_meds: "thyroid medication",
  bp_meds: "blood-pressure medication",
};

export const COMPOUNDS = [
  {
    id: "omega3", slug: "omega-3", name: "Omega-3 (EPA/DHA)", cls: "Fatty acid", tier: "Clinical",
    mech: "Anti-inflammatory eicosanoid precursors; membrane fluidity and neuronal signaling.",
    dose: "1–2 g combined EPA+DHA", timing: "With a fat-containing meal", intake: "meal",
    serves: { cardio: 3, mood: 2, cognition: 2, longevity: 1, joints: 1 },
    contra: [], cautionOn: ["blood_thinners"], synergy: ["vitd", "curcumin"],
  },
  {
    id: "mag", slug: "magnesium", name: "Magnesium glycinate", cls: "Mineral", tier: "Clinical",
    mech: "Cofactor in 300+ reactions; NMDA/GABA modulation and muscle relaxation.",
    dose: "200–400 mg elemental", timing: "60–90 min before bed", intake: "pm",
    serves: { sleep: 3, stress: 2, recovery: 1, metabolic: 1, physical: 1 },
    contra: [], cautionOn: [], synergy: ["glycine", "theanine"],
  },
  {
    id: "creatine", slug: "creatine", name: "Creatine monohydrate", cls: "Amino derivative", tier: "Clinical",
    mech: "Rapid ATP resynthesis via phosphocreatine; supports brain bioenergetics.",
    dose: "3–5 g daily", timing: "Any time — consistency is what matters", intake: "any",
    serves: { physical: 3, cognition: 2, energy: 2, recovery: 2 },
    contra: [], cautionOn: [], synergy: ["taurine"],
  },
  {
    id: "vitd", slug: "vitamin-d", name: "Vitamin D3 + K2", cls: "Vitamin", tier: "Clinical",
    mech: "Steroid hormone; immune modulation, bone and muscle function.",
    dose: "1000–2000 IU (test 25-OH-D first)", timing: "With dietary fat", intake: "meal",
    serves: { immune: 3, mood: 2, longevity: 1, physical: 1 },
    contra: [], cautionOn: [], foundational: true, synergy: ["omega3", "mag"],
  },
  {
    id: "theanine", slug: "l-theanine", name: "L-theanine", cls: "Amino acid", tier: "Clinical",
    mech: "Promotes alpha-wave activity; smooths the edge off stimulants.",
    dose: "100–200 mg", timing: "With caffeine, or standalone for calm focus", intake: "any",
    serves: { focus: 3, stress: 2, cognition: 1, sleep: 1 },
    contra: [], cautionOn: [], synergy: ["mag"],
  },
  {
    id: "ashwa", slug: "ashwagandha", name: "Ashwagandha (KSM-66)", cls: "Adaptogen", tier: "Clinical",
    mech: "Modulates cortisol and the HPA stress axis.",
    dose: "300–600 mg standardized", timing: "Evening", intake: "pm",
    serves: { stress: 3, sleep: 2, recovery: 1, mood: 1 },
    contra: ["pregnant", "thyroid_meds"], cautionOn: [], synergy: ["mag"],
  },
  {
    id: "curcumin", slug: "curcumin", name: "Curcumin (phytosome)", cls: "Polyphenol", tier: "Clinical",
    mech: "NF-κB inhibition; broad systemic anti-inflammatory action.",
    dose: "500–1000 mg bioavailable form", timing: "With food", intake: "meal",
    serves: { joints: 3, longevity: 1, mood: 1, cardio: 1, recovery: 1 },
    contra: ["blood_thinners", "pregnant"], cautionOn: [], synergy: ["omega3"],
  },
  {
    id: "rhodiola", slug: "rhodiola", name: "Rhodiola rosea", cls: "Adaptogen", tier: "Mechanistic",
    mech: "Adaptogenic fatigue resistance via monoamine modulation.",
    dose: "200–400 mg (3% rosavins)", timing: "Morning, empty stomach", intake: "am",
    serves: { energy: 3, stress: 2, mood: 1, cognition: 1 },
    contra: ["pregnant"], cautionOn: [], synergy: [],
  },
  {
    id: "coq10", slug: "coq10", name: "CoQ10 (ubiquinol)", cls: "Quinone", tier: "Mechanistic",
    mech: "Mitochondrial electron transport; endogenous levels fall with age and statins.",
    dose: "100–200 mg", timing: "With dietary fat", intake: "meal",
    serves: { energy: 2, cardio: 2, longevity: 2 },
    contra: [], cautionOn: [], synergy: ["omega3"],
  },
  {
    id: "nmn", slug: "nmn", name: "NMN", cls: "NAD+ precursor", tier: "Exploratory",
    mech: "NAD+ repletion; substrate for sirtuins and DNA repair (early human data).",
    dose: "250–500 mg", timing: "Morning", intake: "am",
    serves: { longevity: 3, energy: 2, cognition: 1 },
    contra: ["pregnant"], cautionOn: [], synergy: ["taurine"],
  },
  {
    id: "glycine", slug: "glycine", name: "Glycine", cls: "Amino acid", tier: "Mechanistic",
    mech: "Lowers core body temperature to deepen sleep; collagen substrate.",
    dose: "3 g", timing: "Before bed", intake: "pm",
    serves: { sleep: 3, longevity: 1, skin: 1 },
    contra: [], cautionOn: [], synergy: ["mag"],
  },
  {
    id: "zinc", slug: "zinc", name: "Zinc (bisglycinate)", cls: "Mineral", tier: "Clinical",
    mech: "Immune cell function and enzymatic cofactor across the body.",
    dose: "15–30 mg", timing: "With food, away from iron/calcium", intake: "meal",
    serves: { immune: 3, skin: 2, recovery: 1 },
    contra: [], cautionOn: [], synergy: [],
  },
  {
    id: "berberine", slug: "berberine", name: "Berberine", cls: "Alkaloid", tier: "Clinical",
    mech: "AMPK activation; glucose disposal with metformin-like effects.",
    dose: "500 mg, 2–3× daily", timing: "With meals", intake: "meal",
    serves: { metabolic: 3, cardio: 1, longevity: 1 },
    contra: ["pregnant"], cautionOn: ["bp_meds"], synergy: [],
  },
  {
    id: "lionsmane", slug: "lions-mane", name: "Lion's Mane", cls: "Nootropic mushroom", tier: "Exploratory",
    mech: "Upregulates NGF/BDNF (preclinical plus early human signal).",
    dose: "500–1000 mg", timing: "Morning", intake: "am",
    serves: { cognition: 2, focus: 2, mood: 1, longevity: 1 },
    contra: [], cautionOn: [], synergy: ["theanine"],
  },
  {
    id: "taurine", slug: "taurine", name: "Taurine", cls: "Amino acid", tier: "Mechanistic",
    mech: "Osmolyte supporting calcium handling and endurance; strong longevity signal in animals.",
    dose: "1–3 g", timing: "Any time", intake: "any",
    serves: { cardio: 2, physical: 2, longevity: 1, energy: 1 },
    contra: [], cautionOn: [], synergy: ["creatine", "nmn"],
  },
  {
    id: "fisetin", slug: "fisetin", name: "Fisetin", cls: "Senolytic polyphenol", tier: "Exploratory",
    mech: "Senolytic candidate — clears senescent cells in rodent models.",
    dose: "Cyclic high-dose protocols under study", timing: "With fat, cyclically", intake: "meal",
    serves: { longevity: 3, joints: 1 },
    contra: ["pregnant", "blood_thinners"], cautionOn: [], synergy: [],
  },
  {
    id: "bcomplex", slug: "b-complex", name: "Methylated B-complex", cls: "Vitamin", tier: "Clinical",
    mech: "Methylation and mitochondrial cofactors; supports homocysteine metabolism.",
    dose: "1× daily, methylated forms", timing: "Morning with food", intake: "am",
    serves: { energy: 2, mood: 2, cognition: 1 },
    contra: [], cautionOn: [], synergy: [],
  },
  {
    id: "probiotic", slug: "probiotic", name: "Multi-strain probiotic", cls: "Biotic", tier: "Mechanistic",
    mech: "Microbiome modulation along the gut–brain axis (strain-specific effects).",
    dose: "10–30B CFU, multi-strain", timing: "Per label / empty stomach", intake: "any",
    serves: { gut: 3, immune: 1, mood: 1 },
    contra: [], cautionOn: [], synergy: [],
  },
];

/* Intake-window grouping labels used in results */
export const INTAKE_GROUPS = {
  am: { label: "Morning", hint: "on waking / with breakfast" },
  meal: { label: "With a meal", hint: "needs dietary fat for absorption" },
  any: { label: "Anytime", hint: "consistency matters more than timing" },
  pm: { label: "Evening / pre-sleep", hint: "60–90 min before bed" },
};
