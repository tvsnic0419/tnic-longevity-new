'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

const PERKS = [
  '12 Hallmarks of Aging — mechanism maps + top interventions',
  'Evidence tier cheatsheet: what actually works in humans',
  'Compound interaction matrix for safe stacking',
];

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    // Store locally — no server call, consistent with privacy-first architecture
    try {
      const existing = JSON.parse(localStorage.getItem('tnic_email_capture') ?? '[]') as string[];
      if (!existing.includes(email.trim())) {
        localStorage.setItem('tnic_email_capture', JSON.stringify([...existing, email.trim()]));
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="py-20 border-t border-border/50 bg-gradient-to-b from-emerald-500/5 to-transparent">
      <div className="container-page max-w-3xl">
        <div className="rounded-2xl border border-emerald-500/20 bg-card/60 p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400 tracking-widest uppercase">Free Resource</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
            Get the 12 Hallmarks Quick Guide
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            A research-dense, no-fluff reference covering every hallmark of aging, the top evidence-graded interventions,
            and the biomarkers that track each one.
          </p>

          <ul className="space-y-2 mb-8 text-left max-w-md mx-auto">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {p}
              </li>
            ))}
          </ul>

          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-5 h-5" />
              Saved — check your Downloads folder soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-black px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Saving…' : <>Send it <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-xs text-rose-400 mt-3">Something went wrong — try again.</p>
          )}

          <p className="text-xs text-muted-foreground/60 mt-4">
            No spam. No data sold. Stored locally per our privacy-first architecture.
          </p>
        </div>
      </div>
    </section>
  );
}
