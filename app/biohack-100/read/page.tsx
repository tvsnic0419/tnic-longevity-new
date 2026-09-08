import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { BiohackReader } from '@/components/biohack/BiohackReader';
import { BIOHACK_COOKIE, verifyBiohackToken } from '@/lib/biohack/access';

export const metadata: Metadata = {
  title: 'BIOHACK 100 Reader — TNiC',
  robots: { index: false, follow: false },
};

export default async function BiohackReadPage() {
  const jar = await cookies();
  const token = jar.get(BIOHACK_COOKIE)?.value;
  if (!verifyBiohackToken(token)) {
    redirect('/biohack-100?need=access');
  }

  return (
    <SubPageLayout hideContextBar>
      <BiohackReader />
    </SubPageLayout>
  );
}
