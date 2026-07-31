/* ------------------------------------------------------------------ *
 *  TNiC · PROTOCOL — questionnaire + scoring engine
 * ------------------------------------------------------------------ */
import { COMPOUNDS, GOAL_LABELS, SAFETY_LABEL } from "./compounds";

export const QUESTIONS = [
  {
    id: "goals", type: "multi", max: 3,
    prompt: "What are you optimizing for?",
    sub: "Pick up to three. This sets the spine of your stack.",
    options: [
      { id: "cognition", label: "Cognitive performance" },
      { id: "sleep", label: "Sleep quality" },
      { id: "energy", label: "Sustained energy" },
      { id: "longevity", label: "Longevity & cellular health" },
      { id: "stress", label: "Stress resilience" },
      { id: "physical", label: "Physical performance" },
      { id: "metabolic", label: "Metabolic health" },
      { id: "immune", label: "Immune resilience" },
    ],
  },
  {
    id: "sleep_q", type: "single", prompt: "How does your sleep actually feel?",
    sub: "Not hours logged — how restored you wake up.",
    options: [
      { id: "deep", label: "Deep & restorative" },
      { id: "light", label: "Decent but light" },
      { id: "restless", label: "Restless, frequent waking" },
      { id: "chronic", label: "Chronic trouble falling/staying asleep" },
    ],
  },
  {
    id: "energy_q", type: "single", prompt: "Where does your energy go?",
    sub: "The honest daily curve.",
    options: [
      { id: "steady", label: "Steady across the day" },
      { id: "crash", label: "Afternoon crash" },
      { id: "low", label: "Low most days" },
      { id: "wired", label: "Wired but tired" },
    ],
  },
  {
    id: "stress_q", type: "single", prompt: "What's your baseline stress load?",
    sub: "How regulated you feel over a normal week.",
    options: [
      { id: "calm", label: "Calm & regulated" },
      { id: "manage", label: "Manageable" },
      { id: "frazzled", label: "Frequently frazzled" },
      { id: "depleted", label: "Chronically depleted" },
    ],
  },
  {
    id: "movement", type: "single", prompt: "How do you move?",
    sub: "Training load shifts what's worth taking.",
    options: [
      { id: "rare", label: "Rarely" },
      { id: "light", label: "1–2× / week, light" },
      { id: "mixed", label: "3–4× / week, mixed" },
      { id: "intense", label: "5+ / week, strength or intense" },
    ],
  },
  {
    id: "diet", type: "single", prompt: "How do you eat?",
    sub: "Diet pattern flags likely gaps.",
    options: [
      { id: "fish", label: "Omnivore — plenty of fish" },
      { id: "lowfish", label: "Omnivore — little fish" },
      { id: "veg", label: "Vegetarian" },
      { id: "vegan", label: "Vegan" },
    ],
  },
  {
    id: "age", type: "single", prompt: "Which decade are you in?",
    sub: "Endogenous NAD+, CoQ10 and more decline with age.",
    options: [
      { id: "a1", label: "18–29" },
      { id: "a2", label: "30–44" },
      { id: "a3", label: "45–59" },
      { id: "a4", label: "60+" },
    ],
  },
  {
    id: "focus", type: "multi", max: 4,
    prompt: "Anything specific you're targeting?",
    sub: "Optional refinements. Skip if nothing fits.",
    options: [
      { id: "mood", label: "Mood & motivation" },
      { id: "joints", label: "Joint & tissue" },
      { id: "gut", label: "Gut & digestion" },
      { id: "skin", label: "Skin & appearance" },
      { id: "metabolic", label: "Blood sugar" },
      { id: "cardio", label: "Cardiovascular" },
      { id: "recovery", label: "Recovery" },
      { id: "focus", label: "Focus & memory" },
    ],
  },
  {
    id: "safety", type: "multi", safety: true,
    prompt: "Before we resolve your stack —",
    sub: "Anything here removes or flags compounds. Nothing is stored.",
    options: [
      { id: "pregnant", label: "Pregnant or nursing" },
      { id: "blood_thinners", label: "On blood thinners" },
      { id: "statins", label: "Taking statins" },
      { id: "thyroid_meds", label: "Thyroid medication" },
      { id: "bp_meds", label: "Blood-pressure medication" },
      { id: "none", label: "None of these", clears: true },
    ],
  },
];

/* ---------- scoring engine ---------- */
export function buildStack(answers) {
  const scores = {};
  const reasonHits = {};
  COMPOUNDS.forEach((c) => { scores[c.id] = 0; reasonHits[c.id] = new Set(); });

  const add = (goalKey, mult, reason) => {
    COMPOUNDS.forEach((c) => {
      const w = c.serves[goalKey];
      if (w) {
        scores[c.id] += w * mult;
        if (reason) reasonHits[c.id].add(reason);
      }
    });
  };

  (answers.goals || []).forEach((g) => add(g, 3, `your focus on ${GOAL_LABELS[g]?.toLowerCase()}`));
  (answers.focus || []).forEach((g) => add(g, 2, `${GOAL_LABELS[g]?.toLowerCase()} as a target area`));

  const boost = (ids, amt, reason) =>
    ids.forEach((id) => { if (scores[id] !== undefined) { scores[id] += amt; if (reason) reasonHits[id].add(reason); } });

  if (["restless", "chronic"].includes(answers.sleep_q))
    boost(["mag", "glycine", "ashwa", "theanine"], 3, "disrupted sleep");
  if (["crash", "low"].includes(answers.energy_q))
    boost(["rhodiola", "coq10", "creatine", "bcomplex", "nmn"], 3, "low daytime energy");
  if (answers.energy_q === "wired")
    boost(["theanine", "mag", "ashwa"], 2, "a wired-but-tired pattern");
  if (["frazzled", "depleted"].includes(answers.stress_q))
    boost(["ashwa", "theanine", "rhodiola", "mag"], 3, "elevated stress load");
  if (["mixed", "intense"].includes(answers.movement))
    boost(["creatine", "mag", "taurine", "omega3"], 2, "your training volume");
  if (["lowfish", "veg", "vegan"].includes(answers.diet))
    boost(["omega3"], 3, "limited dietary fish");
  if (answers.diet === "vegan")
    boost(["bcomplex", "zinc"], 2, "a vegan diet (B12 / zinc gaps)");
  if (["a3", "a4"].includes(answers.age))
    boost(["coq10", "nmn", "taurine", "omega3", "vitd"], 2, "your age band");
  if ((answers.safety || []).includes("statins"))
    boost(["coq10"], 5, "statin use (CoQ10 depletion)");

  const flags = (answers.safety || []).filter((s) => s !== "none");
  const eligible = [];
  const screened = [];
  COMPOUNDS.forEach((c) => {
    const hardHit = c.contra.find((k) => flags.includes(k));
    const entry = {
      ...c,
      score: scores[c.id],
      reasons: [...reasonHits[c.id]],
      cautions: c.cautionOn.filter((k) => flags.includes(k)),
    };
    if (hardHit && scores[c.id] > 0) {
      screened.push({ ...entry, screenedFor: SAFETY_LABEL[hardHit] || hardHit });
    } else if (!hardHit) {
      eligible.push(entry);
    }
  });

  eligible.sort((a, b) => b.score - a.score);
  let stack = eligible.filter((c) => c.score > 0).slice(0, 6);

  if (stack.length < 4) {
    const seeds = ["vitd", "omega3", "mag", "creatine"];
    seeds.forEach((id) => {
      if (!stack.find((c) => c.id === id)) {
        const c = eligible.find((e) => e.id === id);
        if (c) { c.reasons = c.reasons.length ? c.reasons : ["a sensible longevity baseline"]; stack.push(c); }
      }
    });
    stack = stack.slice(0, 5);
  }

  const top = stack[0]?.score || 1;
  stack.forEach((c) => { c.match = Math.max(38, Math.round((c.score / top) * 100)); });

  // NEW: within-stack synergy pairs (both members present)
  const ids = new Set(stack.map((c) => c.id));
  const synergyPairs = [];
  const seen = new Set();
  stack.forEach((c) => {
    (c.synergy || []).forEach((partnerId) => {
      if (ids.has(partnerId)) {
        const key = [c.id, partnerId].sort().join("+");
        if (!seen.has(key)) {
          seen.add(key);
          const partner = stack.find((s) => s.id === partnerId);
          synergyPairs.push([c, partner]);
        }
      }
    });
  });

  return { stack, screened, flags, synergyPairs };
}

/* ---------- compact URL codec (share / persist a result) ---------- */
// Order of answer keys → single query param, no PII, fully client-side.
const KEY_ORDER = ["goals", "sleep_q", "energy_q", "stress_q", "movement", "diet", "age", "focus", "safety"];

export function encodeAnswers(answers) {
  const parts = KEY_ORDER.map((k) => {
    const v = answers[k];
    if (Array.isArray(v)) return v.join(".");
    return v || "";
  });
  return parts.join("~");
}

export function decodeAnswers(code) {
  if (!code) return null;
  const parts = String(code).split("~");
  const answers = {};
  KEY_ORDER.forEach((k, i) => {
    const raw = parts[i] || "";
    if (["goals", "focus", "safety"].includes(k)) answers[k] = raw ? raw.split(".") : [];
    else if (raw) answers[k] = raw;
  });
  return answers;
}
