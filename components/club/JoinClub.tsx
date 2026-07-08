'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import { scorecardGrade } from '@/lib/scorecard';
import { encodeMember, sanitizeName } from '@/lib/club';

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeName(name);
    if (!clean) return;
    router.push(`/club/${encodeMember({ name: clean, grade })}`);
  };

  return (
    <form onSubmit={submit} className="card-floating card-shine rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        <BadgeCheck className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
        <p className="text-label text-accent-emerald">Claim your charter card</p>
      </div>
      <p className="text-body-sm mb-5">
        Charter Class of 2026. Enter your name to generate a shareable member card —
        {grade ? ` your current longevity grade (${grade}) rides along.` : ' build a stack first to carry your longevity grade.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
          maxLength={24}
          className="input-base flex-1"
        />
        <button
          type="submit"
          disabled={!sanitizeName(name)}
          className="focus-ring press btn-gradient rounded-xl text-sm !px-6 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
        >
          Join the Club
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <p className="text-caption mt-3">
        No account, no email — the card is generated from your name alone.
      </p>
    </form>
  );
}
