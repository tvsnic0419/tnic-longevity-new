import { buildWebSiteSchema, buildOrganizationSchema } from '@/lib/seo';
import { StructuredData } from '@/components/seo/StructuredData';

/**
 * Site-identity schema only (WebSite + Organization) — valid on every route.
 * FAQPage, SoftwareApplication, and ItemList schemas describe specific content
 * and belong only on the pages that actually render that content (see
 * app/faq/page.tsx, app/page.tsx, app/quiz/page.tsx), not injected globally.
 */
export function JsonLd() {
  return <StructuredData schemas={[buildWebSiteSchema(), buildOrganizationSchema()]} />;
}