'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { productPicks } from '@/lib/product-picks';
import { ProductPickCard } from '@/components/shop/ProductPickCard';
import { ContextRail } from '@/components/ui/ContextRail';
import { useBriefSubscribe } from '@/hooks/useBriefSubscribe';

const featuredPicks = productPicks.filter((p) => p.compoundId !== 'nr').slice(0, 3);

export function HomepageProductRail() {
  const { email, setEmail, subscribed, loading, error, notice, subscribe } = useBriefSubscribe();

  return (
    <section className="py-16 md:py-20 border-b border-border section-mesh section-glow-amber bg-[#0a0f1a]/30">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-label text-accent-amber mb-3">VERIFIED PICKS</p>
            <h2 className="heading-section">Evidence-aligned products</h2>
            <p className="text-muted-foreground mt-3 max-w-xl text-sm">
              One best-in-class pick per compound. TNiC may earn a commission — it never influences
              which products are listed. Cross-check every pick with Protocol Shop COA checklists before you buy.
            </p>
          </div>
          <Link
            href="/products"
            className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-accent-amber card-premium px-4 py-2 rounded-xl hover:bg-accent-amber/10 transition shrink-0"
          >
            Full catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ContextRail
          what="Curated manufacturer links with trial-matched dose notes — not an affiliate store."
          why="Most longevity sites monetize before they educate. TNiC publishes picks only after evidence grading and COA criteria are met."
          next="Browse all products, then run stack-filtered verification at Protocol Shop."
          theme="amber"
          className="mb-8"
        />

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {featuredPicks.map((pick, i) => (
            <motion.div
              key={pick.compoundId}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductPickCard pick={pick} className="h-full card-premium glow-hover-amber border-border/60" />
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl card-premium border border-accent-violet/20 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex items-start gap-3 flex-1">
            <Package className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Get the Starter Defense Stack + weekly Brief</p>
              <p className="text-xs text-muted-foreground mt-1">
                Email capture for Protocol Brief — includes stack handoff links and PMID-curated research.
              </p>
            </div>
          </div>
          {subscribed ? (
            <div className="flex flex-col gap-1 shrink-0">
              <div className="flex items-center gap-2 text-sm text-accent-emerald">
                <CheckCircle2 className="w-4 h-4" />
                Subscribed — check your inbox
              </div>
              {notice && <p className="text-caption text-muted-foreground">{notice}</p>}
            </div>
          ) : (
            <form onSubmit={subscribe} className="flex flex-col gap-2 w-full md:w-auto shrink-0">
              {error && (
                <p role="alert" className="flex items-center gap-1.5 text-xs text-accent-rose">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </p>
              )}
              <div className="flex gap-2">
              <div className="relative flex-1 md:w-56">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-2.5 text-sm focus-ring"
                  aria-label="Email for stack and Brief"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring shrink-0 bg-accent-violet/20 border border-accent-violet/30 text-accent-violet px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent-violet/30 disabled:opacity-60"
              >
                {loading ? '…' : 'Subscribe'}
              </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}