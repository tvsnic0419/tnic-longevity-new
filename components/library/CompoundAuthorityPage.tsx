import Link from 'next/link';
import {
  ArrowRight, ExternalLink, FlaskConical, ShieldAlert,
  Activity, Layers, Sparkles, ScrollText, Info,
} from 'lucide-react';
import { EvidenceBadgeFromTier } from '@/components/trust/EvidenceBadge';
import {
  getSafetyNote, getHallmarkLinks, getRelatedCompounds, getEvidenceStandard, latestStudyYear,
} from '@/lib/compound-authority';
import type { Compound, EvidenceTier } from '@/lib/types';

const TIER_ACCENT: Record<EvidenceTier, string> = {
  A: 'text-accent-emerald',
  B: 'text-accent-cyan',
  C: 'text-accent-violet',
};

// Literal class names so Tailwind's JIT keeps them (never build via string ops).
const TIER_DOT: Record<EvidenceTier, string> = {
  A: 'bg-accent-emerald',
  B: 'bg-accent-cyan',
  C: 'bg-accent-violet',
};

function Section({
  eyebrow, title, icon: Icon, children,
}: {
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-accent-cyan" aria-hidden="true" />
        <p className="text-[11px] font-mono uppercase tracking-widest text-accent-cyan">{eyebrow}</p>
      </div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border rounded-xl px-4 py-3">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold leading-snug">{value}</p>
    </div>
  );
}

export function CompoundAuthorityPage({ compound }: { compound: Compound }) {
  const safety = getSafetyNote(compound.id);
  const hallmarkLinks = getHallmarkLinks(compound);
  const related = getRelatedCompounds(compound);
  const rubric = getEvidenceStandard(compound.evidence);
  const reviewedYear = latestStudyYear(compound);
  const tierAccent = TIER_ACCENT[compound.evidence];

  return (
    <div className="container-page py-10 md:py-14">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <li><Link href="/library" className="hover:text-accent-cyan focus-ring rounded">Library</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/library" className="hover:text-accent-cyan focus-ring rounded">Compounds</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium">{compound.name}</li>
        </ol>
      </nav>

      <article className="max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <p className="text-[11px] font-mono uppercase tracking-widest text-accent-cyan mb-2">
            {compound.pathway}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{compound.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">Reference brand: {compound.brand}</p>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <EvidenceBadgeFromTier tier={compound.evidence} />
            <span className="text-xs text-muted-foreground">
              Graded against the{' '}
              <Link href="/trust/methodology" className="text-accent-cyan hover:underline focus-ring rounded">
                TNiC evidence rubric
              </Link>
            </span>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">{compound.desc}</p>
        </header>

        {/* Quick facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <Fact label="Typical dose" value={compound.dose} />
          <Fact label="Timing" value={compound.timing} />
          <Fact label="Bioavailability" value={`${compound.bioavailability}%`} />
          <Fact label="Evidence tier" value={`Tier ${compound.evidence}`} />
        </div>

        <div className="space-y-8">
          {/* Targeted hallmarks */}
          {hallmarkLinks.length > 0 && (
            <Section eyebrow="Targets" title="Aging hallmarks it acts on" icon={Layers}>
              <p className="text-sm text-muted-foreground mb-3">
                {compound.name} maps to {hallmarkLinks.length} of the twelve hallmarks of aging. Open a hallmark to
                see its full mechanism and the other interventions that target it.
              </p>
              <div className="flex flex-wrap gap-2">
                {hallmarkLinks.map((h) => (
                  <Link
                    key={h.slug}
                    href={`/library/${h.slug}`}
                    className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg px-3 py-1.5 hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors"
                  >
                    {h.title}
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </Section>
          )}

          {/* Mechanism */}
          <Section eyebrow="Mechanism" title="How it works" icon={FlaskConical}>
            <p className="text-sm leading-relaxed text-muted-foreground">{compound.mechanism}</p>
          </Section>

          {/* Evidence + studies */}
          <Section eyebrow="Evidence" title="Human trials & key studies" icon={ScrollText}>
            {compound.studies.length > 0 ? (
              <ul className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                {compound.studies.map((s) => (
                  <li key={s.pmid} className="p-4">
                    <p className="text-sm font-medium leading-snug mb-1">{s.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-mono">{s.journal} · {s.year}</span>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring inline-flex items-center gap-1 text-accent-cyan hover:underline rounded"
                      >
                        PMID {s.pmid}
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Citations are being compiled for this compound. See the{' '}
                <Link href="/trust/methodology" className="text-accent-cyan hover:underline">methodology</Link> for grading.
              </p>
            )}
          </Section>

          {/* Evidence grade — the rubric, rendered honestly */}
          <Section eyebrow="Grading" title={`Why this is graded ${rubric.label}`} icon={Info}>
            <p className="text-sm text-muted-foreground mb-3">
              TNiC grades every compound against a fixed, published rubric — not marketing. A{' '}
              <span className={`font-semibold ${tierAccent}`}>Tier {compound.evidence}</span> rating requires:
            </p>
            <ul className="space-y-2">
              {rubric.criteria.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${TIER_DOT[compound.evidence]}`} />
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4 border-l-2 border-border pl-3">
              Reference example: {rubric.example}
            </p>
          </Section>

          {/* Dose / form / timing */}
          <Section eyebrow="Protocol" title="Dose, form & timing" icon={Activity}>
            <dl className="grid sm:grid-cols-3 gap-4">
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Typical dose</dt>
                <dd className="text-sm">{compound.dose}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Timing</dt>
                <dd className="text-sm">{compound.timing === 'AM' ? 'Morning' : compound.timing === 'PM' ? 'Evening' : 'Morning &amp; evening'}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Absorption</dt>
                <dd className="text-sm">~{compound.bioavailability}% oral bioavailability</dd>
              </div>
            </dl>
          </Section>

          {/* Safety */}
          <Section eyebrow="Safety" title="Cautions, interactions & contraindications" icon={ShieldAlert}>
            {safety ? (
              <div className="space-y-4">
                {safety.cautions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-accent-amber mb-1.5">General cautions</p>
                    <ul className="space-y-1">
                      {safety.cautions.map((c) => (
                        <li key={c} className="text-sm text-muted-foreground">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {safety.avoidIf.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-accent-rose mb-1.5">Avoid if</p>
                    <ul className="space-y-1">
                      {safety.avoidIf.map((c) => (
                        <li key={c} className="text-sm text-muted-foreground">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {safety.consultIf.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-accent-cyan mb-1.5">Consult a clinician if</p>
                    <ul className="space-y-1">
                      {safety.consultIf.map((c) => (
                        <li key={c} className="text-sm text-muted-foreground">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No compound-specific contraindications are catalogued. Follow the{' '}
                <Link href="/trust/disclaimers" className="text-accent-cyan hover:underline">general safety guidance</Link>{' '}
                and review any new supplement with your clinician.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-4 border border-border rounded-lg p-3">
              Educational only — not medical advice. Taking prescription medication? Review this compound with your
              pharmacist or physician before starting.
            </p>
          </Section>

          {/* Synergies — interlink to other compounds */}
          {related.length > 0 && (
            <Section eyebrow="Stacking" title="Works well with" icon={Sparkles}>
              <div className="grid sm:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/library/compounds/${r.id}`}
                    className="focus-ring group border border-border rounded-xl p-4 hover:border-accent-violet/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold group-hover:text-accent-violet transition-colors">{r.name}</p>
                      <span className="text-[10px] font-mono text-muted-foreground">Tier {r.evidence}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.pathway}</p>
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Continue — no dead ends */}
        <section className="border-t border-border mt-10 pt-8">
          <p className="text-[11px] font-mono uppercase tracking-widest text-accent-emerald mb-4">Continue</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/stacks" className="focus-ring group flex items-center justify-between gap-3 border border-border rounded-xl p-4 hover:border-accent-cyan/40 transition-colors">
              <div>
                <p className="text-sm font-semibold">Build a stack with {compound.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Synergy scoring, dosing & interaction checks</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-cyan transition-colors shrink-0" aria-hidden="true" />
            </Link>
            <Link href="/quiz" className="focus-ring group flex items-center justify-between gap-3 border border-border rounded-xl p-4 hover:border-accent-emerald/40 transition-colors">
              <div>
                <p className="text-sm font-semibold">Find your protocol</p>
                <p className="text-xs text-muted-foreground mt-0.5">3-question quiz → a stack matched to your goal</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-emerald transition-colors shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Method note / review anchor */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            {reviewedYear
              ? `Evidence current through the most recent cited trial (${reviewedYear}).`
              : 'Evidence graded against the TNiC methodology.'}
          </p>
          <Link href="/trust/methodology" className="text-accent-cyan hover:underline focus-ring rounded">
            How compounds are graded →
          </Link>
        </footer>
      </article>
    </div>
  );
}
