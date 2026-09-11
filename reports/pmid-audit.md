# PMID audit

_Generated 2026-09-11T10:09:05.984Z by `scripts/verify-pmids.mjs`._

Every PubMed ID in `content/`, `lib/`, `app/`, `components/` and `scripts/` is resolved against NCBI E-utilities and compared with the metadata stored beside it in our source. Sorted worst-first.

## Summary

| Metric | Count |
| --- | ---: |
| Distinct PMIDs found | 439 |
| Total citation occurrences | 1357 |
| **DEAD** (does not resolve) | 6 |
| **MISMATCH** (stored metadata disagrees) | 174 |
| &nbsp;&nbsp;↳ of which likely the **wrong paper** | 28 |
| Clean | 259 |

> A single disagreeing field can be honest drift — an editorial paraphrase in a `title`, or a print-vs-epub year. A disagreeing **journal together with a disagreeing author or title** means the ID points at a different paper, which is why those are ranked first.

## DEAD — no PubMed record

These IDs resolve to nothing. Every claim hanging off them is uncited.

### `11916459` — cannot get document summary

- `content/compounds/rala.mdx:19` — R-ALA has robust mechanism data and positive outcomes in diabetic neuropathy (Ziegler et al., PMID 11916459; Alpha-Lipoic Acid in Diabetic Neuropathy meta-analysis). Human longevity-specific RCTs in healthy adults are limited. Evidence grade reflects evidence quality in the target population, not mechanism clarity.

### `17094080` — cannot get document summary

- `content/compounds/milk-thistle.mdx:8` — > **TL;DR** — Milk thistle standardized to 70–80% silymarin (a flavonolignan complex — silybin A/B, silydianin, silychristin) has real human RCT evidence for **non-alcoholic fatty liver disease** (Loguercio 2012, PMID 22240442), **type 2 diabetes glycemic control** (Huseini 2006, PMID 17094080), and modest chemoprotection during hepatotoxic drug therapy. Standard dose 420–600 mg silymarin/day divided TID. Silybin phytosome (Siliphos, Legalon) has ~10× better bioavailability than plain silymarin extract.
- `content/compounds/milk-thistle.mdx:22` — Loguercio et al. (2012, PMID 22240442) — 138 NAFLD/NASH patients — silybin-vitamin E-phospholipid complex × 12 months — reduced hepatic fat, ALT, AST, insulin resistance vs placebo. Huseini et al. (2006, PMID 17094080) — 51 type 2 diabetics — silymarin 200 mg TID × 4 months — reduced HbA1c 1.0 percentage points more than placebo. Silybin IV is used as antidote for Amanita phalloides mushroom poisoning (Legalon SIL) in Europe.
- `content/compounds/milk-thistle.mdx:51` — \| Huseini 2006 (PMID 17094080) \| RCT (T2D) \| 51 \| 4 mo \| ↓ HbA1c 1.0pp vs placebo \| B \|
- `lib/data.ts:1260` — desc: 'Milk thistle standardized to 70–80% silymarin (a flavonolignan complex — silybin A/B, silydianin, silychristin) has real human RCT evidence for **non-alcoholic fatty liver disease** (Loguercio 2012, PMID 22240442), **type 2 diabetes glycemic control** (Huseini 2006, PMID 17094080), and modest chemoprotection during hepatotoxic drug therapy. Standard dose 420–600 mg silymarin/day divided TID. Silybin phytosome (Siliphos, Legalon) has ~10× better bioavailability than plain silymarin extract.',
- `lib/data.ts:1269` — { title: 'Huseini 2006', journal: '', year: 2006, pmid: '17094080' },

### `23853036` — cannot get document summary

- `content/compounds/panax-ginseng.mdx:8` — > **TL;DR** — Panax ginseng root standardized to 4–8% total ginsenosides is an adaptogen with human RCT evidence for fatigue reduction in chronic illness (Barton 2013, PMID 23853036 — cancer-related fatigue), modest cognitive support in MCI, and improved glycemic control in type 2 diabetes. Standard dose 200–400 mg/day standardized extract or 1–2 g/day root powder. Distinguished from American ginseng (Panax quinquefolius) which is more "cooling" per TCM.
- `content/compounds/panax-ginseng.mdx:19` — Barton et al. (2013, PMID 23853036) — 364 cancer survivors with chronic fatigue, Wisconsin ginseng (P. quinquefolius) 2 g/day for 8 weeks — MFSI-SF fatigue score improved 20 points on ginseng vs 10 on placebo. Reay et al. (2005, PMID 15982990) showed 200 mg P. ginseng G115 acutely reduced blood glucose and improved mental arithmetic performance in healthy adults. Vuksan et al. (2000, PMID 10796575) showed 3 g Korean red ginseng pre-meal reduced postprandial glucose by 15–20% in type 2 diabetics.
- `content/compounds/panax-ginseng.mdx:47` — \| Barton 2013 (PMID 23853036) \| RCT (P. quinquefolius) \| 364 \| 8 wk \| ↓ Cancer-related fatigue by 2× vs placebo \| B \|
- `lib/data.ts:1000` — desc: 'Panax ginseng root standardized to 4–8% total ginsenosides is an adaptogen with human RCT evidence for fatigue reduction in chronic illness (Barton 2013, PMID 23853036 — cancer-related fatigue), modest cognitive support in MCI, and improved glycemic control in type 2 diabetes. Standard dose 200–400 mg/day standardized extract or 1–2 g/day root powder. Distinguished from American ginseng (Panax quinquefolius) which is more "cooling" per TCM.',
- `lib/data.ts:1008` — { title: 'Barton 2013', journal: '', year: 2013, pmid: '23853036' },

### `26232331` — cannot get document summary

- `content/compounds/capsaicin.mdx:8` — > **TL;DR** — Capsaicin, the pungent alkaloid in chili peppers, is a TRPV1 agonist with real evidence for metabolic health, satiety, and a mortality signal: China Kadoorie Biobank (~500k adults) found 6–7 chili meals per week associated with **14% lower all-cause mortality** (Lv 2015, PMID 26232331). Dietary use via chili peppers is the primary evidence route; supplemental capsaicin 2–6 mg/day is well tolerated but topical (0.025–0.075% cream) is where the RCT evidence for pain is strongest.
- `content/compounds/capsaicin.mdx:19` — Lv et al. (2015, PMID 26232331) — China Kadoorie Biobank prospective cohort of 487,375 adults over 7.2 years — spicy food consumption 6–7 days/week associated with 14% lower all-cause mortality (HR 0.86, 95% CI 0.80–0.92), driven by reduced cancer, ischemic heart, and respiratory disease deaths. Chopan (2017, PMID 28068423) — NHANES III (16,179 US adults, 18.9 years follow-up) — chili pepper consumption associated with 13% lower mortality. Whiting et al. (2012, PMID 22452938) meta-analysis found capsaicin acutely raises energy expenditure ~50 kcal/day.
- `content/compounds/capsaicin.mdx:48` — \| Lv 2015 China Kadoorie (PMID 26232331) \| Prospective cohort \| 487,375 \| 7.2 yr \| 14% ↓ all-cause mortality; ↓ cancer, IHD, respiratory \| B \|
- `lib/data.ts:1060` — desc: 'Capsaicin, the pungent alkaloid in chili peppers, is a TRPV1 agonist with real evidence for metabolic health, satiety, and a mortality signal: China Kadoorie Biobank (~500k adults) found 6–7 chili meals per week associated with **14% lower all-cause mortality** (Lv 2015, PMID 26232331). Dietary use via chili peppers is the primary evidence route; supplemental capsaicin 2–6 mg/day is well tolerated but topical (0.025–0.075% cream) is where the RCT evidence for pain is strongest.',
- `lib/data.ts:1068` — { title: 'Lv 2015 China Kadoorie', journal: '', year: 2015, pmid: '26232331' },

### `26669683` — cannot get document summary

- `app/nad-supplement-guide/page.tsx:290` — href="https://pubmed.ncbi.nlm.nih.gov/26669683/"
- `app/nad-supplement-guide/page.tsx:295` — PMID: 26669683 <ExternalLink className="w-3 h-3" />

### `31380906` — cannot get document summary

- `lib/comparisons.ts:1111` — pmid: '31380906',

## WRONG PAPER — journal and author/title both disagree

The stored citation and the PubMed record describe different papers. Highest-priority fixes after DEAD.

### `22245710` — Morgan MJ, *Vision Res* 2012

**Real record:** Motion adaptation does not depend on attention to the adaptor

**Real first author:** Morgan MJ · **Journal:** Vision Res · **Year:** 2012 · 55():47-51 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22245710/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/omega3.mdx:19` | author | bhatt | Morgan MJ |
| `content/compounds/omega3.mdx:19` | year | 2018, 2021 | 2012 |
| `lib/data.ts:290` | journal | Brain Behav Immun | Vision Res |
| `lib/data.ts:290` | title | Omega-3 fatty acid supplementation and leukocyte telomere length in healthy adults | Motion adaptation does not depend on attention to the adaptor |

### `22395720` — Barth RA, *Pediatr Radiol* 2012

**Real record:** Imaging of fetal chest masses

**Real first author:** Barth RA · **Journal:** Pediatr Radiol · **Year:** 2012 · 42 Suppl 1():S62-73 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22395720/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/coq10.mdx:17` | author | jorat | Barth RA |
| `content/compounds/coq10.mdx:17` | year | 2016, 2018 | 2012 |
| `lib/data.ts:271` | journal | Eur J Clin Pharmacol | Pediatr Radiol |
| `lib/data.ts:271` | title | Effects of statin therapy on mitochondrial function and CoQ10 in human skeletal muscle | Imaging of fetal chest masses |

### `25540326` — Mannick JB, *Sci Transl Med* 2014

**Real record:** mTOR inhibition improves immune function in the elderly

**Real first author:** Mannick JB · **Journal:** Sci Transl Med · **Year:** 2014 · 6(268):268ra179 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/25540326/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:135` | year | 2023 | 2014 |
| `lib/research-feed.ts:135` | journal | eLife / TORC1 Inhibition Study | Sci Transl Med |
| `lib/research-feed.ts:135` | title | Low-Dose Rapamycin Partially Reverses Immune Aging in Humans | mTOR inhibition improves immune function in the elderly |
| `lib/trust.ts:356` | author | See PMID registry | Mannick JB |
| `lib/trust.ts:356` | year | 2023 | 2014 |
| `lib/trust.ts:356` | journal | Immunity & aging | Sci Transl Med |
| `lib/trust.ts:356` | title | Low-dose rapamycin partially reverses immune aging in humans | mTOR inhibition improves immune function in the elderly |

### `26267690` — Lai Z, *Zhong Nan Da Xue Xue Bao Yi Xue Ban* 2015

**Real record:** [Analysis of pulmonary dysfunction of 1 953 coal miners  in Hunan Province]

**Real first author:** Lai Z · **Journal:** Zhong Nan Da Xue Xue Bao Yi Xue Ban · **Year:** 2015 · 40(7):764-9 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/26267690/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/coq10.mdx:17` | author | jorat | Lai Z |
| `content/compounds/coq10.mdx:17` | year | 2016 | 2015 |
| `lib/comparisons.ts:600` | author | liang | Lai Z |
| `lib/comparisons.ts:600` | year | 2016 | 2015 |
| `lib/data.ts:260` | author | jorat | Lai Z |
| `lib/data.ts:260` | year | 2016 | 2015 |
| `lib/data.ts:269` | year | 2016 | 2015 |
| `lib/data.ts:269` | journal | Pharmacol Res | Zhong Nan Da Xue Xue Bao Yi Xue Ban |
| `lib/data.ts:269` | title | Effects of CoQ10 supplementation on inflammatory biomarkers: meta-analysis of 17 RCTs | [Analysis of pulmonary dysfunction of 1 953 coal miners  in Hunan Province] |
| `lib/research-feed.ts:318` | year | 2016 | 2015 |
| `lib/research-feed.ts:318` | journal | Pharmacological Research | Zhong Nan Da Xue Xue Bao Yi Xue Ban |
| `lib/research-feed.ts:318` | title | CoQ10 Supplementation Reduces hs-CRP and IL-6 Across 17 Randomized Trials | [Analysis of pulmonary dysfunction of 1 953 coal miners  in Hunan Province] |

### `26507383` — Holmefur MM, *Dev Med Child Neurol* 2016

**Real record:** Psychometric properties of a revised version of the Assisting Hand Assessment (Kids-AHA 5.0)

**Real first author:** Holmefur MM · **Journal:** Dev Med Child Neurol · **Year:** 2016 (epub 2015) · 58(6):618-24 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/26507383/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/berberine.mdx:17` | author | yin | Holmefur MM |
| `content/compounds/berberine.mdx:17` | year | 2008 | 2016 / 2015 |
| `lib/data.ts:213` | journal | Phytomedicine | Dev Med Child Neurol |
| `lib/data.ts:213` | title | Meta-analysis of berberine on lipid metabolism: 27 RCTs | Psychometric properties of a revised version of the Assisting Hand Assessment (Kids-AHA 5.0) |

### `27702440` — Carroll JE, *Biol Psychiatry* 2017

**Real record:** Epigenetic Aging and Immune Senescence in Women With Insomnia Symptoms: Findings From the Women's Health Initiative Study

**Real first author:** Carroll JE · **Journal:** Biol Psychiatry · **Year:** 2017 (epub 2016) · 81(2):136-144 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27702440/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/consumer-faq.ts:124` | year | 2024 | 2017 / 2016 |
| `lib/research-feed.ts:120` | year | 2024 | 2017 / 2016 |
| `lib/research-feed.ts:120` | journal | SLEEP Journal | Biol Psychiatry |
| `lib/research-feed.ts:120` | title | Chronic Sleep Debt Accelerates Epigenetic Aging by 1.8 Years Per Year | Epigenetic Aging and Immune Senescence in Women With Insomnia Symptoms: Findings From the Women's Health Initiative Study |
| `lib/trust.ts:326` | author | See PMID registry | Carroll JE |
| `lib/trust.ts:326` | year | 2024 | 2017 / 2016 |
| `lib/trust.ts:326` | journal | Peer-reviewed cohort | Biol Psychiatry |
| `lib/trust.ts:326` | title | Chronic sleep debt accelerates epigenetic aging | Epigenetic Aging and Immune Senescence in Women With Insomnia Symptoms: Findings From the Women's Health Initiative Study |

### `29541041` — Cespedes-Guevara J, *Front Psychol* 2018

**Real record:** Music Communicates Affects, Not Basic Emotions - A Constructionist Account of Attribution of Emotional Meanings to Music

**Real first author:** Cespedes-Guevara J · **Journal:** Front Psychol · **Year:** 2018 · 9():215 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/29541041/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/coq10.mdx:17` | author | jorat | Cespedes-Guevara J |
| `content/compounds/coq10.mdx:17` | year | 2016 | 2018 |
| `lib/data.ts:270` | journal | Front Physiol | Front Psychol |
| `lib/data.ts:270` | title | Coenzyme Q10 supplementation in aging and disease | Music Communicates Affects, Not Basic Emotions - A Constructionist Account of Attribution of Emotional Meanings to Music |

### `30093609` — Greenwood SL, *Nat Commun* 2018

**Real record:** Holocene reconfiguration and readvance of the East Antarctic Ice Sheet

**Real first author:** Greenwood SL · **Journal:** Nat Commun · **Year:** 2018 · 9(1):3176 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30093609/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/spermidine.mdx:19` | year | 2021 | 2018 |
| `content/hallmarks/disabled-macroautophagy.mdx:134` | author | madeo | Greenwood SL |
| `lib/data.ts:174` | journal | Science | Nat Commun |
| `lib/data.ts:174` | title | Spermidine in health and disease | Holocene reconfiguration and readvance of the East Antarctic Ice Sheet |

### `32835509` — Aldred MA, *Am J Respir Crit Care Med* 2020

**Real record:** PHorecasting Heritable Pulmonary Arterial Hypertension: Are We Nearly There Yet?

**Real first author:** Aldred MA · **Journal:** Am J Respir Crit Care Med · **Year:** 2020 · 202(11):1500-1502 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32835509/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/omega3.mdx:19` | author | bhatt | Aldred MA |
| `content/compounds/omega3.mdx:19` | year | 2018 | 2020 |
| `lib/data.ts:291` | year | 2021 | 2020 |
| `lib/data.ts:291` | journal | Crit Rev Food Sci Nutr | Am J Respir Crit Care Med |
| `lib/data.ts:291` | title | EPA and DHA reduce inflammatory biomarkers via specialized pro-resolving mediators: meta-analysis | PHorecasting Heritable Pulmonary Arterial Hypertension: Are We Nearly There Yet? |

### `34847066` — Demidenko O, *Aging (Albany NY)* 2021

**Real record:** Rejuvant®, a potential life-extending compound formulation with alpha-ketoglutarate and vitamins, conferred an average 8 year reduction in biological aging, after an average of 7 months of use, in the TruAge DNA methylation test

**Real first author:** Demidenko O · **Journal:** Aging (Albany NY) · **Year:** 2021 · 13(22):24485-24499 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/34847066/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/cakg.mdx:19` | author | shahmirzadi | Demidenko O |
| `content/compounds/cakg.mdx:19` | year | 2020, 2024 | 2021 |
| `lib/consumer-faq.ts:154` | year | 2024 | 2021 |
| `lib/data.ts:98` | year | 2024 | 2021 |
| `lib/data.ts:98` | journal | Aging Cell | Aging (Albany NY) |
| `lib/data.ts:98` | title | AKG supplementation reduces biological age in middle-aged adults | Rejuvant®, a potential life-extending compound formulation with alpha-ketoglutarate and vitamins, conferred an average 8 year reduction in biological aging, after an average of 7 months of use, in the TruAge DNA methylation test |
| `lib/data.ts:1666` | year | 2024 | 2021 |
| `lib/data.ts:2504` | author | Measurable Territory | Demidenko O |
| `lib/data.ts:2513` | author | Clinical Benchmark | Demidenko O |
| `lib/data.ts:2553` | year | 2024 | 2021 |
| `lib/research-feed.ts:104` | year | 2024 | 2021 |
| `lib/stacks-library.ts:315` | year | 2024 | 2021 |
| `lib/stacks-library.ts:315` | journal | Aging Cell | Aging (Albany NY) |
| `lib/stacks-library.ts:315` | title | AKG supplementation in middle-aged adults | Rejuvant®, a potential life-extending compound formulation with alpha-ketoglutarate and vitamins, conferred an average 8 year reduction in biological aging, after an average of 7 months of use, in the TruAge DNA methylation test |
| `lib/stacks-library.ts:494` | year | 2024 | 2021 |
| `lib/stacks-library.ts:494` | journal | Aging Cell | Aging (Albany NY) |
| `lib/stacks-library.ts:494` | title | AKG supplementation in middle-aged adults | Rejuvant®, a potential life-extending compound formulation with alpha-ketoglutarate and vitamins, conferred an average 8 year reduction in biological aging, after an average of 7 months of use, in the TruAge DNA methylation test |
| `lib/trust.ts:316` | year | 2024 | 2021 |
| `lib/trust.ts:316` | journal | Aging Cell | Aging (Albany NY) |
| `lib/trust.ts:316` | title | Ca-AKG reduces biological age in middle-aged adults | Rejuvant®, a potential life-extending compound formulation with alpha-ketoglutarate and vitamins, conferred an average 8 year reduction in biological aging, after an average of 7 months of use, in the TruAge DNA methylation test |

### `35391504` — Chen SX, *Hum Mutat* 2022

**Real record:** Bioinformatics detection of modulators controlling splicing factor-dependent intron retention in the human brain

**Real first author:** Chen SX · **Journal:** Hum Mutat · **Year:** 2022 · 43(11):1629-1641 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/35391504/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/urolithin-a.mdx:17` | author | ryu | Chen SX |
| `content/compounds/urolithin-a.mdx:17` | year | 2019 | 2022 |
| `lib/buyer-guides.ts:395` | author | ryu | Chen SX |
| `lib/comparisons.ts:599` | author | ryu | Chen SX |
| `lib/data.ts:222` | author | medicine | Chen SX |
| `lib/data.ts:232` | journal | Cell Reports Medicine | Hum Mutat |
| `lib/data.ts:232` | title | Randomized trial of urolithin A supplementation in healthy older adults: sustained mitochondrial improvements | Bioinformatics detection of modulators controlling splicing factor-dependent intron retention in the human brain |
| `lib/research-feed.ts:288` | journal | Cell Reports Medicine | Hum Mutat |
| `lib/research-feed.ts:288` | title | Urolithin A Phase 2 RCT: Sustained Mitochondrial Improvement and Muscle Strength in Older Adults | Bioinformatics detection of modulators controlling splicing factor-dependent intron retention in the human brain |

### `38772511` — Ribeiro M, *Free Radic Biol Med* 2024

**Real record:** Sulforaphane upregulates the mRNA expression of NRF2 and NQO1 in non-dialysis patients with chronic kidney disease

**Real first author:** Ribeiro M · **Journal:** Free Radic Biol Med · **Year:** 2024 · 221():181-187 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/38772511/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/stacks-library.ts:140` | year | 2008 | 2024 |
| `lib/stacks-library.ts:140` | journal | Oncogene | Free Radic Biol Med |
| `lib/stacks-library.ts:140` | title | Sulforaphane activates Nrf2 and protects against oxidative stress | Sulforaphane upregulates the mRNA expression of NRF2 and NQO1 in non-dialysis patients with chronic kidney disease |
| `lib/trust.ts:246` | author | Baird L, Dinkova-Kostova AT | Ribeiro M |
| `lib/trust.ts:246` | year | 2008 | 2024 |
| `lib/trust.ts:246` | journal | Oncogene | Free Radic Biol Med |
| `lib/trust.ts:246` | title | Sulforaphane activates Nrf2 and protects against oxidative stress | Sulforaphane upregulates the mRNA expression of NRF2 and NQO1 in non-dialysis patients with chronic kidney disease |
| `lib/trust.ts:336` | author | See PMID registry | Ribeiro M |
| `lib/trust.ts:336` | year | 2023 | 2024 |
| `lib/trust.ts:336` | journal | Microbiome research | Free Radic Biol Med |
| `lib/trust.ts:336` | title | Sulforaphane reshapes gut microbiome toward longevity-associated species | Sulforaphane upregulates the mRNA expression of NRF2 and NQO1 in non-dialysis patients with chronic kidney disease |
| `lib/trust.ts:386` | author | See PMID registry | Ribeiro M |

### `19587680` — Harrison DE, *Nature* 2009

**Real record:** Rapamycin fed late in life extends lifespan in genetically heterogeneous mice

**Real first author:** Harrison DE · **Journal:** Nature · **Year:** 2009 · 460(7253):392-5 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/19587680/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/rapamycin.mdx:59` | author | bjedov | Harrison DE |
| `content/compounds/rapamycin.mdx:59` | year | 2010 | 2009 |
| `lib/stacks-library.ts:563` | year | 2011 | 2009 |
| `lib/stacks-library.ts:563` | journal | Aging Cell | Nature |
| `lib/trust.ts:276` | year | 2011 | 2009 |
| `lib/trust.ts:276` | journal | Aging Cell | Nature |

### `31542391` — Hickson LJ, *EBioMedicine* 2019

**Real record:** Senolytics decrease senescent cells in humans: Preliminary report from a clinical trial of Dasatinib plus Quercetin in individuals with diabetic kidney disease

**Real first author:** Hickson LJ · **Journal:** EBioMedicine · **Year:** 2019 · 47():446-456 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/31542391/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:2550` | year | 2020 | 2019 |
| `lib/research-feed.ts:89` | year | 2020 | 2019 |
| `lib/research-feed.ts:89` | journal | EBioMedicine / Mayo Clinic | EBioMedicine |
| `lib/trust.ts:306` | author | Justice JN et al. | Hickson LJ |
| `lib/trust.ts:306` | year | 2020 | 2019 |

### `33783984` — Kumar P, *Clin Transl Med* 2021

**Real record:** Glycine and N-acetylcysteine (GlyNAC) supplementation in older adults improves glutathione deficiency, oxidative stress, mitochondrial dysfunction, inflammation, insulin resistance, endothelial dysfunction, genotoxicity, muscle strength, and cognition: Results of a pilot clinical trial

**Real first author:** Kumar P · **Journal:** Clin Transl Med · **Year:** 2021 · 11(3):e372 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/33783984/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/hallmarks/genomic-instability.mdx:43` | author | lopez | Kumar P |
| `content/hallmarks/genomic-instability.mdx:43` | year | 2023 | 2021 |
| `lib/stacks-library.ts:138` | journal | J Gerontol A | Clin Transl Med |
| `lib/stacks-library.ts:197` | journal | J Gerontol A | Clin Transl Med |
| `lib/stacks-library.ts:369` | journal | J Gerontol A | Clin Transl Med |
| `lib/stacks-library.ts:437` | journal | J Gerontol A | Clin Transl Med |
| `lib/stacks-library.ts:641` | journal | J Gerontol A | Clin Transl Med |
| `lib/trust.ts:216` | journal | J Gerontol A Biol Sci Med Sci | Clin Transl Med |

### `18396172` — Volek JS, *Prog Lipid Res* 2008

**Real record:** Dietary carbohydrate restriction induces a unique metabolic state positively affecting atherogenic dyslipidemia, fatty acid partitioning, and metabolic syndrome

**Real first author:** Volek JS · **Journal:** Prog Lipid Res · **Year:** 2008 · 47(5):307-18 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/18396172/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/berberine.mdx:17` | author | yin | Volek JS |
| `lib/buyer-guides.ts:368` | author | zhang | Volek JS |
| `lib/data.ts:202` | author | yin | Volek JS |
| `lib/data.ts:211` | journal | Metabolism | Prog Lipid Res |
| `lib/data.ts:211` | title | Efficacy of berberine in patients with type 2 diabetes — metformin-equivalent RCT | Dietary carbohydrate restriction induces a unique metabolic state positively affecting atherogenic dyslipidemia, fatty acid partitioning, and metabolic syndrome |
| `lib/research-feed.ts:273` | journal | Metabolism | Prog Lipid Res |
| `lib/research-feed.ts:273` | title | Berberine Activates AMPK and Reduces Metabolic Aging Risk Markers in Humans | Dietary carbohydrate restriction induces a unique metabolic state positively affecting atherogenic dyslipidemia, fatty acid partitioning, and metabolic syndrome |

### `21749330` — Cao K, *Tissue Antigens* 2011

**Real record:** A new HLA-C allele, C*08:43, identified during a UCLA Immunogenetics Centre cell exchange

**Real first author:** Cao K · **Journal:** Tissue Antigens · **Year:** 2011 · 78(6):459-60 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/21749330/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:184` | author | kapetanovic | Cao K |
| `lib/data.ts:193` | journal | J Agric Food Chem | Tissue Antigens |
| `lib/data.ts:193` | title | Pharmacokinetics and safety of pterostilbene in humans | A new HLA-C allele, C*08:43, identified during a UCLA Immunogenetics Centre cell exchange |
| `lib/field-notes.ts:117` | author | kapetanovic | Cao K |

### `31230029` — Thurtle D, *BMJ Open* 2019

**Real record:** Models predicting survival to guide treatment decision-making in newly diagnosed primary non-metastatic prostate cancer: a systematic review

**Real first author:** Thurtle D · **Journal:** BMJ Open · **Year:** 2019 · 9(6):e029149 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/31230029/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/urolithin-a.mdx:17` | author | ryu | Thurtle D |
| `content/compounds/urolithin-a.mdx:43` | author | ryu | Thurtle D |
| `lib/buyer-guides.ts:396` | author | andreux | Thurtle D |
| `lib/data.ts:231` | journal | Cell Metabolism | BMJ Open |
| `lib/data.ts:231` | title | Urolithin A induces mitophagy and improves muscle function in aging — first human RCT | Models predicting survival to guide treatment decision-making in newly diagnosed primary non-metastatic prostate cancer: a systematic review |
| `lib/research-feed.ts:243` | journal | Cell Metabolism | BMJ Open |
| `lib/research-feed.ts:243` | title | Urolithin A Activates Mitophagy in Human Skeletal Muscle — First Clinical Evidence | Models predicting survival to guide treatment decision-making in newly diagnosed primary non-metastatic prostate cancer: a systematic review |

### `42231578` — Jimenez V, *Mol Ther* 2026

**Real record:** AAV-mediated FGF21 gene therapy promotes health span extension by whole-body tissue-specific adaptations

**Real first author:** Jimenez V · **Journal:** Mol Ther · **Year:** 2026 · 34(8):4546-4568 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/42231578/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:13` | journal | Lifespan.io / Nature Aging | Mol Ther |
| `lib/research-feed.ts:13` | title | Late-Life Gene Therapy Boosts Lifespan in Mice by 20% | AAV-mediated FGF21 gene therapy promotes health span extension by whole-body tissue-specific adaptations |
| `lib/trust.ts:286` | author | See Nature Aging 2026 | Jimenez V |
| `lib/trust.ts:286` | journal | Nature Aging | Mol Ther |

### `16391215` — Howard BV, *JAMA* 2006

**Real record:** Low-fat dietary pattern and weight change over 7 years: the Women's Health Initiative Dietary Modification Trial

**Real first author:** Howard BV · **Journal:** JAMA · **Year:** 2006 · 295(1):39-49 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16391215/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/l-arginine.mdx:8` | author | schulman | Howard BV |
| `content/compounds/l-arginine.mdx:24` | author | schulman | Howard BV |
| `lib/data.ts:1588` | author | schulman | Howard BV |
| `lib/data.ts:1597` | journal | VINTAGE-MI 2006 (PMID 16391215) | JAMA |

### `24101058` — Goldman DP, *Health Aff (Millwood)* 2013

**Real record:** Substantial health and economic returns from delayed aging may warrant a new focus for medical research

**Real first author:** Goldman DP · **Journal:** Health Aff (Millwood) · **Year:** 2013 · 32(10):1698-705 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24101058/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:74` | year | 2025 | 2013 |
| `lib/research-feed.ts:74` | journal | Lifespan Research Institute | Health Aff (Millwood) |
| `lib/research-feed.ts:74` | title | Treating Aging vs Disease: 25+ Years Healthy Life Gained | Substantial health and economic returns from delayed aging may warrant a new focus for medical research |

### `17298901` — Okonkowski J, *J Biosci Bioeng* 2007

**Real record:** Cholesterol delivery to NS0 cells: challenges and solutions in disposable linear low-density polyethylene-based bioreactors

**Real first author:** Okonkowski J · **Journal:** J Biosci Bioeng · **Year:** 2007 · 103(1):50-9 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/17298901/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:212` | journal | J Biol Chem | J Biosci Bioeng |
| `lib/data.ts:212` | title | Berberine activates AMP-activated protein kinase in rat liver and skeletal muscle | Cholesterol delivery to NS0 cells: challenges and solutions in disposable linear low-density polyethylene-based bioreactors |

### `17909917` — Mansour JC, *Ann Surg Oncol* 2007

**Real record:** Does graded histologic response after neoadjuvant chemotherapy predict survival for completely resected gastric cancer?

**Real first author:** Mansour JC · **Journal:** Ann Surg Oncol · **Year:** 2007 · 14(12):3412-8 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/17909917/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:79` | journal | Neurochem Res | Ann Surg Oncol |
| `lib/data.ts:79` | title | Lipoic acid as a means of metabolic therapy | Does graded histologic response after neoadjuvant chemotherapy predict survival for completely resected gastric cancer? |
| `lib/stacks-library.ts:198` | journal | Neurochem Res | Ann Surg Oncol |
| `lib/stacks-library.ts:198` | title | Lipoic acid as a means of metabolic therapy | Does graded histologic response after neoadjuvant chemotherapy predict survival for completely resected gastric cancer? |

### `27356680` — Gurkan C, *Ann Hum Biol* 2017

**Real record:** Turkish Cypriot paternal lineages bear an autochthonous character and closest resemblance to those from neighbouring Near Eastern populations

**Real first author:** Gurkan C · **Journal:** Ann Hum Biol · **Year:** 2017 (epub 2016) · 44(2):164-174 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27356680/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:60` | journal | Clin Immunol | Ann Hum Biol |
| `lib/data.ts:60` | title | Broccoli sprouts activate NRF2 in human airway epithelial cells | Turkish Cypriot paternal lineages bear an autochthonous character and closest resemblance to those from neighbouring Near Eastern populations |

### `29563638` — Golzarand M, *Eur J Clin Nutr* 2018

**Real record:** Vitamin D supplementation and body fat mass: a systematic review and meta-analysis

**Real first author:** Golzarand M · **Journal:** Eur J Clin Nutr · **Year:** 2018 · 72(10):1345-1357 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/29563638/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:258` | journal | Cortex | Eur J Clin Nutr |
| `lib/research-feed.ts:258` | title | Spermidine Supplementation Improves Episodic Memory in Older Adults | Vitamin D supplementation and body fat mass: a systematic review and meta-analysis |

### `29974401` — Vinceti M, *Eur J Epidemiol* 2018

**Real record:** Selenium exposure and the risk of type 2 diabetes: a systematic review and meta-analysis

**Real first author:** Vinceti M · **Journal:** Eur J Epidemiol · **Year:** 2018 · 33(9):789-810 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/29974401/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `scripts/register-orphan-compounds.mjs:14` | journal | Cochrane Database Syst Rev | Eur J Epidemiol |
| `scripts/register-orphan-compounds.mjs:14` | title | Selenium for preventing cancer | Selenium exposure and the risk of type 2 diabetes: a systematic review and meta-analysis |

### `31012539` — de Oliveira T, *Acta Ophthalmol* 2019

**Real record:** Oct angiography compared to fluorescein angiography, indocyanine green angiography and optical coherence tomography in the detection of choroidal neovascularization in pigment epithelial detachment

**Real first author:** de Oliveira T · **Journal:** Acta Ophthalmol · **Year:** 2019 · 97(7):e1006-e1012 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/31012539/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/stacks-library.ts:564` | journal | Aging Cell | Acta Ophthalmol |
| `lib/stacks-library.ts:564` | title | Metformin in longevity study (TAME) protocol | Oct angiography compared to fluorescein angiography, indocyanine green angiography and optical coherence tomography in the detection of choroidal neovascularization in pigment epithelial detachment |

### `32910831` — Borrelli A, *J Vet Emerg Crit Care (San Antonio)* 2020

**Real record:** Evaluation of the effects of hydroxyethyl starch (130/0.4) administration as a constant rate infusion on plasma colloid osmotic pressure in hypoabluminemic dogs

**Real first author:** Borrelli A · **Journal:** J Vet Emerg Crit Care (San Antonio) · **Year:** 2020 · 30(5):550-557 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32910831/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:363` | journal | Cell Metabolism | J Vet Emerg Crit Care (San Antonio) |
| `lib/research-feed.ts:363` | title | TAME Trial: Metformin as the First Aging-Targeting Drug in FDA Clinical Testing | Evaluation of the effects of hydroxyethyl starch (130/0.4) administration as a constant rate infusion on plasma colloid osmotic pressure in hypoabluminemic dogs |

## MISMATCH — one stored field disagrees with PubMed

A single field is off. Some of these are editorial paraphrase or print-vs-epub year; each still needs an eye.

### `22055504` — Timmers S, *Cell Metab* 2011

**Real record:** Calorie restriction-like effects of 30 days of resveratrol supplementation on energy metabolism and metabolic profile in obese humans

**Real first author:** Timmers S · **Journal:** Cell Metab · **Year:** 2011 · 14(5):612-22 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22055504/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:127` | year | 2024 | 2011 |
| `lib/data.ts:138` | year | 2024 | 2011 |
| `lib/data.ts:138` | title | Trans-resveratrol activates SIRT1 and FOXO3a in human PBMCs | Calorie restriction-like effects of 30 days of resveratrol supplementation on energy metabolism and metabolic profile in obese humans |
| `lib/trust.ts:346` | author | See PMID registry | Timmers S |
| `lib/trust.ts:346` | year | 2024 | 2011 |
| `lib/trust.ts:346` | title | Trans-resveratrol activates SIRT1 in human PBMCs | Calorie restriction-like effects of 30 days of resveratrol supplementation on energy metabolism and metabolic profile in obese humans |

### `30279143` — Yousefzadeh MJ, *EBioMedicine* 2018

**Real record:** Fisetin is a senotherapeutic that extends health and lifespan

**Real first author:** Yousefzadeh MJ · **Journal:** EBioMedicine · **Year:** 2018 · 36():18-28 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30279143/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:242` | author | ebiomedicine | Yousefzadeh MJ |
| `lib/field-notes.ts:110` | author | ebiomedicine | Yousefzadeh MJ |
| `lib/research-feed.ts:214` | year | 2019 | 2018 |
| `lib/research-feed.ts:214` | title | Fisetin Reduces Senescent Cells and Improves Physical Function in Older Adults | Fisetin is a senotherapeutic that extends health and lifespan |
| `lib/research-feed.ts:348` | year | 2019 | 2018 |
| `lib/research-feed.ts:348` | title | Fisetin Reduces Senescent Cell Burden and Improves Physical Function — Mayo Clinic Pilot | Fisetin is a senotherapeutic that extends health and lifespan |
| `lib/trust.ts:406` | author | Justice JN et al. | Yousefzadeh MJ |
| `lib/trust.ts:406` | year | 2020 | 2018 |
| `lib/trust.ts:406` | title | Fisetin reduces senescent cells in older adults | Fisetin is a senotherapeutic that extends health and lifespan |

### `30930169` — Amano H, *Cell Metab* 2019

**Real record:** Telomere Dysfunction Induces Sirtuin Repression that Drives Telomere-Dependent Disease

**Real first author:** Amano H · **Journal:** Cell Metab · **Year:** 2019 · 29(6):1274-1290.e9 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30930169/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/synergies/nmn-resveratrol-sirt1.mdx:57` | author | yi | Amano H |
| `content/synergies/nmn-resveratrol-sirt1.mdx:57` | year | 2022 | 2019 |
| `lib/data.ts:137` | title | Resveratrol and NAD+ precursors synergize for mitochondrial health | Telomere Dysfunction Induces Sirtuin Repression that Drives Telomere-Dependent Disease |
| `lib/stacks-library.ts:255` | title | Resveratrol and NAD+ precursors synergize for mitochondrial health | Telomere Dysfunction Induces Sirtuin Repression that Drives Telomere-Dependent Disease |
| `lib/stacks-library.ts:644` | title | Resveratrol and NAD+ precursors synergize for mitochondrial health | Telomere Dysfunction Induces Sirtuin Repression that Drives Telomere-Dependent Disease |

### `10774316` — Streit WJ, *Eur Arch Otorhinolaryngol* 1994

**Real record:** The role of microglia in regeneration

**Real first author:** Streit WJ · **Journal:** Eur Arch Otorhinolaryngol · **Year:** 1994 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/10774316/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/pumpkin-seed-oil.mdx:51` | author | bach | Streit WJ |
| `content/compounds/pumpkin-seed-oil.mdx:51` | year | 2000 | 1994 |
| `lib/data.ts:1090` | author | Bach 2000 | Streit WJ |
| `lib/data.ts:1090` | year | 2000 | 1994 |

### `11289661` — Killeen GF, *Am J Trop Med Hyg* 2000

**Real record:** A simplified model for predicting malaria entomologic inoculation rates based on entomologic and parasitologic parameters relevant to control

**Real first author:** Killeen GF · **Journal:** Am J Trop Med Hyg · **Year:** 2000 · 62(5):535-44 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/11289661/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/benfotiamine.mdx:8` | author | stracke | Killeen GF |
| `content/compounds/benfotiamine.mdx:8` | year | 2001 | 2000 |
| `content/compounds/benfotiamine.mdx:26` | author | stracke | Killeen GF |
| `content/compounds/benfotiamine.mdx:26` | year | 2001 | 2000 |
| `content/compounds/benfotiamine.mdx:57` | author | stracke | Killeen GF |
| `content/compounds/benfotiamine.mdx:57` | year | 2001 | 2000 |
| `lib/data.ts:1416` | author | stracke | Killeen GF |
| `lib/data.ts:1416` | year | 2001 | 2000 |
| `lib/data.ts:1424` | author | Stracke 2001 | Killeen GF |
| `lib/data.ts:1424` | year | 2001 | 2000 |

### `15644613` — Endo Y, *J Vet Med Sci* 2004

**Real record:** Prevalence of canine distemper virus, feline immunodeficiency virus and feline leukemia virus in captive African lions (Panthera leo) in Japan

**Real first author:** Endo Y · **Journal:** J Vet Med Sci · **Year:** 2004 · 66(12):1587-9 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15644613/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/methylcobalamin.mdx:23` | author | andres | Endo Y |
| `content/compounds/methylcobalamin.mdx:23` | year | 2005 | 2004 |

### `19856234` — Spielmans GI, *Psychother Res* 2010

**Real record:** The efficacy of evidence-based psychotherapies versus usual care for youths: controlling confounds in a meta-reanalysis

**Real first author:** Spielmans GI · **Journal:** Psychother Res · **Year:** 2010 · 20(2):234-46 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/19856234/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/uc-ii.mdx:8` | author | crowley | Spielmans GI |
| `content/compounds/uc-ii.mdx:8` | year | 2016, 2009 | 2010 |
| `content/compounds/uc-ii.mdx:21` | author | crowley | Spielmans GI |
| `content/compounds/uc-ii.mdx:21` | year | 2009 | 2010 |
| `content/compounds/uc-ii.mdx:52` | author | crowley | Spielmans GI |
| `content/compounds/uc-ii.mdx:52` | year | 2009 | 2010 |
| `lib/data.ts:1320` | author | crowley | Spielmans GI |
| `lib/data.ts:1320` | year | 2016, 2009 | 2010 |
| `lib/data.ts:1328` | author | Crowley 2009 | Spielmans GI |
| `lib/data.ts:1328` | year | 2009 | 2010 |

### `19961247` — Siebert JR, *Arch Pathol Lab Med* 2009

**Real record:** Increasing the efficiency of autopsy reporting

**Real first author:** Siebert JR · **Journal:** Arch Pathol Lab Med · **Year:** 2009 · 133(12):1932-7 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/19961247/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/piperine.mdx:19` | author | shoba | Siebert JR |
| `content/compounds/piperine.mdx:19` | year | 1998, 2000, 2010 | 2009 |

### `21129580` — Pérez EP, *Enferm Infecc Microbiol Clin* 2010

**Real record:** [A historical view of the specialty of clinical microbiology]

**Real first author:** Pérez EP · **Journal:** Enferm Infecc Microbiol Clin · **Year:** 2010 · 28 Suppl 3():3-7 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/21129580/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/ginkgo-biloba.mdx:19` | author | ihl | Pérez EP |
| `content/compounds/ginkgo-biloba.mdx:19` | year | 1997, 2011 | 2010 |
| `content/compounds/ginkgo-biloba.mdx:48` | author | ihl | Pérez EP |
| `content/compounds/ginkgo-biloba.mdx:48` | year | 2011 | 2010 |
| `lib/data.ts:988` | author | Ihl 2011 meta | Pérez EP |
| `lib/data.ts:988` | year | 2011 | 2010 |

### `21437153` — Jiao P, *Diabetes Metab Syndr Obes* 2008

**Real record:** Adipose inflammation: cause or consequence of obesity-related insulin resistance

**Real first author:** Jiao P · **Journal:** Diabetes Metab Syndr Obes · **Year:** 2008 · 1():25-31 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/21437153/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/superoxide-dismutase.mdx:19` | author | stejnborn | Jiao P |
| `content/compounds/superoxide-dismutase.mdx:19` | year | 2004, 2011 | 2008 |
| `content/compounds/superoxide-dismutase.mdx:49` | year | 2011 | 2008 |
| `lib/data.ts:1109` | author | Skarpańska 2011 | Jiao P |
| `lib/data.ts:1109` | year | 2011 | 2008 |

### `24525715` — Turner DT, *Am J Psychiatry* 2014

**Real record:** Psychological interventions for psychosis: a meta-analysis of comparative outcome studies

**Real first author:** Turner DT · **Journal:** Am J Psychiatry · **Year:** 2014 · 171(5):523-38 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24525715/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/alpha-gpc.mdx:19` | year | 2003 | 2014 |
| `lib/data.ts:948` | author | Amenta ASCOMALVA 2014 | Turner DT |

### `25553771` — Buffenstein R, *Aging (Albany NY)* 2014

**Real record:** Questioning the preclinical paradigm: natural, extreme biology as an alternative discovery platform

**Real first author:** Buffenstein R · **Journal:** Aging (Albany NY) · **Year:** 2014 · 6(11):913-20 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/25553771/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/hmb.mdx:23` | author | wu | Buffenstein R |
| `content/compounds/hmb.mdx:23` | year | 2013, 2015 | 2014 |
| `content/compounds/hmb.mdx:55` | author | wu | Buffenstein R |
| `content/compounds/hmb.mdx:55` | year | 2015 | 2014 |
| `lib/data.ts:1522` | author | wu | Buffenstein R |
| `lib/data.ts:1522` | year | 2015 | 2014 |

### `27057260` — Wahbeh H, *Open Med J* 2014

**Real record:** Group, One-on-One, or Internet? Preferences for Mindfulness Meditation Delivery Format and their Predictors

**Real first author:** Wahbeh H · **Journal:** Open Med J · **Year:** 2014 · 1():66-74 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27057260/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/superoxide-dismutase.mdx:51` | author | coudreuse | Wahbeh H |
| `content/compounds/superoxide-dismutase.mdx:51` | year | 2016 | 2014 |
| `lib/data.ts:1111` | author | Coudreuse 2016 | Wahbeh H |
| `lib/data.ts:1111` | year | 2016 | 2014 |

### `27408835` — Bom HH, *Asia Ocean J Nucl Med Biol* 2013

**Real record:** History and Perspectives of AOFNMB

**Real first author:** Bom HH · **Journal:** Asia Ocean J Nucl Med Biol · **Year:** 2013 · 1(1):3-5 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27408835/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/cordyceps.mdx:19` | author | hirsch | Bom HH |
| `content/compounds/cordyceps.mdx:19` | year | 2010, 2017 | 2013 |
| `content/compounds/cordyceps.mdx:50` | author | hirsch | Bom HH |
| `content/compounds/cordyceps.mdx:50` | year | 2017 | 2013 |
| `lib/data.ts:1191` | author | Hirsch 2017 | Bom HH |
| `lib/data.ts:1191` | year | 2017 | 2013 |

### `30589427` — Dmitrienko SV, *Stomatologiia (Mosk)* 2018

**Real record:** [Algorithm for artificial teeth size estimation according to face morphological features in patients with complete adentia]

**Real first author:** Dmitrienko SV · **Journal:** Stomatologiia (Mosk) · **Year:** 2018 · 97(6):57-60 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30589427/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/milk-thistle.mdx:52` | author | anushiravani | Dmitrienko SV |
| `content/compounds/milk-thistle.mdx:52` | year | 2019 | 2018 |
| `lib/data.ts:1270` | author | Anushiravani 2019 meta | Dmitrienko SV |
| `lib/data.ts:1270` | year | 2019 | 2018 |

### `31987255` — Peng W, *Complement Ther Med* 2020

**Real record:** Effect of carnosine supplementation on lipid profile, fasting blood glucose, HbA1C and insulin resistance: A systematic review and meta-analysis of long-term randomized controlled trials

**Real first author:** Peng W · **Journal:** Complement Ther Med · **Year:** 2020 (epub 2019) · 48():102241 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/31987255/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/l-carnosine.mdx:17` | author | courten | Peng W |
| `content/compounds/l-carnosine.mdx:17` | year | 2024 | 2020 / 2019 |

### `33888053` — de Jesus Freitas T, *Recent Pat Nanotechnol* 2022

**Real record:** Prospective Study on Microencapsulation of Oils and Its Application in Foodstuffs

**Real first author:** de Jesus Freitas T · **Journal:** Recent Pat Nanotechnol · **Year:** 2022 · 16(3):219-234 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/33888053/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/alpha-gpc.mdx:58` | author | lee | de Jesus Freitas T |
| `content/compounds/alpha-gpc.mdx:58` | year | 2021 | 2022 |

### `34741609` — El Bouzidi K, *J Antimicrob Chemother* 2022

**Real record:** Deep sequencing of HIV-1 reveals extensive subtype variation and drug resistance after failure of first-line antiretroviral regimens in Nigeria

**Real first author:** El Bouzidi K · **Journal:** J Antimicrob Chemother · **Year:** 2022 · 77(2):474-482 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/34741609/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/glynac-supplement-guide/page.tsx:52` | author | sekhar | El Bouzidi K |
| `app/glynac-supplement-guide/page.tsx:52` | year | 2021 | 2022 |
| `app/glynac-supplement-guide/page.tsx:139` | author | Sekhar RV | El Bouzidi K |

### `12226120` — Baker SP, *Inj Prev* 2002

**Real record:** Drinking histories of fatally injured drivers

**Real first author:** Baker SP · **Journal:** Inj Prev · **Year:** 2002 · 8(3):221-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/12226120/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/sulforaphane-supplement-guide/page.tsx:60` | author | fahey | Baker SP |
| `app/sulforaphane-supplement-guide/page.tsx:382` | author | Fahey JW et al. · 2002 | Baker SP |
| `app/sulforaphane-supplement-guide/page.tsx:382` | title | H. pylori and gastric cancer risk | Drinking histories of fatally injured drivers |

### `24467923` — Chalmers KJ, *Int J Ment Health Syst* 2014

**Real record:** Providing culturally appropriate mental health first aid to an Aboriginal or Torres Strait Islander adolescent: development of expert consensus guidelines

**Real first author:** Chalmers KJ · **Journal:** Int J Ment Health Syst · **Year:** 2014 · 8(1):6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24467923/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/sulforaphane-supplement-guide/page.tsx:409` | author | Egner PA et al. · 2014 | Chalmers KJ |
| `app/sulforaphane-supplement-guide/page.tsx:409` | title | Air pollution oxidative stress | Providing culturally appropriate mental health first aid to an Aboriginal or Torres Strait Islander adolescent: development of expert consensus guidelines |

### `29621900` — Tiihonen J, *Am J Psychiatry* 2018

**Real record:** 20-Year Nationwide Follow-Up Study on Discontinuation of Antipsychotic Treatment in First-Episode Schizophrenia

**Real first author:** Tiihonen J · **Journal:** Am J Psychiatry · **Year:** 2018 · 175(8):765-773 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/29621900/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/sulforaphane-supplement-guide/page.tsx:141` | author | Shimizu T et al. | Tiihonen J |
| `app/sulforaphane-supplement-guide/page.tsx:391` | author | Shimizu T et al. · 2018 | Tiihonen J |
| `app/sulforaphane-supplement-guide/page.tsx:391` | title | Non-alcoholic liver disease (NAFLD) | 20-Year Nationwide Follow-Up Study on Discontinuation of Antipsychotic Treatment in First-Episode Schizophrenia |

### `30145934` — SCOT-HEART Investigators, *N Engl J Med* 2018

**Real record:** Coronary CT Angiography and 5-Year Risk of Myocardial Infarction

**Real first author:** SCOT-HEART Investigators · **Journal:** N Engl J Med · **Year:** 2018 · 379(10):924-933 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30145934/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/omega3.mdx:19` | author | bhatt | SCOT-HEART Investigators |
| `lib/data.ts:289` | title | Cardiovascular risk reduction with icosapentaenoic acid (REDUCE-IT) — 25% reduction in MACE | Coronary CT Angiography and 5-Year Risk of Myocardial Infarction |
| `lib/research-feed.ts:303` | title | REDUCE-IT Trial: High-Dose EPA Reduces Cardiovascular Events by 25% | Coronary CT Angiography and 5-Year Risk of Myocardial Infarction |

### `33932338` — Truong ME, *Cell* 2021

**Real record:** Vertebrate cells differentially interpret ciliary and extraciliary cAMP

**Real first author:** Truong ME · **Journal:** Cell · **Year:** 2021 · 184(11):2911-2926.e18 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/33932338/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/buyer-guides.ts:313` | author | madeo | Truong ME |
| `lib/data.ts:175` | title | Spermidine supplementation improves memory in older adults | Vertebrate cells differentially interpret ciliary and extraciliary cAMP |
| `lib/hallmarks-library.ts:123` | author | madeo | Truong ME |

### `10404492` — Franklin BA, *J Sports Sci* 1999

**Real record:** Exercise and cardiovascular events: a double-edged sword?

**Real first author:** Franklin BA · **Journal:** J Sports Sci · **Year:** 1999 · 17(6):437-42 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/10404492/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/l-arginine.mdx:24` | author | chen | Franklin BA |
| `content/compounds/l-arginine.mdx:54` | author | chen | Franklin BA |
| `lib/data.ts:1596` | author | Chen 1999 | Franklin BA |

### `10796575` — Kolbe J, *Cochrane Database Syst Rev* 2000

**Real record:** Inhaled steroids for bronchiectasis

**Real first author:** Kolbe J · **Journal:** Cochrane Database Syst Rev · **Year:** 2000 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/10796575/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/panax-ginseng.mdx:19` | author | vuksan | Kolbe J |
| `content/compounds/panax-ginseng.mdx:48` | author | vuksan | Kolbe J |
| `lib/data.ts:1009` | author | Vuksan 2000 | Kolbe J |

### `12203262` — del Rayo Camacho M, *Phytother Res* 2002

**Real record:** In vitro activity of Triclisia patens and some bisbenzylisoquinoline alkaloids against Leishmania donovani and Trypanosoma brucei brucei

**Real first author:** del Rayo Camacho M · **Journal:** Phytother Res · **Year:** 2002 · 16(5):432-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/12203262/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:1011` | author | Ellis Meta 2002 | del Rayo Camacho M |

### `12766374` — Heckmann JG, *Cerebrovasc Dis* 2003

**Real record:** Achard-Lévi syndrome: pupil-sparing oculomotor nerve palsy due to midbrain stroke

**Real first author:** Heckmann JG · **Journal:** Cerebrovasc Dis · **Year:** 2003 · 16(1):109-10 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/12766374/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/acetyl-l-carnitine.mdx:8` | author | montgomery | Heckmann JG |
| `content/compounds/acetyl-l-carnitine.mdx:25` | author | montgomery | Heckmann JG |
| `content/compounds/acetyl-l-carnitine.mdx:59` | author | montgomery | Heckmann JG |
| `lib/data.ts:1607` | author | montgomery | Heckmann JG |
| `lib/data.ts:1616` | author | Montgomery 2003 meta | Heckmann JG |

### `1408468` — Li BU, *Pediatr Res* 1992

**Real record:** Enterohepatic distribution of carnitine in developing piglets: relation to glucagon and insulin

**Real first author:** Li BU · **Journal:** Pediatr Res · **Year:** 1992 · 32(3):312-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/1408468/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/methylcobalamin.mdx:23` | author | yamashiki | Li BU |
| `content/compounds/methylcobalamin.mdx:56` | author | yamashiki | Li BU |
| `lib/data.ts:1385` | author | Yamashiki 1992 | Li BU |

### `15140254` — Clementi MA, *Reprod Biol Endocrinol* 2004

**Real record:** Luteal 3beta-hydroxysteroid dehydrogenase and 20alpha-hydroxysteroid dehydrogenase activities in the rat corpus luteum of pseudopregnancy: effect of the deciduoma reaction

**Real first author:** Clementi MA · **Journal:** Reprod Biol Endocrinol · **Year:** 2004 · 2():22 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15140254/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/bromelain.mdx:22` | author | brien | Clementi MA |
| `content/compounds/bromelain.mdx:55` | author | brien | Clementi MA |
| `lib/data.ts:1348` | author | Brien 2004 meta | Clementi MA |

### `15150435` — Grasland A, *Rheumatology (Oxford)* 2004

**Real record:** Typical and atypical Cogan's syndrome: 32 cases and review of the literature

**Real first author:** Grasland A · **Journal:** Rheumatology (Oxford) · **Year:** 2004 · 43(8):1007-15 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15150435/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/bromelain.mdx:8` | author | kerkhoffs | Grasland A |
| `content/compounds/bromelain.mdx:22` | author | kerkhoffs | Grasland A |
| `content/compounds/bromelain.mdx:52` | author | kerkhoffs | Grasland A |
| `lib/data.ts:1338` | author | kerkhoffs | Grasland A |
| `lib/data.ts:1346` | author | Kerkhoffs 2004 | Grasland A |

### `15340389` — Drews J, *Nat Rev Drug Discov* 2004

**Real record:** Paul Ehrlich: magister mundi

**Real first author:** Drews J · **Journal:** Nat Rev Drug Discov · **Year:** 2004 · 3(9):797-801 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15340389/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/superoxide-dismutase.mdx:19` | author | muth | Drews J |
| `content/compounds/superoxide-dismutase.mdx:48` | author | muth | Drews J |
| `lib/data.ts:1108` | author | Muth 2004 | Drews J |

### `15342466` — Thomer M, *Development* 2004

**Real record:** Drosophila double-parked is sufficient to induce re-replication during development and is regulated by cyclin E/CDK2

**Real first author:** Thomer M · **Journal:** Development · **Year:** 2004 · 131(19):4807-18 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15342466/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/methylfolate.mdx:21` | author | willems | Thomer M |
| `content/compounds/methylfolate.mdx:53` | author | willems | Thomer M |
| `lib/data.ts:1366` | author | Willems 2004 | Thomer M |

### `15462180` — Shrivastava S, *Indian J Exp Biol* 2004

**Real record:** Effectiveness of ethylene glycol bis (2-aminoethyl ether) tetraacetic acid (EGTA) against cerium toxicity

**Real first author:** Shrivastava S · **Journal:** Indian J Exp Biol · **Year:** 2004 · 42(9):876-83 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15462180/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/astragalus.mdx:53` | author | piao | Shrivastava S |
| `lib/data.ts:1251` | author | Piao 2004 | Shrivastava S |

### `15474517` — Shao L, *Biochem Biophys Res Commun* 2004

**Real record:** L-carnosine reduces telomere damage and shortening rate in cultured normal fibroblasts

**Real first author:** Shao L · **Journal:** Biochem Biophys Res Commun · **Year:** 2004 · 324(2):931-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15474517/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/l-carnosine.mdx:30` | author | fu | Shao L |
| `lib/data.ts:692` | author | fu | Shao L |

### `15489397` — Antonini G, *J Neurol Neurosurg Psychiatry* 2004

**Real record:** Cerebral atrophy in myotonic dystrophy: a voxel based morphometric study

**Real first author:** Antonini G · **Journal:** J Neurol Neurosurg Psychiatry · **Year:** 2004 · 75(11):1611-3 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15489397/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mucuna-pruriens.mdx:8` | author | katzenschlager | Antonini G |
| `content/compounds/mucuna-pruriens.mdx:21` | author | katzenschlager | Antonini G |
| `content/compounds/mucuna-pruriens.mdx:49` | author | katzenschlager | Antonini G |
| `lib/data.ts:1020` | author | katzenschlager | Antonini G |
| `lib/data.ts:1028` | author | Katzenschlager 2004 | Antonini G |

### `15551964` — Yin H, *Zhong Yao Cai* 2004

**Real record:** [Study on flavonoids from stem bark of Pongamia pinnata]

**Real first author:** Yin H · **Journal:** Zhong Yao Cai · **Year:** 2004 · 27(7):493-5 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15551964/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mucuna-pruriens.mdx:52` | author | manyam | Yin H |
| `lib/data.ts:1031` | author | Manyam 2004 | Yin H |

### `15626761` — Davis CA, *Proc Natl Acad Sci U S A* 2005

**Real record:** The effects of upstream DNA on open complex formation by Escherichia coli RNA polymerase

**Real first author:** Davis CA · **Journal:** Proc Natl Acad Sci U S A · **Year:** 2005 (epub 2004) · 102(2):285-90 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15626761/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/theobromine.mdx:14` | author | usmani | Davis CA |
| `content/compounds/theobromine.mdx:19` | author | usmani | Davis CA |
| `content/compounds/theobromine.mdx:46` | author | usmani | Davis CA |
| `lib/data.ts:1048` | author | Usmani 2005 | Davis CA |

### `15656416` — Riuduger IuG, *Med Tekh* 2004

**Real record:** [Use of blue and green systems of image visualization in roentgenology]

**Real first author:** Riuduger IuG · **Journal:** Med Tekh · **Year:** 2004 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/15656416/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/krill-oil.mdx:23` | author | bunea | Riuduger IuG |
| `content/compounds/krill-oil.mdx:54` | author | bunea | Riuduger IuG |
| `lib/data.ts:1559` | author | Bunea 2004 | Riuduger IuG |

### `16407641` — Meyer H, *Ann Nutr Metab* 2006

**Real record:** Bioavailability of apigenin from apiin-rich parsley in humans

**Real first author:** Meyer H · **Journal:** Ann Nutr Metab · **Year:** 2006 · 50(3):167-72 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16407641/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/apigenin.mdx:53` | author | gradolatto | Meyer H |
| `lib/data.ts:644` | author | Gradolatto 2006 | Meyer H |

### `16531614` — Bønaa KH, *N Engl J Med* 2006

**Real record:** Homocysteine lowering and cardiovascular events after acute myocardial infarction

**Real first author:** Bønaa KH · **Journal:** N Engl J Med · **Year:** 2006 · 354(15):1578-88 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16531614/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/p5p.mdx:54` | author | lonn | Bønaa KH |
| `lib/data.ts:1405` | author | HOPE-2 (Lonn 2006 | Bønaa KH |

### `16565629` — Cantrell CR, *Med Care* 2006

**Real record:** Methods for evaluating patient adherence to antidepressant therapy: a real-world comparison of adherence and economic outcomes

**Real first author:** Cantrell CR · **Journal:** Med Care · **Year:** 2006 · 44(4):300-3 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16565629/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/turkey-tail.mdx:21` | author | sakamoto | Cantrell CR |
| `content/compounds/turkey-tail.mdx:52` | author | sakamoto | Cantrell CR |
| `lib/data.ts:1229` | author | Sakamoto 2006 | Cantrell CR |

### `16648262` — Hölzl G, *Proc Natl Acad Sci U S A* 2006

**Real record:** Functional differences between galactolipids and glucolipids revealed in photosynthesis of higher plants

**Real first author:** Hölzl G · **Journal:** Proc Natl Acad Sci U S A · **Year:** 2006 · 103(19):7512-7 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16648262/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/iodine.mdx:26` | author | zimmermann | Hölzl G |
| `content/compounds/iodine.mdx:57` | author | zimmermann | Hölzl G |
| `lib/data.ts:1503` | author | Zimmermann 2006 | Hölzl G |

### `16723522` — Jacques-Fricke BT, *J Neurosci* 2006

**Real record:** Ca2+ influx through mechanosensitive channels inhibits neurite outgrowth in opposition to other influx pathways and release from intracellular stores

**Real first author:** Jacques-Fricke BT · **Journal:** J Neurosci · **Year:** 2006 · 26(21):5656-64 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16723522/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/benfotiamine.mdx:26` | author | stirban | Jacques-Fricke BT |
| `content/compounds/benfotiamine.mdx:59` | author | stirban | Jacques-Fricke BT |
| `lib/data.ts:1425` | author | Stirban 2006 | Jacques-Fricke BT |

### `16789952` — Giannelli PC, *J Law Med Ethics* 2006

**Real record:** Forensic science

**Real first author:** Giannelli PC · **Journal:** J Law Med Ethics · **Year:** 2006 · 34(2):310-9 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/16789952/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/cordyceps.mdx:51` | author | nagata | Giannelli PC |
| `lib/data.ts:1192` | author | Nagata 2006 | Giannelli PC |

### `17324195` — Simon D, *Health Expect* 2007

**Real record:** Depressed patients' perceptions of depression treatment decision-making

**Real first author:** Simon D · **Journal:** Health Expect · **Year:** 2007 · 10(1):62-74 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/17324195/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/theobromine.mdx:19` | author | baba | Simon D |
| `content/compounds/theobromine.mdx:47` | author | baba | Simon D |
| `lib/data.ts:1049` | author | Baba 2007 | Simon D |

### `17351811` — Nocker A, *Microb Ecol* 2007

**Real record:** Response of estuarine biofilm microbial community development to changes in dissolved oxygen and nutrient concentrations

**Real first author:** Nocker A · **Journal:** Microb Ecol · **Year:** 2007 · 54(3):532-42 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/17351811/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/turkey-tail.mdx:8` | author | oba | Nocker A |
| `content/compounds/turkey-tail.mdx:21` | author | oba | Nocker A |
| `content/compounds/turkey-tail.mdx:51` | author | oba | Nocker A |
| `lib/data.ts:1220` | author | oba | Nocker A |
| `lib/data.ts:1228` | author | Oba 2007 | Nocker A |

### `17439714` — Phan X, *J Can Dent Assoc* 2007

**Real record:** Clinical limitations of Invisalign

**Real first author:** Phan X · **Journal:** J Can Dent Assoc · **Year:** 2007 · 73(3):263-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/17439714/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/krill-oil.mdx:23` | author | bunea | Phan X |
| `content/compounds/krill-oil.mdx:55` | author | deutsch | Phan X |
| `lib/data.ts:1560` | author | Deutsch 2007 | Phan X |

### `18544724` — Riemersma-van der Lek RF, *JAMA* 2008

**Real record:** Effect of bright light and melatonin on cognitive and noncognitive function in elderly residents of group care facilities: a randomized controlled trial

**Real first author:** Riemersma-van der Lek RF · **Journal:** JAMA · **Year:** 2008 · 299(22):2642-55 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/18544724/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/ginkgo-biloba.mdx:8` | author | bars | Riemersma-van der Lek RF |
| `lib/data.ts:979` | author | bars | Riemersma-van der Lek RF |

### `18606712` — Parsons R, *J Immunol* 2008

**Real record:** The memory T cell response to West Nile virus in symptomatic humans following natural infection is not influenced by age and is dominated by a restricted set of CD8+ T cell epitopes

**Real first author:** Parsons R · **Journal:** J Immunol · **Year:** 2008 · 181(2):1563-72 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/18606712/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/p5p.mdx:21` | author | merete | Parsons R |
| `content/compounds/p5p.mdx:53` | author | merete | Parsons R |
| `lib/data.ts:1404` | author | Merete 2008 | Parsons R |

### `1876787` — Chalmers TC, *Stat Med* 1991

**Real record:** Problems induced by meta-analyses

**Real first author:** Chalmers TC · **Journal:** Stat Med · **Year:** 1991 · 10(6):971-9; discussion 979-80 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/1876787/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/phosphatidylserine.mdx:8` | author | crook | Chalmers TC |
| `content/compounds/phosphatidylserine.mdx:19` | author | crook | Chalmers TC |
| `content/compounds/phosphatidylserine.mdx:37` | author | crook | Chalmers TC |
| `lib/data.ts:959` | author | crook | Chalmers TC |
| `lib/data.ts:967` | author | Crook 1991 | Chalmers TC |

### `18784229` — Pukrittayakamee S, *Am J Trop Med Hyg* 2008

**Real record:** Effects of different antimalarial drugs on gametocyte carriage in P. vivax malaria

**Real first author:** Pukrittayakamee S · **Journal:** Am J Trop Med Hyg · **Year:** 2008 · 79(3):378-84 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/18784229/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/hallmarks/telomere-attrition.mdx:138` | author | ornish | Pukrittayakamee S |

### `1907260` — , *Health Devices* 1991

**Real record:** Gelman Sciences Safe protective mouthpieces

**Real first author:**  · **Journal:** Health Devices · **Year:** 1991 · 20(5):182 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/1907260/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/piperine.mdx:50` | author | bano |  |
| `lib/data.ts:1130` | author | Bano 1991 |  |

### `19171861` — Reiffel JA, *Circulation* 2009

**Real record:** Letter by Reiffel regarding article, "Acute pharmacological conversion of atrial fibrillation to sinus rhythm"

**Real first author:** Reiffel JA · **Journal:** Circulation · **Year:** 2009 · 119(3):e17; author reply e18 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/19171861/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/iodine.mdx:26` | author | zimmermann | Reiffel JA |

### `19587683` — Kim JI, *Nature* 2009

**Real record:** A highly annotated whole-genome sequence of a Korean individual

**Real first author:** Kim JI · **Journal:** Nature · **Year:** 2009 · 460(7258):1011-5 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/19587683/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/rapamycin.mdx:20` | author | harrison | Kim JI |
| `content/compounds/rapamycin.mdx:58` | author | harrison | Kim JI |
| `content/hallmarks/deregulated-nutrient-sensing.mdx:135` | author | lamming | Kim JI |

### `19664276` — Henderson ST, *Nutr Metab (Lond)* 2009

**Real record:** Study of the ketogenic agent AC-1202 in mild to moderate Alzheimer's disease: a randomized, double-blind, placebo-controlled, multicenter trial

**Real first author:** Henderson ST · **Journal:** Nutr Metab (Lond) · **Year:** 2009 · 6():31 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/19664276/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mct-oil.mdx:19` | author | castellano | Henderson ST |

### `20080417` — Haldar C, *J Photochem Photobiol B* 2010

**Real record:** Photoimmunomodulation and melatonin

**Real first author:** Haldar C · **Journal:** J Photochem Photobiol B · **Year:** 2010 (epub 2009) · 98(2):107-17 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/20080417/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mucuna-pruriens.mdx:21` | author | shukla | Haldar C |
| `content/compounds/mucuna-pruriens.mdx:51` | author | shukla | Haldar C |
| `lib/data.ts:1030` | author | Shukla 2010 | Haldar C |

### `20130432` — Lombardi L, *Oncology* 2009

**Real record:** Adjuvant therapy in colon cancer

**Real first author:** Lombardi L · **Journal:** Oncology · **Year:** 2009 (epub 2010) · 77 Suppl 1():50-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/20130432/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/phosphatidylserine.mdx:40` | author | vakhapova | Lombardi L |
| `lib/data.ts:970` | author | Vakhapova 2010 | Lombardi L |

### `20406627` — Binfaré RW, *Eur J Pharmacol* 2010

**Real record:** Involvement of dopamine receptors in the antidepressant-like effect of melatonin in the tail suspension test

**Real first author:** Binfaré RW · **Journal:** Eur J Pharmacol · **Year:** 2010 · 638(1-3):78-83 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/20406627/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:1561` | author | Skarpańska 2010 | Binfaré RW |

### `20573793` — May AM, *Am J Clin Nutr* 2010

**Real record:** Effect of change in physical activity on body fatness over a 10-y period in the Doetinchem Cohort Study

**Real first author:** May AM · **Journal:** Am J Clin Nutr · **Year:** 2010 · 92(3):491-9 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/20573793/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/benfotiamine.mdx:61` | author | alkhalaf | May AM |
| `lib/data.ts:1427` | author | Alkhalaf 2010 | May AM |

### `20590480` — Morgan A, *J Altern Complement Med* 2010

**Real record:** Does Bacopa monnieri improve memory performance in older persons? Results of a randomized, placebo-controlled, double-blind trial

**Real first author:** Morgan A · **Journal:** J Altern Complement Med · **Year:** 2010 · 16(7):753-9 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/20590480/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/bacopa-monnieri.mdx:24` | author | stough | Morgan A |

### `20804807` — Batista R, *Regul Toxicol Pharmacol* 2010

**Real record:** Plant natural variability may affect safety assessment data

**Real first author:** Batista R · **Journal:** Regul Toxicol Pharmacol · **Year:** 2010 · 58(3 Suppl):S8-12 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/20804807/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/cordyceps.mdx:8` | author | chen | Batista R |
| `content/compounds/cordyceps.mdx:19` | author | chen | Batista R |
| `content/compounds/cordyceps.mdx:49` | author | chen | Batista R |
| `lib/data.ts:1182` | author | chen | Batista R |
| `lib/data.ts:1190` | author | Chen 2010 | Batista R |

### `21159786` — Chacko SA, *Am J Clin Nutr* 2011

**Real record:** Magnesium supplementation, metabolic and inflammatory markers, and global genomic and proteomic profiling: a randomized, double-blind, controlled, crossover trial in overweight individuals

**Real first author:** Chacko SA · **Journal:** Am J Clin Nutr · **Year:** 2011 (epub 2010) · 93(2):463-73 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/21159786/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/acetyl-l-carnitine.mdx:62` | author | malaguarnera | Chacko SA |
| `content/compounds/theobromine.mdx:49` | author | mitchell | Chacko SA |
| `lib/data.ts:1051` | author | Mitchell 2011 | Chacko SA |
| `lib/data.ts:1618` | author | Malaguarnera 2011 | Chacko SA |

### `21309862` — Al-Najar A, *Int J Urol* 2011

**Real record:** External validation of the proposed T and N categories of squamous cell carcinoma of the penis

**Real first author:** Al-Najar A · **Journal:** Int J Urol · **Year:** 2011 · 18(4):312-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/21309862/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/rala.mdx:54` | author | ziegler | Al-Najar A |

### `21688839` — Zeng J, *Nano Lett* 2011

**Real record:** Selective sulfuration at the corner sites of a silver nanocrystal and its use in stabilization of the shape

**Real first author:** Zeng J · **Journal:** Nano Lett · **Year:** 2011 · 11(7):3010-5 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/21688839/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/krill-oil.mdx:8` | author | ulven | Zeng J |
| `content/compounds/krill-oil.mdx:23` | author | ulven | Zeng J |
| `content/compounds/krill-oil.mdx:53` | author | ulven | Zeng J |
| `lib/data.ts:1550` | author | ulven | Zeng J |
| `lib/data.ts:1558` | author | Ulven 2011 | Zeng J |

### `21708034` — Debbi EM, *BMC Complement Altern Med* 2011

**Real record:** Efficacy of methylsulfonylmethane supplementation on osteoarthritis of the knee: a randomized controlled study

**Real first author:** Debbi EM · **Journal:** BMC Complement Altern Med · **Year:** 2011 · 11():50 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/21708034/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/msm.mdx:56` | author | brien | Debbi EM |

### `22102734` — Vandepitte J, *J Infect Dis* 2012

**Real record:** Prevalence and correlates of Mycoplasma genitalium infection among female sex workers in Kampala, Uganda

**Real first author:** Vandepitte J · **Journal:** J Infect Dis · **Year:** 2012 (epub 2011) · 205(2):289-96 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22102734/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/astragalus.mdx:17` | author | jesus | Vandepitte J |
| `content/compounds/astragalus.mdx:22` | author | jesus | Vandepitte J |
| `content/compounds/astragalus.mdx:52` | author | bernardes | Vandepitte J |
| `lib/data.ts:1250` | author | Bernardes 2011 | Vandepitte J |

### `22240442` — Reudelhuber TL, *Curr Opin Nephrol Hypertens* 2012

**Real record:** The interaction between prorenin, renin and the (pro)renin receptor: time to rethink the role in hypertension

**Real first author:** Reudelhuber TL · **Journal:** Curr Opin Nephrol Hypertens · **Year:** 2012 · 21(2):137-41 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22240442/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/milk-thistle.mdx:8` | author | loguercio | Reudelhuber TL |
| `content/compounds/milk-thistle.mdx:22` | author | loguercio | Reudelhuber TL |
| `content/compounds/milk-thistle.mdx:50` | author | loguercio | Reudelhuber TL |
| `lib/data.ts:1260` | author | loguercio | Reudelhuber TL |
| `lib/data.ts:1268` | author | Loguercio 2012 | Reudelhuber TL |

### `22452938` — Wallmann B, *Int J Behav Nutr Phys Act* 2012

**Real record:** The perception of the neighborhood environment changes after participation in a pedometer based community intervention

**Real first author:** Wallmann B · **Journal:** Int J Behav Nutr Phys Act · **Year:** 2012 · 9():33 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22452938/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/capsaicin.mdx:19` | author | whiting | Wallmann B |
| `content/compounds/capsaicin.mdx:50` | author | whiting | Wallmann B |
| `lib/data.ts:1070` | author | Whiting 2012 meta | Wallmann B |

### `22576281` — Gauhar R, *Biotechnol Lett* 2012

**Real record:** Heat-processed Gynostemma pentaphyllum extract improves obesity in ob/ob mice by activating AMP-activated protein kinase

**Real first author:** Gauhar R · **Journal:** Biotechnol Lett · **Year:** 2012 · 34(9):1607-16 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22576281/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/gynostemma.mdx:47` | author | yang | Gauhar R |
| `lib/data.ts:886` | author | Yang 2012 | Gauhar R |

### `22591951` — Bachrach RL, *Addict Behav* 2012

**Real record:** Development and initial validation of a measure of motives for pregaming in college students

**Real first author:** Bachrach RL · **Journal:** Addict Behav · **Year:** 2012 · 37(9):1038-45 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22591951/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/ginkgo-biloba.mdx:51` | author | herrschaft | Bachrach RL |
| `lib/data.ts:991` | author | Herrschaft 2012 | Bachrach RL |

### `22690267` — Kaur G, *Chimerism* 2012

**Real record:** Utility of saliva and hair follicles in donor selection for hematopoietic stem cell transplantation and chimerism monitoring

**Real first author:** Kaur G · **Journal:** Chimerism · **Year:** 2012 · 3(1):9-17 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22690267/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/turkey-tail.mdx:21` | author | torkelson | Kaur G |
| `content/compounds/turkey-tail.mdx:53` | author | torkelson | Kaur G |
| `lib/data.ts:1230` | author | Torkelson 2012 | Kaur G |

### `22732208` — Kozanian OO, *Behav Pharmacol* 2012

**Real record:** Ontogeny of methamphetamine-induced and cocaine-induced one-trial behavioral sensitization in preweanling and adolescent rats

**Real first author:** Kozanian OO · **Journal:** Behav Pharmacol · **Year:** 2012 · 23(4):367-79 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22732208/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/l-arginine.mdx:58` | author | ochiai | Kozanian OO |
| `lib/data.ts:1598` | author | Ochiai 2012 | Kozanian OO |

### `22908595` — Cohen LK, *Compend Contin Educ Dent* 2012

**Real record:** Students passionate for global health--dental schools beginning to respond

**Real first author:** Cohen LK · **Journal:** Compend Contin Educ Dent · **Year:** 2012 · 33(7):470-1 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22908595/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/msm.mdx:25` | author | kalman | Cohen LK |
| `content/compounds/msm.mdx:58` | author | kalman | Cohen LK |
| `lib/data.ts:1291` | author | Kalman 2012 | Cohen LK |

### `22945484` — Myrvang H, *Nat Rev Nephrol* 2012

**Real record:** Basic research: role of renal Klotho in mineral metabolism

**Real first author:** Myrvang H · **Journal:** Nat Rev Nephrol · **Year:** 2012 · 8(10):553 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22945484/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/methylfolate.mdx:8` | author | papakostas | Myrvang H |
| `content/compounds/methylfolate.mdx:21` | author | papakostas | Myrvang H |
| `content/compounds/methylfolate.mdx:52` | author | papakostas | Myrvang H |
| `lib/data.ts:1357` | author | papakostas | Myrvang H |
| `lib/data.ts:1365` | author | Papakostas 2012 | Myrvang H |

### `22995673` — Sengupta K, *Lipids Health Dis* 2012

**Real record:** Efficacy and tolerability of a novel herbal formulation for weight management in obese subjects: a randomized double blind placebo controlled clinical study

**Real first author:** Sengupta K · **Journal:** Lipids Health Dis · **Year:** 2012 · 11():122 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22995673/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/reishi.mdx:21` | author | chu | Sengupta K |
| `content/compounds/reishi.mdx:49` | author | chu | Sengupta K |
| `lib/data.ts:1210` | author | Chu 2012 | Sengupta K |

### `23118876` — Wikman H, *PLoS One* 2012

**Real record:** Clinical relevance of loss of 11p15 in primary and metastatic breast cancer: association with loss of PRKCDBP expression in brain metastases

**Real first author:** Wikman H · **Journal:** PLoS One · **Year:** 2012 · 7(10):e47537 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/23118876/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/berberine-supplement-guide/page.tsx:183` | author | Dong H et al. | Wikman H |

### `23320226` — Ryan G, *Case Rep Ophthalmol Med* 2012

**Real record:** Benign fibrous histiocytoma of the conjunctiva

**Real first author:** Ryan G · **Journal:** Case Rep Ophthalmol Med · **Year:** 2012 · 2012():786260 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/23320226/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/bacopa-monnieri.mdx:24` | author | peth | Ryan G |
| `content/compounds/bacopa-monnieri.mdx:54` | author | peth | Ryan G |
| `lib/data.ts:1171` | author | Peth-Nui 2012 | Ryan G |

### `23386705` — Abramovici A, *Evid Based Med* 2013

**Real record:** Network meta-analysis shows that prostaglandin inhibitors and nifedipine are best short-term tocolytics for preterm delivery

**Real first author:** Abramovici A · **Journal:** Evid Based Med · **Year:** 2013 · 18(5):182-3 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/23386705/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/piperine.mdx:51` | author | volak | Abramovici A |
| `lib/data.ts:1131` | author | Volak 2013 | Abramovici A |

### `23407310` — Frank JA, *ISME J* 2013

**Real record:** Structure and function of a cyanophage-encoded peptide deformylase

**Real first author:** Frank JA · **Journal:** ISME J · **Year:** 2013 · 7(6):1150-60 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/23407310/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/theobromine.mdx:48` | author | neufingerl | Frank JA |
| `lib/data.ts:1050` | author | Neufingerl 2013 | Frank JA |

### `23809521` — Hill JN, *J Spinal Cord Med* 2013

**Real record:** Patient and provider perspectives on methicillin-resistant Staphylococcus aureus: a qualitative assessment of knowledge, beliefs, and behavior

**Real first author:** Hill JN · **Journal:** J Spinal Cord Med · **Year:** 2013 · 36(2):82-90 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/23809521/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/hmb.mdx:8` | author | deutz | Hill JN |
| `content/compounds/hmb.mdx:23` | author | deutz | Hill JN |
| `content/compounds/hmb.mdx:54` | author | deutz | Hill JN |
| `lib/data.ts:1513` | author | deutz | Hill JN |
| `lib/data.ts:1521` | author | Deutz 2013 | Hill JN |
| `lib/library-modules.ts:2228` | author | deutz | Hill JN |

### `24074601` — Yu L, *Virology* 2013

**Real record:** Protein-protein interactions among West Nile non-structural proteins and transmembrane complex formation in mammalian cells

**Real first author:** Yu L · **Journal:** Virology · **Year:** 2013 · 446(1-2):365-77 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24074601/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/piperine.mdx:19` | author | kesarwani | Yu L |
| `content/compounds/piperine.mdx:49` | author | kesarwani | Yu L |
| `lib/data.ts:1129` | author | Kesarwani 2013 | Yu L |

### `24086148` — Kennedy SR, *PLoS Genet* 2013

**Real record:** Ultra-sensitive sequencing reveals an age-related increase in somatic mitochondrial mutations that are inconsistent with oxidative damage

**Real first author:** Kennedy SR · **Journal:** PLoS Genet · **Year:** 2013 · 9(9):e1003794 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24086148/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/ginkgo-biloba.mdx:50` | author | amieva | Kennedy SR |
| `lib/data.ts:990` | author | Amieva 2013 | Kennedy SR |

### `24101720` — Chen SY, *J Cell Sci* 2013

**Real record:** Etv5a regulates the proliferation of ventral mesoderm cells and the formation of hemato-vascular derivatives

**Real first author:** Chen SY · **Journal:** J Cell Sci · **Year:** 2013 · 126(Pt 24):5626-34 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24101720/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/bacopa-monnieri.mdx:56` | author | sathyanarayanan | Chen SY |
| `lib/data.ts:1173` | author | Sathyanarayanan 2013 | Chen SY |

### `24127226` — Zhang F, *J Magn Reson Imaging* 2014

**Real record:** Role of magnetic resonance diffusion-weighted imaging in differentiating lacrimal masses

**Real first author:** Zhang F · **Journal:** J Magn Reson Imaging · **Year:** 2014 (epub 2013) · 40(3):641-8 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24127226/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/msm.mdx:25` | author | muizzuddin | Zhang F |
| `content/compounds/msm.mdx:57` | author | muizzuddin | Zhang F |
| `lib/data.ts:1290` | author | Muizzuddin 2013 | Zhang F |

### `24451335` — Balaban B, *PM R* 2014

**Real record:** Gait disturbances in patients with stroke

**Real first author:** Balaban B · **Journal:** PM R · **Year:** 2014 · 6(7):635-42 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24451335/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/acetyl-l-carnitine.mdx:8` | author | wang | Balaban B |
| `content/compounds/acetyl-l-carnitine.mdx:25` | author | wang | Balaban B |
| `content/compounds/acetyl-l-carnitine.mdx:60` | author | wang | Balaban B |
| `lib/data.ts:1607` | author | wang | Balaban B |
| `lib/data.ts:1617` | author | Wang 2014 meta | Balaban B |

### `24548648` — Shang G, *Chemosphere* 2014

**Real record:** Estrogen receptor affinity chromatography: a new method for characterization of novel estrogenic disinfection by-products

**Real first author:** Shang G · **Journal:** Chemosphere · **Year:** 2014 · 104():251-7 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24548648/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/astragalus.mdx:22` | author | xu | Shang G |
| `content/compounds/astragalus.mdx:51` | author | xu | Shang G |
| `lib/data.ts:1249` | author | xu | Shang G |

### `24829546` — Kowdley KV, *Gastroenterol Hepatol (N Y)* 2014

**Real record:** Advances in the diagnosis and treatment of nonalcoholic steatohepatitis

**Real first author:** Kowdley KV · **Journal:** Gastroenterol Hepatol (N Y) · **Year:** 2014 · 10(3):184-6 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24829546/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/superoxide-dismutase.mdx:19` | author | egoumenides | Kowdley KV |
| `content/compounds/superoxide-dismutase.mdx:50` | author | egoumenides | Kowdley KV |
| `lib/data.ts:1110` | author | Egoumenides 2014 | Kowdley KV |

### `24983358` — Lyashchenko AK, *PLoS One* 2014

**Real record:** cAMP control of HCN2 channel Mg2+ block reveals loose coupling between the cyclic nucleotide-gating ring and the pore

**Real first author:** Lyashchenko AK · **Journal:** PLoS One · **Year:** 2014 · 9(7):e101236 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24983358/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/methylcobalamin.mdx:57` | author | bunn | Lyashchenko AK |
| `lib/data.ts:1386` | author | Bunn 2014 review | Lyashchenko AK |

### `25014686` — HPS2-THRIVE Collaborative Group, *N Engl J Med* 2014

**Real record:** Effects of extended-release niacin with laropiprant in high-risk patients

**Real first author:** HPS2-THRIVE Collaborative Group · **Journal:** N Engl J Med · **Year:** 2014 · 371(3):203-12 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/25014686/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/niacin.mdx:23` | author | boden | HPS2-THRIVE Collaborative Group |

### `25017249` — Er V, *Cancer Epidemiol Biomarkers Prev* 2014

**Real record:** Adherence to dietary and lifestyle recommendations and prostate cancer risk in the prostate testing for cancer and treatment (ProtecT) trial

**Real first author:** Er V · **Journal:** Cancer Epidemiol Biomarkers Prev · **Year:** 2014 · 23(10):2066-77 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/25017249/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/pumpkin-seed-oil.mdx:52` | author | nishimura | Er V |
| `lib/data.ts:1091` | author | Nishimura 2014 | Er V |

### `25574023` — Ezenwa VO, *Science* 2015

**Real record:** Epidemiology. Opposite effects of anthelmintic treatment on microbial infection at individual versus population scales

**Real first author:** Ezenwa VO · **Journal:** Science · **Year:** 2015 · 347(6218):175-7 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/25574023/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/chondroitin.mdx:8` | author | fransen | Ezenwa VO |
| `content/compounds/chondroitin.mdx:19` | author | fransen | Ezenwa VO |
| `lib/data.ts:1300` | author | fransen | Ezenwa VO |
| `lib/data.ts:1308` | author | Fransen LEGS 2015 | Ezenwa VO |

### `25874948` — Fleet R, *PLoS One* 2015

**Real record:** Differences in access to services in rural emergency departments of Quebec and Ontario

**Real first author:** Fleet R · **Journal:** PLoS One · **Year:** 2015 · 10(4):e0123746 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/25874948/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/pumpkin-seed-oil.mdx:8` | author | vahlensieck | Fleet R |
| `content/compounds/pumpkin-seed-oil.mdx:19` | author | vahlensieck | Fleet R |
| `content/compounds/pumpkin-seed-oil.mdx:49` | author | vahlensieck | Fleet R |
| `lib/data.ts:1080` | author | vahlensieck | Fleet R |
| `lib/data.ts:1088` | author | Vahlensieck 2015 GRANU | Fleet R |

### `26686842` — Sayers A, *Int J Epidemiol* 2016

**Real record:** Probabilistic record linkage

**Real first author:** Sayers A · **Journal:** Int J Epidemiol · **Year:** 2016 (epub 2015) · 45(3):954-64 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/26686842/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/chondroitin.mdx:8` | author | fransen | Sayers A |
| `content/compounds/chondroitin.mdx:19` | author | hochberg | Sayers A |
| `lib/data.ts:1300` | author | fransen | Sayers A |
| `lib/data.ts:1309` | author | Hochberg MOVES 2016 | Sayers A |

### `26890198` — Volpon LC, *Pediatr Crit Care Med* 2016

**Real record:** Epidemiology and Outcome of Acute Kidney Injury According to Pediatric Risk, Injury, Failure, Loss, End-Stage Renal Disease and Kidney Disease: Improving Global Outcomes Criteria in Critically Ill Children-A Prospective Study

**Real first author:** Volpon LC · **Journal:** Pediatr Crit Care Med · **Year:** 2016 · 17(5):e229-38 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/26890198/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/pea.mdx:8` | author | paladini | Volpon LC |
| `content/compounds/pea.mdx:24` | author | paladini | Volpon LC |
| `content/compounds/pea.mdx:56` | author | paladini | Volpon LC |
| `lib/data.ts:1570` | author | paladini | Volpon LC |
| `lib/data.ts:1578` | author | Paladini 2016 meta | Volpon LC |

### `26914009` — Centeno DC, *Environ Microbiol* 2016

**Real record:** Contrasting strategies used by lichen microalgae to cope with desiccation-rehydration stress revealed by metabolite profiling and cell wall analysis

**Real first author:** Centeno DC · **Journal:** Environ Microbiol · **Year:** 2016 · 18(5):1546-60 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/26914009/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/reishi.mdx:50` | author | klupp | Centeno DC |
| `lib/data.ts:1211` | author | Klupp 2016 meta | Centeno DC |

### `27019027` — Singh NN, *Dev Neurorehabil* 2017

**Real record:** A mindfulness-based intervention for self-management of verbal and physical aggression by adolescents with Prader-Willi syndrome

**Real first author:** Singh NN · **Journal:** Dev Neurorehabil · **Year:** 2017 (epub 2016) · 20(5):253-260 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27019027/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/hmb.mdx:23` | author | kim | Singh NN |
| `content/compounds/hmb.mdx:57` | author | kim | Singh NN |
| `lib/data.ts:1524` | author | Kim 2016 | Singh NN |

### `27080066` — Bhutta ZA, *Soc Sci Med* 2016

**Real record:** What does India need to do to address childhood malnutrition at scale?

**Real first author:** Bhutta ZA · **Journal:** Soc Sci Med · **Year:** 2016 · 157():186-8 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27080066/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mucuna-pruriens.mdx:21` | author | cassani | Bhutta ZA |
| `content/compounds/mucuna-pruriens.mdx:50` | author | cassani | Bhutta ZA |
| `lib/data.ts:1029` | author | Cassani 2016 | Bhutta ZA |

### `27272893` — Delev D, *Acta Neurochir (Wien)* 2016

**Real record:** Vision after trans-sylvian or temporobasal selective amygdalohippocampectomy: a prospective randomised trial

**Real first author:** Delev D · **Journal:** Acta Neurochir (Wien) · **Year:** 2016 · 158(9):1757-65 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27272893/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/reishi.mdx:21` | author | jin | Delev D |
| `content/compounds/reishi.mdx:48` | author | jin | Delev D |
| `lib/data.ts:1209` | author | Jin 2016 Cochrane | Delev D |

### `27409352` — Sun M, *Anal Chem* 2016

**Real record:** Continuous On-Chip Cell Separation Based on Conductivity-Induced Dielectrophoresis with 3D Self-Assembled Ionic Liquid Electrodes

**Real first author:** Sun M · **Journal:** Anal Chem · **Year:** 2016 · 88(16):8264-71 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27409352/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/astragalus.mdx:22` | author | salvador | Sun M |
| `content/compounds/astragalus.mdx:50` | author | salvador | Sun M |
| `lib/data.ts:1248` | author | Salvador 2016 | Sun M |

### `27614638` — Ferrari-Lima AM, *Environ Sci Pollut Res Int* 2017

**Real record:** Perovskite-type titanate zirconate as photocatalyst for textile wastewater treatment

**Real first author:** Ferrari-Lima AM · **Journal:** Environ Sci Pollut Res Int · **Year:** 2017 (epub 2016) · 24(14):12529-12537 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27614638/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/uc-ii.mdx:8` | author | lugo | Ferrari-Lima AM |
| `content/compounds/uc-ii.mdx:21` | author | lugo | Ferrari-Lima AM |
| `content/compounds/uc-ii.mdx:53` | author | lugo | Ferrari-Lima AM |
| `lib/data.ts:1320` | author | lugo | Ferrari-Lima AM |
| `lib/data.ts:1329` | author | Lugo 2016 | Ferrari-Lima AM |

### `28068423` — Chopan M, *PLoS One* 2017

**Real record:** The Association of Hot Red Chili Pepper Consumption and Mortality: A Large Population-Based Cohort Study

**Real first author:** Chopan M · **Journal:** PLoS One · **Year:** 2017 · 12(1):e0169876 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/28068423/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/capsaicin.mdx:19` | author | lv | Chopan M |

### `28282800` — Motalebzadeh J, *Cancer Biomark* 2017

**Real record:** FBLN-4 and BCRP genes as two prognostic markers are downregulated in breast cancer tissue

**Real first author:** Motalebzadeh J · **Journal:** Cancer Biomark · **Year:** 2017 · 19(1):51-55 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/28282800/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/turkey-tail.mdx:54` | author | chay | Motalebzadeh J |
| `lib/data.ts:1231` | author | Chay 2017 | Motalebzadeh J |

### `28379481` — Li M, *Nucleic Acids Res* 2017

**Real record:** The spacer size of I-B CRISPR is modulated by the terminal sequence of the protospacer

**Real first author:** Li M · **Journal:** Nucleic Acids Res · **Year:** 2017 · 45(8):4642-4654 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/28379481/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/chondroitin.mdx:19` | author | reginster | Li M |
| `content/compounds/chondroitin.mdx:49` | author | reginster | Li M |
| `lib/data.ts:1310` | author | Reginster 2017 | Li M |

### `28633094` — Tran PL, *Eur J Obstet Gynecol Reprod Biol* 2017

**Real record:** Impact of management on mortality in patients with invasive cervical cancer in Reunion Island

**Real first author:** Tran PL · **Journal:** Eur J Obstet Gynecol Reprod Biol · **Year:** 2017 · 215():164-170 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/28633094/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mct-oil.mdx:19` | author | vandenberghe | Tran PL |
| `content/compounds/mct-oil.mdx:49` | author | vandenberghe | Tran PL |
| `lib/data.ts:1148` | author | Vandenberghe 2017 | Tran PL |

### `29514097` — Quinn MA, *Cell Rep* 2018

**Real record:** Estrogen Deficiency Promotes Hepatic Steatosis via a Glucocorticoid Receptor-Dependent Mechanism in Mice

**Real first author:** Quinn MA · **Journal:** Cell Rep · **Year:** 2018 · 22(10):2690-2701 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/29514097/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/spermidine-supplement-guide/page.tsx:184` | author | kiechl | Quinn MA |
| `app/spermidine-supplement-guide/page.tsx:303` | author | kiechl | Quinn MA |

### `29659968` — Kim H, *J Nutr* 2018

**Real record:** Healthy Plant-Based Diets Are Associated with Lower Risk of All-Cause Mortality in US Adults

**Real first author:** Kim H · **Journal:** J Nutr · **Year:** 2018 · 148(4):624-631 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/29659968/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/spermidine.mdx:51` | author | kiechl | Kim H |

### `29991564` — Bending D, *EMBO J* 2018

**Real record:** A temporally dynamic Foxp3 autoregulatory transcriptional circuit controls the effector Treg programme

**Real first author:** Bending D · **Journal:** EMBO J · **Year:** 2018 · 37(16): · [PubMed](https://pubmed.ncbi.nlm.nih.gov/29991564/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/comparisons.ts:1008` | author | kiechl | Bending D |

### `30089410` — Ghodsi R, *Ann Clin Biochem* 2019

**Real record:** Carnosine supplementation does not affect serum concentrations of advanced glycation and precursors of lipoxidation end products in autism: a randomized controlled clinical trial

**Real first author:** Ghodsi R · **Journal:** Ann Clin Biochem · **Year:** 2019 (epub 2018) · 56(1):148-154 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30089410/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/l-carnosine.mdx:54` | author | chez | Ghodsi R |

### `30319719` — Louati S, *Dis Markers* 2018

**Real record:** EWSR1 Rearrangement and CD99 Expression as Diagnostic Biomarkers for Ewing/PNET Sarcomas in a Moroccan Population

**Real first author:** Louati S · **Journal:** Dis Markers · **Year:** 2018 · 2018():7971019 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30319719/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/bromelain.mdx:8` | author | guo | Louati S |
| `content/compounds/bromelain.mdx:22` | author | guo | Louati S |
| `content/compounds/bromelain.mdx:53` | author | guo | Louati S |
| `lib/data.ts:1338` | author | guo | Louati S |
| `lib/data.ts:1347` | author | Guo 2018 meta | Louati S |

### `30524290` — Li F, *Front Pharmacol* 2018

**Real record:** EGCG Reduces Obesity and White Adipose Tissue Gain Partly Through AMPK Activation in Mice

**Real first author:** Li F · **Journal:** Front Pharmacol · **Year:** 2018 · 9():1366 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/30524290/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/egcg.mdx:32` | author | sae | Li F |

### `31088732` — Safati AB, *Brain Stimul* 2019

**Real record:** Contextual cues as modifiers of cTBS effects on indulgent eating

**Real first author:** Safati AB · **Journal:** Brain Stimul · **Year:** 2019 · 12(5):1253-1260 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/31088732/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mct-oil.mdx:53` | author | st | Safati AB |
| `lib/data.ts:1152` | author | St-Pierre 2019 | Safati AB |

### `31150038` — Zhang Y , *Nanoscale* 2019

**Real record:** Hybrid vesicles as intracellular reactive oxygen species and nitric oxide generators

**Real first author:** Zhang Y  · **Journal:** Nanoscale · **Year:** 2019 · 11(24):11530-11541 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/31150038/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/hmb.mdx:23` | author | bear | Zhang Y  |
| `content/compounds/hmb.mdx:56` | author | bear | Zhang Y  |
| `lib/data.ts:1523` | author | Bear 2019 meta | Zhang Y  |

### `31375680` — Bae J, *Nat Commun* 2019

**Real record:** Phc2 controls hematopoietic stem and progenitor cell mobilization from bone marrow by repressing Vcam1 expression

**Real first author:** Bae J · **Journal:** Nat Commun · **Year:** 2019 · 10(1):3496 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/31375680/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/sulforaphane-supplement-guide/page.tsx:60` | author | traka | Bae J |

### `32013204` — Nastiti CMRR, *Pharmaceutics* 2020

**Real record:** Novel Nanocarriers for Targeted Topical Skin Delivery of the Antioxidant Resveratrol

**Real first author:** Nastiti CMRR · **Journal:** Pharmaceutics · **Year:** 2020 · 12(2): · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32013204/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/p5p.mdx:56` | author | vazquez | Nastiti CMRR |
| `lib/data.ts:1407` | author | Vazquez 2020 | Nastiti CMRR |

### `32279606` — Wright JR Jr, *J Med Biogr* 2022

**Real record:** Misread and mistaken: Étienne Lancereaux's enduring legacy in the classification of diabetes mellitus

**Real first author:** Wright JR Jr · **Journal:** J Med Biogr · **Year:** 2022 (epub 2020) · 30(1):15-20 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32279606/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/mct-oil.mdx:19` | author | castellano | Wright JR Jr |
| `content/compounds/mct-oil.mdx:50` | author | cunnane | Wright JR Jr |
| `lib/data.ts:1149` | author | Cunnane 2020 | Wright JR Jr |

### `32380763` — Zhang Y, *Antioxidants (Basel)* 2020

**Real record:** Role of Selenoproteins in Redox Regulation of Signaling and the Antioxidant System: A Review

**Real first author:** Zhang Y · **Journal:** Antioxidants (Basel) · **Year:** 2020 · 9(5): · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32380763/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/selenium.mdx:19` | author | loscalzo | Zhang Y |

### `32471043` — Khammanee N, *Int J Environ Res Public Health* 2020

**Real record:** Presence and Health Risks of Obsolete and Emerging Pesticides in Paddy Rice and Soil from Thailand and China

**Real first author:** Khammanee N · **Journal:** Int J Environ Res Public Health · **Year:** 2020 · 17(11): · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32471043/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/pea.mdx:59` | author | cordaro | Khammanee N |
| `lib/data.ts:1579` | author | Cordaro 2020 | Khammanee N |

### `32540634` — Deshpande A, *Sleep Med* 2020

**Real record:** A randomized, double blind, placebo controlled study to evaluate the effects of ashwagandha (Withania somnifera) extract on sleep quality in healthy adults

**Real first author:** Deshpande A · **Journal:** Sleep Med · **Year:** 2020 · 72():28-36 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32540634/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/ashwagandha.mdx:50` | author | langade | Deshpande A |
| `lib/data.ts:784` | author | Langade 2020 | Deshpande A |

### `32650511` — Cicero AFG, *Diseases* 2020

**Real record:** Short-Term Effect of a New Oral Sodium Hyaluronate Formulation on Knee Osteoarthritis: A Double-Blind, Randomized, Placebo-Controlled Clinical Trial

**Real first author:** Cicero AFG · **Journal:** Diseases · **Year:** 2020 · 8(3): · [PubMed](https://pubmed.ncbi.nlm.nih.gov/32650511/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:907` | author | Concia/FS-HA trial 2020 | Cicero AFG |

### `33030563` — Rønn SH, *Osteoporos Int* 2021

**Real record:** The effect of vitamin MK-7 on bone mineral density and microarchitecture in postmenopausal women with osteopenia, a 3-year randomized, placebo-controlled clinical trial

**Real first author:** Rønn SH · **Journal:** Osteoporos Int · **Year:** 2021 (epub 2020) · 32(1):185-191 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/33030563/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/vitamin-k2.mdx:49` | author | r | Rønn SH |

### `33429160` — Lynch JH, *Curr Opin Biotechnol* 2021

**Real record:** Silent constraints: the hidden challenges faced in plant metabolic engineering

**Real first author:** Lynch JH · **Journal:** Curr Opin Biotechnol · **Year:** 2021 · 69():112-117 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/33429160/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/spermidine-supplement-guide/page.tsx:311` | author | wirth | Lynch JH |

### `33704575` — Abraham DA, *Amino Acids* 2021

**Real record:** Effect of L-Carnosine in children with autism spectrum disorders: a systematic review and meta-analysis of randomised controlled trials

**Real first author:** Abraham DA · **Journal:** Amino Acids · **Year:** 2021 · 53(4):575-585 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/33704575/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/l-carnosine.mdx:54` | author | chez | Abraham DA |

### `34432955` — Qiu Y, *Immun Inflamm Dis* 2021

**Real record:** Integrated analysis on the N6-methyladenosine-related long noncoding RNAs prognostic signature, immune checkpoints, and immune cell infiltration in clear cell renal cell carcinoma

**Real first author:** Qiu Y · **Journal:** Immun Inflamm Dis · **Year:** 2021 · 9(4):1596-1612 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/34432955/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/hallmarks/dysbiosis.mdx:43` | author | stanford | Qiu Y |
| `content/hallmarks/dysbiosis.mdx:136` | author | wastyk | Qiu Y |
| `content/lifestyle/nutrition.mdx:19` | author | wastyk | Qiu Y |

### `35367082` — Nyame YA, *Eur Urol* 2022

**Real record:** Deconstructing, Addressing, and Eliminating Racial and Ethnic Inequities in Prostate Cancer Care

**Real first author:** Nyame YA · **Journal:** Eur Urol · **Year:** 2022 · 82(4):341-351 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/35367082/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/methylcobalamin.mdx:58` | author | sun | Nyame YA |
| `lib/data.ts:1387` | author | Sun 2022 | Nyame YA |

### `35443064` — Pauletto P, *Sleep* 2022

**Real record:** Sleep bruxism and obstructive sleep apnea: association, causality or spurious finding? A scoping review

**Real first author:** Pauletto P · **Journal:** Sleep · **Year:** 2022 · 45(7): · [PubMed](https://pubmed.ncbi.nlm.nih.gov/35443064/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/theobromine.mdx:51` | author | sesso | Pauletto P |

### `35594044` — Kwon S, *JAMA Netw Open* 2022

**Real record:** Association of Smartphone Use With Body Image Distortion and Weight Loss Behaviors in Korean Adolescents

**Real first author:** Kwon S · **Journal:** JAMA Netw Open · **Year:** 2022 · 5(5):e2213237 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/35594044/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/spermidine.mdx:53` | author | schwarz | Kwon S |

### `35821844` — Lizzo G, *Front Aging* 2022

**Real record:** A Randomized Controlled Clinical Trial in Healthy Older Adults to Determine Efficacy of Glycine and N-Acetylcysteine Supplementation on Glutathione Redox Status and Oxidative Damage

**Real first author:** Lizzo G · **Journal:** Front Aging · **Year:** 2022 · 3():852569 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/35821844/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/nac.mdx:17` | author | sekhar | Lizzo G |
| `content/compounds/nac.mdx:51` | author | sekhar | Lizzo G |

### `35970308` — Ghosh D, *J Allergy Clin Immunol* 2022

**Real record:** Publicly available cytokine data: Limitations and opportunities

**Real first author:** Ghosh D · **Journal:** J Allergy Clin Immunol · **Year:** 2022 · 150(5):1053-1056 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/35970308/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/glynac-supplement-guide/page.tsx:52` | author | sekhar | Ghosh D |
| `app/glynac-supplement-guide/page.tsx:147` | author | Sekhar RV | Ghosh D |

### `36091752` — Dai N, *Front Pharmacol* 2022

**Real record:** Gynostemma pentaphyllum for dyslipidemia: A systematic review of randomized controlled trials

**Real first author:** Dai N · **Journal:** Front Pharmacol · **Year:** 2022 · 13():917521 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/36091752/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/gynostemma.mdx:46` | author | xie | Dai N |
| `lib/data.ts:885` | author | Xie 2022 systematic review | Dai N |

### `37289936` — , *Plant Physiol* 2023

**Real record:** Correction to: The MYB59 transcription factor negatively regulates salicylic acid- and jasmonic acid-mediated leaf senescence

**Real first author:**  · **Journal:** Plant Physiol · **Year:** 2023 · 193(1):874 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/37289936/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/taurine-supplement-guide/page.tsx:40` | author | singh |  |
| `app/taurine-supplement-guide/page.tsx:126` | author | Singh P, Gollapalli K, Mangiola S et al. |  |

### `38243784` — Huwiler VV, *Thyroid* 2024

**Real record:** Selenium Supplementation in Patients with Hashimoto Thyroiditis: A Systematic Review and Meta-Analysis of Randomized Clinical Trials

**Real first author:** Huwiler VV · **Journal:** Thyroid · **Year:** 2024 · 34(3):295-313 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/38243784/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/selenium.mdx:51` | author | kong | Huwiler VV |

### `38286830` — Karimi K, *Sci Rep* 2024

**Real record:** Subsurface geology detection from application of the gravity-related dimensionality constraint

**Real first author:** Karimi K · **Journal:** Sci Rep · **Year:** 2024 · 14(1):2440 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/38286830/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/trigonelline.mdx:23` | author | auwerx | Karimi K |
| `content/compounds/trigonelline.mdx:53` | author | auwerx | Karimi K |
| `lib/data.ts:1541` | author | Membrez / Auwerx 2024 | Karimi K |
| `lib/library-modules.ts:2249` | author | epfl | Karimi K |

### `38888087` — Cruz-Sanabria F, *J Pineal Res* 2024

**Real record:** Optimizing the Time and Dose of Melatonin as a Sleep-Promoting Drug: A Systematic Review of Randomized Controlled Trials and Dose-Response Meta-Analysis

**Real first author:** Cruz-Sanabria F · **Journal:** J Pineal Res · **Year:** 2024 · 76(5):e12985 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/38888087/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/melatonin.mdx:19` | author | buscemi | Cruz-Sanabria F |

### `40565024` — Mitrović M, *Int J Mol Sci* 2025

**Real record:** Exploring the Potential of Oral Butyrate Supplementation in Metabolic Dysfunction-Associated Steatotic Liver Disease: Subgroup Insights from an Interventional Study

**Real first author:** Mitrović M · **Journal:** Int J Mol Sci · **Year:** 2025 · 26(12): · [PubMed](https://pubmed.ncbi.nlm.nih.gov/40565024/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/butyrate.mdx:19` | author | krokowicz | Mitrović M |
| `lib/data.ts:764` | author | Mitrović 2025 | Mitrović M |

### `40615851` — Hsueh HC, *BMC Complement Med Ther* 2025

**Real record:** Effects of curcumin on serum inflammatory biomarkers in patients with knee osteoarthritis: a systematic review and meta-analysis of randomized controlled trials

**Real first author:** Hsueh HC · **Journal:** BMC Complement Med Ther · **Year:** 2025 · 25(1):237 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/40615851/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/curcumin.mdx:52` | author | wu | Hsueh HC |

### `41422283` — Dolečková I, *Sci Rep* 2025

**Real record:** Oral sodium hyaluronate improves skin hydration, barrier function and signs of aging: a randomized, double-blind, placebo-controlled trial in 150 healthy adults

**Real first author:** Dolečková I · **Journal:** Sci Rep · **Year:** 2025 · 16(1):2941 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/41422283/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/data.ts:904` | author | Dolečková 2025 | Dolečková I |

### `8622245` — Grimm RH Jr, *JAMA* 1996

**Real record:** Long-term effects on plasma lipids of diet and drugs to treat hypertension. Treatment of Mild Hypertension Study (TOMHS) Research Group

**Real first author:** Grimm RH Jr · **Journal:** JAMA · **Year:** 1996 · 275(20):1549-56 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/8622245/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/vitamin-c.mdx:26` | author | rebouche | Grimm RH Jr |

### `11832527` — Knowler WC, *N Engl J Med* 2002

**Real record:** Reduction in the incidence of type 2 diabetes with lifestyle intervention or metformin

**Real first author:** Knowler WC · **Journal:** N Engl J Med · **Year:** 2002 · 346(6):393-403 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/11832527/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/metformin.mdx:20` | year | 1998 | 2002 |

### `19800084` — Zhang H, *Metabolism* 2010

**Real record:** Berberine lowers blood glucose in type 2 diabetes mellitus patients through increasing insulin receptor expression

**Real first author:** Zhang H · **Journal:** Metabolism · **Year:** 2010 (epub 2009) · 59(2):285-92 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/19800084/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/berberine-supplement-guide/page.tsx:94` | year | 2008 | 2010 / 2009 |

### `22768836` — Longo VD, *Cell Metab* 2012

**Real record:** Replicative and chronological aging in Saccharomyces cerevisiae

**Real first author:** Longo VD · **Journal:** Cell Metab · **Year:** 2012 · 16(1):18-31 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/22768836/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `app/hallmarks/page.tsx:218` | year | 2013 | 2012 |

### `24103935` — Radnatarov D, *Opt Express* 2013

**Real record:** Automatic electronic-controlled mode locking self-start in fibre lasers with non-linear polarisation evolution

**Real first author:** Radnatarov D · **Journal:** Opt Express · **Year:** 2013 · 21(18):20626-31 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/24103935/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/buyer-guides.ts:340` | year | 2014 | 2013 |

### `27304507` — Barzilai N, *Cell Metab* 2016

**Real record:** Metformin as a Tool to Target Aging

**Real first author:** Barzilai N · **Journal:** Cell Metab · **Year:** 2016 · 23(6):1060-1065 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/27304507/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `content/compounds/metformin.mdx:20` | year | 1998, 2002 | 2016 |

### `35975308` — Kumar P, *J Gerontol A Biol Sci Med Sci* 2023

**Real record:** Supplementing Glycine and N-Acetylcysteine (GlyNAC) in Older Adults Improves Glutathione Deficiency, Oxidative Stress, Mitochondrial Dysfunction, Inflammation, Physical Function, and Aging Hallmarks: A Randomized Clinical Trial

**Real first author:** Kumar P · **Journal:** J Gerontol A Biol Sci Med Sci · **Year:** 2023 · 78(1):75-89 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/35975308/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:150` | year | 2022 | 2023 |

### `26782228` — Itoh Y, *Adv Exp Med Biol* 2016

**Real record:** Effect of the Antioxidant Supplement Pyrroloquinoline Quinone Disodium Salt (BioPQQ™) on Cognitive Functions

**Real first author:** Itoh Y · **Journal:** Adv Exp Med Biol · **Year:** 2016 · 876():319-325 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/26782228/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `scripts/register-orphan-compounds.mjs:25` | journal | Food Style 21 | Adv Exp Med Biol |

### `34256014` — Wastyk HC, *Cell* 2021

**Real record:** Gut-microbiota-targeted diets modulate human immune status

**Real first author:** Wastyk HC · **Journal:** Cell · **Year:** 2021 · 184(16):4137-4153.e14 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/34256014/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:333` | title | Fermented Foods Increase Microbiome Diversity and Reduce 19 Inflammatory Markers | Gut-microbiota-targeted diets modulate human immune status |

### `36482258` — Yi L, *Geroscience* 2023

**Real record:** The efficacy and safety of β-nicotinamide mononucleotide (NMN) supplementation in healthy middle-aged adults: a randomized, multicenter, double-blind, placebo-controlled, parallel-group, dose-dependent clinical trial

**Real first author:** Yi L · **Journal:** Geroscience · **Year:** 2023 (epub 2022) · 45(1):29-43 · [PubMed](https://pubmed.ncbi.nlm.nih.gov/36482258/)

| Location | Field | Stored | PubMed |
| --- | --- | --- | --- |
| `lib/research-feed.ts:58` | title | NMN Raises Blood NAD+ Dose-Dependently — Peak Effect at 600 mg | The efficacy and safety of β-nicotinamide mononucleotide (NMN) supplementation in healthy middle-aged adults: a randomized, multicenter, double-blind, placebo-controlled, parallel-group, dose-dependent clinical trial |

## Clean

| PMID | First author | Journal | Year | Title | Uses |
| --- | --- | --- | ---: | --- | ---: |
| [10639539](https://pubmed.ncbi.nlm.nih.gov/10639539/) | Heart Outcomes Prevention Evaluation Study Investigators | N Engl J Med | 2000 | Effects of an angiotensin-converting-enzyme inhibitor, ramipril, on cardiovascular events in high-risk patients | 3 |
| [11081987](https://pubmed.ncbi.nlm.nih.gov/11081987/) | Darbinyan V | Phytomedicine | 2000 | Rhodiola rosea in stress induced fatigue--a double blind cross-over study of a standardized extract SHR-5 with a repeated low-dose regimen on the mental performance of healthy physicians during night duty | 4 |
| [11160537](https://pubmed.ncbi.nlm.nih.gov/11160537/) | Qureshi AA | J Nutr | 2001 | Novel tocotrienols of rice bran suppress cholesterogenesis in hereditary hypercholesterolemic swine | 3 |
| [11498727](https://pubmed.ncbi.nlm.nih.gov/11498727/) | Stough C | Psychopharmacology (Berl) | 2001 | The chronic effects of an extract of Bacopa monniera (Brahmi) on cognitive function in healthy human subjects | 5 |
| [11899100](https://pubmed.ncbi.nlm.nih.gov/11899100/) | Tan DX | Curr Top Med Chem | 2002 | Chemical and physical properties and potential mechanisms: melatonin as a broad spectrum antioxidant and free radical scavenger | 1 |
| [11976199](https://pubmed.ncbi.nlm.nih.gov/11976199/) | Reiter RJ | Ann N Y Acad Sci | 2002 | Melatonin reduces oxidant damage and promotes mitochondrial respiration: implications for aging | 2 |
| [12585724](https://pubmed.ncbi.nlm.nih.gov/12585724/) | Chez MG | J Child Neurol | 2002 | Double-blind, placebo-controlled study of L-carnosine supplementation in children with autistic spectrum disorders | 2 |
| [12637119](https://pubmed.ncbi.nlm.nih.gov/12637119/) | De Jesus Moreno Moreno M | Clin Ther | 2003 | Cognitive improvement in mild to moderate Alzheimer's dementia after treatment with the acetylcholine precursor choline alfoscerate: a multicenter, double-blind, randomized, placebo-controlled trial | 3 |
| [14500065](https://pubmed.ncbi.nlm.nih.gov/14500065/) | Minakawa M | Eur J Cardiothorac Surg | 2003 | Restoration of sarcoplasmic reticulum protein level by thyroid hormone contributes to partial improvement of myocardial function, but not to glucose metabolism in an early failing heart | 1 |
| [14633667](https://pubmed.ncbi.nlm.nih.gov/14633667/) | Fang MZ | Cancer Res | 2003 | Tea polyphenol (-)-epigallocatechin-3-gallate inhibits DNA methyltransferase and reactivates methylation-silenced genes in cancer cell lines | 1 |
| [15068981](https://pubmed.ncbi.nlm.nih.gov/15068981/) | Padayatty SJ | Ann Intern Med | 2004 | Vitamin C pharmacokinetics: implications for oral and intravenous use | 3 |
| [15512856](https://pubmed.ncbi.nlm.nih.gov/15512856/) | Hellhammer J | Stress | 2004 | Effects of soy lecithin phosphatidic acid and phosphatidylserine complex (PAS) on the endocrine and psychological responses to mental stress | 2 |
| [15514282](https://pubmed.ncbi.nlm.nih.gov/15514282/) | Geleijnse JM | J Nutr | 2004 | Dietary intake of menaquinone is associated with a reduced risk of coronary heart disease: the Rotterdam Study | 1 |
| [15537682](https://pubmed.ncbi.nlm.nih.gov/15537682/) | Miller ER 3rd | Ann Intern Med | 2005 | Meta-analysis: high-dosage vitamin E supplementation may increase all-cause mortality | 3 |
| [15616239](https://pubmed.ncbi.nlm.nih.gov/15616239/) | Sima AA | Diabetes Care | 2005 | Acetyl-L-carnitine improves pain, nerve regeneration, and vibratory perception in patients with chronic diabetic neuropathy: an analysis of two randomized placebo-controlled trials | 5 |
| [15735277](https://pubmed.ncbi.nlm.nih.gov/15735277/) | Vaardal B | Emerg Med J | 2005 | Have the implementation of a new specialised emergency medical service influenced the pattern of general practitioners involvement in pre-hospital medical emergencies? A study of geographic variations in alerting, dispatch, and response | 1 |
| [15982990](https://pubmed.ncbi.nlm.nih.gov/15982990/) | Reay JL | J Psychopharmacol | 2005 | Single doses of Panax ginseng (G115) reduce blood glucose levels and improve cognitive performance during sustained mental activity | 3 |
| [16309928](https://pubmed.ncbi.nlm.nih.gov/16309928/) | Kim LS | Osteoarthritis Cartilage | 2006 | Efficacy of methylsulfonylmethane (MSM) in osteoarthritis pain of the knee: a pilot clinical trial | 5 |
| [16423108](https://pubmed.ncbi.nlm.nih.gov/16423108/) | Buscemi N | J Gen Intern Med | 2005 | The efficacy and safety of exogenous melatonin for primary sleep disorders. A meta-analysis | 4 |
| [16424063](https://pubmed.ncbi.nlm.nih.gov/16424063/) | Bettuzzi S | Cancer Res | 2006 | Chemoprevention of human prostate cancer by oral administration of green tea catechins in volunteers with high-grade prostate intraepithelial neoplasia: a preliminary report from a one-year proof-of-principle study | 3 |
| [16439621](https://pubmed.ncbi.nlm.nih.gov/16439621/) | Rodriguez-Viciana P | Science | 2006 | Germline mutations in genes within the MAPK pathway cause cardio-facio-cutaneous syndrome | 1 |
| [16495392](https://pubmed.ncbi.nlm.nih.gov/16495392/) | Clegg DO | N Engl J Med | 2006 | Glucosamine, chondroitin sulfate, and the two in combination for painful knee osteoarthritis | 1 |
| [17086191](https://pubmed.ncbi.nlm.nih.gov/17086191/) | Baur JA | Nature | 2006 | Resveratrol improves health and survival of mice on a high-calorie diet | 5 |
| [17344507](https://pubmed.ncbi.nlm.nih.gov/17344507/) | Prasad AS | Am J Clin Nutr | 2007 | Zinc supplementation decreases incidence of infections in the elderly: effect of zinc on generation of cytokines and oxidative stress | 4 |
| [17620655](https://pubmed.ncbi.nlm.nih.gov/17620655/) | Stranges S | Ann Intern Med | 2007 | Effects of long-term selenium supplementation on the incidence of type 2 diabetes: a randomized trial | 4 |
| [17698683](https://pubmed.ncbi.nlm.nih.gov/17698683/) | Cook NR | Arch Intern Med | 2007 | A randomized factorial trial of vitamins C and E and beta carotene in the secondary prevention of cardiovascular events in women: results from the Women's Antioxidant Cardiovascular Study | 2 |
| [18313522](https://pubmed.ncbi.nlm.nih.gov/18313522/) | Finger PT | Int J Radiat Oncol Biol Phys | 2008 | Radiation retinopathy is treatable with anti-vascular endothelial growth factor bevacizumab (Avastin) | 2 |
| [18657483](https://pubmed.ncbi.nlm.nih.gov/18657483/) | Díaz-Feijoo B | J Minim Invasive Gynecol | 2008 | Sentinel lymph node identification and radical hysterectomy with lymphadenectomy in early stage cervical cancer: laparoscopy versus laparotomy | 1 |
| [18662395](https://pubmed.ncbi.nlm.nih.gov/18662395/) | Starks MA | J Int Soc Sports Nutr | 2008 | The effects of phosphatidylserine on endocrine response to moderate intensity exercise | 5 |
| [18667054](https://pubmed.ncbi.nlm.nih.gov/18667054/) | Sengupta K | Arthritis Res Ther | 2008 | A double blind, randomized, placebo controlled study of the efficacy and safety of 5-Loxin for treatment of osteoarthritis of the knee | 3 |
| [18678913](https://pubmed.ncbi.nlm.nih.gov/18678913/) | Chen Q | Proc Natl Acad Sci U S A | 2008 | Pharmacologic doses of ascorbate act as a prooxidant and decrease growth of aggressive tumor xenografts in mice | 3 |
| [18681988](https://pubmed.ncbi.nlm.nih.gov/18681988/) | Owen GN | Nutr Neurosci | 2008 | The combined effects of L-theanine and caffeine on cognitive performance and mood | 1 |
| [18834505](https://pubmed.ncbi.nlm.nih.gov/18834505/) | Kerksick C | J Int Soc Sports Nutr | 2008 | International Society of Sports Nutrition position stand: nutrient timing | 2 |
| [18841280](https://pubmed.ncbi.nlm.nih.gov/18841280/) | Schurgers LJ | Thromb Haemost | 2008 | Matrix Gla-protein: the calcification inhibitor in need of vitamin K | 1 |
| [18844328](https://pubmed.ncbi.nlm.nih.gov/18844328/) | Mori K | Phytother Res | 2009 | Improving effects of the mushroom Yamabushitake (Hericium erinaceus) on mild cognitive impairment: a double-blind placebo-controlled clinical trial | 1 |
| [18959406](https://pubmed.ncbi.nlm.nih.gov/18959406/) | Balogh L | J Agric Food Chem | 2008 | Absorption, uptake and tissue affinity of high-molecular-weight hyaluronan after oral administration in rats and dogs | 4 |
| [18997197](https://pubmed.ncbi.nlm.nih.gov/18997197/) | Sesso HD | JAMA | 2008 | Vitamins E and C in the prevention of cardiovascular disease in men: the Physicians' Health Study II randomized controlled trial | 3 |
| [19016404](https://pubmed.ncbi.nlm.nih.gov/19016404/) | Olsson EM | Planta Med | 2009 | A randomised, double-blind, placebo-controlled, parallel-group study of the standardised extract shr-5 of the roots of Rhodiola rosea in the treatment of subjects with stress-related fatigue | 4 |
| [19017911](https://pubmed.ncbi.nlm.nih.gov/19017911/) | DeKosky ST | JAMA | 2008 | Ginkgo biloba for prevention of dementia: a randomized controlled trial | 3 |
| [19066370](https://pubmed.ncbi.nlm.nih.gov/19066370/) | Lippman SM | JAMA | 2009 | Effect of selenium and vitamin E on risk of prostate cancer and other cancers: the Selenium and Vitamin E Cancer Prevention Trial (SELECT) | 8 |
| [19345947](https://pubmed.ncbi.nlm.nih.gov/19345947/) | Kummerow FA | Atherosclerosis | 2009 | The negative effects of hydrogenated trans fats and what to do about them | 1 |
| [19523191](https://pubmed.ncbi.nlm.nih.gov/19523191/) | Haase H | Immun Ageing | 2009 | The immune system and the impact of zinc during aging | 3 |
| [19593179](https://pubmed.ncbi.nlm.nih.gov/19593179/) | Amsterdam JD | J Clin Psychopharmacol | 2009 | A randomized, double-blind, placebo-controlled trial of oral Matricaria recutita (chamomile) extract therapy for generalized anxiety disorder | 3 |
| [19597519](https://pubmed.ncbi.nlm.nih.gov/19597519/) | Hursel R | Int J Obes (Lond) | 2009 | The effects of green tea on weight loss and weight maintenance: a meta-analysis | 2 |
| [19861415](https://pubmed.ncbi.nlm.nih.gov/19861415/) | Chowanadisai W | J Biol Chem | 2010 | Pyrroloquinoline quinone stimulates mitochondrial biogenesis through cAMP response element-binding protein phosphorylation and increased PGC-1alpha expression | 7 |
| [20021046](https://pubmed.ncbi.nlm.nih.gov/20021046/) | Lalithakumari K | Toxicol Mech Methods | 2006 | Safety and Toxicological Evaluation of a Novel, Standardized 3-O-Acetyl-11-keto-beta-Boswellic Acid (AKBA)-Enriched Boswellia serrata Extract (5-Loxin(R)) | 1 |
| [20061378](https://pubmed.ncbi.nlm.nih.gov/20061378/) | Pacholec M | J Biol Chem | 2010 | SRT1720, SRT2183, SRT1460, and resveratrol are not direct activators of SIRT1 | 1 |
| [20152239](https://pubmed.ncbi.nlm.nih.gov/20152239/) | Ahmadi N | Am J Cardiol | 2010 | Relation of oxidative biomarkers, vascular dysfunction, and progression of coronary artery calcium | 1 |
| [20205737](https://pubmed.ncbi.nlm.nih.gov/20205737/) | Park JS | Nutr Metab (Lond) | 2010 | Astaxanthin decreased oxidative stress and inflammation and enhanced immune response in humans | 4 |
| [2044644](https://pubmed.ncbi.nlm.nih.gov/2044644/) | Berge KG | Eur J Clin Pharmacol | 1991 | Coronary drug project: experience with niacin. Coronary Drug Project Research Group | 5 |
| [20594781](https://pubmed.ncbi.nlm.nih.gov/20594781/) | Ried K | Maturitas | 2010 | Aged garlic extract lowers blood pressure in patients with treated but uncontrolled hypertension: a randomised controlled trial | 1 |
| [20807740](https://pubmed.ncbi.nlm.nih.gov/20807740/) | Valenza M | Proc Natl Acad Sci U S A | 2010 | Neuroprotection and brain cholesterol biosynthesis in Huntington's disease | 2 |
| [20819793](https://pubmed.ncbi.nlm.nih.gov/20819793/) | Flurkey K | J Gerontol A Biol Sci Med Sci | 2010 | Life extension by diet restriction and N-acetyl-L-cysteine in genetically heterogeneous mice | 1 |
| [20847017](https://pubmed.ncbi.nlm.nih.gov/20847017/) | Wandel S | BMJ | 2010 | Effects of glucosamine, chondroitin, or placebo in patients with osteoarthritis of hip or knee: network meta-analysis | 2 |
| [21040626](https://pubmed.ncbi.nlm.nih.gov/21040626/) | Giesbrecht T | Nutr Neurosci | 2010 | The combination of L-theanine and caffeine improves cognitive performance and increases subjective alertness | 1 |
| [21060724](https://pubmed.ncbi.nlm.nih.gov/21060724/) | Sengupta K | Int J Med Sci | 2010 | Comparative efficacy and tolerability of 5-Loxin and AflapinAgainst osteoarthritis of the knee: a double blind, randomized, placebo controlled clinical study | 2 |
| [21068346](https://pubmed.ncbi.nlm.nih.gov/21068346/) | Morand C | Am J Clin Nutr | 2011 | Hesperidin contributes to the vascular protective effects of orange juice: a randomized crossover study in healthy volunteers | 2 |
| [21093467](https://pubmed.ncbi.nlm.nih.gov/21093467/) | Ludy MJ | Physiol Behav | 2011 | The effects of hedonically acceptable red pepper doses on thermogenesis and appetite | 2 |
| [21346065](https://pubmed.ncbi.nlm.nih.gov/21346065/) | Rizza S | J Clin Endocrinol Metab | 2011 | Citrus polyphenol hesperidin stimulates production of nitric oxide in endothelial cells while improving endothelial function and reducing inflammatory markers in patients with metabolic syndrome | 3 |
| [21939549](https://pubmed.ncbi.nlm.nih.gov/21939549/) | Zick SM | BMC Complement Altern Med | 2011 | Preliminary examination of the efficacy and safety of a standardized chamomile extract for chronic primary insomnia: a randomized placebo-controlled pilot study | 2 |
| [21990298](https://pubmed.ncbi.nlm.nih.gov/21990298/) | Klein EA | JAMA | 2011 | Vitamin E and the risk of prostate cancer: the Selenium and Vitamin E Cancer Prevention Trial (SELECT) | 5 |
| [22085343](https://pubmed.ncbi.nlm.nih.gov/22085343/) | AIM-HIGH Investigators | N Engl J Med | 2011 | Niacin in patients with low HDL cholesterol levels receiving intensive statin therapy | 3 |
| [22107967](https://pubmed.ncbi.nlm.nih.gov/22107967/) | Sroubek J | J Immunol Methods | 2012 | The use of Bcl-2 over-expression to stabilize hybridomas specific to the HERG potassium channel | 1 |
| [22222917](https://pubmed.ncbi.nlm.nih.gov/22222917/) | Mocchegiani E | Age (Dordr) | 2013 | Zinc: dietary intake and impact of supplementation on immune function in elderly | 2 |
| [22270875](https://pubmed.ncbi.nlm.nih.gov/22270875/) | Hobson RM | Amino Acids | 2012 | Effects of β-alanine supplementation on exercise performance: a meta-analysis | 1 |
| [22529837](https://pubmed.ncbi.nlm.nih.gov/22529837/) | Bannai M | Front Neurol | 2012 | The effects of glycine on subjective daytime performance in partially sleep-restricted healthy volunteers | 3 |
| [22566526](https://pubmed.ncbi.nlm.nih.gov/22566526/) | Science M | CMAJ | 2012 | Zinc for the treatment of the common cold: a systematic review and meta-analysis of randomized controlled trials | 4 |
| [22673596](https://pubmed.ncbi.nlm.nih.gov/22673596/) | Kawamura T | Nutrition | 2012 | Glycerophosphocholine enhances growth hormone secretion and fat oxidation in young adults | 3 |
| [22724080](https://pubmed.ncbi.nlm.nih.gov/22724080/) | Hardeland R | Aging Dis | 2012 | Melatonin in aging and disease -multiple consequences of reduced secretion, options and limits of treatment | 1 |
| [22738315](https://pubmed.ncbi.nlm.nih.gov/22738315/) | Banasiewicz T | Colorectal Dis | 2013 | Microencapsulated sodium butyrate reduces the frequency of abdominal pain in patients with irritable bowel syndrome | 2 |
| [22746245](https://pubmed.ncbi.nlm.nih.gov/22746245/) | Nunes MA | Curr Alzheimer Res | 2013 | Microdose lithium treatment stabilized cognitive impairment in patients with Alzheimer's disease | 2 |
| [22974472](https://pubmed.ncbi.nlm.nih.gov/22974472/) | Brown ES | J Affect Disord | 2012 | A randomized, double-blind, placebo-controlled trial of citicoline for bipolar and unipolar depression and methamphetamine dependence | 1 |
| [23169470](https://pubmed.ncbi.nlm.nih.gov/23169470/) | Ried K | Eur J Clin Nutr | 2013 | Aged garlic extract reduces blood pressure in hypertensives: a dose-response trial | 1 |
| [23172919](https://pubmed.ncbi.nlm.nih.gov/23172919/) | Escande C | Diabetes | 2013 | Flavonoid apigenin is an inhibitor of the NAD+ ase CD38: implications for cellular NAD+ metabolism, protein acetylation, and treatment of metabolic syndrome | 4 |
| [23284689](https://pubmed.ncbi.nlm.nih.gov/23284689/) | Libri V | PLoS One | 2012 | A pilot randomized, placebo controlled, double blind phase I trial of the novel SIRT1 activator SRT2104 in elderly volunteers | 1 |
| [23439798](https://pubmed.ncbi.nlm.nih.gov/23439798/) | Chandrasekhar K | Indian J Psychol Med | 2012 | A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults | 3 |
| [23471411](https://pubmed.ncbi.nlm.nih.gov/23471411/) | Hubbard BP | Science | 2013 | Evidence for a common mechanism of SIRT1 regulation by allosteric activators | 1 |
| [23525894](https://pubmed.ncbi.nlm.nih.gov/23525894/) | Knapen MH | Osteoporos Int | 2013 | Three-year low-dose menaquinone-7 supplementation helps decrease bone loss in healthy postmenopausal women | 3 |
| [23691095](https://pubmed.ncbi.nlm.nih.gov/23691095/) | Ferracioli-Oda E | PLoS One | 2013 | Meta-analysis: melatonin for the treatment of primary sleep disorders | 4 |
| [23706508](https://pubmed.ncbi.nlm.nih.gov/23706508/) | Bath SC | Lancet | 2013 | Effect of inadequate iodine status in UK pregnant women on cognitive outcomes in their children: results from the Avon Longitudinal Study of Parents and Children (ALSPAC) | 2 |
| [23746838](https://pubmed.ncbi.nlm.nih.gov/23746838/) | López-Otín C | Cell | 2013 | The hallmarks of aging | 2 |
| [23804546](https://pubmed.ncbi.nlm.nih.gov/23804546/) | Park SH | Obesity (Silver Spring) | 2014 | Antiobesity effect of Gynostemma pentaphyllum extract (actiponin): a randomized, double-blind, placebo-controlled trial | 3 |
| [23853635](https://pubmed.ncbi.nlm.nih.gov/23853635/) | Abbasi B | J Res Med Sci | 2012 | The effect of magnesium supplementation on primary insomnia in elderly: A double-blind placebo-controlled clinical trial | 1 |
| [23900241](https://pubmed.ncbi.nlm.nih.gov/23900241/) | Martin-Montalvo A | Nat Commun | 2013 | Metformin improves healthspan and lifespan in mice | 1 |
| [23949208](https://pubmed.ncbi.nlm.nih.gov/23949208/) | Proksch E | Skin Pharmacol Physiol | 2014 | Oral supplementation of specific collagen peptides has beneficial effects on human skin physiology: a double-blind, placebo-controlled study | 1 |
| [24144057](https://pubmed.ncbi.nlm.nih.gov/24144057/) | Díaz-Flores M | Can J Physiol Pharmacol | 2013 | Oral supplementation with glycine reduces oxidative stress in patients with metabolic syndrome, improving their systolic blood pressure | 4 |
| [24231099](https://pubmed.ncbi.nlm.nih.gov/24231099/) | Harris CB | J Nutr Biochem | 2013 | Dietary pyrroloquinoline quinone (PQQ) alters indicators of inflammation and mitochondrial-related metabolism in human subjects | 8 |
| [24239156](https://pubmed.ncbi.nlm.nih.gov/24239156/) | Gliozzi M | Int J Cardiol | 2013 | Bergamot polyphenolic fraction enhances rosuvastatin-induced effect on LDL-cholesterol, LOX-1 expression and protein kinase B phosphorylation in patients with hyperlipidemia | 1 |
| [24252493](https://pubmed.ncbi.nlm.nih.gov/24252493/) | Kongkeaw C | J Ethnopharmacol | 2014 | Meta-analysis of randomized controlled trials on cognitive effects of Bacopa monnieri extract | 2 |
| [24343275](https://pubmed.ncbi.nlm.nih.gov/24343275/) | Krokowicz L | Int J Colorectal Dis | 2014 | Microencapsulated sodium butyrate administered to patients with diverticulosis decreases incidence of diverticulitis--a prospective randomized study | 3 |
| [24359983](https://pubmed.ncbi.nlm.nih.gov/24359983/) | Wilson FP | Adv Chronic Kidney Dis | 2014 | Tumor lysis syndrome: new challenges and recent advances | 1 |
| [24373555](https://pubmed.ncbi.nlm.nih.gov/24373555/) | Magosso E | Nutr J | 2013 | Tocotrienols for normalisation of hepatic echogenic response in nonalcoholic fatty liver: a randomised placebo-controlled clinical trial | 3 |
| [24576864](https://pubmed.ncbi.nlm.nih.gov/24576864/) | Devries MC | Med Sci Sports Exerc | 2014 | Creatine supplementation during resistance training in older adults-a meta-analysis | 4 |
| [24672232](https://pubmed.ncbi.nlm.nih.gov/24672232/) | Kuptniratsaikul V | Clin Interv Aging | 2014 | Efficacy and safety of Curcuma domestica extracts compared with ibuprofen in patients with knee osteoarthritis: a multicenter study | 4 |
| [24683506](https://pubmed.ncbi.nlm.nih.gov/24683506/) | Bavarsad Shahripour R | Brain Behav | 2014 | N-acetylcysteine (NAC) in neurological disorders: mechanisms of action and therapeutic opportunities | 1 |
| [24714520](https://pubmed.ncbi.nlm.nih.gov/24714520/) | Weimer S | Nat Commun | 2014 | D-Glucosamine supplementation extends life span of nematodes and of ageing mice | 4 |
| [24861099](https://pubmed.ncbi.nlm.nih.gov/24861099/) | Khalesi S | Eur J Nutr | 2014 | Green tea catechins and blood pressure: a systematic review and meta-analysis of randomised controlled trials | 2 |
| [24864154](https://pubmed.ncbi.nlm.nih.gov/24864154/) | Cho YH | Evid Based Complement Alternat Med | 2014 | Effect of pumpkin seed oil on hair growth in men with androgenetic alopecia: a randomized, double-blind, placebo-controlled trial | 6 |
| [25004186](https://pubmed.ncbi.nlm.nih.gov/25004186/) | Berk M | J Clin Psychiatry | 2014 | The efficacy of adjunctive N-acetylcysteine in major depressive disorder: a double-blind, randomized, placebo-controlled trial | 3 |
| [25282031](https://pubmed.ncbi.nlm.nih.gov/25282031/) | Mortensen SA | JACC Heart Fail | 2014 | The effect of coenzyme Q10 on morbidity and mortality in chronic heart failure: results from Q-SYMBIO: a randomized double-blind trial | 2 |
| [25313065](https://pubmed.ncbi.nlm.nih.gov/25313065/) | Singh K | Proc Natl Acad Sci U S A | 2014 | Sulforaphane treatment of autism spectrum disorder (ASD) | 1 |
| [25533534](https://pubmed.ncbi.nlm.nih.gov/25533534/) | Kawai N | Neuropsychopharmacology | 2015 | The sleep-promoting and hypothermic effects of glycine are mediated by NMDA receptors in the suprachiasmatic nucleus | 1 |
| [25636220](https://pubmed.ncbi.nlm.nih.gov/25636220/) | Mumme K | J Acad Nutr Diet | 2015 | Effects of medium-chain triglycerides on weight loss and body composition: a meta-analysis of randomized controlled trials | 2 |
| [25694037](https://pubmed.ncbi.nlm.nih.gov/25694037/) | Knapen MH | Thromb Haemost | 2015 | Menaquinone-7 supplementation improves arterial stiffness in healthy postmenopausal women. A double-blind randomised clinical trial | 4 |
| [25754370](https://pubmed.ncbi.nlm.nih.gov/25754370/) | Zhu Y | Aging Cell | 2015 | The Achilles' heel of senescent cells: from transcriptome to senolytic drugs | 2 |
| [25764393](https://pubmed.ncbi.nlm.nih.gov/25764393/) | Lara J | Eur J Nutr | 2016 | Effects of inorganic nitrate and beetroot supplementation on endothelial function: a systematic review and meta-analysis | 1 |
| [25871545](https://pubmed.ncbi.nlm.nih.gov/25871545/) | Pillai VB | Nat Commun | 2015 | Honokiol blocks and reverses cardiac hypertrophy in mice by activating mitochondrial Sirt3 | 1 |
| [25886384](https://pubmed.ncbi.nlm.nih.gov/25886384/) | Cicero AF | Nutr J | 2015 | Short-term effects of a combined nutraceutical of insulin-sensitivity, lipid level and indexes of liver steatosis: a double-blind, randomized, cross-over clinical trial | 3 |
| [25921843](https://pubmed.ncbi.nlm.nih.gov/25921843/) | de Kreutzenberg SV | Nutr Metab Cardiovasc Dis | 2015 | Metformin improves putative longevity effectors in peripheral mononuclear cells from subjects with prediabetes. A randomized controlled trial | 1 |
| [25975988](https://pubmed.ncbi.nlm.nih.gov/25975988/) | Mazzanti G | Arch Toxicol | 2015 | Hepatotoxicity of green tea: an update | 1 |
| [26186647](https://pubmed.ncbi.nlm.nih.gov/26186647/) | Kotsyfakis M | PLoS Negl Trop Dis | 2015 | Correction: Deep Sequencing Analysis of the Ixodes ricinus Haemocytome | 1 |
| [26516911](https://pubmed.ncbi.nlm.nih.gov/26516911/) | Boets E | Nutrients | 2015 | Quantification of in Vivo Colonic Short Chain Fatty Acid Production from Inulin | 3 |
| [26519439](https://pubmed.ncbi.nlm.nih.gov/26519439/) | Liu G | J Alzheimers Dis | 2016 | Efficacy and Safety of MMFS-01, a Synapse Density Enhancer, for Treating Cognitive Impairment in Older Adults: A Randomized, Double-Blind, Placebo-Controlled Trial | 3 |
| [26579537](https://pubmed.ncbi.nlm.nih.gov/26579537/) | Chen C | Biomed Res Int | 2015 | Molecular Imaging with MRI: Potential Application in Pancreatic Cancer | 3 |
| [26609282](https://pubmed.ncbi.nlm.nih.gov/26609282/) | Wankhede S | J Int Soc Sports Nutr | 2015 | Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial | 2 |
| [2671116](https://pubmed.ncbi.nlm.nih.gov/2671116/) | Ferenci P | J Hepatol | 1989 | Randomized controlled trial of silymarin treatment in patients with cirrhosis of the liver | 2 |
| [27040154](https://pubmed.ncbi.nlm.nih.gov/27040154/) | de Courten B | Obesity (Silver Spring) | 2016 | Effects of carnosine supplementation on glucose metabolism: Pilot clinical trial | 2 |
| [27312235](https://pubmed.ncbi.nlm.nih.gov/27312235/) | Strong R | Aging Cell | 2016 | Longer lifespan in male mice treated with a weakly estrogenic agonist, an antioxidant, an α-glucosidase inhibitor or a Nrf2-inducer | 4 |
| [27329332](https://pubmed.ncbi.nlm.nih.gov/27329332/) | Simental-Mendía LE | Pharmacol Res | 2016 | A systematic review and meta-analysis of randomized controlled trials on the effects of magnesium supplementation on insulin sensitivity and glucose control | 3 |
| [27400265](https://pubmed.ncbi.nlm.nih.gov/27400265/) | Ryu D | Nat Med | 2016 | Urolithin A induces mitophagy and prolongs lifespan in C. elegans and increases muscle function in rodents | 3 |
| [27402922](https://pubmed.ncbi.nlm.nih.gov/27402922/) | Zhang X | Hypertension | 2016 | Effects of Magnesium Supplementation on Blood Pressure: A Meta-Analysis of Randomized Double-Blind Placebo-Controlled Trials | 4 |
| [27405810](https://pubmed.ncbi.nlm.nih.gov/27405810/) | Serban MC | J Am Heart Assoc | 2016 | Effects of Quercetin on Blood Pressure: A Systematic Review and Meta-Analysis of Randomized Controlled Trials | 3 |
| [27492975](https://pubmed.ncbi.nlm.nih.gov/27492975/) | Micka A | Int J Food Sci Nutr | 2017 | Effect of consumption of chicory inulin on bowel function in healthy subjects with constipation: a randomized, double-blind, placebo-controlled trial | 2 |
| [27537554](https://pubmed.ncbi.nlm.nih.gov/27537554/) | Zhang H | Medicine (Baltimore) | 2016 | The impact of grape seed extract treatment on blood pressure changes: A meta-analysis of 16 randomized controlled trials | 3 |
| [27785095](https://pubmed.ncbi.nlm.nih.gov/27785095/) | Jensen GS | Integr Blood Press Control | 2016 | Consumption of nattokinase is associated with reduced blood pressure and von Willebrand factor, a cardiovascular risk marker: results from a randomized, double-blind, placebo-controlled, multicenter North American clinical trial | 1 |
| [27797708](https://pubmed.ncbi.nlm.nih.gov/27797708/) | Salden BN | Am J Clin Nutr | 2016 | Randomized clinical trial on the efficacy of hesperidin 2S on validated cardiovascular biomarkers in healthy overweight individuals | 2 |
| [28026137](https://pubmed.ncbi.nlm.nih.gov/28026137/) | Hibi T | J Hepatobiliary Pancreat Sci | 2017 | The "right" way is not always popular: comparison of surgeons' perceptions during laparoscopic cholecystectomy for acute cholecystitis among experts from Japan, Korea and Taiwan | 3 |
| [28319596](https://pubmed.ncbi.nlm.nih.gov/28319596/) | Ashor AW | J Hypertens | 2017 | Medium-term effects of dietary nitrate supplementation on systolic and diastolic blood pressure in adults: a systematic review and meta-analysis | 1 |
| [28378188](https://pubmed.ncbi.nlm.nih.gov/28378188/) | Perrott KM | Geroscience | 2017 | Apigenin suppresses the senescence-associated secretory phenotype and paracrine effects on breast cancer cells | 3 |
| [28615996](https://pubmed.ncbi.nlm.nih.gov/28615996/) | Kreider RB | J Int Soc Sports Nutr | 2017 | International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine | 4 |
| [28776086](https://pubmed.ncbi.nlm.nih.gov/28776086/) | Rena G | Diabetologia | 2017 | The mechanisms of action of metformin | 1 |
| [29138605](https://pubmed.ncbi.nlm.nih.gov/29138605/) | Chilibeck PD | Open Access J Sports Med | 2017 | Effect of creatine supplementation during resistance training on lean tissue mass and muscular strength in older adults: a meta-analysis | 5 |
| [29141968](https://pubmed.ncbi.nlm.nih.gov/29141968/) | Bahadoran Z | Adv Nutr | 2017 | The Nitrate-Independent Blood Pressure-Lowering Effect of Beetroot Juice: A Systematic Review and Meta-Analysis | 1 |
| [29420997](https://pubmed.ncbi.nlm.nih.gov/29420997/) | Houjeghani S | Nutr Res | 2018 | l-Carnosine supplementation attenuated fasting glucose, triglycerides, advanced glycation end products, and tumor necrosis factor-α levels in patients with type 2 diabetes: a double-blind placebo-controlled randomized clinical trial | 2 |
| [29514064](https://pubmed.ncbi.nlm.nih.gov/29514064/) | Rajman L | Cell Metab | 2018 | Therapeutic Potential of NAD-Boosting Molecules: The In Vivo Evidence | 4 |
| [29515203](https://pubmed.ncbi.nlm.nih.gov/29515203/) | Rahnasto-Rilla M | Sci Rep | 2018 | Natural polyphenols as sirtuin 6 modulators | 1 |
| [29599478](https://pubmed.ncbi.nlm.nih.gov/29599478/) | Martens CR | Nat Commun | 2018 | Chronic nicotinamide riboside supplementation is well-tolerated and elevates NAD(+) in healthy middle-aged and older adults | 3 |
| [29661838](https://pubmed.ncbi.nlm.nih.gov/29661838/) | Rossman MJ | Hypertension | 2018 | Chronic Supplementation With a Mitochondrial Antioxidant (MitoQ) Improves Vascular Function in Healthy Older Adults | 1 |
| [29801717](https://pubmed.ncbi.nlm.nih.gov/29801717/) | Aziz N | J Ethnopharmacol | 2018 | Anti-inflammatory effects of luteolin: A review of in vitro, in vivo, and in silico studies | 3 |
| [29907916](https://pubmed.ncbi.nlm.nih.gov/29907916/) | Akbari M | Inflammopharmacology | 2018 | The effects of melatonin supplementation on inflammatory markers among patients with metabolic syndrome or related disorders: a systematic review and meta-analysis of randomized controlled trials | 1 |
| [29941810](https://pubmed.ncbi.nlm.nih.gov/29941810/) | Ito N | Nutrients | 2018 | The Protective Role of Astaxanthin for UV-Induced Skin Deterioration in Healthy People-A Randomized, Double-Blind, Placebo-Controlled Trial | 3 |
| [29947998](https://pubmed.ncbi.nlm.nih.gov/29947998/) | Simental-Mendía M | Rheumatol Int | 2018 | Effect of glucosamine and chondroitin sulfate in symptomatic knee osteoarthritis: a systematic review and meta-analysis of randomized placebo-controlled trials | 1 |
| [29949889](https://pubmed.ncbi.nlm.nih.gov/29949889/) | Kim DU | Nutrients | 2018 | Oral Intake of Low-Molecular-Weight Collagen Peptide Improves Hydration, Elasticity, and Wrinkling in Human Skin: A Randomized, Double-Blind, Placebo-Controlled Study | 1 |
| [30065671](https://pubmed.ncbi.nlm.nih.gov/30065671/) | Couvee S | Front Psychol | 2018 | Structure and Grammaticalization of Serial Verb Constructions in Sign Language of the Netherlands-A Corpus-Based Study | 1 |
| [30250025](https://pubmed.ncbi.nlm.nih.gov/30250025/) | Iachettini S | Cell Death Dis | 2018 | Pharmacological activation of SIRT6 triggers lethal autophagy in human cancer cells | 1 |
| [30345336](https://pubmed.ncbi.nlm.nih.gov/30345336/) | Lim J | Neurol Neuroimmunol Neuroinflamm | 2019 | Seronegative patients form a distinctive subgroup of immune-mediated necrotizing myopathy | 2 |
| [30374165](https://pubmed.ncbi.nlm.nih.gov/30374165/) | Huang Z | Nat Chem Biol | 2018 | Identification of a cellularly active SIRT6 allosteric activator | 1 |
| [30402990](https://pubmed.ncbi.nlm.nih.gov/30402990/) | Tabrizi R | Phytother Res | 2019 | The effects of curcumin-containing supplements on biomarkers of inflammation and oxidative stress: A systematic review and meta-analysis of randomized controlled trials | 3 |
| [30415629](https://pubmed.ncbi.nlm.nih.gov/30415629/) | Manson JE | N Engl J Med | 2019 | Vitamin D Supplements and Prevention of Cancer and Cardiovascular Disease | 4 |
| [30475480](https://pubmed.ncbi.nlm.nih.gov/30475480/) | Castellucci M | Mod Healthc | 2016 | As IT's importance grows, CIO role grows with technology's reach | 2 |
| [30501605](https://pubmed.ncbi.nlm.nih.gov/30501605/) | Mollace V | Endocr Metab Immune Disord Drug Targets | 2019 | Hypoglycemic and Hypolipemic Effects of a New Lecithin Formulation of Bergamot Polyphenolic Fraction: A Double Blind, Randomized, Placebo- Controlled Study | 1 |
| [30548390](https://pubmed.ncbi.nlm.nih.gov/30548390/) | Konopka AR | Aging Cell | 2019 | Metformin inhibits mitochondrial adaptations to aerobic exercise training in older adults | 3 |
| [30616957](https://pubmed.ncbi.nlm.nih.gov/30616957/) | Saeveraas SB | Transfus Apher Sci | 2019 | The use of thromboelastography (TEG) in massively bleeding patients at Haukeland University Hospital 2008-15 | 1 |
| [30616998](https://pubmed.ncbi.nlm.nih.gov/30616998/) | Justice JN | EBioMedicine | 2019 | Senolytics in idiopathic pulmonary fibrosis: Results from a first-in-human, open-label, pilot study | 3 |
| [30632207](https://pubmed.ncbi.nlm.nih.gov/30632207/) | Mohammadi M | Phytother Res | 2019 | Hesperidin, a major flavonoid in orange juice, might not affect lipid profile and blood pressure: A systematic review and meta-analysis of randomized controlled clinical trials | 3 |
| [30796437](https://pubmed.ncbi.nlm.nih.gov/30796437/) | Keum N | Ann Oncol | 2019 | Vitamin D supplementation and total cancer incidence and mortality: a meta-analysis of randomized controlled trials | 3 |
| [30916479](https://pubmed.ncbi.nlm.nih.gov/30916479/) | Miller RA | Aging Cell | 2019 | Glycine supplementation extends lifespan of male and female mice | 1 |
| [30940148](https://pubmed.ncbi.nlm.nih.gov/30940148/) | Djohari N | Harm Reduct J | 2019 | Recall and awareness of gambling advertising and sponsorship in sport in the UK: a study of young people and adults | 1 |
| [30957782](https://pubmed.ncbi.nlm.nih.gov/30957782/) | Goga A | BMJ | 2019 | Is elimination of vertical transmission of HIV in high prevalence settings achievable? | 2 |
| [30971437](https://pubmed.ncbi.nlm.nih.gov/30971437/) | Chambers ES | Gut | 2019 | Dietary supplementation with inulin-propionate ester or inulin improves insulin sensitivity in adults with overweight and obesity with distinct effects on the gut microbiota, plasma metabolome and systemic inflammatory responses: a randomised cross-over trial | 2 |
| [30975980](https://pubmed.ncbi.nlm.nih.gov/30975980/) | Wu YH | Cell Death Dis | 2019 | Akt inhibitor SC66 promotes cell sensitivity to cisplatin in chemoresistant ovarian cancer cells through inhibition of COL11A1 expression | 1 |
| [31088786](https://pubmed.ncbi.nlm.nih.gov/31088786/) | Ma H | BMJ | 2019 | Association of habitual glucosamine use with risk of cardiovascular disease: prospective study in UK Biobank | 4 |
| [31353414](https://pubmed.ncbi.nlm.nih.gov/31353414/) | Mau T | J Gerontol A Biol Sci Med Sci | 2020 | Life-span Extension Drug Interventions Affect Adipose Tissue Inflammation in Aging | 2 |
| [31413233](https://pubmed.ncbi.nlm.nih.gov/31413233/) | Saitsu Y | Biomed Res | 2019 | Improvement of cognitive functions by oral intake of Hericium erinaceus | 1 |
| [31530037](https://pubmed.ncbi.nlm.nih.gov/31530037/) | Ewart D | Connect Tissue Res | 2020 | Naturally occurring osteoarthritis in male mice with an extended lifespan | 2 |
| [31672783](https://pubmed.ncbi.nlm.nih.gov/31672783/) | Smith E | Heart | 2020 | Ergothioneine is associated with reduced mortality and decreased risk of cardiovascular disease | 3 |
| [31707507](https://pubmed.ncbi.nlm.nih.gov/31707507/) | Le Bastard Q | Eur J Clin Microbiol Infect Dis | 2020 | The effects of inulin on gut microbial composition: a systematic review of evidence from human studies | 3 |
| [31805963](https://pubmed.ncbi.nlm.nih.gov/31805963/) | Wang L | J Transl Med | 2019 | Inulin-type fructans supplementation improves glycemic control for the prediabetes and type 2 diabetes populations: results from a GRADE-assessed systematic review and dose-response meta-analysis of 33 randomized controlled trials | 3 |
| [31809615](https://pubmed.ncbi.nlm.nih.gov/31809615/) | Zawieja EE | J Diet Suppl | 2021 | Betaine Supplementation Moderately Increases Total Cholesterol Levels: A Systematic Review and Meta-Analysis | 4 |
| [31844103](https://pubmed.ncbi.nlm.nih.gov/31844103/) | You W | Sci Rep | 2019 | Structural basis for the activation and inhibition of Sirtuin 6 by quercetin and its derivatives | 1 |
| [31844967](https://pubmed.ncbi.nlm.nih.gov/31844967/) | Yari Z | Eur J Nutr | 2020 | The effect of hesperidin supplementation on metabolic profiles in patients with metabolic syndrome: a randomized, double-blind, placebo-controlled clinical trial | 1 |
| [31991029](https://pubmed.ncbi.nlm.nih.gov/31991029/) | Björnsson HK | Liver Int | 2020 | Ashwagandha-induced liver injury: A case series from Iceland and the US Drug-Induced Liver Injury Network | 3 |
| [32253185](https://pubmed.ncbi.nlm.nih.gov/32253185/) | Li ZH | Ann Rheum Dis | 2020 | Associations of regular glucosamine use with all-cause and cause-specific mortality: a large prospective cohort study | 4 |
| [32434539](https://pubmed.ncbi.nlm.nih.gov/32434539/) | Xu R | Nutr J | 2020 | Effect of green tea consumption on blood lipids: a systematic review and meta-analysis of randomized controlled trials | 2 |
| [32582019](https://pubmed.ncbi.nlm.nih.gov/32582019/) | Zhang F | Front Endocrinol (Lausanne) | 2020 | Acarbose With Comparable Glucose-Lowering but Superior Weight-Loss Efficacy to Dipeptidyl Peptidase-4 Inhibitors: A Systematic Review and Network Meta-Analysis of Randomized Controlled Trials | 2 |
| [32625874](https://pubmed.ncbi.nlm.nih.gov/32625874/) | EFSA Panel on Food Additives and Nutrient Sources added to Food (ANS) | EFSA J | 2018 | Scientific opinion on the safety of green tea catechins | 2 |
| [32661681](https://pubmed.ncbi.nlm.nih.gov/32661681/) | Valls RM | Eur J Nutr | 2021 | Effects of hesperidin in orange juice on blood and pulse pressures in mildly hypertensive individuals: a randomized controlled trial (Citrus study) | 3 |
| [32680575](https://pubmed.ncbi.nlm.nih.gov/32680575/) | Yu G | BMC Complement Med Ther | 2020 | Effectiveness of Boswellia and Boswellia extract for osteoarthritis patients: a systematic review and meta-analysis | 3 |
| [32686219](https://pubmed.ncbi.nlm.nih.gov/32686219/) | Kirkland JL | J Intern Med | 2020 | Senolytic drugs: from discovery to translation | 2 |
| [32877690](https://pubmed.ncbi.nlm.nih.gov/32877690/) | Asadi Shahmirzadi A | Cell Metab | 2020 | Alpha-Ketoglutarate, an Endogenous Metabolite, Extends Lifespan and Compresses Morbidity in Aging Mice | 19 |
| [32882837](https://pubmed.ncbi.nlm.nih.gov/32882837/) | Sato FT | Cells | 2020 | Tributyrin Attenuates Metabolic and Inflammatory Changes Associated with Obesity through a GPR109A-Dependent Mechanism | 4 |
| [33865376](https://pubmed.ncbi.nlm.nih.gov/33865376/) | Mah J | BMC Complement Med Ther | 2021 | Oral magnesium supplementation for insomnia in older adults: a Systematic Review & Meta-Analysis | 1 |
| [33888596](https://pubmed.ncbi.nlm.nih.gov/33888596/) | Yoshino M | Science | 2021 | Nicotinamide mononucleotide increases muscle insulin sensitivity in prediabetic women | 12 |
| [33978188](https://pubmed.ncbi.nlm.nih.gov/33978188/) | Nakazaki E | J Nutr | 2021 | Citicoline and Memory Function in Healthy Older Adults: A Randomized, Double-Blind, Placebo-Controlled Clinical Trial | 1 |
| [34110707](https://pubmed.ncbi.nlm.nih.gov/34110707/) | Liu SZ | Physiol Rep | 2021 | Astaxanthin supplementation enhances metabolic adaptation with aerobic training in the elderly | 2 |
| [34203487](https://pubmed.ncbi.nlm.nih.gov/34203487/) | Hsu TF | Nutrients | 2021 | Oral Hyaluronan Relieves Wrinkles and Improves Dry Skin: A 12-Week Double-Blinded, Placebo-Controlled Study | 3 |
| [34238308](https://pubmed.ncbi.nlm.nih.gov/34238308/) | Liao B | J Int Soc Sports Nutr | 2021 | Nicotinamide mononucleotide supplementation enhances aerobic capacity in amateur runners: a randomized, double-blind study | 6 |
| [34323337](https://pubmed.ncbi.nlm.nih.gov/34323337/) | Rao A | J Hum Nutr Diet | 2022 | The effect of an orally-dosed Gynostemma pentaphyllum extract (ActivAMP®) on body composition in overweight, adult men and women: A double-blind, randomised, placebo-controlled study | 3 |
| [34326206](https://pubmed.ncbi.nlm.nih.gov/34326206/) | Brenner C | Science | 2021 | Comment on "Nicotinamide mononucleotide increases muscle insulin sensitivity in prediabetic women" | 1 |
| [34345932](https://pubmed.ncbi.nlm.nih.gov/34345932/) | Cicero AFG | Curr Atheroscler Rep | 2021 | Nutraceuticals in the Management of Dyslipidemia: Which, When, and for Whom? Could Nutraceuticals Help Low-Risk Individuals with Non-optimal Lipid Levels? | 1 |
| [34370338](https://pubmed.ncbi.nlm.nih.gov/34370338/) | Lauritzen ES | Clin Endocrinol (Oxf) | 2021 | Effects of daily administration of melatonin before bedtime on fasting insulin, glucose and insulin sensitivity in healthy adults and patients with metabolic diseases. A systematic review and meta-analysis | 1 |
| [34578794](https://pubmed.ncbi.nlm.nih.gov/34578794/) | Zhou X | Nutrients | 2021 | Systematic Review and Meta-Analysis on the Effects of Astaxanthin on Human Skin Ageing | 3 |
| [34589204](https://pubmed.ncbi.nlm.nih.gov/34589204/) | Birkeland E | J Nutr Sci | 2021 | Effect of inulin-type fructans on appetite in patients with type 2 diabetes: a randomised controlled crossover trial | 2 |
| [34631532](https://pubmed.ncbi.nlm.nih.gov/34631532/) | Clark CA | Front Oncol | 2021 | Harnessing DNA Repair Defects to Augment Immune-Based Therapies in Triple-Negative Breast Cancer | 3 |
| [34708673](https://pubmed.ncbi.nlm.nih.gov/34708673/) | Alanazi RR | Orbit | 2022 | Outcomes of the use of orbital hydrogel expanders in the management of congenital anophthalmia: CT-based orbital parameter analysis | 1 |
| [34715934](https://pubmed.ncbi.nlm.nih.gov/34715934/) | Tian X | Pilot Feasibility Stud | 2021 | Ergothioneine supplementation in people with metabolic syndrome (ErgMS): protocol for a randomised, double-blind, placebo-controlled pilot study | 2 |
| [35026158](https://pubmed.ncbi.nlm.nih.gov/35026158/) | Neale RE | Lancet Diabetes Endocrinol | 2022 | The D-Health Trial: a randomised controlled trial of the effect of vitamin D on mortality | 4 |
| [35056816](https://pubmed.ncbi.nlm.nih.gov/35056816/) | Davinelli S | Molecules | 2022 | Astaxanthin as a Modulator of Nrf2, NF-κB, and Their Crosstalk: Molecular Mechanisms and Possible Clinical Applications | 2 |
| [35082139](https://pubmed.ncbi.nlm.nih.gov/35082139/) | Hahn J | BMJ | 2022 | Vitamin D and marine omega 3 fatty acid supplementation and incident autoimmune disease: VITAL randomized controlled trial | 1 |
| [35294962](https://pubmed.ncbi.nlm.nih.gov/35294962/) | Sesso HD | Am J Clin Nutr | 2022 | Effect of cocoa flavanol supplementation for the prevention of cardiovascular disease events: the COcoa Supplement and Multivitamin Outcomes Study (COSMOS) randomized clinical trial | 1 |
| [35662923](https://pubmed.ncbi.nlm.nih.gov/35662923/) | Hu L | Front Nutr | 2022 | Association of Dietary Magnesium Intake With Leukocyte Telomere Length in United States Middle-Aged and Elderly Adults | 1 |
| [35707855](https://pubmed.ncbi.nlm.nih.gov/35707855/) | Jayarathne HSM | Aging Cell | 2022 | Neuroprotective effects of Canagliflozin: Lessons from aged genetically diverse UM-HET3 mice | 2 |
| [35745211](https://pubmed.ncbi.nlm.nih.gov/35745211/) | Crescenti A | Nutrients | 2022 | Hesperidin Bioavailability Is Increased by the Presence of 2S-Diastereoisomer and Micronization-A Randomized, Crossover and Double-Blind Clinical Trial | 1 |
| [35882295](https://pubmed.ncbi.nlm.nih.gov/35882295/) | Sun YK | Pharmacol Res | 2022 | Progress in the treatment of drug-induced liver injury with natural products | 3 |
| [35939577](https://pubmed.ncbi.nlm.nih.gov/35939577/) | LeBoff MS | N Engl J Med | 2022 | Supplemental Vitamin D and Incident Fractures in Midlife and Older Adults | 1 |
| [35984306](https://pubmed.ncbi.nlm.nih.gov/35984306/) | Prokopidis K | Nutr Rev | 2023 | Effects of creatine supplementation on memory in healthy individuals: a systematic review and meta-analysis of randomized controlled trials | 1 |
| [36017529](https://pubmed.ncbi.nlm.nih.gov/36017529/) | Akhgarjand C | Phytother Res | 2022 | Does Ashwagandha supplementation have a beneficial effect on the management of anxiety and stress? A systematic review and meta-analysis of randomized controlled trials | 3 |
| [36033779](https://pubmed.ncbi.nlm.nih.gov/36033779/) | Ma ML | Front Public Health | 2022 | Efficacy of vitamin K2 in the prevention and treatment of postmenopausal osteoporosis: A systematic review and meta-analysis of randomized controlled trials | 3 |
| [36034775](https://pubmed.ncbi.nlm.nih.gov/36034775/) | Licata A | Front Pharmacol | 2022 | N-Acetylcysteine for Preventing Acetaminophen-Induced Liver Injury: A Comprehensive Review | 1 |
| [36102337](https://pubmed.ncbi.nlm.nih.gov/36102337/) | Baker LD | Alzheimers Dement | 2023 | Effects of cocoa extract and a multivitamin on cognitive function: A randomized clinical trial | 1 |
| [36228194](https://pubmed.ncbi.nlm.nih.gov/36228194/) | Suenkel B | J Med Chem | 2022 | Potent and Specific Activators for Mitochondrial Sirtuins Sirt3 and Sirt5 | 1 |
| [36261810](https://pubmed.ncbi.nlm.nih.gov/36261810/) | Feng J | BMC Complement Med Ther | 2022 | Efficacy and safety of curcuminoids alone in alleviating pain and dysfunction for knee osteoarthritis: a systematic review and meta-analysis of randomized controlled trials | 4 |
| [36581622](https://pubmed.ncbi.nlm.nih.gov/36581622/) | Wu QJ | Signal Transduct Target Ther | 2022 | The sirtuin family in health and disease | 1 |
| [36599349](https://pubmed.ncbi.nlm.nih.gov/36599349/) | López-Otín C | Cell | 2023 | Hallmarks of aging: An expanding universe | 8 |
| [36717385](https://pubmed.ncbi.nlm.nih.gov/36717385/) | Lu XT | Eur J Nutr | 2023 | Effects of low-dose B vitamins plus betaine supplementation on lowering homocysteine concentrations among Chinese adults with hyperhomocysteinemia: a randomized, double-blind, controlled preliminary clinical trial | 4 |
| [36807425](https://pubmed.ncbi.nlm.nih.gov/36807425/) | Tamakoshi M | Food Funct | 2023 | Pyrroloquinoline quinone disodium salt improves brain function in both younger and older adults | 1 |
| [36857968](https://pubmed.ncbi.nlm.nih.gov/36857968/) | Nambiar A | EBioMedicine | 2023 | Senolytics dasatinib and quercetin in idiopathic pulmonary fibrosis: results of a phase I, single-blind, single-center, randomized, placebo-controlled pilot trial on feasibility and tolerability | 3 |
| [37166526](https://pubmed.ncbi.nlm.nih.gov/37166526/) | Yildirim G | Geroscience | 2023 | Long-term effects of canagliflozin treatment on the skeleton of aged UM-HET3 mice | 2 |
| [37289138](https://pubmed.ncbi.nlm.nih.gov/37289138/) | Curry AM | FEBS J | 2023 | Nicotinamide riboside activates SIRT5 deacetylation | 1 |
| [37289866](https://pubmed.ncbi.nlm.nih.gov/37289866/) | Singh P | Science | 2023 | Taurine deficiency as a driver of aging | 10 |
| [37686723](https://pubmed.ncbi.nlm.nih.gov/37686723/) | Serrano JCE | Nutrients | 2023 | Antihypertensive Effects of an Optimized Aged Garlic Extract in Subjects with Grade I Hypertension and Antihypertensive Drug Therapy: A Randomized, Triple-Blind Controlled Trial | 1 |
| [3782631](https://pubmed.ncbi.nlm.nih.gov/3782631/) | Canner PL | J Am Coll Cardiol | 1986 | Fifteen year mortality in Coronary Drug Project patients: long-term benefit with niacin | 3 |
| [38004115](https://pubmed.ncbi.nlm.nih.gov/38004115/) | Nayyar D | Nutrients | 2023 | Gynostemma Pentaphyllum Increases Exercise Performance and Alters Mitochondrial Respiration and AMPK in Healthy Males | 4 |
| [38009035](https://pubmed.ncbi.nlm.nih.gov/38009035/) | Gao YR | Skin Res Technol | 2023 | Oral administration of hyaluronic acid to improve skin conditions via a randomized double-blind clinical test | 2 |
| [38172006](https://pubmed.ncbi.nlm.nih.gov/38172006/) | Hariharan R | Nutr Metab Cardiovasc Dis | 2024 | Carnosine supplementation improves glucose control in adults with pre-diabetes and type 2 diabetes: A randomised controlled trial | 3 |
| [38253184](https://pubmed.ncbi.nlm.nih.gov/38253184/) | Terao I | Ageing Res Rev | 2024 | Comparative efficacy, tolerability and acceptability of donanemab, lecanemab, aducanumab and lithium on cognitive function in mild cognitive impairment and Alzheimer's disease: A systematic review and network meta-analysis | 2 |
| [38325073](https://pubmed.ncbi.nlm.nih.gov/38325073/) | Nasimi Doost Azgomi R | Diabetes Metab Syndr | 2024 | The favorable impacts of cardamom on related complications of diabetes: A comprehensive literature systematic review | 3 |
| [38446314](https://pubmed.ncbi.nlm.nih.gov/38446314/) | Katsube M | Geroscience | 2024 | Ergothioneine promotes longevity and healthy aging in male mice | 2 |
| [38876040](https://pubmed.ncbi.nlm.nih.gov/38876040/) | Zawieja E | Nutr Res | 2024 | Betaine supplementation modulates betaine concentration by methylenetetrahydrofolate reductase genotype, but has no effect on amino acid profile in healthy active males: A randomized placebo-controlled cross-over study | 3 |
| [38908296](https://pubmed.ncbi.nlm.nih.gov/38908296/) | Baltic S | J Nutr Health Aging | 2024 | The impact of six-week dihydrogen-pyrroloquinoline quinone supplementation on mitochondrial biomarkers, brain metabolism, and cognition in elderly individuals with mild cognitive impairment: a randomized controlled trial | 1 |
| [39003477](https://pubmed.ncbi.nlm.nih.gov/39003477/) | Firoozi D | Lipids Health Dis | 2024 | Effects of short-chain fatty acid-butyrate supplementation on expression of circadian-clock genes, sleep quality, and inflammation in patients with active ulcerative colitis: a double-blind randomized controlled trial | 2 |
| [39070254](https://pubmed.ncbi.nlm.nih.gov/39070254/) | Xu C | Front Nutr | 2024 | The effects of creatine supplementation on cognitive function in adults: a systematic review and meta-analysis | 1 |
| [39076715](https://pubmed.ncbi.nlm.nih.gov/39076715/) | Li X | Rev Cardiovasc Med | 2023 | Nattokinase Supplementation and Cardiovascular Risk Factors: A Systematic Review and Meta-Analysis of Randomized Controlled Trials | 1 |
| [39504621](https://pubmed.ncbi.nlm.nih.gov/39504621/) | Peng TR | Gen Hosp Psychiatry | 2024 | Efficacy of N-acetylcysteine for patients with depression: An updated systematic review and meta-analysis | 1 |
| [39531334](https://pubmed.ncbi.nlm.nih.gov/39531334/) | Ancel S | J Clin Invest | 2024 | Nicotinamide and pyridoxine stimulate muscle stem cell expansion and enhance regenerative capacity during aging | 3 |
| [39601362](https://pubmed.ncbi.nlm.nih.gov/39601362/) | Schwarz NA | J Int Soc Sports Nutr | 2024 | Salidroside and exercise performance in healthy active young adults - an exploratory, randomized, double-blind, placebo-controlled study | 3 |
| [39840045](https://pubmed.ncbi.nlm.nih.gov/39840045/) | Lauritzen KH | Front Immunol | 2024 | Apigenin inhibits NLRP3 inflammasome activation in monocytes and macrophages independently of CD38 | 3 |
| [39885119](https://pubmed.ncbi.nlm.nih.gov/39885119/) | Chen M | Nat Commun | 2025 | SLC29A1 and SLC29A2 are human nicotinamide cell membrane transporters | 3 |
| [40005371](https://pubmed.ncbi.nlm.nih.gov/40005371/) | Camillo L | Medicina (Kaunas) | 2025 | Nicotinamide: A Multifaceted Molecule in Skin Health and Beyond | 3 |
| [40158656](https://pubmed.ncbi.nlm.nih.gov/40158656/) | Mansouri F | J Acad Nutr Diet | 2025 | Impact of Resveratrol Supplementation on Human Sirtuin 1: A Grading of Recommendations Assessment, Development and Evaluation-Assessed Systematic Review and Dose-Response Meta-Analysis of Randomized Controlled Trials | 1 |
| [40416147](https://pubmed.ncbi.nlm.nih.gov/40416147/) | Osadchyi V | Cureus | 2025 | Zinc-Induced Copper Deficiency Myeloneuropathy Masquerading as Paraneoplastic Syndrome: A Case Report | 1 |
| [40601216](https://pubmed.ncbi.nlm.nih.gov/40601216/) | Snyder JM | Geroscience | 2026 | End-of-life pathology in UM-HET3 mice treated with 16 α‑hydroxyestradiol or late‑start canagliflozin | 2 |
| [40615903](https://pubmed.ncbi.nlm.nih.gov/40615903/) | Tsao JP | BMC Sports Sci Med Rehabil | 2025 | Effect of astaxanthin supplementation on cycling performance, muscle damage biomarkers and oxidative stress in young adults: a randomized controlled trial | 2 |
| [40911749](https://pubmed.ncbi.nlm.nih.gov/40911749/) | Amin P | J Drugs Dermatol | 2025 | Oral Hyaluronic Acid Supplement: Efficacy in Skin Hydration, Elasticity, and Wrinkle Depth Reduction | 3 |
| [40944179](https://pubmed.ncbi.nlm.nih.gov/40944179/) | Figueroa A | Nutrients | 2025 | Citrulline Supplementation Improves Microvascular Function and Muscle Strength in Middle-Aged and Older Adults with Type 2 Diabetes | 4 |
| [41075523](https://pubmed.ncbi.nlm.nih.gov/41075523/) | Nischang V | Phytomedicine | 2025 | Boswellia serrata extract with low 3O-acetyl-11-keto-β-boswellic acid-content causes efficient lipid mediator class switch | 4 |
| [41323997](https://pubmed.ncbi.nlm.nih.gov/41323997/) | Luo P | Front Nutr | 2025 | Effects of L-citrulline supplementation and watermelon intake on arterial stiffness and endothelial function in middle-aged and older adults: a systematic review and meta-analysis of randomized controlled trials | 4 |
| [41374029](https://pubmed.ncbi.nlm.nih.gov/41374029/) | Kang Y | Nutrients | 2025 | Effects of L-Citrulline Supplementation on Endothelial Function, Arterial Stiffness, and Blood Glucose Level in the Fasted and Acute Hyperglycemic States in Middle-Aged and Older Adults with Type 2 Diabetes | 4 |
| [41770546](https://pubmed.ncbi.nlm.nih.gov/41770546/) | Gildengers AG | JAMA Neurol | 2026 | Low-Dose Lithium for Mild Cognitive Impairment: A Pilot Randomized Clinical Trial | 2 |
| [41811985](https://pubmed.ncbi.nlm.nih.gov/41811985/) | Hou Q | Sci Transl Med | 2026 | Acarbose ameliorates podocyte injury and glomerular lesions in diabetic nephropathy through USP46 activation | 2 |
| [41974937](https://pubmed.ncbi.nlm.nih.gov/41974937/) | Panufnik P | Sci Rep | 2026 | Effect of microencapsulated sodium butyrate on abdominal symptoms and carbohydrate metabolism in patients with type 2 diabetes: a randomized placebo-controlled trial | 2 |
| [8646405](https://pubmed.ncbi.nlm.nih.gov/8646405/) | Sailer ER | Br J Pharmacol | 1996 | Acetyl-11-keto-beta-boswellic acid (AKBA): structure requirements for binding and 5-lipoxygenase inhibitory activity | 3 |
| [8893066](https://pubmed.ncbi.nlm.nih.gov/8893066/) | Martin AE | Am J Health Syst Pharm | 1996 | Acarbose: an alpha-glucosidase inhibitor | 2 |
| [9294217](https://pubmed.ncbi.nlm.nih.gov/9294217/) | Fahey JW | Proc Natl Acad Sci U S A | 1997 | Broccoli sprouts: an exceptionally rich source of inducers of enzymes that protect against chemical carcinogens | 1 |
| [9343463](https://pubmed.ncbi.nlm.nih.gov/9343463/) | Le Bars PL | JAMA | 1997 | A placebo-controlled, double-blind, randomized trial of an extract of Ginkgo biloba for dementia. North American EGb Study Group | 5 |
| [9459468](https://pubmed.ncbi.nlm.nih.gov/9459468/) | Rimm EB | JAMA | 1998 | Folate and vitamin B6 from diet and supplements in relation to risk of coronary heart disease among women | 2 |
| [9619120](https://pubmed.ncbi.nlm.nih.gov/9619120/) | Shoba G | Planta Med | 1998 | Influence of piperine on the pharmacokinetics of curcumin in animals and human volunteers | 6 |
| [9694707](https://pubmed.ncbi.nlm.nih.gov/9694707/) | Kuzminski AM | Blood | 1998 | Effective treatment of cobalamin deficiency with oral cobalamin | 3 |
| [9742977](https://pubmed.ncbi.nlm.nih.gov/9742977/) |  | Lancet | 1998 | Effect of intensive blood-glucose control with metformin on complications in overweight patients with type 2 diabetes (UKPDS 34). UK Prospective Diabetes Study (UKPDS) Group | 2 |
