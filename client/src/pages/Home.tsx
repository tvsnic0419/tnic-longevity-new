import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { ArrowRight, FlaskConical, Dna, Network, Brain, Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SUPPLEMENTS, AGING_HALLMARKS } from "@shared/supplements";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const tierACounts = SUPPLEMENTS.filter((s) => s.tier === "A").length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {SUPPLEMENTS.length} Compounds Indexed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                {tierACounts} Tier A (Human Trials)
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Evidence-graded longevity
              <span className="text-primary text-glow-green"> compounds</span>,
              <br />
              mapped to aging biology.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Explore supplement interventions ranked by human trial evidence. Understand mechanisms, 
              aging pathway targets, and synergistic combinations — no marketing rhetoric, only data.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/library">
                <Button size="lg" className="gap-2 glow-green font-medium">
                  <FlaskConical className="w-4 h-4" />
                  Explore the Library
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/protocol">
                <Button size="lg" variant="outline" className="gap-2 font-medium">
                  Build Your Protocol
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Tier Explainer */}
      <section className="py-16 border-t border-border/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="tier-a px-2.5 py-1 rounded-md text-xs font-mono font-semibold">Tier A</span>
                <span className="text-sm font-medium text-foreground">Robust Evidence</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Multiple randomized controlled trials in humans with consistent, reproducible results and clear mechanistic understanding.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="tier-b px-2.5 py-1 rounded-md text-xs font-mono font-semibold">Tier B</span>
                <span className="text-sm font-medium text-foreground">Emerging Evidence</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Promising human data from pilot studies or strong mechanistic rationale with ongoing clinical trials.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <span className="tier-c px-2.5 py-1 rounded-md text-xs font-mono font-semibold">Tier C</span>
                <span className="text-sm font-medium text-foreground">Preclinical Only</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Strong animal model data or in-vitro evidence only. No published human efficacy trials for longevity endpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-4">
              Built for informed decision-making
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every feature is designed to help you understand the science — not sell you a product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FlaskConical className="w-5 h-5" />}
              title="Supplement Library"
              description="15+ compounds with full mechanism breakdowns, evidence tiers, and dosing context from published research."
              href="/library"
            />
            <FeatureCard
              icon={<Dna className="w-5 h-5" />}
              title="12 Hallmarks of Aging"
              description="Understand the biological mechanisms of aging and which interventions target each pathway."
              href="/pathways"
            />
            <FeatureCard
              icon={<Network className="w-5 h-5" />}
              title="Synergy Matrix"
              description="Discover which compounds amplify each other's effects and the mechanistic rationale behind combinations."
              href="/synergy"
            />
            <FeatureCard
              icon={<Brain className="w-5 h-5" />}
              title="Protocol Builder"
              description="3-step guided flow to build an evidence-matched supplement stack based on your goals and concerns."
              href="/protocol"
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="AI Stack Analysis"
              description="Select your compounds and get an AI-generated synergy report, interaction warnings, and pathway coverage."
              href="/analysis"
            />
            <FeatureCard
              icon={<Dna className="w-5 h-5" />}
              title="Health Prognostication"
              description="Coming soon: AI-powered projections of long-term health outcomes from consistent supplement interventions."
              href="#future"
              comingSoon
            />
          </div>
        </div>
      </section>

      {/* Hallmarks Preview */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-2">
                The 12 Hallmarks of Aging
              </h2>
              <p className="text-muted-foreground">
                Each hallmark mapped to evidence-based supplement interventions.
              </p>
            </div>
            <Link href="/pathways">
              <Button variant="outline" size="sm" className="gap-1 hidden sm:flex">
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {AGING_HALLMARKS.slice(0, 12).map((hallmark) => (
              <Link key={hallmark.id} href={`/pathways#${hallmark.id}`}>
                <div className="p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 text-center group">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                    {hallmark.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {hallmark.supplements.length} compounds
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Future Feature Teaser */}
      <WaitlistSection />

      {/* Footer */}
      <footer className="py-10 border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              <span className="font-[family-name:var(--font-heading)] font-semibold text-sm">TNiC</span>
              <span className="text-xs text-muted-foreground">Evidence-Based Longevity</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Educational resource only. Not medical advice. Consult a healthcare provider before starting any supplement protocol.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  comingSoon,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  comingSoon?: boolean;
}) {
  const content = (
    <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-200 h-full group">
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:glow-green transition-all duration-200">
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {comingSoon && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent border border-accent/20">
            Soon
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );

  if (comingSoon) return content;
  return <Link href={href}>{content}</Link>;
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const joinMutation = trpc.waitlist.join.useMutation({
    onSuccess: (data: { success: boolean; message: string }) => {
      setSubmitted(true);
      setMessage(data.message);
    },
    onError: () => {
      setMessage("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    joinMutation.mutate({ email });
  };

  return (
    <section id="future" className="py-20 border-t border-border/50">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            In Development
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-4">
            AI Health Prognostication
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Upload labs, track your supplement protocol over time, and receive AI-generated projections 
            of how consistent interventions may influence your biological aging trajectory. 
            Grounded in published longitudinal data.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border/50"
                required
              />
              <Button type="submit" className="gap-2 shrink-0" disabled={joinMutation.isPending}>
                {joinMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Notify Me
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam. One notification when the feature launches.
          </p>
        </div>
      </div>
    </section>
  );
}
