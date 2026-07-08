import Link from 'next/link';
import { ArrowLeft, CheckCircle2, AlertCircle, Info, FlaskConical } from 'lucide-react';
import { buildPageMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { getHubContext } from '@/lib/hub-context';

export const metadata = buildPageMetadata({
  title: 'Lipid Delivery Systems — Bioavailability Technology Guide',
  description:
    'Compare liposomes, phytosomes, NLCs, and LNPs. Understand which delivery technology maximises bioavailability for longevity compounds.',
  path: '/library/delivery-systems',
  keywords: ['liposomal', 'phytosome', 'NLC', 'bioavailability', 'lipid nanoparticle', 'supplement delivery'],
});

const systems = [
  {
    name: 'Liposomes',
    tag: 'General purpose',
    tagColor: 'text-accent-emerald bg-accent-emerald/10',
    strengths: ['Good absorption', 'Versatile — works with many compound classes', 'Biocompatible, long safety record'],
    limitations: ['Moderate stability; quality varies by manufacturer', 'Phospholipid shell can degrade without proper storage'],
    bestFor: 'Vitamins C & D, glutathione, general polyphenols, curcumin',
    maturity: 'High',
    maturityNote: 'Widely available, most consumer supplements',
    maturityColor: 'text-accent-emerald',
  },
  {
    name: 'Phytosomes',
    tag: 'Polyphenol specialist',
    tagColor: 'text-accent-cyan bg-accent-cyan/10',
    strengths: ['Strong covalent bond with plant compounds', 'Multiple clinical trials with measured outcomes', 'Good stability — phospholipid-polyphenol complex resists oxidation'],
    limitations: ['Mainly effective with specific polyphenols', 'Less versatile for non-plant molecules'],
    bestFor: 'Curcumin (Meriva), resveratrol, silymarin (Siliphos), EGCG',
    maturity: 'High',
    maturityNote: 'Well-established branded extracts with clinical backing',
    maturityColor: 'text-accent-cyan',
  },
  {
    name: 'NLCs',
    subtitle: 'Nanostructured Lipid Carriers',
    tag: 'Premium lipophilics',
    tagColor: 'text-accent-violet bg-accent-violet/10',
    strengths: ['Superior stability vs liposomes', 'High drug loading capacity', 'Controlled-release kinetics', 'Strong bioavailability gains for fat-soluble compounds'],
    limitations: ['More complex to manufacture', 'Fewer consumer products at scale yet'],
    bestFor: 'Sulforaphane, fisetin, quercetin, resveratrol, curcumin',
    maturity: 'Medium-High',
    maturityNote: 'Growing rapidly in premium supplement lines',
    maturityColor: 'text-accent-violet',
  },
  {
    name: 'Modern LNPs',
    subtitle: 'Ionizable Lipid Nanoparticles',
    tag: 'Pharmaceutical grade',
    tagColor: 'text-accent-rose bg-accent-rose/10',
    strengths: ['Excellent endosomal escape', 'Very high delivery efficiency for nucleic acids'],
    limitations: ['Complex and expensive to manufacture', 'Higher potential for immune activation', 'Often over-engineered relative to supplement needs'],
    bestFor: 'mRNA / siRNA delivery, pharmaceutical applications (e.g. mRNA vaccines)',
    maturity: 'Low in supplements',
    maturityNote: 'Primarily pharmaceutical — not commonly used in consumer supplements',
    maturityColor: 'text-accent-rose',
  },
];

export default function DeliverySystemsPage() {
  return (
    <div className="container-page py-10 md:py-14 max-w-5xl">
      <Link
        href="/library"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8 focus-ring rounded-lg"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Library
      </Link>

      <PageHeader
        icon={FlaskConical}
        eyebrow="Research Library · Delivery Science"
        title="Lipid-Based Delivery Systems"
        description="A comparison of the main lipid-based technologies used to improve absorption, stability, and effectiveness of bioactive longevity compounds. Delivery matters as much as dose."
        theme="emerald"
        align="left"
        context={getHubContext('deliverySystems')}
      />

      <div className="card-ultra rounded-2xl p-5 mb-10 flex gap-3">
        <Info className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">TNiC approach:</span> For most longevity and cellular
          resilience compounds, <span className="text-accent-emerald font-medium">Phytosomes and NLCs</span> offer
          the best balance of performance, stability, and real-world applicability. We evaluate delivery
          technology when curating product picks in the{' '}
          <Link href="/shop" className="text-accent-cyan hover:underline">Protocol Shop</Link>.
        </p>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden mb-10">
        {systems.map((s) => (
          <div key={s.name} className="card-ultra rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="font-bold text-base">{s.name}</h2>
                {s.subtitle && <p className="text-xs text-muted-foreground">{s.subtitle}</p>}
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 ${s.tagColor}`}>
                {s.tag}
              </span>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-accent-emerald" /> Strengths
                </dt>
                <dd>
                  <ul className="space-y-0.5">
                    {s.strengths.map((str) => (
                      <li key={str} className="text-xs text-muted-foreground">• {str}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-accent-amber" /> Limitations
                </dt>
                <dd>
                  <ul className="space-y-0.5">
                    {s.limitations.map((lim) => (
                      <li key={lim} className="text-xs text-muted-foreground">• {lim}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Best Suited For</dt>
                <dd className="text-xs text-muted-foreground">{s.bestFor}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Maturity</dt>
                <dd className={`text-xs font-semibold ${s.maturityColor}`}>{s.maturity}</dd>
                <dd className="text-xs text-muted-foreground">{s.maturityNote}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-4 pr-6 text-xs font-mono text-accent-emerald uppercase tracking-wider w-[18%]">System</th>
              <th className="py-4 pr-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">Key Strengths</th>
              <th className="py-4 pr-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">Limitations</th>
              <th className="py-4 pr-6 text-xs font-mono text-muted-foreground uppercase tracking-wider">Best Suited For</th>
              <th className="py-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Maturity</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((s, i) => (
              <tr key={s.name} className={`align-top ${i < systems.length - 1 ? 'border-b border-border' : ''}`}>
                <td className="py-5 pr-6">
                  <p className="font-semibold">{s.name}</p>
                  {s.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>}
                  <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full mt-2 ${s.tagColor}`}>
                    {s.tag}
                  </span>
                </td>
                <td className="py-5 pr-6 text-muted-foreground">
                  <ul className="space-y-1">
                    {s.strengths.map((str) => (
                      <li key={str} className="text-xs flex gap-1.5">
                        <span className="text-accent-emerald shrink-0">+</span>{str}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-5 pr-6 text-muted-foreground">
                  <ul className="space-y-1">
                    {s.limitations.map((lim) => (
                      <li key={lim} className="text-xs flex gap-1.5">
                        <span className="text-accent-amber shrink-0">–</span>{lim}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-5 pr-6 text-xs text-muted-foreground">{s.bestFor}</td>
                <td className="py-5">
                  <p className={`text-xs font-semibold ${s.maturityColor}`}>{s.maturity}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.maturityNote}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border pt-8">
        <p className="text-label text-muted-foreground mb-4">RELATED</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="focus-ring glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium">
            Protocol Shop — product picks
          </Link>
          <Link href="/library" className="focus-ring glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium">
            Full library
          </Link>
          <Link href="/faq" className="focus-ring glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium">
            FAQ — delivery questions
          </Link>
        </div>
      </div>
    </div>
  );
}
