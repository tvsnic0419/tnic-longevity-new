'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck, Infinity as InfinityIcon, ShieldCheck } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { scorecardGrade } from '@/lib/scorecard';
import { encodeMember, memberId, sanitizeName, CHARTER_YEAR } from '@/lib/club';

export function JoinClub() {
  const router = useRouter();
  const { score, selected } = usePlatform();
  const [name, setName] = useState('');

  const grade =
    selected.length > 0
      ? scorecardGrade({
          age: 0,
          bioAge: 0,
          synergy: score,
          coverage: Math.min(100, (selected.length / 12) * 100),
          stackSize: selected.length,
        })
      : undefined;

  const cleanName = sanitizeName(name);
  const previewName = cleanName || 'Your name';
  const previewId = cleanName ? memberId(cleanName) : `CHTR-${CHARTER_YEAR}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanName) return;
    const code = encodeMember({ name: cleanName, grade });
    try {
      localStorage.setItem('tnic:club-member', JSON.stringify({ name: cleanName, code, claimedAt: new Date().toISOString() }));
      window.dispatchEvent(new Event('tnic:club-member-updated'));
    } catch {
      // The card URL remains fully usable when storage is unavailable.
    }
    router.push(`/club/${code}`);
  };

  return (
    <form onSubmit={submit} className="card-floating card-shine overflow-hidden rounded-3xl p-5 md:p-7">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.78fr)] lg:items-stretch">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
            <p className="text-label text-accent-emerald">Claim your charter card</p>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Make the commitment visible.</h2>
          <p className="text-body-sm mt-3 max-w-xl text-muted-foreground">
            Charter Class of {CHARTER_YEAR}. Your card marks a commitment to inspect the evidence, state the limits, and share what you learn in the open.
          </p>

          <label className="mt-6 text-label text-foreground" htmlFor="club-member-name">Your name</label>
          <div className="mt-2 flex flex-col sm:flex-row gap-3">
            <input
              id="club-member-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-describedby="club-member-privacy"
              maxLength={24}
              className="input-base flex-1"
            />
            <button
              type="submit"
              disabled={!cleanName}
              className="focus-ring press btn-gradient rounded-xl text-sm !px-6 shrink-0 disabled:pointer-events-none disabled:opacity-40"
            >
              Generate my card
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p id="club-member-privacy" className="text-caption mt-3">
            No account, email, health data, or public ranking. Your card is generated from your name alone.
          </p>
        </div>

        <aside className="relative overflow-hidden rounded-2xl border border-accent-emerald/30 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(16,185,129,0.20),transparent_50%),linear-gradient(135deg,rgba(10,18,28,0.92),rgba(5,10,19,0.98))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" aria-label="Charter card preview">
          <span className="pointer-events-none absolute -right-10 -bottom-12 h-44 w-44 rounded-full border border-accent-cyan/20" aria-hidden="true" />
          <span className="pointer-events-none absolute right-8 top-12 h-px w-40 rotate-[-32deg] bg-gradient-to-r from-transparent via-accent-emerald/50 to-transparent" aria-hidden="true" />
          <div className="relative flex h-full min-h-56 flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 text-accent-emerald">
                <InfinityIcon className="h-4 w-4" aria-hidden="true" />
                <span className="text-micro font-mono uppercase tracking-[0.16em]">The 150-Year Club</span>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-micro font-mono text-muted-foreground">{CHARTER_YEAR}</span>
            </div>
            <p className="mt-8 text-micro font-mono uppercase tracking-[0.16em] text-muted-foreground">Charter Member</p>
            <p className="mt-2 font-display text-3xl leading-tight text-foreground break-words">{previewName}</p>
            <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground">Member ID</p>
                <p className="mt-1 text-sm font-mono text-accent-cyan">{previewId}</p>
              </div>
              <div>
                <p className="text-micro font-mono uppercase tracking-[0.1em] text-muted-foreground">Pledge</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent-emerald"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Evidence first</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
