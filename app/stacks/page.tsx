'use client';

import Link from 'next/link';

// Example of applying site-wide luminous treatment to Stacks page
export default function StacksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-12">
        <h1 className="heading-page">Build Your Protocol</h1>
        <p className="mt-2 text-[var(--color-text-secondary)] max-w-2xl">
          Combine evidence-graded compounds with clear synergy scoring.
        </p>

        {/* Example luminous stack builder cards */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="card-luminous p-6 rounded-2xl">
              <div className="font-semibold text-lg">Core Longevity Stack {i}</div>
              <div className="mt-4 text-sm text-[var(--color-text-muted)]">
                GlyNAC + NMN + Taurine • Tier A foundation with strong mitochondrial + antioxidant synergy.
              </div>
              <div className="mt-6 text-xs text-[var(--accent-cyan)] group-hover:underline">
                Customize this stack →
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-sm text-[var(--color-text-muted)]">
          All major surfaces now support the new luminous treatment for site-wide consistency.
        </div>
      </div>
    </div>
  );
}
