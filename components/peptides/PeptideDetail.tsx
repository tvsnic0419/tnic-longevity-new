'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FlaskConical, Syringe, Scale } from 'lucide-react';
import type { Peptide } from '@/lib/types';
import { peptideCategoryMeta, peptideLibrary } from '@/lib/peptides-library';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { PeptideLegalBadge, getPeptideLegalStatusMeta } from './PeptideLegalBadge';
import { PeptideContextStrip } from './PeptideContextStrip';
import { MdxRenderer } from '@/components/library/MdxRenderer';
import { ContentByline } from '@/components/trust/ContentByline';

/** ThemeAccent -> full static Tailwind class strings — see the identical
 * note in LibraryModuleDetail.tsx on why these can't be interpolated. */
const themeVisual: Record<string, { badgeClass: string; glowClass: string; textClass: string }> = {
  cyan: { badgeClass: 'icon-badge-cyan', glowClass: 'glow-cyan', textClass: 'text-accent-cyan' },
  emerald: { badgeClass: 'icon-badge-emerald', glowClass: 'glow-emerald', textClass: 'text-accent-emerald' },
  violet: { badgeClass: 'icon-badge-violet', glowClass: 'glow-violet', textClass: 'text-accent-violet' },
  rose: { badgeClass: 'icon-badge-rose', glowClass: 'glow-rose', textClass: 'text-accent-rose' },
  amber: { badgeClass: 'icon-badge-amber', glowClass: 'glow-amber', textClass: 'text-accent-amber' },
};

export function PeptideDetail({
  peptide,
  mdxBody,
  lastUpdated,
  author,
  reviewer,
}: {
  peptide: Peptide;
  mdxBody: string | null;
  lastUpdated?: string;
  author?: string;
  reviewer?: string;
}) {
  const categoryMeta = peptideCategoryMeta[peptide.category];
  const legalMeta = getPeptideLegalStatusMeta(peptide.legalStatus);
  const relatedHallmarks = hallmarkLibrary.filter((h) => peptide.relatedHallmarkIds.includes(h.id));
  const relatedPeptides = (peptide.relatedPeptideIds ?? [])
    .map((id) => peptideLibrary.find((p) => p.id === id))
    .filter((p): p is Peptide => Boolean(p));
  const citationCount = mdxBody
    ? new Set(mdxBody.match(/\bPMID:?\s*(\d{7,8})\b/g)?.map((m) => m.replace(/\D/g, '')) ?? []).size
    : 0;

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/peptides"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-cyan transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Peptides
        </Link>
        <ContentByline
          author={author}
          lastUpdated={lastUpdated}
          reviewer={reviewer}
          citationCount={citationCount}
          className="mb-8"
        />

        <div className="grid lg:grid-cols-12 gap-10">
          <aside className="order-2 lg:order-1 lg:col-span-4 space-y-6">
            <div className="card-elevated p-6">
              <p className="text-micro font-mono text-accent-cyan tracking-widest mb-2 uppercase">
                {categoryMeta.label}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <EvidenceTag tier={peptide.evidenceTier} size="lg" />
                <PeptideLegalBadge status={peptide.legalStatus} size="lg" />
              </div>
              <h2 className="text-lg font-bold mb-4">Page outline</h2>
              <ol className="space-y-2">
                {peptide.outline.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-accent-cyan font-mono text-xs shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Syringe className="w-4 h-4 text-accent-cyan" />
                <p className="text-micro font-mono text-accent-cyan uppercase">Administration</p>
              </div>
              <p className="text-sm text-muted-foreground">{peptide.administrationRoute}</p>
            </div>

            {relatedHallmarks.length > 0 && (
              <div className="glass rounded-xl p-5">
                <p className="text-micro font-mono text-accent-violet uppercase mb-3">Related hallmarks</p>
                <ul className="space-y-2">
                  {relatedHallmarks.map((h) => (
                    <li key={h.id}>
                      <Link
                        href={`/library/${h.slug}`}
                        className="text-sm text-muted-foreground hover:text-accent-cyan transition"
                      >
                        #{h.number} {h.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedPeptides.length > 0 && (
              <div className="glass rounded-xl p-5">
                <p className="text-micro font-mono text-accent-emerald uppercase mb-3">Related peptides</p>
                <ul className="space-y-2">
                  {relatedPeptides.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/peptides/${p.slug}`}
                        className="text-sm text-muted-foreground hover:text-accent-cyan transition"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/trust/disclaimers"
              className="focus-ring interactive flex items-center gap-3 glass glass-hover rounded-xl p-4"
            >
              <Scale className="w-5 h-5 text-accent-rose shrink-0" />
              <div>
                <p className="text-sm font-semibold">Legal & safety disclaimers</p>
                <p className="text-xs text-muted-foreground">Read before sourcing anything</p>
              </div>
            </Link>

            <Link
              href="/labs"
              className="focus-ring interactive flex items-center gap-3 glass glass-hover rounded-xl p-4"
            >
              <FlaskConical className="w-5 h-5 text-accent-cyan shrink-0" />
              <div>
                <p className="text-sm font-semibold">Labs hub</p>
                <p className="text-xs text-muted-foreground">Track biomarkers alongside any protocol</p>
              </div>
            </Link>
          </aside>

          <div className="order-1 lg:order-2 min-w-0 lg:col-span-8 space-y-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <PeptideContextStrip peptide={peptide} />
              <div className="flex items-start gap-4 mb-2">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${themeVisual[categoryMeta.theme].badgeClass} ${themeVisual[categoryMeta.theme].glowClass}`}
                  aria-hidden="true"
                >
                  <Syringe className={`h-7 w-7 ${themeVisual[categoryMeta.theme].textClass}`} />
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight pt-1">
                  {peptide.name}
                  {peptide.aliases && peptide.aliases.length > 0 && (
                    <span className="block text-sm font-normal text-muted-foreground mt-1">
                      Also known as: {peptide.aliases.join(', ')}
                    </span>
                  )}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{peptide.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{peptide.summary}</p>
            </motion.div>

            <div className={`rounded-xl p-5 border flex gap-3 ${legalMeta.bannerClassName}`}>
              <Scale className={`w-5 h-5 shrink-0 mt-0.5 ${legalMeta.iconClassName}`} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold mb-1">{legalMeta.label}</p>
                <p className="text-sm text-muted-foreground">{legalMeta.description}</p>
              </div>
            </div>

            {mdxBody ? (
              <div className="gradient-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-accent-cyan" />
                  <p className="text-micro font-mono text-accent-cyan uppercase">Deep dive</p>
                </div>
                <MdxRenderer content={mdxBody} selfHref={`/peptides/${peptide.slug}`} />
              </div>
            ) : (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground">
                Content module in progress. Outline available in sidebar.
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href="/peptides"
                className="focus-ring interactive tnic-button-tonal inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              >
                All peptides
              </Link>
              <Link
                href="/labs"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                Open Labs hub
              </Link>
              <Link
                href="/trust"
                className="focus-ring interactive inline-flex items-center gap-2 px-4 py-2 rounded-lg glass glass-hover text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                Evidence methodology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
