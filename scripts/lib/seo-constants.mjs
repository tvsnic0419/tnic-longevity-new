export const SITE_URL = 'https://tnic.help';
export const INDEXNOW_KEY = 'f7c3a9e2b1d0486c5e8f2a4b9c1d3e57';

export const PRIORITY_INDEX_PATHS = [
  '/',
  '/library',
  '/library/compare',
  '/library/compare/nmn-vs-nr',
  '/library/compare/glynac-vs-liposomal-glutathione',
  '/library/compare/sulforaphane-vs-curcumin',
  '/library/compare/resveratrol-vs-pterostilbene',
  '/library/compounds/nmn',
  '/library/compounds/nr',
  '/library/compounds/glynac',
  '/library/compounds/sulforaphane',
  '/library/compounds/rapamycin',
  '/library/mitochondrial-dysfunction',
  '/library/cellular-senescence',
  '/faq',
  '/quiz',
  '/stacks',
  '/learn',
  '/brief',
  '/site-map',
];

export const PRIORITY_INDEX_URLS = PRIORITY_INDEX_PATHS.map((p) =>
  p === '/' ? SITE_URL + '/' : `${SITE_URL}${p}`,
);