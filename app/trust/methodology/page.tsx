import { FileText } from 'lucide-react';
import { TrustPageTemplate } from '@/components/trust/TrustPageTemplate';
import { MethodologySection } from '@/components/trust/MethodologySection';
import { EvidenceTagLegend } from '@/components/trust/EvidenceTag';
import { StructuredData } from '@/components/seo/StructuredData';
import { methodologySections } from '@/lib/trust';
import { seoRoutes } from '@/lib/seo-routes';
import { buildArticleSchema, buildBreadcrumbSchema } from '@/lib/seo';

export const metadata = seoRoutes.trustMethodology();

function buildMethodologySchemas() {
  return [
    buildArticleSchema({
      title: 'TNiC Evidence Methodology — How Longevity Compounds Are Graded',
      description:
        'Transparent framework for compound selection, evidence tier grading (A/B/C/D), biomarker modeling, and conflict-of-interest management at TNiC.',
      path: '/trust/methodology',
    }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Trust', path: '/trust' },
      { name: 'Methodology', path: '/trust/methodology' },
    ]),
  ];
}

export default function MethodologyPage() {
  return (
    <TrustPageTemplate
      icon={FileText}
      eyebrow="Trust · Methodology"
      title="TNiC Methodology"
      description="How compounds are selected, evidence is graded, biomarkers are modeled, and conflicts of interest are managed. Published for full transparency."
      pageKey="methodology"
    >
      <StructuredData schemas={buildMethodologySchemas()} />
      <EvidenceTagLegend className="mb-10" />
      {methodologySections.map((section) => (
        <MethodologySection key={section.id} {...section} />
      ))}
    </TrustPageTemplate>
  );
}