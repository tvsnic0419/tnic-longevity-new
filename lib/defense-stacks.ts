import type { EvidenceTier } from './types';

/**
 * Defense stacks — protective protocols for people with an ongoing, uncontrolled
 * oxidative and inflammatory exposure they are not currently removing.
 *
 * These pages exist because the alternative is worse. People who smoke, and
 * people who use stimulants, search for this information and currently find it
 * on forums with no citations and no contraindication checks. A page that states
 * the risks honestly, names what the evidence does and does not support, and
 * flags the supplements that are actively dangerous in this context is more
 * useful than silence.
 *
 * Two rules govern everything in this file, and they are not negotiable:
 *
 *  1. NOTHING HERE OFFSETS THE EXPOSURE. Every stack is mitigation at the
 *     margins. Where a number exists for what removing the exposure achieves,
 *     it is stated alongside, so the reader can see the ratio for themselves.
 *  2. EVERY CLAIM TRACES TO A VERIFIED PMID. Each citation below was resolved
 *     against PubMed and its abstract read before it was written down —
 *     including, especially, the trials that came back negative. Reporting
 *     `nacForStimulantUse` as a success would have been easy and wrong.
 */

export interface StackCitation {
  pmid: string;
  label: string;
  finding: string;
}

export interface StackItem {
  compoundId?: string;
  name: string;
  dose: string;
  timing: string;
  /** What this is actually for. No hedging, no implied cure. */
  rationale: string;
  tier: EvidenceTier;
  /** Why it earns this tier — stated so the grade is checkable, not asserted. */
  tierNote: string;
  citations?: StackCitation[];
}

export interface StackWarning {
  title: string;
  body: string;
  severity: 'avoid' | 'caution';
  citations?: StackCitation[];
}

export interface DefenseStack {
  slug: string;
  title: string;
  audience: string;
  /** The honest headline: what continuing costs, in numbers where numbers exist. */
  exposureRisks: { title: string; body: string; citations?: StackCitation[] }[];
  /** What removing the exposure achieves — the comparison the reader deserves. */
  cessationBenchmark: { body: string; citations: StackCitation[] };
  core: StackItem[];
  warnings: StackWarning[];
  monitoring: { marker: string; why: string; cadence: string }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Cigarette smokers
// ─────────────────────────────────────────────────────────────────────────────

export const SMOKER_DEFENSE: DefenseStack = {
  slug: 'smoker-defense-stack',
  title: 'Smoker Defense Stack',
  audience: 'People who currently smoke and are not stopping right now.',

  exposureRisks: [
    {
      title: 'Sustained oxidative load, not an occasional hit',
      body:
        'Cigarette smoke delivers a continuous oxidant burden that measurably depletes circulating ascorbate and shifts the ascorbate/dehydroascorbate ratio toward the oxidised form. This is why a smoker\'s antioxidant requirement is genuinely higher than a non-smoker\'s — it is a depletion problem, not a marketing claim.',
      citations: [
        {
          pmid: '9094879',
          label: 'Lykkesfeldt et al., Am J Clin Nutr 1997',
          finding:
            'Ascorbic acid and dehydroascorbic acid used as biomarkers of smoking-caused oxidative stress.',
        },
      ],
    },
    {
      title: 'Most of the damage is not reversible by supplementation',
      body:
        'Nothing on this page changes the carcinogen exposure itself. Tar-phase and gas-phase constituents form DNA adducts directly; an antioxidant taken hours later does not undo an adduct already formed. Treat this stack as reducing collateral oxidative and inflammatory cost, not as protection from the primary mechanism.',
    },
  ],

  cessationBenchmark: {
    body:
      'For scale: in the Nurses\' Health Study cohort, roughly 64% of deaths among current smokers were attributable to smoking, and excess all-cause mortality risk fell to that of a never-smoker about 20 years after quitting — with most of the excess vascular mortality resolving considerably faster than that. No supplement protocol produces an effect in that range, and none of the trials below claim to.',
    citations: [
      {
        pmid: '18460664',
        label: 'Kenfield et al., JAMA 2008',
        finding:
          '~64% of deaths in current smokers attributable to smoking; excess all-cause mortality reaches never-smoker level ~20 years after cessation, with vascular risk falling fastest.',
      },
    ],
  },

  core: [
    {
      compoundId: 'nac',
      name: 'N-acetylcysteine (NAC)',
      dose: '600 mg twice daily',
      timing: 'Morning and evening, with or without food',
      rationale:
        'Glutathione precursor and mucolytic. This is the dose and schedule that reduced COPD exacerbations in a 1,006-patient randomised trial — the strongest human airway evidence in this stack, and the reason NAC leads it.',
      tier: 'A',
      tierNote:
        'Tier A for exacerbation reduction in established moderate-to-severe COPD. That is not the same as "protects healthy smokers", and the trial did not test that.',
      citations: [
        {
          pmid: '24621680',
          label: 'Zheng et al., Lancet Respir Med 2014 (PANTHEON)',
          finding:
            'NAC 600 mg twice daily for one year: 1.16 vs 1.49 exacerbations per patient-year, risk ratio 0.78 (95% CI 0.67–0.90), p=0.0011, n=1,006.',
        },
      ],
    },
    {
      compoundId: 'sulforaphane',
      name: 'Sulforaphane (broccoli sprout extract)',
      dose: 'Standardised to 10–20 mg sulforaphane, or the glucoraphanin equivalent with active myrosinase',
      timing: 'Morning, with food',
      rationale:
        'The most direct NRF2 activator in the library. NRF2 drives the phase-II detoxification and antioxidant response that handles exactly the class of electrophiles tobacco smoke delivers.',
      tier: 'B',
      tierNote:
        'Tier B. The NRF2 mechanism is well characterised and human airway work exists, but there is no large outcome trial in smokers. Graded on mechanism plus early human data, not on a hard endpoint.',
    },
    {
      compoundId: 'vitamin-c',
      name: 'Vitamin C',
      dose: '500 mg/day, split if tolerance is an issue',
      timing: 'With meals',
      rationale:
        'Replaces a documented, measurable depletion rather than topping up an adequate pool. Smokers sit lower on plasma ascorbate at equivalent intake.',
      tier: 'B',
      tierNote:
        'Tier B for correcting the depletion itself. No mortality or cancer-endpoint benefit has been shown from supplementing it, and this page does not imply one.',
      citations: [
        {
          pmid: '9094879',
          label: 'Lykkesfeldt et al., Am J Clin Nutr 1997',
          finding: 'Smoking-driven shift in the ascorbate/dehydroascorbate ratio.',
        },
      ],
    },
    {
      compoundId: 'glynac',
      name: 'GlyNAC (glycine + NAC)',
      dose: 'Glycine ~100 mg/kg/day with NAC ~100 mg/kg/day, if running it in place of NAC alone',
      timing: 'Split across the day',
      rationale:
        'Glutathione synthesis needs both cysteine and glycine. If you are already running NAC and want the fuller glutathione-restoration protocol rather than the airway-specific one, this is the version with the ageing-population trial data behind it.',
      tier: 'B',
      tierNote:
        'Tier B here specifically. The GlyNAC trials were run in older adults for glutathione and mitochondrial markers — not in smokers, and not for respiratory endpoints.',
    },
    {
      compoundId: 'aged-garlic',
      name: 'Aged garlic extract',
      dose: '1,200 mg/day',
      timing: 'With food',
      rationale:
        'Cardiovascular-directed rather than airway-directed. Smoking risk is not only pulmonary, and the vascular side of the exposure is where cessation benefit appears fastest — which makes it the side most worth supporting.',
      tier: 'C',
      tierNote:
        'Tier C in this context. Reasonable vascular rationale, no trial in smokers specifically.',
    },
  ],

  warnings: [
    {
      title: 'Do not take beta-carotene supplements',
      severity: 'avoid',
      body:
        'This is the single most important line on the page. Two large randomised trials tested beta-carotene in smokers and both found MORE lung cancer in the supplemented group, not less. CARET was stopped early for harm. This is not a theoretical interaction or a dose-dependent caution — it is a supplement that has been shown, twice, in tens of thousands of smokers, to increase the outcome it was given to prevent. Check your multivitamin: many still contain it, and "provitamin A" on a label means beta-carotene. Beta-carotene from whole food has not shown this effect; the harm is specific to supplemental doses.',
      citations: [
        {
          pmid: '8602180',
          label: 'Omenn et al., N Engl J Med 1996 (CARET)',
          finding:
            'Beta carotene plus vitamin A in smokers and asbestos-exposed workers: trial stopped early — lung cancer and cardiovascular death were increased, not reduced.',
        },
        {
          pmid: '8127329',
          label: 'ATBC Study Group, N Engl J Med 1994',
          finding:
            'Alpha-tocopherol and beta carotene in male smokers: higher lung cancer incidence in the beta-carotene arm.',
        },
      ],
    },
    {
      title: 'High-dose vitamin E is not a free addition either',
      severity: 'caution',
      body:
        'The same trial that found beta-carotene harm also tested alpha-tocopherol, and it did not deliver the hoped-for lung cancer reduction. Vitamin E at ordinary dietary-supplement levels is not the concern; treating high-dose isolated alpha-tocopherol as protective against smoking damage is not supported. Mixed tocopherols at food-equivalent doses are the more defensible choice.',
      citations: [
        {
          pmid: '8127329',
          label: 'ATBC Study Group, N Engl J Med 1994',
          finding: 'No lung cancer benefit from alpha-tocopherol supplementation in male smokers.',
        },
      ],
    },
    {
      title: 'NAC and nitrate-based heart medication',
      severity: 'caution',
      body:
        'NAC can potentiate the vasodilatory effect of nitrates. If you take nitroglycerin or any long-acting nitrate, clear NAC with the prescriber before starting rather than after.',
    },
  ],

  monitoring: [
    { marker: 'hs-CRP', why: 'Tracks the inflammatory component that responds first', cadence: 'Baseline, then 12 weeks' },
    { marker: 'Spirometry (FEV1/FVC)', why: 'The endpoint that actually matters for airway decline', cadence: 'Annually' },
    { marker: 'Blood pressure', why: 'Vascular risk is the fastest-moving part of smoking exposure, in both directions', cadence: 'Monthly at home' },
    { marker: 'Full blood count', why: 'Smoking raises haematocrit and white cell count; a rising trend is worth knowing', cadence: 'Annually' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Stimulant (methamphetamine) users
// ─────────────────────────────────────────────────────────────────────────────

export const STIMULANT_DEFENSE: DefenseStack = {
  slug: 'stimulant-defense-stack',
  title: 'Stimulant Defense Stack',
  audience:
    'People using methamphetamine or other high-dose stimulants who want to reduce the physical damage while they are still using.',

  exposureRisks: [
    {
      title: 'Dopaminergic terminal damage is the signature injury',
      body:
        'High-dose methamphetamine damages dopamine and serotonin nerve terminals, with oxidative stress and reactive species central to the mechanism rather than incidental to it. This is the basis for every antioxidant strategy below — and also the reason those strategies are inherently partial, since they act on one arm of a multi-arm injury that includes hyperthermia, excitotoxicity and mitochondrial failure.',
      citations: [
        {
          pmid: '23892199',
          label: 'Halpin et al., Life Sci 2014',
          finding: 'Review of methamphetamine and MDMA neurotoxicity mechanisms.',
        },
        {
          pmid: '16808729',
          label: 'Yamamoto & Raudensky, Crit Rev Neurobiol 2005',
          finding: 'Amphetamine neurotoxicity as both cause and consequence of oxidative stress.',
        },
      ],
    },
    {
      title: 'The heart is the most likely thing to kill you, and it is partly reversible',
      body:
        'Methamphetamine-associated heart failure is common enough to have its own literature, and up to 44% of cases present with preserved ejection fraction — meaning it can be well advanced before the obvious signs appear. The part worth knowing: abstinence is associated with improved outcomes, and chamber dimensions and biopsy fibrosis predict how much recovery is possible. Damage accumulated so far is not necessarily permanent, but the window is not open indefinitely.',
      citations: [
        {
          pmid: '36456204',
          label: 'Manja et al., Heart 2023',
          finding:
            'Systematic review of methamphetamine-associated heart failure: up to 44% with preserved LVEF; abstinence and guideline-directed therapy associated with improved outcomes; chamber size and fibrosis predict extent of recovery.',
        },
        {
          pmid: '36693638',
          label: 'Somma et al., Intern Med J 2023',
          finding: 'Methamphetamine-associated cardiomyopathy from an addiction-medicine perspective.',
        },
      ],
    },
    {
      title: 'Dental destruction is fast, cheap to slow, and permanent if ignored',
      body:
        'Rampant caries in stimulant users is driven by a combination of xerostomia, sugar intake, bruxism and deferred care — most of which are addressable without stopping use. Of everything on this page, the dental protocol has the best ratio of effort to preserved quality of life.',
      citations: [
        {
          pmid: '22299123',
          label: 'Ravenel et al., Quintessence Int 2012',
          finding: 'Pilot study characterising the caries pattern of "meth mouth".',
        },
        {
          pmid: '31309583',
          label: 'Teoh et al., Aust Dent J 2019',
          finding: 'Oral manifestations of illicit drug use.',
        },
      ],
    },
  ],

  cessationBenchmark: {
    body:
      'The honest comparison: in the heart-failure literature, abstinence is the intervention associated with recovery, and the degree of structural damage at the time of stopping predicts how much function returns. No supplement in this stack has been shown to do that. What follows reduces some of the oxidative cost and protects some of the organ systems most at risk — it does not substitute for the one variable with a documented effect on outcomes.',
    citations: [
      {
        pmid: '36456204',
        label: 'Manja et al., Heart 2023',
        finding:
          'Abstinence associated with improved heart-failure outcomes; extent of recovery predicted by chamber dimensions and fibrosis at baseline.',
      },
    ],
  },

  core: [
    {
      compoundId: 'nac',
      name: 'N-acetylcysteine (NAC)',
      dose: '1,200–2,400 mg/day',
      timing: 'Split morning and evening',
      rationale:
        'Included as a glutathione precursor for the oxidative-stress arm of the injury — NOT as a treatment for use or craving. Read the tier note before deciding, because the trial evidence here is genuinely mixed and the largest study was negative.',
      tier: 'C',
      tierNote:
        'Tier C, and deliberately so. The largest and best-powered trial — 153 methamphetamine-dependent participants, 2,400 mg/day for 12 weeks — found NO effect on days of use, craving, dependence severity, withdrawal or psychiatric symptoms versus placebo. A smaller crossover trial did find reduced craving, and a 2024 meta-analysis across substance use disorders found a modest craving effect while explicitly describing the evidence as weak. NAC is kept in this stack for glutathione support, which is a different and much more modest claim than the one most pages make for it.',
      citations: [
        {
          pmid: '34308314',
          label: 'McKetin et al., EClinicalMedicine 2021 (N-ICE) — NEGATIVE',
          finding:
            'NAC 2,400 mg/day for 12 weeks, n=153: no significant effect on methamphetamine use, craving, dependence severity, withdrawal, or psychiatric symptoms versus placebo.',
        },
        {
          pmid: '25556383',
          label: 'Mousavi et al., Arch Iran Med 2015',
          finding:
            'Smaller double-blind crossover trial, 1,200 mg/day: reduced craving scores (23 completers).',
        },
        {
          pmid: '39309000',
          label: 'Cuocina et al., Front Pharmacol 2024',
          finding:
            'Meta-analysis of 11 RCTs across substance use disorders: craving reduced (SMD −0.61), authors state the evidence is weak.',
        },
      ],
    },
    {
      compoundId: 'vitamin-c',
      name: 'Vitamin C',
      dose: '500–1,000 mg/day',
      timing: 'Split with meals',
      rationale:
        'Cheap, water-soluble, and directed at the same oxidative arm. Stimulant use is typically accompanied by poor dietary intake, so this is often correcting a real deficit rather than supplementing an adequate one.',
      tier: 'C',
      tierNote:
        'Tier C. Mechanistically coherent and low-risk; no trial in stimulant users has tested a hard endpoint.',
    },
    {
      compoundId: 'rala',
      name: 'R-alpha-lipoic acid',
      dose: '300–600 mg/day',
      timing: 'Away from food',
      rationale:
        'Regenerates other antioxidants and is both water- and fat-soluble, so it reaches compartments ascorbate does not. Chosen over generic ALA for the active isomer.',
      tier: 'C',
      tierNote:
        'Tier C. Lipoic acid has real human trial data in diabetic neuropathy, but nothing has tested it in stimulant users and the neuropathy evidence does not transfer to this exposure. Included on redox rationale, graded accordingly.',
    },
    {
      compoundId: 'magnesium',
      name: 'Magnesium (glycinate)',
      dose: '200–400 mg elemental/day',
      timing: 'Evening',
      rationale:
        'Targets the things most likely to be depleted and most likely to hurt: sleep debt, bruxism that is destroying teeth, and cardiac irritability. The glycinate form is chosen for tolerability and because glycine is useful here on its own account.',
      tier: 'C',
      tierNote:
        'Tier C for this use. Magnesium repletion is well established generally; nothing has tested it in stimulant users specifically.',
    },
    {
      compoundId: 'coq10',
      name: 'CoQ10 (ubiquinone)',
      dose: '100–200 mg/day',
      timing: 'With a fat-containing meal',
      rationale:
        'Directed at the cardiac and mitochondrial arm rather than the neurological one, given that cardiomyopathy is the highest-mortality complication in this population.',
      tier: 'C',
      tierNote: 'Tier C. Extrapolated from general heart-failure literature, not from stimulant users.',
    },
  ],

  warnings: [
    {
      title: 'Never combine a stimulant with a serotonergic supplement',
      severity: 'avoid',
      body:
        'This is the line most likely to prevent a death on this page. 5-HTP, L-tryptophan at supplement doses, St John\'s wort, SAM-e and high-dose dextromethorphan all raise serotonergic tone. Methamphetamine is itself a potent serotonin releaser. Combining them risks serotonin syndrome — hyperthermia, rigidity, autonomic instability, seizures — which is a medical emergency and can be fatal. The fact that these are sold without prescription does not make them safe in this combination. The same applies to MAOI-active botanicals such as Syrian rue and any "mood support" blend that does not fully disclose its ingredients.',
    },
    {
      title: 'Do not stack additional stimulants',
      severity: 'avoid',
      body:
        'High-dose caffeine, yohimbine, synephrine, ephedra-type botanicals and "pre-workout" blends add cardiovascular load on top of an already-strained heart. Given that cardiomyopathy is the leading cause of death in this group, this is a direct additive risk, not a theoretical one.',
      citations: [
        {
          pmid: '36456204',
          label: 'Manja et al., Heart 2023',
          finding: 'Methamphetamine-associated heart failure burden and outcomes.',
        },
      ],
    },
    {
      title: 'Hyperthermia is the acute emergency — plan for it',
      severity: 'avoid',
      body:
        'Overheating is a central mechanism of acute stimulant toxicity and neuronal injury, and it compounds in hot rooms, crowded spaces and with exertion. Practical mitigation matters more than any capsule here: keep fluids and electrolytes available, stay somewhere you can cool down, and treat confusion, stopping sweating, or a body temperature that feels dangerously high as an emergency requiring cooling and medical help, not something to sleep off.',
      citations: [
        {
          pmid: '23892199',
          label: 'Halpin et al., Life Sci 2014',
          finding: 'Hyperthermia as a contributor to methamphetamine neurotoxicity.',
        },
      ],
    },
    {
      title: 'Water intoxication is a real risk in the other direction',
      severity: 'caution',
      body:
        'Drinking large volumes of plain water to counter dehydration can drop sodium dangerously, particularly alongside the antidiuretic effects of some stimulants. Use electrolyte-containing fluid rather than water alone, and drink to thirst rather than on a schedule.',
    },
  ],

  monitoring: [
    { marker: 'Blood pressure and resting heart rate', why: 'The earliest signal of the complication most likely to be fatal', cadence: 'Weekly at home' },
    { marker: 'Echocardiogram', why: 'Methamphetamine cardiomyopathy can be advanced with preserved ejection fraction — symptoms are a late signal', cadence: 'Ask for one; repeat per cardiology advice' },
    { marker: 'Dental review', why: 'Caries progression is fast and, once through the enamel, irreversible', cadence: 'Every 6 months, sooner if there is pain' },
    { marker: 'Renal function and CK', why: 'Rhabdomyolysis and kidney injury follow hyperthermia and dehydration episodes', cadence: 'After any overheating episode; otherwise annually' },
    { marker: 'Weight and albumin', why: 'Undernutrition drives much of the visible deterioration and is directly fixable', cadence: 'Monthly' },
  ],
};

export const DEFENSE_STACKS: DefenseStack[] = [SMOKER_DEFENSE, STIMULANT_DEFENSE];

/** Every PMID cited across both stacks — used by the citation-integrity guard. */
export function defenseStackPmids(): string[] {
  const out = new Set<string>();
  for (const stack of DEFENSE_STACKS) {
    const cites = [
      ...stack.exposureRisks.flatMap((r) => r.citations ?? []),
      ...stack.cessationBenchmark.citations,
      ...stack.core.flatMap((c) => c.citations ?? []),
      ...stack.warnings.flatMap((w) => w.citations ?? []),
    ];
    for (const c of cites) out.add(c.pmid);
  }
  return [...out];
}
