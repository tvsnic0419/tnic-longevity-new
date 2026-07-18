import Link from 'next/link';
import { Zap, Droplet, Recycle, Leaf, Shield, Waves, ArrowUpRight } from 'lucide-react';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import type { EvidenceTier } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';

interface FeaturedGuide {
  href: string;
  title: string;
  desc: string;
  tier: EvidenceTier;
  icon: LucideIcon;
}

const featuredGuides: FeaturedGuide[] = [
  { href: '/nad-supplement-guide', title: 'NAD+ Guide', desc: 'NMN vs NR, dosing, and the decline curve behind both.', tier: 'A', icon: Zap },
  { href: '/glynac-supplement-guide', title: 'GlyNAC Guide', desc: '9 aging hallmarks reversed in the Sekhar 2021 trial.', tier: 'A', icon: Droplet },
  { href: '/sulforaphane-supplement-guide', title: 'Sulforaphane Guide', desc: 'The NRF2 activation protocol, dose-ranged from trials.', tier: 'A', icon: Shield },
  { href: '/berberine-supplement-guide', title: 'Berberine Guide', desc: "“Nature's Ozempic” claims, checked against metformin data.", tier: 'A', icon: Leaf },
  { href: '/spermidine-supplement-guide', title: 'Spermidine Guide', desc: 'Autophagy induction and the ITP lifespan data.', tier: 'B', icon: Recycle },
  { href: '/taurine-supplement-guide', title: 'Taurine Guide', desc: 'What the 2023 Science aging-biomarker paper actually found.', tier: 'B', icon: Waves },
];

/**
 * Page-specific replacement for the generic What/Why/Next context rail —
 * a grid of the guides people actually land on Learn to find, each stamped
 * with its real evidence tier instead of a paragraph explaining the hub.
 */
export function LearnFeaturedGuides() {
  return (
    <div className="mt-8" role="group" aria-label="Featured supplement guides">
      <p className="text-label mb-4">Featured guides</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featuredGuides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="focus-ring interactive group flex flex-col gap-3 rounded-2xl glass glass-hover p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-cyan/10 border border-accent-cyan/25">
                <guide.icon className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
              </span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">{guide.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{guide.desc}</p>
            </div>
            <EvidenceTag tier={guide.tier} size="sm" showTooltip={false} className="mt-auto self-start" />
          </Link>
        ))}
      </div>
    </div>
  );
}
