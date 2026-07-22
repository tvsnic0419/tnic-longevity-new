import { getBuyerGuide } from './buyer-guides';
import type { CompoundBuyerGuide } from './buyer-guides';
import { getProductPick, type ProductPick } from './product-picks';

export interface StackShopItem {
  compoundId: string;
  compoundName: string;
  dose: string;
  timing: string;
  buyerGuide?: CompoundBuyerGuide;
  moduleHref: string;
  compareHref?: string;
  priority: 'essential' | 'recommended' | 'optional';
  productPick?: ProductPick;
}

const compoundModuleMap: Record<string, { name: string; slug: string; synergy?: boolean }> = {
  glynac: { name: 'GlyNAC', slug: 'glynac' },
  nmn: { name: 'NMN', slug: 'nmn' },
  sulforaphane: { name: 'Sulforaphane', slug: 'sulforaphane' },
  resveratrol: { name: 'Trans-Resveratrol', slug: 'resveratrol' },
  cakg: { name: 'Ca-AKG', slug: 'nad-mito-stack', synergy: true },
  rala: { name: 'R-Alpha Lipoic Acid', slug: 'glynac-nrf2-triad', synergy: true },
  taurine: { name: 'Taurine', slug: 'taurine' },
  spermidine: { name: 'Spermidine', slug: 'spermidine' },
  pterostilbene: { name: 'Pterostilbene', slug: 'pterostilbene' },
  tudca: { name: 'TUDCA', slug: 'tudca' },
};

/** NR alternative shop card when user chose NR over NMN */
export function getNrAlternativeShopItem(): StackShopItem | null {
  const guide = getBuyerGuide('nr');
  if (!guide) return null;

  return {
    compoundId: 'nr',
    compoundName: 'NR (Nicotinamide Riboside)',
    dose: guide.doseAnchors[0]?.dose ?? '300–1000 mg/day',
    timing: 'AM',
    buyerGuide: guide,
    moduleHref: '/library/compounds/nr',
    compareHref: '/library/compare/nmn-vs-nr',
    priority: 'optional',
    productPick: getProductPick('nr'),
  };
}

/** Map active stack IDs to shop intelligence — no affiliate URLs, buyer-guide driven */
export function getStackShopItems(compoundIds: string[]): StackShopItem[] {
  const unique = [...new Set(compoundIds)];

  return unique
    .map((id) => {
      const meta = compoundModuleMap[id];
      if (!meta) return null;

      const guide = getBuyerGuide(id);
      const dose = guide?.doseAnchors[0]?.dose ?? 'See module';
      const timing =
        id === 'resveratrol' || id === 'pterostilbene'
          ? 'PM with fat meal'
          : id === 'nmn'
            ? 'AM fasted'
            : 'AM';

      return {
        compoundId: id,
        compoundName: meta.name,
        dose,
        timing,
        buyerGuide: guide,
        moduleHref: meta.synergy
          ? `/library/synergies/${meta.slug}`
          : `/library/compounds/${meta.slug}`,
        compareHref: guide?.relatedCompareSlug
          ? `/library/compare/${guide.relatedCompareSlug}`
          : undefined,
        priority: ['glynac', 'nmn', 'sulforaphane'].includes(id) ? 'essential' : 'recommended',
        productPick: getProductPick(id),
      } satisfies StackShopItem;
    })
    .filter(Boolean) as StackShopItem[];
}

/** Shop items for ?stack=nr deep link or NR-only verification */
export function getNrShopItems(): StackShopItem[] {
  const nr = getNrAlternativeShopItem();
  return nr ? [nr] : [];
}

/** Canonical commerce language — import everywhere; do not contradict elsewhere */
export const commerceDisclosure = {
  headline: 'TNiC may earn a commission — never for placement',
  body: 'TNiC does not sell supplements or hold inventory. Verified picks link directly to manufacturer websites and may carry an affiliate token at no extra cost to you — always request batch COA before purchase.',
  policy:
    'Affiliate commission never influences which products are listed or their evidence tier, and is disclosed at the point of purchase.',
};

export const shopDisclosure = {
  title: 'Zero inventory conflict',
  body: commerceDisclosure.body,
  affiliateNote: `${commerceDisclosure.headline}. ${commerceDisclosure.policy}`,
};
