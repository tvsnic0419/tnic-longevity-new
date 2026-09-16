import { ContactForm } from '@/components/contact/ContactForm';
import { buildPageMetadata } from '@/lib/seo';
import { PageConnections } from '@/components/ui/PageConnections';
import { clusterFrom } from '@/lib/page-connections';

export const metadata = buildPageMetadata({
  title: 'Contact — Questions & Partnership Inquiries',
  description:
    'Structured async channel for educational questions, platform issues, and partnership inquiries. Educational only — not medical advice.',
  path: '/contact',
  keywords: ['longevity protocol question', 'TNiC contact', 'supplement stack help', 'TNiC partnerships'],
});

export default function ContactPage() {
  return (
    <>
      <div className="container-page py-8 md:py-12 max-w-2xl">
        <ContactForm />
      </div>
      <div className="container-page max-w-4xl">
        <PageConnections cluster={clusterFrom('about', '/contact')} accent="cyan" id="about-connections" />
      </div>
    </>
  );
}
