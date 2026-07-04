import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Infinity as InfinityIcon, Check, ArrowRight } from 'lucide-react';
import { decodeMember, memberId, CHARTER_YEAR, CLUB_PLEDGE } from '@/lib/club';
import { ClubMemberShare } from '@/components/club/ClubMemberShare';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const m = decodeMember(code);
  if (!m) return { title: 'The 150-Year Club' };
  return {
    title: `${m.name} — Charter Member, The 150-Year Club`,
    description: `${m.name} joined the 150-Year Club (Charter Class of ${CHARTER_YEAR}) — a public commitment to the evidence-based pursuit of maximum healthspan. Claim your free charter card.`,
    robots: { index: false, follow: true },
  };
}

export default async function ClubMemberPage({ params }: Props) {
  const { code } = await params;
  const m = decodeMember(code);
  if (!m) redirect('/club');

  const id = memberId(m.name);

  return (
    <div className="min-h-screen section-deep">
      <div className="container-page py-16 md:py-24 max-w-2xl">
        {/* Membership card */}
        <div className="card-floating rounded-3xl p-8 md:p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-emerald/10 blur-3xl rounded-full" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <InfinityIcon className="w-5 h-5 text-accent-emerald" aria-hidden="true" />
                <span className="text-eyebrow !text-accent-emerald">The 150-Year Club</span>
              </div>
              <span className="text-caption font-mono">Charter Class {CHARTER_YEAR}</span>
            </div>

            <p className="text-label text-muted-foreground mb-1">Charter Member</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">{m.name}</h1>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div>
                <p className="text-caption">Member ID</p>
                <p className="font-mono text-accent-cyan text-lg">{id}</p>
              </div>
              {m.grade && (
                <div>
                  <p className="text-caption">Longevity grade</p>
                  <p className="font-mono text-accent-emerald text-lg">{m.grade}</p>
                </div>
              )}
              <div>
                <p className="text-caption">Status</p>
                <p className="font-mono text-foreground text-lg">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <p className="text-body-sm mb-6">
            {m.name} committed to the Charter Pledge. Share the card, or claim your own.
          </p>
          <ClubMemberShare code={code} />
        </div>

        {/* Pledge */}
        <div className="mb-10">
          <p className="text-label text-center mb-5">The Charter Pledge</p>
          <ul className="space-y-3">
            {CLUB_PLEDGE.map((line, i) => (
              <li key={i} className="flex gap-3 glass rounded-xl p-4">
                <Check className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-body-sm text-muted-foreground">{line}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link href="/club" className="focus-ring btn-ghost-premium inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
            Claim your charter card
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <p className="text-caption mt-6 max-w-md mx-auto">
            Membership is a commitment to the method, not a claim about the outcome. Educational only —
            not medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
