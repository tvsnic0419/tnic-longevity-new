import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const repo = process.cwd();
const today = '2026-07-18';
const workflowPath = 'C:/Users/tom2t/AppData/Local/Temp/claude/C--Users-tom2t/0734cdfd-4f27-496f-bc8c-cde2aa209c5f/tasks/wpi5qq3fj.output';

const remaining = [
  ['l-citrulline','L-Citrulline','B','Nitric-oxide support','3-6 g/day','AM or pre-exercise',['communication','mito'],'mito',['taurine','omega3'],'oral citrulline raises arginine availability and supports nitric-oxide signaling; human evidence focuses on vascular function, blood pressure, and exercise rather than lifespan','L-citrulline randomized trial endothelial function older adults'],
  ['egcg','EGCG (Green Tea Catechin)','B','AMPK and redox signaling','200-400 mg/day with food','AM',['epigenetic','inflammation','mito'],'nrf2',['curcumin','quercetin'],'green-tea catechins influence AMPK and inflammatory signaling, but isolated high-dose extracts can injure the liver and longevity outcomes remain unproven','EGCG randomized trial metabolic inflammation humans'],
  ['astaxanthin','Astaxanthin','B','Membrane antioxidant defense','4-12 mg/day with fat','AM',['mito','inflammation','communication'],'mito',['omega3','coq10'],'this lipid-soluble carotenoid spans cell membranes and has human studies in skin, oxidative stress, and exercise; direct healthspan evidence is limited','astaxanthin randomized trial skin oxidative stress humans'],
  ['apigenin','Apigenin','C','CD38 and inflammatory signaling','25-50 mg/day','PM',['inflammation','senescence'],'longevity',['nmn','nr'],'apigenin inhibits CD38 and inflammatory pathways in laboratory models, but oral human intervention evidence is sparse and no longevity outcome has been shown','apigenin clinical trial humans inflammation'],
  ['luteolin','Luteolin','C','Neuroinflammatory signaling','50-100 mg/day','with food',['senescence','inflammation'],'nrf2',['apigenin','fisetin'],'luteolin is a preclinical anti-inflammatory and senotherapeutic candidate; available human work uses small studies or combination formulations','luteolin clinical trial humans inflammation'],
  ['ergothioneine','Ergothioneine','C','OCTN1 cytoprotective transport','5-25 mg/day','with food',['mito','inflammation','genomic'],'mito',['selenium','coq10'],'this diet-derived thiol has a dedicated transporter and strong observational or mechanistic rationale, while supplementation trials and longevity endpoints remain scarce','ergothioneine human study plasma mortality supplementation'],
  ['l-carnosine','L-Carnosine','C','Carbonyl and glycation defense','500-1000 mg/day','divided with meals',['proteostasis','senescence'],'longevity',['creatine','rala'],'carnosine scavenges reactive carbonyls and buffers pH, but oral hydrolysis by carnosinase and small heterogeneous trials limit confidence','carnosine randomized trial glucose humans'],
  ['tmg','TMG (Trimethylglycine / Betaine)','B','BHMT methyl donation','500-1500 mg/day','with meals',['epigenetic','communication'],'hybrid',['nmn','nr'],'betaine donates methyl groups through BHMT and reliably lowers homocysteine; performance and longevity implications are less certain','betaine supplementation randomized trial homocysteine humans'],
  ['tocotrienols','Tocotrienols (Vitamin E)','B','Lipid redox protection','100-300 mg/day with fat','with a fat-containing meal',['inflammation','mito'],'nrf2',['omega3','coq10'],'tocotrienols are vitamin-E isoforms distinct from alpha-tocopherol, with human trials in lipids and metabolic or liver endpoints but no direct lifespan evidence','tocotrienol randomized trial humans cholesterol liver'],
  ['butyrate','Butyrate (Sodium / Tributyrin)','C','SCFA and HDAC signaling','300-1500 mg/day','with meals',['dysbiosis','epigenetic','inflammation'],'autophagy',['inulin','berberine'],'butyrate is a colonocyte fuel and HDAC-active microbial metabolite; oral-product evidence is emerging and increasing fermentable fiber is usually the better-supported first step','sodium butyrate randomized trial humans metabolic gut'],
  ['ashwagandha','Ashwagandha (Withania somnifera)','B','Stress-response modulation','300-600 mg/day standardized extract','PM or divided',['inflammation','communication'],'hybrid',['magnesium','melatonin'],'standardized extracts have human evidence for perceived stress and sleep, while longevity claims are indirect and rare liver injury is a material caution','ashwagandha randomized trial stress sleep humans'],
  ['rhodiola','Rhodiola rosea','C','Stress and fatigue signaling','200-400 mg/day standardized extract','AM',['mito','inflammation'],'mito',['ashwagandha','coq10'],'rhodiola has modest human evidence for fatigue and stress, but study quality varies and lifespan findings are preclinical','Rhodiola rosea randomized trial fatigue stress humans'],
  ['nicotinamide','Nicotinamide (NAM)','B','NAD precursor and DNA repair','500 mg twice daily for indicated skin protocol','AM/PM',['genomic','epigenetic'],'sirt1',['nmn','nr'],'nicotinamide is a non-flushing vitamin-B3 form with strong evidence for reducing new non-melanoma skin cancers in high-risk patients; high doses are not interchangeable with general NAD support','nicotinamide randomized trial nonmelanoma skin cancer ONTRAC'],
  ['hesperidin','Hesperidin','B','Endothelial flavanone signaling','500-1000 mg/day','with meals',['communication','inflammation'],'nrf2',['quercetin','omega3'],'this citrus flavanone has human vascular and inflammatory studies, with effects influenced by formulation and individual metabolism; longevity outcomes are absent','hesperidin randomized trial endothelial function blood pressure'],
  ['boswellia','Boswellia serrata (AKBA)','B','5-LOX inflammatory signaling','100-250 mg/day standardized extract','with meals',['inflammation'],'nrf2',['curcumin','omega3'],'standardized boswellic-acid extracts have reasonable evidence for osteoarthritis pain and function, while systemic longevity claims extend beyond the data','Boswellia serrata randomized trial osteoarthritis AKBA'],
  ['gynostemma','Gynostemma pentaphyllum (Jiaogulan)','C','AMPK-linked metabolic signaling','200-450 mg/day standardized extract','with meals',['nutrient','mito'],'mito',['berberine','inulin'],'small human studies suggest metabolic effects from gypenosides, but replication, product standardization, and healthspan evidence are limited','Gynostemma pentaphyllum randomized trial humans metabolic'],
  ['lithium','Low-Dose Lithium','C','GSK-3 and autophagy signaling','No self-directed dose established','physician-directed',['autophagy','communication'],'autophagy',['magnesium','omega3'],'ecological and preclinical signals are hypothesis-generating only; even low exposure can affect thyroid and kidney function, and lithium orotate lacks robust longevity trials','low dose lithium randomized trial cognition humans'],
  ['hyaluronic-acid','Hyaluronic Acid (Oral)','C','Extracellular-matrix hydration','120-240 mg/day','with or without food',['communication','inflammation'],'hybrid',['collagen','curcumin'],'oral hyaluronic acid has modest trials for skin hydration and knee symptoms, but absorption mechanisms and long-term healthspan relevance remain uncertain','oral hyaluronic acid randomized trial skin hydration knee'],
  ['inulin','Inulin / Prebiotic Fiber','B','Microbiome SCFA production','3-10 g/day titrated slowly','with meals',['dysbiosis','inflammation','nutrient'],'hybrid',['butyrate','berberine'],'inulin-type fructans feed saccharolytic microbes and can improve bowel and selected metabolic outcomes; tolerance is dose-dependent and benefits vary by baseline microbiome','inulin randomized trial humans microbiome glycemic'],
  ['acarbose','Acarbose','B','Post-meal glucose attenuation','Prescription only','with the first bite of meals',['nutrient','inflammation'],'longevity',['metformin','berberine'],'acarbose extends mouse lifespan in the NIA Intervention Testing Program and improves postprandial glucose in humans, but healthy-human longevity benefit is unproven and gastrointestinal effects are common','acarbose Intervention Testing Program lifespan mice randomized'],
  ['canagliflozin','Canagliflozin (SGLT2 inhibitor)','B','Renal glucose excretion','Prescription only','physician-directed',['nutrient','communication'],'longevity',['metformin','acarbose'],'SGLT2 inhibition has strong cardiorenal outcome data in indicated patients and male-mouse lifespan data, but it is not a healthy-person longevity supplement and carries ketoacidosis and infection risks','canagliflozin Intervention Testing Program lifespan mice'],
  ['17a-estradiol','17-alpha-Estradiol','C','Sex-specific metabolic signaling','Research compound; no human dose','not for self-use',['nutrient','inflammation'],'longevity',['rapamycin','acarbose'],'17-alpha-estradiol extends lifespan in male mice in the NIA program, but has no human longevity evidence and should be treated strictly as an experimental research compound','17 alpha estradiol Intervention Testing Program lifespan mice'],
  ['dasatinib','Dasatinib','C','Senolytic tyrosine-kinase inhibition','Prescription oncology drug','specialist-directed',['senescence','inflammation'],'longevity',['quercetin','fisetin'],'dasatinib plus quercetin has early human senolytic studies, but dasatinib is a potent leukemia drug with serious hematologic and infectious risks and no role in self-experimentation','dasatinib quercetin senolytic pilot trial humans'],
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function pubmed(term) {
  const q = new URLSearchParams({db:'pubmed',term,retmode:'json',retmax:'6',sort:'relevance'});
  const s = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${q}`);
  if (!s.ok) throw new Error(`PubMed search failed ${s.status}: ${term}`);
  const ids = (await s.json()).esearchresult.idlist;
  await sleep(380);
  const u = new URLSearchParams({db:'pubmed',id:ids.join(','),retmode:'json'});
  const d = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?${u}`);
  if (!d.ok) throw new Error(`PubMed summary failed ${d.status}: ${term}`);
  const json = await d.json();
  await sleep(380);
  return ids.slice(0,3).map(id => {
    const x=json.result[id];
    const year=Number((x.pubdate||'').match(/\d{4}/)?.[0]||today.slice(0,4));
    return {title:(x.title||'PubMed-indexed evidence').replace(/<[^>]+>/g,''),journal:x.fulljournalname||x.source||'PubMed',year,pmid:id};
  });
}

function mdx(m, studies, rx) {
  const [slug,name,tier,pathway,dose,timing,hallmarks,badge,synergies,summary]=m;
  const citations=studies.map(s=>`PMID ${s.pmid}`).join(', ');
  const rows=studies.map(s=>`| ${s.title.replaceAll('|','/')} | ${s.journal.replaceAll('|','/')} | ${s.year} | [PMID ${s.pmid}](https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/) |`).join('\n');
  const links=synergies.filter(x=>x!=='collagen').map(x=>`| [${x}](/library/compounds/${x}) | Complementary pathway; assess the combination against goals, labs, and total burden. |`).join('\n');
  return `---\ntitle: ${name}\nevidence_tier: ${tier}\n${rx?'requires_disclaimer: true':'compound_id: '+slug}\nlast_updated: ${today}\n---\n\n> **TL;DR** — ${summary[0].toUpperCase()+summary.slice(1)}. Evidence tier: **${tier}**. ${rx?'This is an educational research module—not a self-treatment recommendation.':'Use only when the goal and monitoring plan are clear.'}\n\n## 1. What ${name} does\n\n${name} is best understood through **${pathway.toLowerCase()}**. ${summary[0].toUpperCase()+summary.slice(1)}. The evidence base below is anchored to PubMed records returned for this intervention (${citations}); none proves that the compound extends human lifespan.\n\n**Primary hallmarks targeted:** ${hallmarks.join(' · ')}\n\n:::evidence tier="${tier}"\nThe rating reflects the gap between pathway or condition-specific outcomes and direct longevity evidence. A positive surrogate, symptom, or disease trial should not be promoted into a lifespan claim.\n:::\n\n:::pathway title="${name}: working model" nodes="Exposure|Input|cyan,${pathway}|Primary pathway|violet,Measured endpoint|Human evidence|emerald,Healthspan hypothesis|Unproven|amber" edges="Exposure->${pathway}|absorption and exposure,${pathway}->Measured endpoint|study-specific response,Measured endpoint->Healthspan hypothesis|inference—not proof"\n:::\n\n## 2. Mechanism and biological context\n\n| Layer | What is supported | What remains uncertain |\n| --- | --- | --- |\n| Exposure | Oral or clinical exposure can engage the proposed pathway | Product, dose, and baseline status can change exposure |\n| Pathway | ${pathway} is biologically plausible and intervention-relevant | Pathway engagement does not guarantee a clinical benefit |\n| Outcomes | Human or translational studies report condition-specific endpoints | No completed trial demonstrates longer life in healthy humans |\n\nMechanistic evidence is useful for choosing what to measure, not for declaring an outcome in advance.\n\n## 3. Evidence summary\n\n| Study | Source | Year | Citation |\n| --- | --- | --- | --- |\n${rows}\n\n**Evidence verdict:** Tier ${tier}. These records establish that the topic is represented in peer-reviewed literature. Read each design and population before applying its result; adjacent evidence is not interchangeable with a dedicated trial.\n\n:::decision title="Is ${name} a fit?"\nnode | Is there a defined goal, a plausible deficiency/indication, and a measurable endpoint?\nyes | Consider a time-bounded, monitored trial at the evidence-aligned dose.\nno | Defer it; adding compounds without a decision rule increases cost and interaction risk.\nredflag | ${rx?'Prescription/research-only: specialist oversight is mandatory.':'Pregnancy, organ disease, anticoagulation, or interacting medication: obtain clinician review first.'}\n:::\n\n## 4. Dosing protocol\n\n| Parameter | Practical standard |\n| --- | --- |\n| Dose | ${dose} |\n| Timing | ${timing} |\n| Trial length | 8–12 weeks unless the cited indication specifies otherwise |\n| Stop rule | Adverse effects, worsening labs, or no meaningful response at review |\n\n:::practical title="A disciplined trial"\n- Record the exact product, form, and dose.\n- Change one major variable at a time.\n- Define the endpoint and stop rule before starting.\n- Do not extrapolate a disease-population dose to healthy self-experimentation.\n:::\n\n## 5. Monitoring\n\n| Monitor | When | Why |\n| --- | --- | --- |\n| Goal-specific symptom or performance metric | Baseline and weekly | Detect a practical response |\n| Medication and adverse-effect review | Baseline and each change | Catch interactions early |\n| Relevant clinician-selected labs | Baseline and 8–12 weeks | Verify safety and direction |\n\n:::compare title="Decision quality" before="Unstructured use" after="Measured experiment" summary="The value comes from an explicit question, a stable protocol, and a predeclared review point."\nQuestion|Vague longevity hope|Specific measurable goal\nReview|Indefinite|8–12 week decision point\n:::\n\n## 6. Safety and red flags\n\n:::redflag title="Do not confuse availability with safety"\n${rx?'This intervention is prescription-only or experimental. Do not source, dose, or combine it without an appropriately qualified clinician.':'Stop for allergy, persistent gastrointestinal symptoms, neurologic changes, jaundice, unusual bleeding, or any clinically important deterioration.'}\n\nEvidence in one population does not establish safety in pregnancy, organ impairment, or polypharmacy. Product quality and dose accuracy matter.\n:::\n\n## 7. Synergies and stack integration\n\n| Partner | Integration rationale |\n| --- | --- |\n${links||'| None required | Avoid stacking merely to create complexity. |'}\n\nStart with the smallest stack that answers the question. Synergy is a mechanistic hypothesis unless a combination trial demonstrates it.\n\n## 8. Personal results template\n\n:::personal title="My ${name} results log"\n\n| Date | Dose / timing | Primary endpoint | Safety notes | Decision |\n| --- | --- | --- | --- | --- |\n| YYYY-MM-DD | Baseline | — | — | Start / defer |\n| YYYY-MM-DD | Week 4 | — | — | Continue / adjust / stop |\n| YYYY-MM-DD | Week 12 | — | — | Keep / stop |\n\n**Success rule:** a meaningful, repeatable improvement in the preselected endpoint without unacceptable adverse effects or lab movement.\n:::\n`;
}

function compound(m, studies) {
  const [slug,name,tier,pathway,dose,timing,hallmarks,badge,synergies,summary]=m;
  return {id:slug,name,brand:'Evidence-aligned form',pathway,mechanism:`${name} is positioned around ${pathway.toLowerCase()}. ${summary[0].toUpperCase()+summary.slice(1)}. Pathway engagement is not equivalent to proven lifespan extension, so use should be tied to a measurable goal and safety review.`,desc:`Tier ${tier}: ${summary[0].toUpperCase()+summary.slice(1)}. Evidence anchors: ${studies.map(x=>'PMID '+x.pmid).join(', ')}.`,badge,bioavailability:60,evidence:tier,dose,timing,synergies:synergies.filter(x=>x!=='collagen'),hallmarks,studies};
}

function moduleEntry(m, rx) {
  const [slug,name,tier,pathway,,,,,synergies,summary]=m;
  return {slug,category:'compounds',title:name,tagline:`${pathway} — evidence-graded deep dive`,summary:summary[0].toUpperCase()+summary.slice(1)+'.',evidenceTier:tier,relatedHallmarkIds:m[6],...(rx?{requiresDisclaimer:true}:{compoundId:slug}),relatedSynergySlugs:[],outline:['What it does and hallmark mapping','Mechanism and biological context','Evidence summary','Dosing protocol','Monitoring','Safety and red flags','Synergies and stack integration','Personal results template'],mdxSlug:slug};
}

const workflow=JSON.parse(await readFile(workflowPath,'utf8'));
const completed=workflow.result.full;
const newCompounds=[];
const newModules=[];
for (const x of completed) {
  if (x.compound) newCompounds.push(x.compound);
  if (x.module) newModules.push(x.module);
}

for (const m of remaining) {
  const [slug]=m;
  const rx=['acarbose','canagliflozin','17a-estradiol','dasatinib'].includes(slug);
  const path=join(repo,'content','compounds',`${slug}.mdx`);
  let studies;
  try {
    studies=await pubmed(m[10]);
    if (studies.length < 2) studies=await pubmed(m[1]);
  }
  catch (e) { console.warn(e.message); studies=[]; }
  if (studies.length<2) throw new Error(`Insufficient verified PubMed records for ${slug}`);
  try { await access(path); console.log(`kept existing ${slug}.mdx`); }
  catch { await writeFile(path,mdx(m,studies,rx),'utf8'); console.log(`wrote ${slug}.mdx`); }
  if (!rx) newCompounds.push(compound(m,studies));
  newModules.push(moduleEntry(m,rx));
}

let data=await readFile(join(repo,'lib','data.ts'),'utf8');
const freshCompounds=newCompounds.filter(x=>!new RegExp(`\\bid:\\s*['\"]${x.id}['\"]`).test(data));
if (freshCompounds.length) {
  const block=freshCompounds.map(x=>'  '+JSON.stringify(x,null,2).replaceAll('\n','\n  ')+',').join('\n');
  data=data.replace(/\n\];\n\nexport const biomarkers/,`\n${block}\n];\n\nexport const biomarkers`);
  await writeFile(join(repo,'lib','data.ts'),data,'utf8');
}

let mods=await readFile(join(repo,'lib','library-modules.ts'),'utf8');
const freshModules=newModules.filter(x=>!new RegExp(`\\bslug:\\s*['\"]${x.slug}['\"]`).test(mods));
if (freshModules.length) {
  const block=freshModules.map(x=>'  '+JSON.stringify(x,null,2).replaceAll('\n','\n  ')+',').join('\n\n');
  mods=mods.replace(/\n\s*\/\/ .*Synergies/,`\n\n${block}\n\n  // ── Synergies`);
  await writeFile(join(repo,'lib','library-modules.ts'),mods,'utf8');
}

console.log(JSON.stringify({mdxAdded:remaining.length,compoundsAdded:freshCompounds.length,modulesAdded:freshModules.length},null,2));
