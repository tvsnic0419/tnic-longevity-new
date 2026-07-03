import Navigation from "@/components/Navigation";
import TierBadge from "@/components/TierBadge";
import { Link } from "wouter";
import { AGING_HALLMARKS, SUPPLEMENTS } from "@shared/supplements";
import {
  Dna, Timer, Layers, Shapes, Activity, Zap,
  Skull, Sprout, Network, Recycle, Bug, Flame
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Dna: <Dna className="w-5 h-5" />,
  Timer: <Timer className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Shapes: <Shapes className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Skull: <Skull className="w-5 h-5" />,
  Sprout: <Sprout className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
  Recycle: <Recycle className="w-5 h-5" />,
  Bug: <Bug className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
};

export default function AgingPathways() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              The 12 Hallmarks of Aging
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Aging is driven by interconnected biological mechanisms. Each hallmark represents a distinct 
              category of cellular and molecular decline. Understanding these pathways is the foundation 
              for targeted nutritional intervention.
            </p>
          </div>

          {/* Hallmarks Grid */}
          <div className="space-y-6">
            {AGING_HALLMARKS.map((hallmark, index) => {
              const hallmarkSupplements = SUPPLEMENTS.filter((s) =>
                hallmark.supplements.includes(s.id)
              );

              return (
                <section
                  key={hallmark.id}
                  id={hallmark.id}
                  className="p-6 md:p-8 rounded-xl bg-card border border-border/50 scroll-mt-24"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      {iconMap[hallmark.icon] || <Dna className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="font-[family-name:var(--font-heading)] text-lg md:text-xl font-bold text-foreground">
                          {index + 1}. {hallmark.name}
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {hallmark.description}
                      </p>
                    </div>
                  </div>

                  {/* Mapped Supplements */}
                  <div className="mt-5 pt-5 border-t border-border/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Targeted Interventions
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {hallmarkSupplements.map((s) => (
                        <Link key={s.id} href={`/library/${s.slug}`}>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors group">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                {s.name.split("(")[0].trim()}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {s.pathways[0]}
                              </p>
                            </div>
                            <TierBadge tier={s.tier} size="sm" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
