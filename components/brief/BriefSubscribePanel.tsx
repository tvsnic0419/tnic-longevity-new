'use client';
/* eslint-disable react-hooks/set-state-in-effect --
   The mount/URL-driven effect(s) below set state from client-only sources
   (localStorage, window, or URL search params) or trigger entrance animations.
   These cannot run during SSR, so the initial setState is intentional and not a
   value derivable during render. Reviewed 2026-06-21; safe to keep. */

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Bell, CheckCircle2, X, Rss, AlertCircle } from 'lucide-react';
import { SITE } from '@/lib/site';
import {
  getBriefSubscription,
  clearBriefSubscription,
} from '@/lib/brief-subscribe';
import { submitBriefSubscription } from '@/lib/brief-subscribe-client';

function BriefSubscribePanelInner() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<'feed' | 'webhook' | 'resend' | null>(null);
  const [loading, setLoading] = useState(false);
  const [unsubNotice, setUnsubNotice] = useState<string | null>(null);
  const [welcomeSent, setWelcomeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const record = getBriefSubscription();
    if (record) {
      setSubscribed(true);
      setSavedEmail(record.email);
      setEmail(record.email);
    }
  }, []);

  useEffect(() => {
    const status = searchParams.get('unsubscribe');
    if (!status) return;

    if (status === 'ok') {
      clearBriefSubscription();
      setSubscribed(false);
      setSavedEmail(null);
      setEmail('');
      setDeliveryMode(null);
      setUnsubNotice('You have been unsubscribed from Protocol Brief emails.');
    } else if (status === 'partial') {
      setUnsubNotice('Unsubscribe recorded locally — contact support if emails continue.');
    } else if (status === 'invalid') {
      setUnsubNotice('Invalid unsubscribe link — use the link from your latest email.');
    } else if (status === 'error') {
      setUnsubNotice('Unsubscribe failed — try again or clear your preference below.');
    }
  }, [searchParams]);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setUnsubNotice(null);
    setError(null);

    const result = await submitBriefSubscription(email.trim());
    setLoading(false);

    if (result.ok) {
      setDeliveryMode(result.mode ?? 'feed');
      setWelcomeSent(Boolean(result.welcomeSent));
      setSubscribed(true);
      setSavedEmail(email.trim());
      if (result.message) setUnsubNotice(result.message);
      return;
    }

    setError(result.error ?? 'Subscription failed.');
  };

  const unsubscribe = () => {
    const cleared = clearBriefSubscription();
    setSubscribed(false);
    setSavedEmail(null);
    setEmail('');
    setDeliveryMode(null);
    setError(null);
    setUnsubNotice(
      cleared
        ? 'Local preference cleared — use the email unsubscribe link to leave the Resend list.'
        : 'Could not clear local preference — check browser storage settings.',
    );
  };

  return (
    <section
      id="brief-subscribe"
      className="rounded-2xl border border-accent-violet/25 bg-gradient-to-br from-accent-violet/5 to-transparent p-6 md:p-8 mb-10"
      aria-labelledby="brief-subscribe-heading"
    >
      <div className="flex items-start gap-3 mb-4">
        <Bell className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" />
        <div>
          <h2 id="brief-subscribe-heading" className="font-bold text-lg">
            Automated Protocol Brief delivery
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Subscribe by email for an instant welcome preview plus weekly rotating digests (Resend when
            configured). Or add the RSS/JSON feed — one-click unsubscribe in every email.
          </p>
        </div>
      </div>

      {unsubNotice && (
        <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-4 bg-accent-emerald/10 text-accent-emerald">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          {unsubNotice}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href="/brief/feed.xml"
          className="focus-ring interactive inline-flex items-center gap-2 px-3 py-2 rounded-lg glass glass-hover text-xs font-semibold"
        >
          <Rss className="w-3.5 h-3.5 text-accent-violet" />
          RSS feed
        </a>
        <a
          href="/brief/feed.json"
          className="focus-ring interactive inline-flex items-center gap-2 px-3 py-2 rounded-lg glass glass-hover text-xs font-semibold"
        >
          JSON feed
        </a>
      </div>

      {subscribed && savedEmail ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                {deliveryMode === 'resend'
                  ? welcomeSent
                    ? 'Subscribed — welcome email sent, weekly delivery active'
                    : 'Subscribed — weekly email delivery active'
                  : deliveryMode === 'webhook'
                    ? 'Email queued via webhook'
                    : 'Subscribed — use feeds'}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{savedEmail}</p>
              {deliveryMode === 'resend' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Unsubscribe via the link in your weekly email.
                </p>
              )}
              {deliveryMode === 'feed' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Add{' '}
                  <Link href="/brief/feed.xml" className="text-accent-cyan hover:underline">
                    {SITE.url}/brief/feed.xml
                  </Link>{' '}
                  to Feedly, Apple News, or your reader.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={unsubscribe}
            className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-accent-rose rounded shrink-0"
          >
            <X className="w-3.5 h-3.5" /> Clear preference
          </button>
        </div>
      ) : (
        <form onSubmit={subscribe} className="flex flex-col gap-2 max-w-lg">
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
    </section>
  );
}

export function BriefSubscribePanel() {
  return (
    <Suspense fallback={<div className="mb-10 h-32 rounded-2xl glass animate-pulse" />}>
      <BriefSubscribePanelInner />
    </Suspense>
  );
}