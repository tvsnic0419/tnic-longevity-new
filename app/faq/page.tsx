import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { FaqHub } from '@/components/learn/FaqHub';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildFaqSchema } from '@/lib/seo';
import { seoRoutes } from '@/lib/seo-routes';

export const metadata = seoRoutes.faq();

export default function FaqPage() {
  return (
    <SubPageLayout>
      <StructuredData schemas={[buildFaqSchema()]} />
      <FaqHub />
    </SubPageLayout>
  );
}