import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import TierBadge from "@/components/TierBadge";
import { Link } from "wouter";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SUPPLEMENTS, AGING_HALLMARKS } from "@shared/supplements";
import type { EvidenceTier } from "@shared/supplements";

export default function SupplementLibrary() {
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<EvidenceTier | "all">("all");
  const [selectedHallmark, setSelectedHallmark] = useState<string>("all");

  const filtered = useMemo(() => {
    return SUPPLEMENTS.filter((s) => {
      const matchesSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.mechanism.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchesTier = selectedTier === "all" || s.tier === selectedTier;
      const matchesHallmark =
        selectedHallmark === "all" ||
        AGING_HALLMARKS.find((h) => h.id === selectedHallmark)?.supplements.includes(s.id);
      return matchesSearch && matchesTier && matchesHallmark;
    });
  }, [search, selectedTier, selectedHallmark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-3">
              Supplement Library
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {SUPPLEMENTS.length} compounds indexed with evidence tiers, mechanisms of action, and aging pathway targets.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search compounds, mechanisms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border/50"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1 px-1 py-1 rounded-lg bg-card border border-border/50">
                {(["all", "A", "B", "C"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      selectedTier === tier
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tier === "all" ? "All Tiers" : `Tier ${tier}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hallmark Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Filter by Aging Hallmark
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedHallmark("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selectedHallmark === "all"
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                All Pathways
              </button>
              {AGING_HALLMARKS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHallmark(h.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedHallmark === h.id
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {h.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filtered.length} of {SUPPLEMENTS.length} compounds
          </p>

          {/* Supplement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((supplement) => (
              <Link key={supplement.id} href={`/library/${supplement.slug}`}>
                <div className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 h-full group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                        {supplement.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{supplement.category}</p>
                    </div>
                    <TierBadge tier={supplement.tier} size="sm" />
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-medium text-accent mb-1">Primary Target</p>
                    <p className="text-sm text-foreground/80">{supplement.primaryTarget}</p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                    {supplement.mechanism}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex flex-wrap gap-1">
                      {supplement.pathways.slice(0, 2).map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No compounds match your current filters.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setSearch("");
                  setSelectedTier("all");
                  setSelectedHallmark("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
