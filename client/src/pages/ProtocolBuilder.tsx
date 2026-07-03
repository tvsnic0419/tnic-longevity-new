import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import TierBadge from "@/components/TierBadge";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPLEMENTS, AGING_HALLMARKS } from "@shared/supplements";

type Goal = "longevity" | "energy" | "inflammation" | "cognition" | "metabolic";
type Concern = string; // hallmark IDs
type Experience = "beginner" | "intermediate" | "advanced";

const goals: { id: Goal; label: string; description: string }[] = [
  { id: "longevity", label: "General Longevity", description: "Broad healthspan extension targeting multiple aging pathways" },
  { id: "energy", label: "Energy & Mitochondria", description: "Boost cellular energy production and reduce fatigue" },
  { id: "inflammation", label: "Reduce Inflammation", description: "Target chronic low-grade inflammation (inflammaging)" },
  { id: "cognition", label: "Cognitive Health", description: "Support brain function, neuroprotection, and mental clarity" },
  { id: "metabolic", label: "Metabolic Optimization", description: "Improve insulin sensitivity, glucose metabolism, and body composition" },
];

const goalToHallmarks: Record<Goal, string[]> = {
  longevity: ["mitochondrial-dysfunction", "cellular-senescence", "compromised-autophagy", "epigenetic-alterations"],
  energy: ["mitochondrial-dysfunction", "deregulated-nutrient-sensing"],
  inflammation: ["chronic-inflammation", "altered-intercellular-communication", "cellular-senescence"],
  cognition: ["mitochondrial-dysfunction", "genomic-instability", "altered-intercellular-communication"],
  metabolic: ["deregulated-nutrient-sensing", "gut-dysbiosis", "chronic-inflammation"],
};

export default function ProtocolBuilder() {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<Concern[]>([]);
  const [experience, setExperience] = useState<Experience | null>(null);

  const recommendations = useMemo(() => {
    if (!selectedGoal || !experience) return [];

    const relevantHallmarks = [
      ...goalToHallmarks[selectedGoal],
      ...selectedConcerns,
    ];

    const scored = SUPPLEMENTS.map((s) => {
      let score = 0;
      const matchedHallmarks = AGING_HALLMARKS.filter(
        (h) => relevantHallmarks.includes(h.id) && h.supplements.includes(s.id)
      );
      score += matchedHallmarks.length * 3;
      if (s.tier === "A") score += 5;
      if (s.tier === "B") score += 2;
      score += (16 - s.rank) * 0.5;
      return { supplement: s, score, matchedHallmarks };
    });

    scored.sort((a, b) => b.score - a.score);

    const limit = experience === "beginner" ? 3 : experience === "intermediate" ? 5 : 7;
    return scored.slice(0, limit);
  }, [selectedGoal, selectedConcerns, experience]);

  const reset = () => {
    setStep(1);
    setSelectedGoal(null);
    setSelectedConcerns([]);
    setExperience(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-3">
              Protocol Builder
            </h1>
            <p className="text-muted-foreground">
              3-step guided flow to build an evidence-matched supplement stack.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 rounded ${
                      step > s ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
            <span className="ml-3 text-xs text-muted-foreground">
              Step {Math.min(step, 3)} of 3
            </span>
          </div>

          {/* Step 1: Goal */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">What is your primary goal?</h2>
              <div className="space-y-3">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedGoal === g.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-card hover:border-border"
                    }`}
                  >
                    <p className="font-medium text-foreground text-sm">{g.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{g.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedGoal}
                  className="gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Specific Concerns */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Any specific aging concerns?</h2>
              <p className="text-sm text-muted-foreground mb-4">Select any that apply (optional).</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AGING_HALLMARKS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() =>
                      setSelectedConcerns((prev) =>
                        prev.includes(h.id)
                          ? prev.filter((c) => c !== h.id)
                          : [...prev, h.id]
                      )
                    }
                    className={`text-left p-3 rounded-lg border transition-all text-sm ${
                      selectedConcerns.includes(h.id)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 bg-card text-foreground hover:border-border"
                    }`}
                  >
                    {h.name}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Experience Level */}
          {step === 3 && !experience && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Your supplement experience level?</h2>
              <div className="space-y-3">
                {[
                  { id: "beginner" as Experience, label: "Beginner", desc: "New to supplementation — recommend 3 core compounds" },
                  { id: "intermediate" as Experience, label: "Intermediate", desc: "Some experience — recommend 5 targeted compounds" },
                  { id: "advanced" as Experience, label: "Advanced", desc: "Experienced — recommend 7 compounds with synergies" },
                ].map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setExperience(e.id)}
                    className="w-full text-left p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-all"
                  >
                    <p className="font-medium text-foreground text-sm">{e.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              </div>
            </div>
          )}

          {/* Results */}
          {step === 3 && experience && recommendations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-lg">Your Recommended Protocol</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on: {goals.find((g) => g.id === selectedGoal)?.label} — {experience} level
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </Button>
              </div>

              <div className="space-y-3">
                {recommendations.map(({ supplement, matchedHallmarks }, i) => (
                  <Link key={supplement.id} href={`/library/${supplement.slug}`}>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors group">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {supplement.name}
                          </p>
                          <TierBadge tier={supplement.tier} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Targets: {matchedHallmarks.map((h) => h.name).join(", ")}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-card border border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Want a deeper analysis of how these compounds interact?
                </p>
                <Link href="/analysis">
                  <Button size="sm" className="gap-2">
                    Run AI Stack Analysis <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
