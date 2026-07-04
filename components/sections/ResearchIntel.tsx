'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, BookOpen, FlaskConical, Zap, ArrowRight, Radio } from 'lucide-react';
import { SectionShell } from '@/components/SectionShell';
import { ContextRail } from '@/components/ui/ContextRail';
import { researchFeed } from '@/lib/data';
import { getBriefHrefForResearch } from '@/lib/brief-research-sync';
import {
  filterResearchFeed,
  getResearchIntelContext,
  researchCompoundFilters,
  researchHallmarkFilters,
  researchImpactFilters,
  researchImpactStyles,
  researchTags,
  type ResearchIntelFilters,
} from '@/lib/research-intel';

const impactIcons = {
  breakthrough: Zap,
  clinical: FlaskConical,
  preclinical: BookOpen,
};

const defaultFilters: ResearchIntelFilters = {
  tag: 'All',
  impact: 'all',
  compound: 'all',
  hallmark: 'all',
};

export function ResearchIntel() {
  const [filters, setFilters] = useState<ResearchIntelFilters>(defaultFilters);
  const [expanded, setExpanded] = useState<string | null>(researchFeed[0].id);

  const filtered = useMemo(() => filterResearchFeed(researchFeed, filters), [filters]);
  const context = useMemo(() => getResearchIntelContext(filters), [filters]);

  const setFilter = <K extends keyof ResearchIntelFilters>(key: K, value: ResearchIntelFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const chipClass = (active: boolean) =>
    `focus-ring px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
      active ? 'bg-accent-emerald text-black' : 'glass text-muted-foreground hover:text-foreground'
    }`;

  return (
    <SectionShell
      id="research"
      mod="MOD-INT-03"
      theme="emerald"
      badge="Research Intelligence"
      title="Longevity Intel Feed"
      subtitle="Lifespan.io publishes the news. TNiC connects it to your protocol. Every study mapped to actionable compounds and biomarkers."
      mesh
      className="bg-[#0a0f1a]/60"
    >
      <ContextRail
        what={context.what}
        why={context.why}
        next={context.next}
        theme="emerald"
        className="mb-8 max-w-4xl"
      />

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-label text-muted-foreground mb-2">Evidence type</p>
          <div className="flex flex-wrap gap-2">
            {researchImpactFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter('impact', f.id)}
                className={chipClass(filters.impact === f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-label text-muted-foreground mb-2">Topic</p>
          <div className="flex flex-wrap gap-2">
            {researchTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setFilter('tag', tag)}
                className={chipClass(filters.tag === tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-label text-muted-foreground mb-2">Compound</p>
          <div className="flex flex-wrap gap-2">
            {researchCompoundFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter('compound', f.id)}
                className={chipClass(filters.compound === f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-label text-muted-foreground mb-2">Hallmark</p>
          <div className="flex flex-wrap gap-2">
            {researchHallmarkFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter('hallmark', f.id)}
                className={chipClass(filters.hallmark === f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground glass rounded-2xl p-6 text-center">
          No headlines match these filters. Try broadening evidence type or clearing compound/hallmark chips.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => {
            const style = researchImpactStyles[article.impact];
            const ImpactIcon = impactIcons[article.impact];
            const isOpen = expanded === article.id;
            return (
              <motion.div
                key={article.id}
                layout
                className={`rounded-2xl overflow-hidden transition-all ${
                  isOpen ? 'gradient-border' : 'glass glass-hover'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : article.id)}
                  className="focus-ring w-full flex items-start gap-4 p-6 text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.color}`}>
                    <ImpactIcon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.color}`}>
                        {style.label}
                      </span>
                      <span className="text-[10px] font-mono text-caption">{article.date}</span>
                      <span className="text-[10px] text-accent-emerald/70">{article.tag}</span>
                    </div>
                    <h3 className="font-bold text-base md:text-lg">{article.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{article.source}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-border mx-6">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 pt-4">{article.summary}</p>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-accent-emerald hover:text-accent-cyan transition-colors font-mono"
                          >
                            PubMed: {article.pmid} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                          <Link
                            href={getBriefHrefForResearch(article.id)}
                            className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-accent-violet hover:text-accent-cyan transition"
                          >
                            <Radio className="w-3.5 h-3.5" aria-hidden="true" />
                            Protocol Brief
                          </Link>
                        </div>
                        {article.relatedHrefs.length > 0 && (
                          <div className="pt-3 border-t border-border/60">
                            <p className="text-label text-accent-emerald mb-2">Protocol links</p>
                            <ul className="flex flex-wrap gap-2">
                              {article.relatedHrefs.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold glass px-3 py-1.5 rounded-lg hover:border-accent-emerald/30 transition"
                                  >
                                    {link.label}
                                    <ArrowRight className="w-3 h-3 text-accent-emerald" aria-hidden="true" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
}