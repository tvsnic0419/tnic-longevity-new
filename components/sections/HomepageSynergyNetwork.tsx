'use client';

import { SynergyNetworkGraph } from '@/components/ui/SynergyNetworkGraph';

export function HomepageSynergyNetwork() {
  return (
    <section className="section-deep relative py-20 sm:py-28 overflow-hidden">
      {/* Aurora background */}
      <div className="aurora-beams pointer-events-none" aria-hidden />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-badge mb-4">Compound Intelligence</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            14 Compounds.{' '}
            <span className="gradient-sweep-text">23 Synergy Edges.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every compound in our library was selected not just for its solo efficacy, but for
            how it connects. Hover any node to reveal its mechanistic alliances — and why the
            whole stack outperforms the sum of its parts.
          </p>
        </div>

        {/* Graph */}
        <div className="card-floating rounded-3xl p-6 sm:p-8 border border-border/50 bg-background/60 backdrop-blur-sm">
          <SynergyNetworkGraph />
        </div>

        {/* Supporting stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { value: '14', label: 'Evidence-Graded Compounds' },
            { value: '23', label: 'Unique Synergy Connections' },
            { value: '5',  label: 'Biological Pathways' },
            { value: '6',  label: 'Optimized Stack Presets' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-4 rounded-2xl border border-border/40 bg-card/40">
              <div className="stat-neon text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Edge weights reflect mechanistic evidence strength. Dashed lines = additive / modulatory effect; solid lines = direct pathway co-activation.
          All connections drawn from peer-reviewed literature.
        </p>
      </div>
    </section>
  );
}
