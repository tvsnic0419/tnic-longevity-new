import { describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';
import { productPicks } from '@/lib/product-picks';

const PUBLIC_PRODUCTS = join(process.cwd(), 'public', 'products');

describe('product pick images', () => {
  it.each(productPicks.map((p) => [p.compoundId, p.imageSrc, p.fallbackImageSrc]))(
    '%s image file exists on disk',
    (_id, imageSrc, fallbackImageSrc) => {
      const primary = join(PUBLIC_PRODUCTS, imageSrc.replace('/products/', ''));
      const fallback = join(PUBLIC_PRODUCTS, fallbackImageSrc.replace('/products/', ''));
      expect(existsSync(primary), `missing ${primary}`).toBe(true);
      expect(existsSync(fallback), `missing ${fallback}`).toBe(true);
    },
  );

  it('uses local /products paths for reliable Next.js rendering', () => {
    for (const pick of productPicks) {
      expect(pick.imageSrc.startsWith('/products/')).toBe(true);
      expect(pick.fallbackImageSrc.startsWith('/products/')).toBe(true);
    }
  });
});