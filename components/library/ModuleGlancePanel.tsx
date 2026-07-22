import Link from 'next/link';
import { FileText, Route, Target } from 'lucide-react';
import type { LibraryModule } from '@/lib/library-modules';
import { hallmarkLibrary } from '@/lib/hallmarks-library';
import { EvidenceTag } from '@/components/trust/EvidenceTag';

/**
 * "Compound at a glance" for library-first compounds that do not (yet) have a
 * canonical `compounds` dataset entry driving the Stack Architect. It presents
 * the SAME visual shape as {@link CompoundGlancePanel} so every one of the 55
 * compound pages opens with a scannable identity block — but it is built only
 * from facts already reviewed elsewhere: the module's evidence tier, its
 * hallmark mapping, the focus stated in its tagline, and a live count of the
 * PMIDs cited in the deep-dive body. Nothing here is invented; fields the
 * structured dataset would add (bioavailability, protocol dose) are simply
 * omitted rather than guessed.
 */

const firstSentence = (text: string): string => {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
};

/** The tagline reads "<focus> — evidence-graded deep dive"; take the focus. */
const focusFromTagline = (tagline: string): string => {
  const [focus] = tagline.split(/\s+[—–-]\s+/);
  return (focus || tagline).trim();
};

function Metric({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Route;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-accent-cyan" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function ModuleGlancePanel({
  module,
  studyCount,
}: {
  module: LibraryModule;
  /** Unique PMIDs cited in the deep-dive body — a real, verifiable count. */
  studyCount: number;
}) {
  const targetHallmarks = module.relatedHallmarkIds
    .map((id) => hallmarkLibrary.find((h) => h.id === id))
    .filter((h): h is (typeof hallmarkLibrary)[number] => Boolean(h));

  return (
    <section
      className="card-elevated p-6 md:p-7"
      aria-label={`${module.title} at a glance`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-label text-accent-cyan">Compound at a glance</p>
        <EvidenceTag tier={module.evidenceTier} showTooltip />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Metric icon={Route} label="Focus">
          <p className="text-sm font-semibold text-foreground">{focusFromTagline(module.tagline)}</p>
        </Metric>

        <Metric icon={Target} label="Hallmarks targeted">
          <p className="text-lg font-bold leading-none text-accent-violet">
            {targetHallmarks.length}
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              of 12
            </span>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">Aging pathways</p>
        </Metric>

        <Metric icon={FileText} label="Evidence base">
          <p className="text-lg font-bold leading-none text-accent-emerald">
            {studyCount}
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              cited {studyCount === 1 ? 'study' : 'studies'}
            </span>
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">Peer-reviewed PMIDs</p>
        </Metric>
      </div>

      {targetHallmarks.length > 0 && (
        <div className="mt-5">
          <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-accent-violet" aria-hidden="true" />
            Targets {targetHallmarks.length} hallmark{targetHallmarks.length === 1 ? '' : 's'} of aging
          </div>
          <div className="flex flex-wrap gap-2">
            {targetHallmarks.map((h) => (
              <Link
                key={h.id}
                href={`/library/${h.slug}`}
                className="focus-ring interactive inline-flex items-center gap-1.5 rounded-full border border-accent-violet/25 bg-accent-violet/5 px-3 py-1 text-xs text-muted-foreground transition hover:border-accent-violet/50 hover:text-accent-violet"
              >
                <span className="font-mono text-[10px] text-accent-violet">
                  {String(h.number).padStart(2, '0')}
                </span>
                {h.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 border-t border-border/50 pt-4 text-sm leading-relaxed text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-cyan">
          What it is
        </span>
        <br />
        {firstSentence(module.summary)}
      </p>
    </section>
  );
}
