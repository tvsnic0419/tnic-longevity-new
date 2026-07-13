import type { Metadata } from 'next';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import {
  SectionLabel, EvidenceGrade, HallmarkChip, CitationList, Stat, Surface,
} from '@/components/ds';

export const metadata: Metadata = {
  title: 'Design System',
  description: 'The TNiC design system — typography, the evidence scale, surfaces, and signature components.',
  robots: { index: false, follow: false },
};

const TYPE_SCALE = [
  { cls: 'heading-page', name: 'heading-page', note: 'Page titles · clamp 2–3.25rem · tracking −0.03em' },
  { cls: 'heading-section', name: 'heading-section', note: 'Section titles · clamp 1.5–2.5rem' },
  { cls: 'heading-card', name: 'heading-card', note: 'Card titles · 1rem / 600' },
  { cls: 'text-body', name: 'text-body', note: 'Body copy · 1rem' },
  { cls: 'text-body-sm', name: 'text-body-sm', note: 'Secondary body · 0.875rem' },
  { cls: 'text-caption', name: 'text-caption', note: 'Captions · 0.75rem' },
];

const ACCENTS = [
  { name: 'Interactive', token: '--accent-cyan', cls: 'bg-accent-cyan', use: 'Links, primary CTAs, active & focus states' },
  { name: 'Evidence · Strong (A)', token: '--accent-emerald', cls: 'bg-accent-emerald', use: 'Tier A grades, success' },
  { name: 'Evidence · Moderate (B)', token: '--accent-cyan', cls: 'bg-accent-cyan', use: 'Tier B grades' },
  { name: 'Evidence · Preclinical (C)', token: '--accent-violet', cls: 'bg-accent-violet', use: 'Tier C grades' },
  { name: 'Caution', token: '--accent-amber', cls: 'bg-accent-amber', use: 'Warnings, watch states' },
  { name: 'Critical', token: '--accent-rose', cls: 'bg-accent-rose', use: 'Contraindications, errors' },
];

const PRINCIPLES = [
  'Typography carries the hierarchy — one confident scale, tight tracking on headlines, wide tracking on mono labels.',
  'Restraint over effects: a single hairline border and generous whitespace, not gradient borders on everything.',
  'One interactive accent (cyan). Colour is otherwise reserved for the evidence scale, so a grade is legible at a glance.',
  'The data is the identity — real doses, real citations, graded evidence rendered as first-class UI.',
];

function Block({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <SectionLabel className="mb-1">{label}</SectionLabel>
      <h2 className="text-xl font-bold mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <SubPageLayout>
      <div className="container-page py-10 md:py-14 max-w-3xl">
        <header className="mb-10">
          <SectionLabel className="mb-2">Design system</SectionLabel>
          <h1 className="heading-page mb-3">A legible, evidence-first system</h1>
          <p className="text-body max-w-2xl">
            The visual language behind TNiC. Confident typography, one interactive accent, hairline surfaces, and an
            evidence scale that doubles as the brand&apos;s identity — the same components power every entity page.
          </p>
        </header>

        <div className="space-y-8">
          <Block label="Principles" title="How it holds together">
            <ul className="space-y-2.5">
              {PRINCIPLES.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </Block>

          <Block label="Typography" title="One type scale">
            <div className="space-y-5">
              {TYPE_SCALE.map((t) => (
                <div key={t.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <div className={`${t.cls} sm:w-64 shrink-0`}>Healthspan</div>
                  <div className="text-caption">
                    <code className="text-accent-cyan">.{t.name}</code> — {t.note}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-1">
                <SectionLabel as="span">Section label</SectionLabel>
                <span className="text-caption">Signature mono eyebrow · tracking 0.18em</span>
              </div>
            </div>
          </Block>

          <Block label="Colour" title="One accent + the evidence scale">
            <div className="grid sm:grid-cols-2 gap-3">
              {ACCENTS.map((a) => (
                <div key={a.name} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className={`w-8 h-8 rounded-lg shrink-0 ${a.cls}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      <code className="font-mono">{a.token}</code> — {a.use}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block label="Components" title="Evidence grade">
            <div className="flex flex-wrap items-center gap-3">
              <EvidenceGrade tier="A" />
              <EvidenceGrade tier="B" />
              <EvidenceGrade tier="C" />
              <EvidenceGrade tier="A" showLabel={false} />
            </div>
            <p className="text-caption mt-3">
              <code className="text-accent-cyan">&lt;EvidenceGrade tier=&quot;A&quot; /&gt;</code> — a fixed, honest mapping to the published rubric.
            </p>
          </Block>

          <Block label="Components" title="Hallmark chips">
            <div className="flex flex-wrap gap-2">
              <HallmarkChip slug="mitochondrial-dysfunction" title="Mitochondrial Dysfunction" />
              <HallmarkChip slug="cellular-senescence" title="Cellular Senescence" />
              <HallmarkChip slug="chronic-inflammation" title="Chronic Inflammation" />
            </div>
            <p className="text-caption mt-3">Linked, hairline, accent-on-hover — every chip resolves to a real page.</p>
          </Block>

          <Block label="Components" title="Stats & surface">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <Stat label="Synergy" value={86} />
              <Stat label="Hallmarks" value="6/12" />
              <Stat label="Compounds" value={5} />
              <Stat label="Est./mo" value="$74" />
            </div>
            <Surface className="p-5">
              <p className="text-sm font-semibold mb-1">Surface</p>
              <p className="text-sm text-muted-foreground">
                The single canonical card — hairline border, faint fill, spacing does the work.
              </p>
            </Surface>
          </Block>

          <Block label="Components" title="Citation">
            <CitationList
              studies={[
                { title: 'NMN supplementation elevates NAD+ levels in healthy adults', journal: 'GeroScience', year: 2022, pmid: '36482258' },
                { title: 'Efficacy of berberine in patients with type 2 diabetes', journal: 'Metabolism', year: 2008, pmid: '18396172' },
              ]}
            />
          </Block>
        </div>
      </div>
    </SubPageLayout>
  );
}
