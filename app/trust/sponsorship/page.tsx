import { ShieldCheck } from 'lucide-react';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';

export const metadata = seoRoutes.trustSponsorship();

const principles = [
  {
    title: 'Editorial and analysis separation',
    body:
      'Commercial relationships may support distribution or education, but they do not control evidence tiers, stack scoring, buyer-guide criteria, citations, or scientific conclusions.',
  },
  {
    title: 'Clear labels for commercial content',
    body:
      'Sponsored placements, affiliate links, or brand-supported education must be labeled in plain language at the point where a user sees or acts on them.',
  },
  {
    title: 'No silent ranking influence',
    body:
      'A sponsor cannot purchase a stronger evidence grade, preferred stack position, product-pick status, or mechanism claim. Any methodology change must be documented as a product update.',
  },
  {
    title: 'User data stays constrained',
    body:
      'Stack selections, lab entries, notes, and modeled health data are treated as user-controlled product data. TNiC does not sell personal health-interest data to sponsors.',
  },
  {
    title: 'Scientific uncertainty remains visible',
    body:
      'Human randomized evidence, observational evidence, preclinical evidence, and mechanistic plausibility must remain distinguishable even when a sponsor is associated with a topic.',
  },
];

function buildSchemas() {
  return [
    buildArticleSchema({
      title: 'TNiC Sponsorship & Advertising Principles',
      description:
        'How TNiC separates sponsorship, affiliate links, editorial content, scientific analysis, and user-entered data.',
      path: '/trust/sponsorship',
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Trust', path: '/trust' },
      { name: 'Sponsorship Principles', path: '/trust/sponsorship' },
    ]),
  ];
}

export default function SponsorshipPolicyPage() {
  return (
    <TrustPageTemplate
      icon={ShieldCheck}
      eyebrow="Trust · Sponsorship"
      title="Sponsorship & Advertising Principles"
      description="How commercial relationships can exist without compromising TNiC analysis, evidence labels, or user trust."
      theme="cyan"
      pageKey="sponsorship"
      disclaimer="This page is a product integrity statement, not legal advice. Formal sponsor agreements should be reviewed by qualified counsel."
    >
      <StructuredData schemas={buildSchemas()} />
      <div className="space-y-4">
        {principles.map((principle) => (
          <section key={principle.title} className="glass rounded-2xl p-5 border border-border/70">
            <p className="font-semibold text-foreground mb-2">{principle.title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{principle.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-accent-amber/25 bg-accent-amber/5 p-6">
        <p className="text-label text-accent-amber mb-3">Professional review needed before paid campaigns</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          TNiC should have counsel review sponsorship agreements, endorsement language, affiliate disclosures,
          privacy representations, and any brand-supported content workflow before accepting paid placements.
          Scientific claims should receive separate review when a campaign references specific outcomes.
        </p>
      </div>
    </TrustPageTemplate>
  );
}
