import { ContactForm } from '@/components/contact/ContactForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact — Protocol & Lab Questions',
  description:
    'Structured async channel for stack, lab, and library questions. Educational only — not medical advice.',
  path: '/contact',
  keywords: ['longevity protocol question', 'TNiC contact', 'supplement stack help'],
});

export default function ContactPage() {
  return (
    <div className="container-page py-8 md:py-12 max-w-2xl">
      <ContactForm />
    </div>
  );
}