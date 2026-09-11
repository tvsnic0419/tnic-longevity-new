import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { DefenseStackGuide } from '@/components/guides/DefenseStackGuide';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { SMOKER_DEFENSE } from '@/lib/defense-stacks';

export const metadata = buildPageMetadata({
  title: 'Smoker Defense Stack — What Actually Protects, and the One Supplement to Avoid',
  description:
    'Evidence-graded protective protocol for people who currently smoke: NAC at the PANTHEON trial dose, sulforaphane, vitamin C repletion — and why two large randomised trials found beta-carotene supplements INCREASED lung cancer in smokers. Every claim PMID-cited.',
  path: '/smoker-defense-stack',
  keywords: [
    'best supplements for smokers',
    'what supplements should smokers take',
    'smoker antioxidant protocol',
    'NAC for smokers',
    'sulforaphane smokers lung',
    'beta carotene smokers lung cancer',
    'supplements to avoid if you smoke',
    'vitamin C smokers depletion',
    'smoker lung protection supplements',
    'harm reduction smoking supplements',
  ],
});

export default function SmokerDefenseStackPage() {
  return (
    <SubPageLayout>
      <StructuredData
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Smoker Defense Stack', path: '/smoker-defense-stack' },
          ]),
        ]}
      />
      <DefenseStackGuide stack={SMOKER_DEFENSE} />
    </SubPageLayout>
  );
}
