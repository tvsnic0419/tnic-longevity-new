'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Mail, Rss, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContextRail } from '@/components/ui/ContextRail';
import { SITE } from '@/lib/site';
import { useBriefSubscribe } from '@/hooks/useBriefSubscribe';

export function HomepageBriefRail() {
  const { email, setEmail, subscribed, loading, error, notice, subscribe } = useBriefSubscribe();

  return (
    <section className="py-16 md:py-20 border-b border-border bg-[#0a0f1a]/50 section-mesh">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10">
          <div className="lg:w-2/5">
            <p className="text-label text-accent-violet mb-3">PROTOCOL BRIEF</p>
            <h2 className="heading-section mb-3">
              Research that maps to your stack
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-6">
              Weekly PMID-curated digests synced from Research Intel — every headline linked to
              compounds, hallmarks, and stack presets. No hype, no affiliate spin.
            </p>
            <ContextRail
              what="PMID-curated research digest with protocol links to hallmarks, compounds, and stacks."
              why="Headlines without stack context waste time. Brief issues translate trials into actionable modules."
              next="Subscribe for email or RSS, then follow protocol links from your quiz preset."
              theme="violet"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 rounded-2xl border border-accent-violet/25 bg-gradient-to-br from-accent-violet/8 to-transparent p-6 md:p-8"
          >
            <div className="flex items-start gap-3 mb-5">
              <Bell className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold">Get the Brief on your schedule</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Instant welcome preview when Resend is configured. One-click unsubscribe in every email.
                </p>
              </div>
            </div>

            {subscribed && email ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Subscribed — weekly delivery active</p>
                    <p className="text-xs text-muted-foreground font-mono">{email}</p>
                    {notice && <p className="text-caption mt-1">{notice}</p>}
                  </div>
                </div>
                <Link
                  href="/brief"
                  className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-accent-violet shrink-0"
                >
                  Read latest issue <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <form onSubmit={subscribe} className="flex flex-col gap-2 mb-4">
                {error && (
                  <p role="alert" className="flex items-center gap-1.5 text-xs text-accent-rose">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm focus-ring"
                    aria-label="Email for Protocol Brief"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="focus-ring shrink-0 inline-flex items-center justify-center gap-2 bg-accent-violet/20 border border-accent-violet/30 text-accent-violet px-5 py-3 rounded-xl font-semibold text-sm hover:bg-accent-violet/30 transition disabled:opacity-60"
                >
                  <Bell className="w-4 h-4" />
                  {loading ? 'Subscribing…' : 'Subscribe'}
                </button>
                </div>
              </form>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href="/brief/feed.xml"
                className="focus-ring interactive inline-flex items-center gap-2 px-3 py-2 rounded-lg glass glass-hover text-xs font-semibold"
              >
                <Rss className="w-3.5 h-3.5 text-accent-violet" />
                RSS feed
              </a>
              <Link
                href="/brief"
                className="focus-ring interactive inline-flex items-center gap-2 px-3 py-2 rounded-lg glass glass-hover text-xs font-semibold"
              >
                Browse issues
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[10px] font-mono text-muted-foreground self-center hidden sm:inline">
                {SITE.url}/brief/feed.xml
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}