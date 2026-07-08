'use client';

import { motion } from 'framer-motion';
import { CountUp } from '@/components/ui/CountUp';

interface StatItem {
  label: string;
  value: string | number;
  color?: string;
  sublabel?: string;
}

interface StatStripProps {
  stats: StatItem[];
  ariaLabel?: string;
  variant?: 'default' | 'hero';
}

export function StatStrip({ stats, ariaLabel = 'Key metrics', variant = 'default' }: StatStripProps) {
  const cardClass = variant === 'hero' ? 'stat-card-v3' : 'stat-card';
  const valueClass = variant === 'hero' ? 'stat-value-v3' : 'stat-value';

  return (
    <div
      className={`summary-strip ${variant === 'hero' ? 'mb-0' : 'mb-8'}`}
      role="group"
      aria-label={ariaLabel}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className={cardClass}
        >
          <p className={`${valueClass} ${stat.color ?? ''}`}>
            {typeof stat.value === 'number' ? (
              <CountUp value={stat.value} />
            ) : /^\d+$/.test(String(stat.value)) ? (
              <CountUp value={parseInt(String(stat.value), 10)} />
            ) : (
              stat.value
            )}
          </p>
          <p className="text-label mt-1.5">{stat.label}</p>
          {stat.sublabel && (
            <p className="text-caption mt-0.5">{stat.sublabel}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}