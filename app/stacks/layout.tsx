import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { AmbientTone } from '@/components/theme/AmbientTone';

export default function StacksLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubPageLayout>
      <AmbientTone hue="violet" />
      {children}
    </SubPageLayout>
  );
}