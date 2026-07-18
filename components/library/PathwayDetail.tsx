import Link from 'next/link';
import { ArrowLeft, ArrowRight, Waypoints } from 'lucide-react';
import type { Pathway, PathwayLever } from '@/lib/pathways';
import { compounds } from '@/lib/data';
import { peptideLibrary } from '@/lib/peptides-library';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { themes } from '@/lib/design-system';
import { PageHeader } from '@/components/ui/PageHeader';
import { EvidenceTag } from '@/components/trust/EvidenceTag';
import { getHubContext } from '@/lib/hub-context';

function leverHref(l: PathwayLever): string {
  if (l.compoundId) return `/library/compounds/${l.compoundId}`;
  if (l.peptideId) return `/peptides/${l.peptideId}`;
  return l.href ?? '#';
}

function leverName(l: PathwayLever): string {
  if (l.compoundId) return compounds.find((c) => c.id === l.compoundId)?.name ?? l.compoundId;
  if (l.peptideId) return peptideLibrary.find((p) => p.id === l.peptideId)?.name ?? l.peptideId;
  return l.name ?? '';
}

function LeverCard({ lever, theme }: { lever: PathwayLever; theme: Pathway['theme'] }) {
  const t = themes[theme];
  return (
    <Link
      href={leverHref(lever)}
      className="focus-ring interactive group flex flex-col gap-2 glass glass-hover rounded-xl p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`font-semibold text-sm ${t.text}`}>{leverName(lever)}</span>
        <EvidenceTag tier={lever.evidenceTier} size="sm" showTooltip={false} className="shrink-0" />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{lever.role}</p>
    </Link>
  );
}

export function PathwayDetail({ pathway }: { pathway: Pathway }) {
  const t = themes[pathway.theme];
  const primaryLevers = pathway.levers.filter((l) => l.strength === 'primary');
  const secondaryLevers = pathway.levers.filter((l) => l.strength === 'secondary');
  const relatedHallmarks = hallmarkLibrary.filter((h) => pathway.relatedHallmarkIds.includes(h.id));

  return (
    <div className="min-h-screen canvas-scrim text-foreground pt-6 md:pt-8 pb-20">
      <div className="container-page max-w-5xl">
        <Link
          href="/library/pathways"
          className="focus-ring interactive inline-flex items-center gap-2 text-body-sm text-muted-foreground hover:text-accent-violet mb-6 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All pathways
        </Link>

        <PageHeader
          icon={Waypoints}
          eyebrow={pathway.keyMolecules.slice(0, 4).join(' · ')}
          title={pathway.name}
          description={pathway.tagline}
          theme={pathway.theme}
          align="left"
          context={getHubContext('pathways')}
        />

        {/* Mechanism synthesis */}
        <section aria-labelledby="mechanism-heading" className="mb-10">
          <h2 id="mechanism-heading" className={`text-label mb-4 ${t.text}`}>
            Mechanism
          </h2>
          <div className="space-y-4 max-w-3xl">
            {pathway.synthesis.map((para, i) => (
              <p key={i} className="text-body text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Why it matters */}
        <section className={`mb-10 rounded-2xl border p-6 max-w-3xl ${t.border} ${t.bg}`}>
          <p className={`text-label mb-2 ${t.text}`}>Why it matters</p>
          <p className="text-sm text-foreground/90 leading-relaxed">{pathway.whyItMatters}</p>
        </section>

        {/* Primary levers */}
        <section aria-labelledby="primary-levers-heading" className="mb-8">
          <h2 id="primary-levers-heading" className={`text-label mb-4 ${t.text}`}>
            Primary levers
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {primaryLevers.map((l) => (
              <LeverCard key={l.compoundId ?? l.peptideId ?? l.name} lever={l} theme={pathway.theme} />
            ))}
          </div>
        </section>

        {secondaryLevers.length > 0 && (
          <section aria-labelledby="secondary-levers-heading" className="mb-10">
            <h2 id="secondary-levers-heading" className="text-label text-muted-foreground mb-4">
              Secondary / crosstalk levers
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {secondaryLevers.map((l) => (
                <LeverCard key={l.compoundId ?? l.peptideId ?? l.name} lever={l} theme={pathway.theme} />
              ))}
            </div>
          </section>
        )}

        {/* Related hallmarks */}
        {relatedHallmarks.length > 0 && (
          <section aria-labelledby="related-hallmarks-heading" className="mb-10">
            <h2 id="related-hallmarks-heading" className="text-label text-muted-foreground mb-4">
              Hallmarks this pathway addresses
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedHallmarks.map((h) => (
                <Link
                  key={h.id}
                  href={`/library/${h.slug}`}
                  className="focus-ring interactive text-xs px-3 py-1.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  {h.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Further reading */}
        {pathway.furtherReading.length > 0 && (
          <section aria-labelledby="further-reading-heading">
            <h2 id="further-reading-heading" className="text-label text-muted-foreground mb-4">
              Further reading
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {pathway.furtherReading.map((fr) => (
                <li key={fr.href}>
                  <Link
                    href={fr.href}
                    className="focus-ring interactive group flex items-center justify-between gap-3 glass glass-hover rounded-xl p-4"
                  >
                    <span className="text-sm font-semibold text-foreground truncate">{fr.label}</span>
                    <ArrowRight className={`w-4 h-4 shrink-0 text-muted-foreground group-hover:${t.text} transition-colors`} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs text-muted-foreground mt-10 max-w-2xl">
          Pathway pages are TNiC&rsquo;s own mechanistic synthesis across existing compound, peptide, and hallmark
          modules — not a new evidence source. Always check the linked compound module for the actual human
          trial data and evidence tier before acting.
        </p>
      </div>
    </div>
  );
}
