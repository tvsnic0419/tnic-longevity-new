'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Library, Search, ArrowRight, BookOpen, Dna } from 'lucide-react';
import { HallmarksConstellation } from '@/components/ui/HallmarksConstellation';
import { StatStrip } from '@/components/ui/StatStrip';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { libraryModules } from '@/lib/library-modules';
import { citationRegistry } from '@/lib/trust';

const hubStats = [
  { value: 12, label: 'Hallmarks', sublabel: 'Full MDX coverage' },
  { value: libraryModules.length, label: 'Modules', sublabel: 'Compounds & guides' },
  { value: citationRegistry.length, label: 'Citations', sublabel: 'PubMed traceable' },
  { value: 6, label: 'Compares', sublabel: 'Head-to-head' },
] as const;

export function LibraryHubHero() {
  return (
    <section className="hub-hero hub-hero-library relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 hub-hero-mesh pointer-events-none" aria-hidden="true" />
      <div className="relative container-page py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 card-ultra rounded-full px-4 py-2 mb-5 text-body-sm">
              <Library className="w-4 h-4 text-accent-cyan" aria-hidden="true" />
              <span>Anti-Aging Library</span>
              <span className="text-caption font-mono hidden sm:inline">MOD-LIB-13</span>
            </div>

            <h1 className="heading-page mb-4">
              Evidence-graded longevity
              <br />
              <span className="shimmer-text">intelligence hub</span>
            </h1>
            <p className="text-body max-w-xl mb-8">
              {hallmarkLibrary.length} hallmarks, {libraryModules.length} deep-dive modules, PMID citations on every claim.
              Search by compound, pathway, or biological problem — not by what&apos;s in stock.
            </p>

            <StatStrip stats={[...hubStats]} variant="hero" ariaLabel="Library scale" />

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="#hallmark-search" className="focus-ring btn-gradient text-sm">
                <Search className="w-4 h-4" aria-hidden="true" />
                Search hallmarks
              </Link>
              <Link href="/library/compare" className="focus-ring btn-ghost-premium text-sm">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Evidence compares
              </Link>
              <Link href="/elite-8" className="focus-ring interactive text-sm text-accent-violet hover:text-accent-cyan inline-flex items-center gap-1.5 px-4 py-2">
                Elite 8 Quotient
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="card-ultra card-ultra-hover p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Dna className="w-4 h-4 text-accent-violet" aria-hidden="true" />
                <p className="text-label text-accent-violet">Hallmark constellation</p>
              </div>
              <HallmarksConstellation />
              <p className="text-caption font-mono text-center mt-4">
                Hover a node · Jump to MDX module
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}