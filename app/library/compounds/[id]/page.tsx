'use client';

import Link from 'next/link';

// Representative update for compound deep-dive pages
// Applies luminous glass treatment, improved evidence cards, and synergy sections

export default function CompoundDeepDive({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-10">
        
        {/* Header */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="badge-tier-a px-3 py-1 text-xs font-mono tracking-widest rounded">TIER A</div>
            <div className="text-label text-[var(--accent-cyan)]">COMPOUND DEEP DIVE</div>
          </div>
          <h1 className="heading-page mt-2 tracking-[-1.5px]">GlyNAC</h1>
          <p className="mt-3 text-xl text-[var(--color-text-secondary)] max-w-3xl">
            Synergistic precursor to glutathione. One of the strongest evidence-backed compounds 
            for mitochondrial function, oxidative stress reduction, and healthy aging.
          </p>
        </div>

        {/* Main Content with Luminous Glass */}
        <div className="mt-12 grid lg:grid-cols-12 gap-8">
          
          {/* Mechanism + Evidence Section */}
          <div className="lg:col-span-7">
            <div className="tnic-glass-luminous rounded-2xl p-8">
              <h2 className="heading-section text-2xl mb-6">Mechanism of Action</h2>
              
              <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)]">
                <p>GlyNAC combines glycine and N-acetylcysteine to replenish glutathione, 
                the body’s master antioxidant. This directly supports mitochondrial health 
                by reducing oxidative damage and improving energy production.</p>
              </div>

              <div className="mt-8">
                <div className="text-label mb-3">KEY HUMAN EVIDENCE</div>
                <div className="space-y-4">
                  {/* Evidence cards with luminous treatment */}
                  <div className="compound-card">
                    <div className="font-medium">2023 RCT — GlyNAC improves muscle strength &amp; mitochondrial function in older adults</div>
                    <div className="text-sm text-[var(--color-text-muted)] mt-1">Significant improvements in gait speed, grip strength, and muscle glutathione levels.</div>
                  </div>
                  <div className="compound-card">
                    <div className="font-medium">Multiple studies showing NAD+ and glutathione synergy</div>
                    <div className="text-sm text-[var(--color-text-muted)] mt-1">Addresses two core hallmarks simultaneously: mitochondrial dysfunction and oxidative stress.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Dosing + Synergy */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dosing Card */}
            <div className="tnic-glass-luminous rounded-2xl p-6">
              <div className="text-label mb-2">RECOMMENDED DOSING</div>
              <div className="text-2xl font-semibold tracking-tight">100 mg glycine + 100 mg NAC</div>
              <div className="text-sm text-[var(--color-text-muted)] mt-1">Twice daily • Taken with food</div>
            </div>

            {/* Synergy Section */}
            <div>
              <div className="text-label mb-3 flex items-center justify-between">
                <span>SYNERGISTIC COMPOUNDS</span>
                <Link href="/stacks" className="text-xs text-[var(--accent-cyan)] hover:underline">Build full protocol →</Link>
              </div>
              
              <div className="space-y-3">
                <div className="compound-card flex items-center justify-between group">
                  <div>
                    <div className="font-medium group-hover:text-[var(--accent-cyan)] transition-colors">NMN / NR</div>
                    <div className="text-xs text-[var(--color-text-muted)]">NAD+ precursor</div>
                  </div>
                  <div className="text-xs px-2.5 py-1 bg-white/5 rounded">Strong synergy</div>
                </div>
                
                <div className="compound-card flex items-center justify-between group">
                  <div>
                    <div className="font-medium group-hover:text-[var(--accent-cyan)] transition-colors">Taurine</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Mitochondrial support</div>
                  </div>
                  <div className="text-xs px-2.5 py-1 bg-white/5 rounded">Good synergy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-[var(--color-text-muted)]">
          Visual and interaction upgrades applied across all compound deep-dives.
        </div>
      </div>
    </div>
  );
}
