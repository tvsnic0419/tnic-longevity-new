import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { AmbientTone } from '@/components/theme/AmbientTone';

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubPageLayout>
      <AmbientTone hue="cyan" />
      {children}
    </SubPageLayout>
  );
}