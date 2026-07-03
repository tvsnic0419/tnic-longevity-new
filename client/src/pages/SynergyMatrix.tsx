import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { Network, ArrowRight } from "lucide-react";
import { SYNERGY_PAIRS } from "@shared/supplements";

export default function SynergyMatrix() {
  const strongPairs = SYNERGY_PAIRS.filter((p) => p.strength === "strong");
  const moderatePairs = SYNERGY_PAIRS.filter((p) => p.strength === "moderate");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              Synergy Matrix
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Supplements rarely work in isolation. This matrix maps evidence-based combinations 
              where compounds amplify each other's effects through complementary mechanisms.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-8 p-4 rounded-lg bg-card border border-border/50">
            <span className="text-xs font-medium text-muted-foreground">Synergy Strength:</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-foreground">Strong (validated mechanism)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-xs text-foreground">Moderate (mechanistic rationale)</span>
            </div>
          </div>

          {/* Strong Synergies */}
          <section className="mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              Strong Synergies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strongPairs.map((pair, i) => (
                <SynergyCard key={i} pair={pair} />
              ))}
            </div>
          </section>

          {/* Moderate Synergies */}
          <section>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent" />
              Moderate Synergies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moderatePairs.map((pair, i) => (
                <SynergyCard key={i} pair={pair} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 p-6 rounded-xl bg-card border border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Want to analyze your own supplement stack for synergies and interactions?
            </p>
            <Link href="/analysis">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Network className="w-4 h-4" />
                Try AI Stack Analysis
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SynergyCard({ pair }: { pair: typeof SYNERGY_PAIRS[number] }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          {pair.compounds.map((c, i) => (
            <span key={c}>
              <span className="text-sm font-semibold text-foreground">{c}</span>
              {i < pair.compounds.length - 1 && (
                <span className="text-primary mx-1.5 text-xs">+</span>
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <span
          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${
            pair.strength === "strong"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-accent/10 text-accent border border-accent/20"
          }`}
        >
          {pair.pathway}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{pair.reason}</p>
    </div>
  );
}
