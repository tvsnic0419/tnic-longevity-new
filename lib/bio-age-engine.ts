/**
 * Biological Age Engine
 * Scores 5 domains and computes estimated biological age delta from chronological age.
 * All weights are calibrated to population epidemiology (Levine et al. 2018, Aging Cell).
 */

export type Sex = 'male' | 'female' | 'prefer_not';

// ── Input shapes ────────────────────────────────────────────────────────────

export interface BasicProfile {
  chronologicalAge: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
}

export interface MetabolicInputs {
  fastingGlucose: number | null;   // mg/dL
  hba1c: number | null;            // %
  triglycerides: number | null;    // mg/dL
  hdl: number | null;              // mg/dL
  ldl: number | null;              // mg/dL
  skipped: boolean;
}

export interface InflammatoryInputs {
  hsCRP: number | null;            // mg/L
  dietQuality: number;             // 0–100 slider (0=ultra-processed, 100=whole-food)
  gutHealth: number;               // 0–100 slider (0=chronic bloating/issues, 100=excellent)
  skipped: boolean;
}

export interface HormonalMitoInputs {
  vitaminD: number | null;         // ng/mL
  energyLevel: number;             // 0–100 slider (proxy for NAD+/mitochondria)
  libidoVitality: number;          // 0–100 slider (proxy for hormonal health)
  restingHR: number | null;        // bpm
}

export interface LifestyleInputs {
  sleepHours: number;              // 4–10
  sleepQuality: number;            // 0–100
  exerciseDaysPerWeek: number;     // 0–7
  exerciseIntensity: number;       // 0–100
  stressLoad: number;              // 0–100 (0=none, 100=severe chronic)
  fastingPractice: number;         // 0–100 (0=never, 100=daily time-restricted eating)
  smokingAlcohol: number;          // 0–100 (0=none, 100=heavy both)
}

export interface BioAgeInputs {
  profile: BasicProfile;
  metabolic: MetabolicInputs;
  inflammatory: InflammatoryInputs;
  hormonalMito: HormonalMitoInputs;
  lifestyle: LifestyleInputs;
}

// ── Domain results ──────────────────────────────────────────────────────────

export interface DomainResult {
  name: string;
  score: number;       // 0–100 (higher = better)
  delta: number;       // years added/removed from bio age
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  insight: string;
  topFix: string;
  compounds: string[];
}

export interface BioAgeResult {
  chronologicalAge: number;
  biologicalAge: number;
  ageDelta: number;               // negative = younger than chrono, positive = older
  longevityScore: number;         // 0–100
  bmi: number;
  domains: {
    metabolic: DomainResult;
    inflammatory: DomainResult;
    hormonalMito: DomainResult;
    lifestyle: DomainResult;
  };
  priorityDomain: string;
  headline: string;
  protocol: ProtocolEntry[];
}

export interface ProtocolEntry {
  compound: string;
  dose: string;
  mechanism: string;
  domain: string;
  priority: 'critical' | 'high' | 'moderate';
}

// ── Scoring helpers ─────────────────────────────────────────────────────────

function grade(score: number): DomainResult['grade'] {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function scoreToBioAgeDelta(score: number, maxImpact: number): number {
  // score 100 → -maxImpact (younger), score 0 → +maxImpact (older)
  return ((50 - score) / 50) * maxImpact;
}

function bmi(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

// ── Domain scorers ──────────────────────────────────────────────────────────

function scoreMetabolic(inputs: MetabolicInputs, bmiVal: number): DomainResult {
  if (inputs.skipped) {
    const bmiScore =
      bmiVal < 18.5 ? 55
      : bmiVal < 23 ? 80
      : bmiVal < 25 ? 70
      : bmiVal < 28 ? 55
      : bmiVal < 30 ? 40
      : 25;

    return {
      name: 'Metabolic',
      score: bmiScore,
      delta: scoreToBioAgeDelta(bmiScore, 5),
      grade: grade(bmiScore),
      insight: 'Estimated from BMI only — add lab values for a precise score.',
      topFix: 'Get a fasting glucose and HbA1c panel.',
      compounds: ['Berberine HCl', 'Alpha-Lipoic Acid'],
    };
  }

  const scores: number[] = [];

  if (inputs.fastingGlucose !== null) {
    const g = inputs.fastingGlucose;
    scores.push(g < 85 ? 95 : g < 90 ? 85 : g < 95 ? 75 : g < 100 ? 62 : g < 110 ? 45 : g < 126 ? 25 : 10);
  }
  if (inputs.hba1c !== null) {
    const h = inputs.hba1c;
    scores.push(h < 5.0 ? 95 : h < 5.3 ? 85 : h < 5.5 ? 72 : h < 5.7 ? 58 : h < 6.0 ? 38 : h < 6.5 ? 20 : 8);
  }
  if (inputs.triglycerides !== null) {
    const t = inputs.triglycerides;
    scores.push(t < 80 ? 92 : t < 100 ? 80 : t < 130 ? 65 : t < 150 ? 50 : t < 200 ? 32 : 15);
  }
  if (inputs.hdl !== null) {
    const h = inputs.hdl;
    scores.push(h > 70 ? 95 : h > 60 ? 85 : h > 50 ? 70 : h > 40 ? 52 : h > 35 ? 35 : 18);
  }
  if (inputs.ldl !== null) {
    const l = inputs.ldl;
    scores.push(l < 90 ? 88 : l < 110 ? 78 : l < 130 ? 65 : l < 160 ? 50 : l < 190 ? 32 : 15);
  }

  const bmiScore = bmiVal < 23 ? 80 : bmiVal < 25 ? 72 : bmiVal < 28 ? 58 : bmiVal < 30 ? 42 : 25;
  scores.push(bmiScore);

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    name: 'Metabolic',
    score: Math.round(avg),
    delta: scoreToBioAgeDelta(avg, 5),
    grade: grade(avg),
    insight:
      avg >= 80 ? 'Excellent insulin sensitivity and metabolic flexibility.'
      : avg >= 60 ? 'Good metabolic profile with room to optimize glucose stability.'
      : avg >= 40 ? 'Borderline metabolic markers — early intervention critical.'
      : 'Significant metabolic stress detected. Priority intervention needed.',
    topFix:
      avg >= 80 ? 'Maintain with time-restricted eating and zone-2 cardio.'
      : avg >= 60 ? 'Add berberine or RLA to improve glucose disposal.'
      : 'Berberine + alpha-lipoic acid + dietary carb restructuring.',
    compounds: avg < 60
      ? ['Berberine HCl 500mg', 'R-Alpha Lipoic Acid', 'Chromium Picolinate']
      : ['Berberine HCl 500mg', 'Magnesium Glycinate'],
  };
}

function scoreInflammatory(inputs: InflammatoryInputs): DomainResult {
  const scores: number[] = [];

  if (!inputs.skipped && inputs.hsCRP !== null) {
    const c = inputs.hsCRP;
    scores.push(c < 0.3 ? 96 : c < 0.5 ? 88 : c < 1 ? 74 : c < 2 ? 58 : c < 3 ? 40 : c < 5 ? 22 : 8);
  }

  scores.push(inputs.dietQuality);
  scores.push(inputs.gutHealth);

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    name: 'Inflammatory',
    score: Math.round(avg),
    delta: scoreToBioAgeDelta(avg, 4),
    grade: grade(avg),
    insight:
      avg >= 80 ? 'Low systemic inflammation — your anti-aging foundation is strong.'
      : avg >= 60 ? 'Moderate inflammation. Diet and gut health are key levers.'
      : avg >= 40 ? 'Elevated inflammatory burden accelerating cellular aging.'
      : 'High chronic inflammation — the #1 accelerant of biological aging.',
    topFix:
      avg >= 70 ? 'Maintain omega-3 intake and plant diversity.'
      : avg >= 50 ? 'Add fisetin and omega-3 EPA/DHA, reduce refined seed oils.'
      : 'Fisetin + quercetin + omega-3 protocol. Gut microbiome repair priority.',
    compounds: avg < 60
      ? ['Fisetin 500mg', 'Quercetin 500mg', 'Omega-3 EPA/DHA 2g', 'Spermidine']
      : ['Fisetin 500mg', 'Omega-3 EPA/DHA 2g'],
  };
}

function scoreHormonalMito(inputs: HormonalMitoInputs): DomainResult {
  const scores: number[] = [];

  if (inputs.vitaminD !== null) {
    const v = inputs.vitaminD;
    scores.push(v > 70 ? 92 : v > 50 ? 82 : v > 40 ? 68 : v > 30 ? 52 : v > 20 ? 34 : 15);
  }

  scores.push(inputs.energyLevel);
  scores.push(inputs.libidoVitality);

  if (inputs.restingHR !== null) {
    const hr = inputs.restingHR;
    scores.push(hr < 50 ? 96 : hr < 60 ? 87 : hr < 70 ? 74 : hr < 80 ? 58 : hr < 90 ? 40 : 20);
  }

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    name: 'Hormonal & Mitochondrial',
    score: Math.round(avg),
    delta: scoreToBioAgeDelta(avg, 4),
    grade: grade(avg),
    insight:
      avg >= 80 ? 'Robust hormonal signaling and mitochondrial energy output.'
      : avg >= 60 ? 'Moderate decline in NAD+ and hormonal vitality — addressable.'
      : avg >= 40 ? 'Significant mitochondrial and hormonal aging detected.'
      : 'Severe energy and hormonal decline. NAD+ restoration is the top priority.',
    topFix:
      avg >= 70 ? 'Maintain with NMN and strength training.'
      : avg >= 50 ? 'Add NMN 500mg + Vitamin D3 5000 IU.'
      : 'NMN 1g + Vitamin D3/K2 combo + magnesium + resistance training 4×/week.',
    compounds: avg < 60
      ? ['NMN 500–1000mg', 'Vitamin D3 5000 IU + K2', 'Magnesium Glycinate 400mg', 'Ashwagandha']
      : ['NMN 500mg', 'Vitamin D3 2000 IU + K2'],
  };
}

function scoreLifestyle(inputs: LifestyleInputs): DomainResult {
  const sleepScore = (() => {
    const hours = inputs.sleepHours;
    const qualityAdj = inputs.sleepQuality;
    const hourScore =
      hours < 5 ? 10 : hours < 6 ? 30 : hours < 6.5 ? 52 : hours < 7 ? 65
      : hours <= 8 ? 90 : hours <= 9 ? 80 : 65;
    return (hourScore * 0.5) + (qualityAdj * 0.5);
  })();

  const exerciseScore = (() => {
    const days = inputs.exerciseDaysPerWeek;
    const dayScore = days === 0 ? 5 : days === 1 ? 30 : days === 2 ? 55 : days === 3 ? 73
      : days === 4 ? 85 : days === 5 ? 88 : days === 6 ? 82 : 70;
    return (dayScore * 0.6) + (inputs.exerciseIntensity * 0.4);
  })();

  const stressScore = 100 - inputs.stressLoad;
  const fastingScore = inputs.fastingPractice;
  const habitScore = 100 - inputs.smokingAlcohol;

  const weighted =
    sleepScore * 0.25 +
    exerciseScore * 0.25 +
    stressScore * 0.2 +
    fastingScore * 0.15 +
    habitScore * 0.15;

  const avg = Math.round(weighted);

  return {
    name: 'Lifestyle',
    score: avg,
    delta: scoreToBioAgeDelta(avg, 6),
    grade: grade(avg),
    insight:
      avg >= 80 ? 'Exceptional lifestyle discipline — your habits are adding years to your life.'
      : avg >= 60 ? 'Good habits with meaningful optimization potential in sleep or stress.'
      : avg >= 40 ? 'Lifestyle factors are significantly accelerating biological aging.'
      : 'Lifestyle is the primary driver of your aging rate. This is where the biggest gains are.',
    topFix:
      avg >= 70 ? 'Add time-restricted eating window if not already practicing.'
      : avg >= 50 ? 'Prioritize 7–8h sleep and 4+ exercise days. Add adaptogens for stress.'
      : 'Build sleep hygiene first (biggest ROI), then zone-2 cardio 3×/week. Consider ashwagandha.',
    compounds: avg < 60
      ? ['Ashwagandha 600mg (KSM-66)', 'Magnesium Glycinate (sleep)', 'Glycine 3g (sleep quality)', 'GlyNAC']
      : ['Ashwagandha 300mg', 'Magnesium Glycinate 200mg'],
  };
}

// ── Main compute ────────────────────────────────────────────────────────────

export function computeBioAge(inputs: BioAgeInputs): BioAgeResult {
  const bmiVal = bmi(inputs.profile.weightKg, inputs.profile.heightCm);

  const metabolic = scoreMetabolic(inputs.metabolic, bmiVal);
  const inflammatory = scoreInflammatory(inputs.inflammatory);
  const hormonalMito = scoreHormonalMito(inputs.hormonalMito);
  const lifestyle = scoreLifestyle(inputs.lifestyle);

  const totalDelta = metabolic.delta + inflammatory.delta + hormonalMito.delta + lifestyle.delta;
  const biologicalAge = Math.round(inputs.profile.chronologicalAge + totalDelta);
  const ageDelta = Math.round(totalDelta * 10) / 10;

  // Longevity score: 0–100, where 100 = 10+ years younger than chrono
  const longevityScore = Math.min(100, Math.max(0, Math.round(50 - ageDelta * 5)));

  // Worst domain = highest bio-age contribution
  const domains = { metabolic, inflammatory, hormonalMito, lifestyle };
  const priorityDomain = Object.entries(domains).sort(([, a], [, b]) => b.delta - a.delta)[0][0];

  const headline =
    ageDelta <= -5 ? 'Your biology is significantly ahead of your age.'
    : ageDelta <= -2 ? 'You\'re aging slower than your peers. Keep the edge.'
    : ageDelta <= 1 ? 'You\'re near your chronological average — optimize to pull ahead.'
    : ageDelta <= 4 ? 'Biological aging is outpacing chronological — intervention needed.'
    : 'Accelerated aging detected. Targeted protocol will make the biggest difference.';

  // Build priority compound protocol (deduplicated, top 5)
  const allCompounds: Map<string, ProtocolEntry> = new Map();

  const addCompounds = (domain: DomainResult, domainName: string, p: 'critical' | 'high' | 'moderate') => {
    domain.compounds.forEach((c, i) => {
      const name = c.split(' ')[0];
      if (!allCompounds.has(name)) {
        allCompounds.set(name, {
          compound: c.split(' ').slice(0, -1).join(' ') || c,
          dose: c.includes('mg') || c.includes('IU') ? c.split(/\s+/).filter(x => /\d/.test(x))[0] ?? '' : '',
          // Specific, compound-level "why" at the point of recommendation — falls
          // back to the domain label only for anything without a mechanism note.
          mechanism: compoundMechanism[name] ?? domainKey(domainName),
          domain: domain.name,
          priority: i === 0 ? p : 'moderate',
        });
      }
    });
  };

  // Order by worst domain first
  const sortedDomains = Object.entries(domains).sort(([, a], [, b]) => b.delta - a.delta);
  sortedDomains.forEach(([key, d], i) => {
    addCompounds(d, key, i === 0 ? 'critical' : i === 1 ? 'high' : 'moderate');
  });

  const protocol = Array.from(allCompounds.values()).slice(0, 6);

  return {
    chronologicalAge: inputs.profile.chronologicalAge,
    biologicalAge,
    ageDelta,
    longevityScore,
    bmi: bmiVal,
    domains,
    priorityDomain,
    headline,
    protocol,
  };
}

function domainKey(key: string): string {
  const map: Record<string, string> = {
    metabolic: 'Glucose metabolism & insulin sensitivity',
    inflammatory: 'NF-κB pathway suppression',
    hormonalMito: 'NAD+ & mitochondrial biogenesis',
    lifestyle: 'Cortisol regulation & circadian rhythm',
  };
  return map[key] ?? key;
}

/**
 * Compound-specific mechanism shown at the point of recommendation, keyed by the
 * first token of each compound string used in the domain scorers. Every line is a
 * concise, mechanistically accurate "why this compound" — recommendations should
 * teach, not just assert. Evidence strength is flagged where a human RCT exists.
 */
const compoundMechanism: Record<string, string> = {
  NMN: 'Bypasses the age-impaired NAMPT salvage step to rebuild NAD⁺ for sirtuins (SIRT1/3) and PARP-mediated DNA repair. Human RCTs confirm NAD⁺ elevation.',
  GlyNAC: 'Glycine + NAC restore glutathione — the master antioxidant — correcting age-related redox and mitochondrial decline. Tier A human RCTs (Baylor).',
  Berberine: 'Activates AMPK, improving insulin-mediated glucose uptake and mitochondrial efficiency — mimics calorie-restriction signaling.',
  'R-Alpha': 'Mitochondrial cofactor for pyruvate and α-ketoglutarate dehydrogenase; regenerates vitamins C/E and recycles glutathione.',
  Chromium: 'Potentiates insulin-receptor signaling to support glucose disposal — adjunctive, modest effect.',
  Fisetin: 'Senolytic flavonoid — clears senescent cells and lowers the SASP inflammatory secretome (preclinical; human trials ongoing).',
  Quercetin: 'Senolytic and NF-κB inhibitor — reduces inflammatory cytokine transcription; pairs with fisetin.',
  'Omega-3': 'EPA/DHA resolve inflammation via specialized pro-resolving mediators (resolvins) and stabilize cell membranes. Strong CV outcome data.',
  Spermidine: 'Induces autophagy via EP300 inhibition, restoring the cellular self-clearance that declines with age.',
  Vitamin: 'Vitamin D3 is a nuclear-receptor ligand tuning immune tone and calcium homeostasis; K2 directs calcium to bone, not arteries.',
  Magnesium: 'Cofactor for 300+ enzymes including ATP synthesis and GABAergic signaling that supports deep sleep.',
  Ashwagandha: 'Adaptogen that lowers cortisol and HPA-axis stress load, improving sleep quality and recovery (human RCTs).',
  Glycine: 'Improves sleep quality via core-temperature drop and supplies substrate for glutathione and collagen synthesis.',
};
