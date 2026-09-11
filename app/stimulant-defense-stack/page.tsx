import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { DefenseStackGuide } from '@/components/guides/DefenseStackGuide';
import { StructuredData } from '@/components/seo/StructuredData';
import { buildPageMetadata, buildBreadcrumbSchema } from '@/lib/seo';
import { STIMULANT_DEFENSE } from '@/lib/defense-stacks';

export const metadata = buildPageMetadata({
  title: 'Stimulant & Meth Defense Stack — Harm Reduction for People Still Using',
  description:
    'Evidence-graded damage-mitigation protocol for methamphetamine and high-dose stimulant users: what the oxidative, cardiac and dental risks actually are, which supplements have real support, why the largest NAC trial was negative, and the serotonergic combinations that can kill you.',
  path: '/stimulant-defense-stack',
  keywords: [
    'meth harm reduction supplements',
    'supplements for meth users',
    'methamphetamine neurotoxicity protection',
    'stimulant harm reduction stack',
    'NAC methamphetamine',
    'meth mouth prevention',
    'methamphetamine heart damage',
    'amphetamine antioxidant protocol',
    'serotonin syndrome supplement stimulant',
    'protect body while using stimulants',
  ],
});

export default function StimulantDefenseStackPage() {
  return (
    <SubPageLayout>
      <StructuredData
        schemas={[
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Stimulant Defense Stack', path: '/stimulant-defense-stack' },
          ]),
        ]}
      />
      <DefenseStackGuide stack={STIMULANT_DEFENSE} />
    </SubPageLayout>
  );
}
