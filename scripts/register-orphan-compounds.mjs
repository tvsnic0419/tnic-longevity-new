import { readFile, writeFile } from 'node:fs/promises';

const dataFile = new URL('../lib/data.ts', import.meta.url);
const modulesFile = new URL('../lib/library-modules.ts', import.meta.url);
const compounds = [
  {
    id:'selenium',name:'Selenium',brand:'Selenomethionine',pathway:'Selenoprotein Redox Defense',
    mechanism:'Selenium is incorporated into glutathione peroxidases, thioredoxin reductases, and thyroid deiodinases. These enzymes depend on adequate selenium, but their activity plateaus at sufficiency, creating a narrow benefit window. Additional intake above sufficiency can add toxicity without improving antioxidant capacity.',
    desc:'Tier B for correcting insufficiency, not for general longevity. SELECT found no cancer-prevention benefit in largely replete men (PMID 19066370), while randomized and meta-analytic evidence raises a type-2-diabetes concern at high intake (PMIDs 17620655, 29974401).',
    badge:'nrf2',bioavailability:80,evidence:'B',dose:'55-100 mcg/day; avoid chronic 200 mcg without indication',timing:'with food',synergies:['zinc','nac'],hallmarks:['genomic','inflammation'],
    studies:[
      {title:'Effect of selenium and vitamin E on risk of prostate cancer and other cancers: SELECT',journal:'JAMA',year:2009,pmid:'19066370'},
      {title:'Effects of long-term selenium supplementation on the incidence of type 2 diabetes',journal:'Ann Intern Med',year:2007,pmid:'17620655'},
      {title:'Selenium for preventing cancer',journal:'Cochrane Database Syst Rev',year:2018,pmid:'29974401'},
    ],
  },
  {
    id:'pqq',name:'PQQ (Pyrroloquinoline Quinone)',brand:'BioPQQ',pathway:'PGC-1alpha Mitochondrial Signaling',
    mechanism:'PQQ is a redox-active quinone proposed to signal through CREB and PGC-1alpha. Cell work supports mitochondrial-biogenesis markers, but human evidence consists of small pilots that do not establish mitochondrial renewal or longevity. It therefore belongs in an experimental, endpoint-driven tier rather than a foundational stack.',
    desc:'Tier C: a 10-person crossover reported inflammatory and metabolic-marker shifts (PMID 24231099), while small cognition trials provide preliminary rather than decisive evidence (PMIDs 26782228, 36807425). No human longevity endpoint has been demonstrated.',
    badge:'mito',bioavailability:60,evidence:'C',dose:'10-20 mg/day',timing:'AM',synergies:['coq10','creatine'],hallmarks:['mito','inflammation'],
    studies:[
      {title:'Pyrroloquinoline quinone stimulates mitochondrial biogenesis through cAMP response element-binding protein phosphorylation',journal:'J Biol Chem',year:2010,pmid:'19861415'},
      {title:'Dietary pyrroloquinoline quinone alters indicators of inflammation and mitochondrial-related metabolism in human subjects',journal:'J Nutr Biochem',year:2013,pmid:'24231099'},
      {title:'Effect of oral supplementation with pyrroloquinoline quinone on stress, fatigue, and sleep',journal:'Food Style 21',year:2016,pmid:'26782228'},
    ],
  },
];
const modules = compounds.map(c => ({slug:c.id,category:'compounds',title:c.name,tagline:`${c.pathway} — evidence-graded deep dive`,summary:c.desc,evidenceTier:c.evidence,relatedHallmarkIds:c.hallmarks,compoundId:c.id,relatedSynergySlugs:[],outline:['What it does and hallmark mapping','Mechanism and biological context','Evidence summary','Dosing protocol','Monitoring','Safety and red flags','Synergies and stack integration','Personal results template'],mdxSlug:c.id}));

let data=await readFile(dataFile,'utf8');
const add=compounds.filter(c=>!new RegExp(`\\bid:\\s*['\"]${c.id}['\"]`).test(data));
if(add.length){const block=add.map(x=>'  '+JSON.stringify(x,null,2).replaceAll('\n','\n  ')+',').join('\n');data=data.replace(/\n\];\n\nexport const biomarkers/,`\n${block}\n];\n\nexport const biomarkers`);await writeFile(dataFile,data,'utf8');}
let source=await readFile(modulesFile,'utf8');
const modAdd=modules.filter(c=>!new RegExp(`\\bslug:\\s*['\"]${c.slug}['\"]`).test(source)&&!source.includes(`"slug": "${c.slug}"`));
if(modAdd.length){const block=modAdd.map(x=>'  '+JSON.stringify(x,null,2).replaceAll('\n','\n  ')+',').join('\n\n');source=source.replace(/\n\s*\/\/ .*Synergies/,`\n\n${block}\n\n  // ── Synergies`);await writeFile(modulesFile,source,'utf8');}
console.log({compounds:add.length,modules:modAdd.length});
