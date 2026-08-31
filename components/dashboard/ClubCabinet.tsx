'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, Infinity as InfinityIcon, Share2, Sparkles } from 'lucide-react';

interface StoredMember {
  name: string;
  code: string;
  claimedAt: string;
}

function subscribeToMemberCabinet(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('focus', callback);
  window.addEventListener('tnic:club-member-updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('focus', callback);
    window.removeEventListener('tnic:club-member-updated', callback);
  };
}

function getMemberCabinetSnapshot() {
  return localStorage.getItem('tnic:club-member') ?? '';
}

function getServerSnapshot() {
  return '';
}

function parseStoredMember(raw: string): StoredMember | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredMember>;
    return typeof value.name === 'string' && typeof value.code === 'string' && typeof value.claimedAt === 'string'
      ? { name: value.name, code: value.code, claimedAt: value.claimedAt }
      : null;
  } catch {
    return null;
  }
}

/** A private dashboard shelf for the voluntary, local-only Club identity. */
export function ClubCabinet() {
  const rawMember = useSyncExternalStore(subscribeToMemberCabinet, getMemberCabinetSnapshot, getServerSnapshot);
  const member = useMemo(() => parseStoredMember(rawMember), [rawMember]);

  if (!member) {
    return (
      <section className="card-floating relative overflow-hidden rounded-2xl p-6 md:p-7" aria-labelledby="member-cabinet-title">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-accent-emerald/10 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent-emerald/25 bg-accent-emerald/[0.06] px-3 py-1.5">
              <InfinityIcon className="h-3.5 w-3.5 text-accent-emerald" aria-hidden="true" />
              <span className="text-micro font-mono uppercase tracking-[0.12em] text-accent-emerald">Member Cabinet</span>
            </div>
            <h2 id="member-cabinet-title" className="text-xl font-bold tracking-tight">Make your evidence-first commitment visible.</h2>
            <p className="mt-2 max-w-2xl text-body-sm text-muted-foreground">Claim a private, shareable 150-Year Club charter card. No account, health data, or ranking required.</p>
          </div>
          <Link href="/club" className="focus-ring btn-ghost-premium inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
            Explore the Club
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="card-floating card-shine relative overflow-hidden rounded-2xl p-6 md:p-7" aria-labelledby="member-cabinet-title">
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-accent-emerald/15 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent-emerald/25 bg-accent-emerald/[0.08]">
            <InfinityIcon className="h-6 w-6 text-accent-emerald" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="text-micro font-mono uppercase tracking-[0.12em] text-accent-emerald">Member Cabinet</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-accent-violet/25 bg-accent-violet/[0.07] px-2 py-0.5 text-micro font-mono text-accent-violet"><Sparkles className="h-3 w-3" aria-hidden="true" /> Charter Member</span>
            </div>
            <h2 id="member-cabinet-title" className="truncate text-xl font-bold tracking-tight">{member.name}&apos;s 150-Year Club card</h2>
            <p className="mt-1 text-body-sm text-muted-foreground">A commitment to evidence before marketing. Kept locally on this device.</p>
          </div>
        </div>
        <Link href={`/club/${member.code}`} className="focus-ring interactive inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-accent-emerald/30 bg-accent-emerald/[0.07] px-4 py-3 text-sm font-semibold text-accent-emerald hover:bg-accent-emerald/[0.13]">
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Open card
        </Link>
      </div>
    </section>
  );
}
