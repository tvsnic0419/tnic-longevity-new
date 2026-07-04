'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { LongevityGaugeArc } from '@/components/ui/LongevityGaugeArc';
import type { HallmarkRisk, RiskLevel } from '@/lib/lab-analysis';

const riskStyle: Record<RiskLevel, { bar: string; text: string; bg: string }> = {
  low: { bar: 'bg-accent-emerald', text: 'text-accent-emerald', bg: 'bg-accent-emerald/10' },
  moderate: { bar: 'bg-accent-cyan', text: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  elevated: { bar: 'bg-accent-amber', text: 'text-accent-amber', bg: 'bg-accent-amber/10' },
  high: { bar: 'bg-accent-rose', text: 'text-accent-rose', bg: 'bg-accent-rose/10' },
};

interface HallmarkRiskPanelProps {
  risks: HallmarkRisk[];
  healthspanScore: number;
}

export function HallmarkRiskPanel({ risks, healthspanScore }: HallmarkRiskPanelProps) {
  const slugFor = (id: string) => hallmarkLibrary.find((h) => h.id === id)?.slug ?? id;

  if (risks.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Shield className="w-8 h-8 text-caption mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Log biomarkers to generate hallmark-linked risk insights.</p>
        <p className="text-xs text-caption mt-2">Each marker maps to 1–4 hallmarks of aging for prognosis analysis.</p>
      </div>
    );
  }

  const elevated = risks.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'elevated');

  return (
    <div className="space-y-6">
      {/* Healthspan score */}
      <div className="gradient-border p-6 text-center">
        <div className="flex justify-center">
          <LongevityGaugeArc
            score={healthspanScore}
            color={
              healthspanScore >= 75 ? 'var(--accent-emerald)'
              : healthspanScore >= 50 ? 'var(--accent-amber)'
              : 'var(--accent-rose)'
            }
            label="HEALTHSPAN"
            sublabel={`${risks.reduce((s, r) => s + r.drivingMarkers.length, 0)} marker links`}
            size={150}
            immediate
          />
        </div>
        {elevated.length > 0 && (
          <p className="text-xs text-accent-amber mt-3 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {elevated.length} hallmark{elevated.length > 1 ? 's' : ''} need attention
          </p>
        )}
      </div>

      {/* Risk cards */}
      <div className="space-y-3">
        {risks.map((risk, i) => {
          const style = riskStyle[risk.riskLevel];
          return (
            <motion.div
              key={risk.hallmarkId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass rounded-xl p-5 border border-border`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] font-mono text-caption">HALLMARK {risk.hallmarkNumber}</p>
                  <h4 className="font-semibold text-sm">{risk.hallmarkTitle}</h4>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {risk.riskLevel}
                </span>
              </div>

              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${style.bar}`}
                  style={{ width: `${risk.riskScore}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{risk.prognosis}</p>

              {risk.drivingMarkers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {risk.drivingMarkers.map((m) => (
                    <span
                      key={m.markerId}
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                        m.status === 'critical'
                          ? 'bg-accent-rose/10 text-accent-rose'
                          : m.status === 'watch'
                            ? 'bg-accent-amber/10 text-accent-amber'
                            : 'bg-accent-emerald/10 text-accent-emerald'
                      }`}
                    >
                      {m.name}: {m.value}
                    </span>
                  ))}
                </div>
              )}

              {risk.priorityInterventions.length > 0 && (
                <p className="text-[10px] text-caption mb-2">
                  Interventions: {risk.priorityInterventions.join(' · ')}
                </p>
              )}

              <Link
                href={`/library/${slugFor(risk.hallmarkId)}`}
                className="text-xs font-semibold text-accent-cyan hover:text-accent-emerald transition inline-flex items-center gap-1"
              >
                Hallmark deep dive <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}