import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPLEMENTS } from "@shared/supplements";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function StackAnalysis() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const analysisMutation = trpc.analysis.analyzeStack.useMutation({
    onSuccess: (data: { analysis: string }) => {
      setAnalysisResult(data.analysis);
    },
  });

  const toggleSupplement = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setAnalysisResult(null);
  };

  const runAnalysis = () => {
    if (selectedIds.length < 2) return;
    analysisMutation.mutate({ supplementIds: selectedIds });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-3">
              AI Stack Analysis
            </h1>
            <p className="text-muted-foreground">
              Select your supplements and get an AI-generated synergy report, interaction warnings, 
              and aging pathway coverage summary.
            </p>
          </div>

          {/* Supplement Selector */}
          <div className="mb-8">
            <p className="text-sm font-medium text-foreground mb-3">
              Select your compounds ({selectedIds.length} selected, minimum 2):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {SUPPLEMENTS.map((s) => {
                const isSelected = selectedIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSupplement(s.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all text-sm ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 bg-card text-foreground hover:border-border"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {isSelected ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </span>
                    <span className="truncate">{s.name.split("(")[0].trim()}</span>
                    <span
                      className={`ml-auto text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        s.tier === "A" ? "tier-a" : s.tier === "B" ? "tier-b" : "tier-c"
                      }`}
                    >
                      {s.tier}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Run Analysis Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={runAnalysis}
              disabled={selectedIds.length < 2 || analysisMutation.isPending}
              className="gap-2 glow-green"
              size="lg"
            >
              {analysisMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Stack ({selectedIds.length} compounds)
                </>
              )}
            </Button>
          </div>

          {/* Error */}
          {analysisMutation.isError && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive mb-6">
              Analysis failed. Please try again.
            </div>
          )}

          {/* Results */}
          {analysisResult && (
            <div className="p-6 md:p-8 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Stack Analysis Report</h2>
              </div>
              <div className="prose prose-sm prose-invert max-w-none text-foreground/85">
                <Streamdown>{analysisResult}</Streamdown>
              </div>
              <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border/30 italic">
                AI-generated analysis based on published research. Not medical advice. 
                Consult a healthcare provider before starting any supplement protocol.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
