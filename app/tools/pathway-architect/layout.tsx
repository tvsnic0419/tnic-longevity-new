import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { AmbientTone } from '@/components/theme/AmbientTone';

export default function PathwayArchitectLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubPageLayout hideStackReadout>
      <AmbientTone hue="gold" />
      {children}
    </SubPageLayout>
  );
}
