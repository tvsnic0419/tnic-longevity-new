import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { AmbientTone } from '@/components/theme/AmbientTone';

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubPageLayout>
      <AmbientTone hue="rose" />
      {children}
    </SubPageLayout>
  );
}