import type { Metadata } from 'next';
import Link from 'next/link';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { BiohackCardView } from '@/components/biohack/BiohackCard';
import { buildPageMetadata } from '@/lib/seo';
import { previewCards } from '@/lib/biohack/protocol';

export const metadata: Metadata = buildPageMetadata({
  title: 'Bio Bible Preview — Cards 01–02',
  description: 'Public preview of the first two TNiC Bio Bible cards: NAC and R-ALA.',
  path: '/biohack-100/preview',
});

export default function BiohackPreviewPage() {
  return (
    <SubPageLayout hideContextBar>
      <div className="section-deep">
        <div className="container-page max-w-3xl space-y-4 py-16">
          <p className="text-eyebrow text-accent-cyan">Preview</p>
          <h1 className="headline-editorial">Cards 01–02</h1>
          {previewCards().map((card) => (
            <BiohackCardView key={card.num} card={card} />
          ))}
          <Link href="/biohack-100" className="focus-ring btn-gradient mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold">
            Back to Bio Bible
          </Link>
        </div>
      </div>
    </SubPageLayout>
  );
}
