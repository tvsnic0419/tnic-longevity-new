'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, FlaskConical, ArrowRight, ExternalLink } from 'lucide-react';
import { ContextRail } from '@/components/ui/ContextRail';
import { usePlatform } from '@/context/PlatformContext';
import { featuredStacks } from '@/lib/homepage';
import { compounds, researchFeed } from '@/lib/data';
import { getPresetCompoundIds } from '@/lib/homepage-personalization';
import type { PresetKey } from '@/lib/presets';

const impactColor = {
  breakthrough: 'text-accent-amber bg-accent-amber/10 border border-accent-amber/20',
  clinical:     'text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20',
  preclinical:  'text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20',
};

function getPersonalizedResearch(preset?: string) {
  if (!preset) return researchFeed.slice(0, 3);

  const compoundIds = new Set(getPresetCompoundIds(preset));
  const presetMatches = researchFeed.filter(
    (item) =>
      item.presetKey === preset ||
      item.relatedHrefs?.some((link) =>
        compoundIds.has(link.href.split('/').pop() ?? ''),
      ),
  );

  return (presetMatches.length > 0 ? presetMatches : researchFeed).slice(0, 3);
}

export function LibraryHighlights() {
  const { quizResult } = usePlatform();
  const preset = quizResult?.preset as PresetKey | undefined;
  const latestResearch = getPersonalizedResearch(preset);

  return (
    <section id="library" className="py-20 md:py-28 bg-background border-b border-border section-glow-violet section-mesh">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 section-header-mesh">
          <div>
            <p className="text-label text-accent-violet mb-3">THE LIBRARY</p>
            <h2 className="heading-section">
              Curated stacks. Live research.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Not a supplement catalog — an evidence library. Every stack is graded, every study linked to actionable compounds.
            </p>
          </div>
          <Link
            href="/library"
            className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-accent-violet card-premium px-4 py-2 rounded-xl hover:bg-accent-violet/10 transition shrink-0"
          >
            Full library <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ContextRail
          what="Evidence-graded stacks and live research headlines — both linked to compound deep-dives."
          why="Knowing what to take requires knowing what the science actually says, not marketing claims."
          next="Browse featured stacks for presets, or follow research headlines to Protocol Brief issues."
          theme="violet"
          className="mb-12"
        />

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Featured Stacks */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="icon-badge-violet w-7 h-7 rounded-lg flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-accent-violet" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Featured Stacks</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {featuredStacks.map((stack, i) => (
                <motion.a
                  key={stack.key}
                  href={`/stacks?preset=${stack.key}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group block rounded-2xl p-5 border border-border/60 bg-gradient-to-br from-accent-violet/[0.07] to-transparent backdrop-blur-sm glow-hover-violet transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono font-semibold text-accent-violet bg-accent-violet/10 border border-accent-violet/20 px-2 py-0.5 rounded-lg">{stack.compoundCount} compounds</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-violet transition" />
                  </div>
                  <h4 className="font-bold mb-1 group-hover:text-accent-violet transition text-sm">{stack.label}</h4>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{stack.desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {stack.ids.slice(0, 3).map((id) => {
                      const c = compounds.find((x) => x.id === id);
                      return c ? (
                        <span key={id} className="text-[9px] font-mono text-accent-violet/70 bg-accent-violet/10 px-1.5 py-0.5 rounded border border-accent-violet/15">
                          {c.name.split(' ')[0]}
                        </span>
                      ) : null;
                    })}
                    {stack.ids.length > 3 && (
                      <span className="text-[9px] font-mono text-muted-foreground">+{stack.ids.length - 3}</span>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Latest Research */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="icon-badge-emerald w-7 h-7 rounded-lg flex items-center justify-center">
                <FlaskConical className="w-3.5 h-3.5 text-accent-emerald" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                {preset ? 'Research for your stack' : 'Latest Research'}
              </h3>
            </div>
            <div className="space-y-3">
              {latestResearch.map((article, i) => (
                <motion.a
                  key={article.id}
                  href="/#research"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group block rounded-2xl p-5 border border-border/60 bg-gradient-to-br from-accent-emerald/[0.06] to-transparent backdrop-blur-sm glow-hover-emerald transition-all duration-300 flex gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${impactColor[article.impact]}`}>
                        {article.tag}
                      </span>
                      <span className="text-caption font-mono">{article.date}</span>
                    </div>
                    <h4 className="font-semibold text-sm leading-snug group-hover:text-accent-emerald transition line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-caption mt-1">{article.source}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent-emerald shrink-0 mt-1 transition" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
