export const NAV_GROUPS = [
  {
    label: "Learn",
    links: [
      { href: "/library", label: "Library" },
      { href: "/peptides", label: "Peptides" },
      { href: "/sirtuin-atlas", label: "Sirtuins" },
      { href: "/insights", label: "Insights" },
      { href: "/learn", label: "Learn" },
    ],
  },
  {
    label: "Build",
    links: [
      { href: "/stacks", label: "Stacks" },
      { href: "/protocols", label: "Protocols" },
      { href: "/tools", label: "Tools" },
      { href: "/compound-engine", label: "Engine" },
    ],
  },
  {
    label: "Track",
    links: [{ href: "/labs", label: "Labs" }],
  },
  {
    label: "Shop",
    links: [{ href: "/products", label: "Products" }],
  },
] as const;

export const PRIMARY_LINKS = [
  { href: "/library", label: "Library" },
  { href: "/stacks", label: "Stacks" },
  { href: "/labs", label: "Labs" },
  { href: "/products", label: "Products" },
] as const;

export const HALLMARKS = [
  { n: "01", slug: "genomic-instability", title: "Genomic instability", blurb: "DNA lesions, repair load, and what the citations actually support." },
  { n: "02", slug: "telomere-attrition", title: "Telomere attrition", blurb: "Replicative clock, telomerase claims, and human-evidence gaps." },
  { n: "03", slug: "epigenetic-alterations", title: "Epigenetic alterations", blurb: "Methyl clocks, TET/SAM context, and reversible marks." },
  { n: "04", slug: "loss-of-proteostasis", title: "Loss of proteostasis", blurb: "Misfolded proteins, heat-shock response, and autophagy load." },
  { n: "05", slug: "disabled-macroautophagy", title: "Disabled macroautophagy", blurb: "Cellular cleanup failure and the compounds graded against it." },
  { n: "06", slug: "deregulated-nutrient-sensing", title: "Deregulated nutrient sensing", blurb: "mTOR, AMPK, insulin/IGF-1 — pathways before products." },
  { n: "07", slug: "mitochondrial-dysfunction", title: "Mitochondrial dysfunction", blurb: "Energy collapse, ROS, and NAD pathways without the sales deck." },
  { n: "08", slug: "cellular-senescence", title: "Cellular senescence", blurb: "SASP burden, senolytics, and the gap between mouse and human." },
  { n: "09", slug: "stem-cell-exhaustion", title: "Stem cell exhaustion", blurb: "Regenerative decline — muscle, marrow, and wound repair." },
  { n: "10", slug: "altered-communication", title: "Altered intercellular communication", blurb: "Signaling noise across tissues as the organism ages." },
  { n: "11", slug: "chronic-inflammation", title: "Chronic inflammation", blurb: "Inflammaging as a network, not a single supplement target." },
  { n: "12", slug: "dysbiosis", title: "Dysbiosis", blurb: "Gut ecology, barrier integrity, and metabolite signaling." },
] as const;

export const ELITE = [
  { id: "glynac", name: "GlyNAC", tier: "A", line: "Rebuilds the glutathione antioxidant system" },
  { id: "nmn", name: "NMN", tier: "A", line: "Restores NAD⁺ that powers sirtuins and DNA repair" },
  { id: "cakg", name: "Ca-AKG", tier: "A", line: "Feeds the TCA cycle and α-ketoglutarate signalling" },
  { id: "sulforaphane", name: "Sulforaphane", tier: "A", line: "Switches on the NRF2 cellular-defense response" },
  { id: "resveratrol", name: "Resveratrol", tier: "B", line: "Activates SIRT1, a caloric-restriction mimic" },
  { id: "spermidine", name: "Spermidine", tier: "B", line: "Induces autophagy — the cell’s self-cleanup pathway" },
  { id: "taurine", name: "Taurine", tier: "B", line: "A mitochondrial osmolyte that declines with age" },
  { id: "rala", name: "R-ALA", tier: "B", line: "Recycles antioxidants across water and lipid compartments" },
] as const;

export const STEPS = [
  { n: "01", title: "Grade the compound", body: "Open the library. Read the tier, the PMIDs, and the hallmark map before a product name." },
  { n: "02", title: "See the system", body: "Stacks and the synergy engine show boosts and clashes — nothing is graded in isolation." },
  { n: "03", title: "Personalize the start", body: "NICO is nine questions. Labs stay in the browser. The protocol is yours to adjust." },
] as const;

export type HubDef = {
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  cards: { title: string; body: string; href?: string }[];
};

export const HUBS: Record<string, HubDef> = {
  library: {
    path: "/library",
    eyebrow: "Learn",
    title: "Anti-Aging Library",
    lede: "The twelve hallmarks of aging, each paired with PMID-cited interventions and mechanistic visuals — the free, evidence-first reference the whole site is built on.",
    cards: HALLMARKS.map((h) => ({
      title: `${h.n}  ${h.title}`,
      body: h.blurb,
      href: "/hallmarks",
    })),
  },
  peptides: {
    path: "/peptides",
    eyebrow: "Learn",
    title: "Peptide Library",
    lede: "Research peptides mapped to mechanisms and evidence quality — separate from the oral-compound library so the two catalogs never blur.",
    cards: [
      { title: "Mechanism first", body: "Each entry opens on target and pathway, not a vendor SKU." },
      { title: "Evidence grade", body: "Human, emerging, or preclinical — the letter sits next to the name." },
      { title: "Safety frame", body: "Research-use context and contraindications stay in the same pane." },
    ],
  },
  "sirtuin-atlas": {
    path: "/sirtuin-atlas",
    eyebrow: "Learn",
    title: "Sirtuin Atlas",
    lede: "SIRT1–7 as a map: NAD dependence, tissue context, and the compounds graded against each isoform.",
    cards: [
      { title: "SIRT1", body: "Caloric-restriction mimicry — resveratrol and NAD precursors." },
      { title: "SIRT3", body: "Mitochondrial deacetylation and energetic decline." },
      { title: "SIRT6", body: "Genomic stability and inflammatory tone." },
    ],
  },
  insights: {
    path: "/insights",
    eyebrow: "Learn",
    title: "Longevity by the Numbers",
    lede: "A data view of the library: evidence-tier breakdown, hallmark coverage, dosing rhythm, and bioavailability notes.",
    cards: [
      { title: "Tier mix", body: "How many modules sit at A, B, and C — updated as the library grows." },
      { title: "Hallmark coverage", body: "Which hallmarks are well-cited and which are still thin." },
      { title: "Dosing rhythm", body: "Daily vs pulsed vs contextual — from the compound records, not marketing." },
    ],
  },
  learn: {
    path: "/learn",
    eyebrow: "Learn",
    title: "Learning Hub",
    lede: "Guides that teach the method: how to read a tier, how to walk a hallmark, how to question a stack.",
    cards: [
      { title: "How we grade", body: "A / B / C is a method, not a vibe. Open Trust for the rubric." },
      { title: "How to read a module", body: "Pathway → hallmarks → citations → product pick, in that order." },
      { title: "What we will not claim", body: "No disease treatment language. No pay-for-placement." },
    ],
  },
  stacks: {
    path: "/stacks",
    eyebrow: "Build",
    title: "Stacks & Protocols",
    lede: "Coverage and cautions across a set of compounds. The combination lab lives here — not next to biomarker Labs.",
    cards: [
      { title: "Builder", body: "Assemble a stack and see hallmark coverage plus clash warnings." },
      { title: "Saved protocols", body: "Named stacks you can revisit. Local in this preview." },
      { title: "Combination Lab", body: "Pairwise synergy and antagonism from the graded graph." },
    ],
  },
  protocols: {
    path: "/protocols",
    eyebrow: "Build",
    title: "Protocol Library",
    lede: "Named, inspectable protocols — timing, context, and the evidence each step leans on.",
    cards: [
      { title: "Foundation", body: "GlyNAC + NAD + mineral context as a readable starting protocol." },
      { title: "Mitochondrial", body: "AKG, taurine, and R-ALA grouped by shared energetic load." },
      { title: "Cleanup", body: "Spermidine and autophagy-adjacent picks, graded honestly." },
    ],
  },
  tools: {
    path: "/tools",
    eyebrow: "Build",
    title: "Tools",
    lede: "Calculators and inspectors that sit on top of the same library data.",
    cards: [
      { title: "Bio-age notes", body: "A structured place to record clocks — not a medical device." },
      { title: "Dose inspector", body: "Compare labeled dose to the range cited in the module." },
      { title: "Clash check", body: "A thin wrapper over the synergy graph." },
    ],
  },
  "compound-engine": {
    path: "/compound-engine",
    eyebrow: "Build",
    title: "Compound Engine",
    lede: "The graph behind the library: compounds, links, confidence, and elite markers in one instrument.",
    cards: [
      { title: "Nodes", body: "Every graded compound is a node with a tier and hallmark list." },
      { title: "Edges", body: "Synergy and clash links carry a confidence tint." },
      { title: "Elite halo", body: "The eight featured interventions stay visually distinct from tier color." },
    ],
  },
  labs: {
    path: "/labs",
    eyebrow: "Track",
    title: "Lab Analysis Hub",
    lede: "Biomarker tracking that stays in the browser. Log a result, see status, export locally.",
    cards: [
      { title: "Single marker", body: "Enter one value with units and a date." },
      { title: "Panel import", body: "Partner import stays optional — nothing leaves the device by default." },
      { title: "Status colors", body: "Optimal / watch / critical are a different axis from evidence tiers." },
    ],
  },
  products: {
    path: "/products",
    eyebrow: "Shop",
    title: "Verified Products",
    lede: "One pick per featured compound — COA-first, no pay-for-placement. The library grade is still the headline.",
    cards: ELITE.map((e) => ({
      title: e.name,
      body: `${e.tier} · ${e.line}`,
      href: "/library",
    })),
  },
  nico: {
    path: "/nico",
    eyebrow: "Start",
    title: "NICO Starter",
    lede: "Nine adjustable questions. A starting stack plan you can interrogate — not a prescription.",
    cards: [
      { title: "Goals", body: "Energy, cleanup, inflammation, or a mixed brief." },
      { title: "Constraints", body: "Sleep, GI, medications — the plan narrows, it does not invent." },
      { title: "Output", body: "A readable stack with links back into the library modules." },
    ],
  },
  "elite-8": {
    path: "/elite-8",
    eyebrow: "Interventions",
    title: "Elite 8",
    lede: "The eight interventions featured on the homepage — each already a graded library compound with a verified pick.",
    cards: ELITE.map((e) => ({
      title: e.name,
      body: `Tier ${e.tier} · ${e.line}`,
      href: "/library",
    })),
  },
  hallmarks: {
    path: "/hallmarks",
    eyebrow: "Mechanisms",
    title: "The 12 Hallmarks of Aging",
    lede: "Each hallmark explained with visuals, evidence-ranked interventions, and citations.",
    cards: HALLMARKS.map((h) => ({ title: h.title, body: h.blurb, href: "/library" })),
  },
  about: {
    path: "/about",
    eyebrow: "TNiC",
    title: "About",
    lede: "Independent longevity intelligence. Mechanisms stay visible. Grades stay honest. The library is the product.",
    cards: [
      { title: "Independent", body: "No inventory to move. No health-data sales model." },
      { title: "Inspectable", body: "Every intervention is pinned to PMIDs." },
      { title: "Local-first", body: "Personal notes and labs stay on the device unless you export." },
    ],
  },
  trust: {
    path: "/trust",
    eyebrow: "Trust",
    title: "Trust & Methodology",
    lede: "How A/B/C is assigned, what we will not claim, and how corrections land.",
    cards: [
      { title: "Methodology", body: "Primary literature first. Thin papers stay thin grades." },
      { title: "Sponsorship", body: "Picks are not for sale. Disclosed relationships never move a tier." },
      { title: "Corrections", body: "Wrong citation, wrong dose, wrong grade — we patch in public." },
    ],
  },
  faq: {
    path: "/faq",
    eyebrow: "Help",
    title: "FAQ",
    lede: "Short answers. The long versions live in Learn and Trust.",
    cards: [
      { title: "Is this medical advice?", body: "No. Educational only. Talk to a clinician before changing a regimen." },
      { title: "Why a product pick?", body: "So the grade has a COA-checked example — not because we stock it." },
      { title: "Where is my data?", body: "In this preview, access requests and notes stay in localStorage." },
    ],
  },
  partnerships: {
    path: "/partnerships",
    eyebrow: "Work with TNiC",
    title: "Partnerships",
    lede: "TNiC is a cell-health and nutrition intelligence product for advanced consumers who want compounds, pathways, evidence quality, and biomarkers in one inspectable surface.",
    cards: [
      { title: "What we partner on", body: "Data, citations, and honest product documentation." },
      { title: "What we will not do", body: "Pay-for-placement, ghost grades, or buried conflicts." },
      { title: "Contact", body: "protocol@tnic.help — keep the brief specific." },
    ],
  },
  dashboard: {
    path: "/dashboard",
    eyebrow: "You",
    title: "Dashboard",
    lede: "Saved modules, lab snapshots, and the last NICO plan — local in this preview.",
    cards: [
      { title: "Queue", body: "Modules you marked to revisit." },
      { title: "Labs", body: "The last values logged in the Labs hub." },
      { title: "Plan", body: "The current NICO output, if you ran it." },
    ],
  },
};
