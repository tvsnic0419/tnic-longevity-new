import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { AmbientTone } from '@/components/theme/AmbientTone';

export default function TrustLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubPageLayout>
      <AmbientTone hue="emerald" />
      {children}
    </SubPageLayout>
  );
}