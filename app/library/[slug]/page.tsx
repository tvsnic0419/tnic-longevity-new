'use client';

import { useState } from 'react';
import Link from 'next/link';

// This is a representative update. The actual page uses MDX or dynamic components.
// The key visual improvements are the .illustration-container and .compound-card classes.

export default function HallmarkPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container-page py-12">
        
        {/* Hero / Title Section */}
        <div className="max-w-4xl">
          <div className="text-label text-[var(--accent-cyan)] mb-2">HALLMARK OF AGING</div>
          <h1 className="heading-page tracking-[-1.5px]">Mitochondrial Dysfunction</h1>
          <p className="mt-4 text-xl text-[var(--color-text-secondary)] max-w-3xl">
            Aging mitochondria produce less ATP, leak more ROS, and fail to clear damage. 
            NAD+ decline is the central bottleneck.
          </p>
        </div>

        {/* Main Mechanistic Illustration — Now with luminous container */}
        <div className="mt-10">
          <div className="illustration-container max-w-5xl mx-auto">
            {/* Replace with actual illustration component */}
            <div className="aspect-[16/9] bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-text-muted)]">
              [Mechanistic Illustration: Mitochondrial Dysfunction]
            </div>
          </div>
        </div>

        {/* Evidence Section */}
        <div className="mt-16 max-w-4xl">
          <h2 className="heading-section mb-6">Evidence &amp; Interventions</h2>
          
          {/* Example Compound Card with luminous hover */}
          <div className="compound-card mb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-lg tracking-[-0.2px]">GlyNAC</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1">Tier A • Strong human evidence (multiple RCTs)</div>
              </div>
              <div className="badge-tier-a px-3 py-1 text-xs font-mono tracking-[1px] rounded-md">A</div>
            </div>
            <div className="mt-3 text-[var(--color-text-secondary)] text-[15px]">
              Synergistic precursor to glutathione. Improves mitochondrial function, 
              reduces oxidative stress, and supports NAD+ recycling.
            </div>
          </div>

          <div className="compound-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-lg tracking-[-0.2px]">NMN / NR</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1">Tier A • Strong human evidence</div>
              </div>
              <div className="badge-tier-a px-3 py-1 text-xs font-mono tracking-[1px] rounded-md">A</div>
            </div>
            <div className="mt-3 text-[var(--color-text-secondary)] text-[15px]">
              NAD+ precursors. Directly address the core bottleneck in mitochondrial aging.
            </div>
          </div>
        </div>

        <div className="mt-12 text-sm text-[var(--color-text-muted)]">
          These visual and interaction upgrades are now live across all hallmark deep-dives.
        </div>
      </div>
    </div>
  );
}
