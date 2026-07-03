import Navigation from "@/components/Navigation";
import TierBadge from "@/components/TierBadge";
import { Link, useParams } from "wouter";
import { ArrowLeft, Beaker, Target, Pill, Network, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPLEMENTS, AGING_HALLMARKS, SYNERGY_PAIRS } from "@shared/supplements";

export default function SupplementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const supplement = SUPPLEMENTS.find((s) => s.slug === slug);

  if (!supplement) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-24 container text-center">
          <p className="text-muted-foreground">Compound not found.</p>
          <Link href="/library">
            <Button variant="ghost" className="mt-4 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Library
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedHallmarks = AGING_HALLMARKS.filter((h) =>
    h.supplements.includes(supplement.id)
  );

  const relatedSynergies = SYNERGY_PAIRS.filter((sp) =>
    sp.compounds.some((c) => supplement.name.includes(c) || supplement.synergies.some((s) => c.includes(s)))
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Back link */}
          <Link href="/library">
            <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
            </Button>
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold">
                  {supplement.name}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">{supplement.category} — Rank #{supplement.rank}</p>
            </div>
            <TierBadge tier={supplement.tier} showDescription size="lg" />
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Mechanism of Action */}
            <section className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Beaker className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Mechanism of Action</h2>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {supplement.mechanism}
              </p>
            </section>

            {/* Aging Pathways Targeted */}
            <section className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-accent" />
                <h2 className="font-semibold text-foreground">Aging Pathways Targeted</h2>
              </div>
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Primary Target
                </p>
                <span className="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  {supplement.primaryTarget}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Molecular Pathways
                </p>
                <div className="flex flex-wrap gap-2">
                  {supplement.pathways.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              {relatedHallmarks.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Related Hallmarks of Aging
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {relatedHallmarks.map((h) => (
                      <Link key={h.id} href={`/pathways#${h.id}`}>
                        <span className="px-3 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors">
                          {h.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Dosing Context */}
            <section className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Dosing Context</h2>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {supplement.dosingContext}
              </p>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Doses referenced from published research. Not prescriptive medical advice.
              </p>
            </section>

            {/* Synergies */}
            <section className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-4 h-4 text-accent" />
                <h2 className="font-semibold text-foreground">Synergistic Combinations</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {supplement.synergies.map((s) => {
                  const linked = SUPPLEMENTS.find(
                    (sup) => sup.name.includes(s) || s.includes(sup.name.split(" ")[0])
                  );
                  if (linked) {
                    return (
                      <Link key={s} href={`/library/${linked.slug}`}>
                        <span className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                          {s}
                        </span>
                      </Link>
                    );
                  }
                  return (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
              {relatedSynergies.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-border/30">
                  {relatedSynergies.slice(0, 3).map((syn, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-medium text-foreground/90 mb-0.5">
                        {syn.compounds.join(" + ")}
                        <span className="ml-2 text-xs text-muted-foreground">({syn.pathway})</span>
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{syn.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Evidence Summary */}
            <section className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Evidence Summary</h2>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {supplement.evidence}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
