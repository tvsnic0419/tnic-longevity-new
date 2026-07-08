'use client';

import { motion } from 'framer-motion';
import { communityPulse } from '@/lib/data';
import { platformStats } from '@/lib/platform-stats';

export function CommunityPulse() {
  return (
    <section className="relative border-y border-border bg-[#0a0f1a]/80 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-transparent to-accent-emerald/5" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {platformStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-accent-cyan stat-glow">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[10px] text-caption mb-4">Educational content scope — not user analytics</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {communityPulse.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="text-center"
            >
              <p className="text-lg font-bold font-mono text-foreground">{c.metric}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}