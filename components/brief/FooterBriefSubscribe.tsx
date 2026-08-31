'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitBriefSubscription } from '@/lib/brief-subscribe-client';

/**
 * Sitewide, single-line email capture — the only lead-capture mechanism on
 * the site previously lived exclusively on /brief, which isn't in primary
 * nav and isn't linked from the homepage or footer. Reuses
 * submitBriefSubscription (the exact function BriefSubscribePanel.tsx uses)
 * so validation, localStorage save, and the /api/brief/subscribe POST are
 * 100% shared, not reinvented. Deliberately condensed — no
 * useSearchParams()/unsubscribe flow, no RSS/JSON feed buttons; that full
 * experience stays on /brief for anyone who wants it (linked below).
 */
export function FooterBriefSubscribe() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setResult(null);
    const res = await submitBriefSubscription(email.trim());
    setLoading(false);

    if (res.ok) {
      setResult({ ok: true, message: res.message ?? "Subscribed — you're on the list." });
      setEmail('');
    } else {
      setResult({ ok: false, message: res.error ?? 'Subscription failed.' });
    }
  };

  return (
    <div className="rounded-2xl border border-accent-violet/25 bg-gradient-to-br from-accent-violet/5 to-transparent p-5 sm:p-6 mb-10 md:mb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">Protocol Brief — weekly, by email</p>
            <p className="text-caption text-muted-foreground mt-0.5">
              New evidence, stack updates, corrections.{' '}
              <Link href="/brief#brief-subscribe" className="text-accent-cyan hover:underline">
                Manage subscription
              </Link>
            </p>
          </div>
        </div>
        <form onSubmit={subscribe} className="flex w-full max-w-sm shrink-0 gap-2 sm:w-auto">
          <label htmlFor="footer-brief-email" className="sr-only">
            Email address
          </label>
          <input
            id="footer-brief-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="focus-ring min-w-0 flex-1 rounded-xl border border-border/70 bg-card/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="focus-ring interactive shrink-0 rounded-xl bg-accent-violet/15 border border-accent-violet/30 px-4 py-2.5 text-sm font-semibold text-accent-violet transition-colors hover:bg-accent-violet/25 disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Subscribe'}
          </button>
        </form>
      </div>
      {result && (
        <p
          className={`mt-3 flex items-center gap-2 text-xs ${result.ok ? 'text-accent-emerald' : 'text-accent-rose'}`}
        >
          {result.ok ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          )}
          {result.message}
        </p>
      )}
    </div>
  );
}
