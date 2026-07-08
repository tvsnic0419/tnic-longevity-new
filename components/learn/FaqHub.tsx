'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';
import { consumerFAQ } from '@/lib/data';
import { PageHeader } from '@/components/ui/PageHeader';
import { getHubContext } from '@/lib/hub-context';

const faqCategories = [
  { id: 'all', label: 'All' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'safety', label: 'Safety' },
  { id: 'science', label: 'Science' },
  { id: 'products', label: 'Products' },
] as const;

export function FaqHub() {
  const [faqFilter, setFaqFilter] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<string | null>(consumerFAQ[0].id);

  const filteredFaq =
    faqFilter === 'all'
      ? consumerFAQ
      : consumerFAQ.filter((f) => f.category === faqFilter);

  return (
    <div className="container-page py-10 md:py-14">
      <PageHeader
        icon={HelpCircle}
        eyebrow="Learn"
        title="Frequently Asked Questions"
        description="Thirty-three expert answers about TNiC protocols, compound science, safety, evidence tiers, data privacy, and how we differ from supplement stores."
        align="left"
        context={getHubContext('faq')}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {faqCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFaqFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all focus-ring ${
              faqFilter === cat.id
                ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                : 'glass text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-w-3xl">
        {filteredFaq.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl overflow-hidden ${openFaq === item.id ? 'gradient-border' : 'glass'}`}
          >
            <button
              onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
              className="w-full flex items-center justify-between p-5 text-left focus-ring"
              aria-expanded={openFaq === item.id}
            >
              <span className="font-semibold text-sm pr-4">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                  openFaq === item.id ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {openFaq === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4 mx-5">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-12 gradient-border p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-3xl">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h2 className="font-bold text-sm mb-1">Need the full learning path?</h2>
            <p className="text-body-sm text-muted-foreground">
              Glossary, red flags, outcome timelines, and a 5-step getting started checklist live in
              the Learn hub.
            </p>
          </div>
        </div>
        <Link
          href="/learn"
          className="focus-ring interactive shrink-0 inline-flex items-center gap-2 bg-accent-cyan text-black px-5 py-3 rounded-xl font-semibold text-sm"
        >
          Open Learn hub
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
