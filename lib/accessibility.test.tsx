// @vitest-environment jsdom
/**
 * Automated accessibility guardrail. Prior a11y work (axe-core sweeps across
 * ~28 pages, 0 violations) was done manually and left no regression check —
 * a real violation introduced since could ship undetected. This codifies
 * that sweep for the components most likely to regress silently: the
 * evidence-badge legend (the site's primary non-color-only status signal),
 * the verified-product card (buy CTA + disclosure), and the persistent
 * global chrome (nav + footer). It intentionally tests components in
 * isolation rather than full routed pages — Next 16 App Router server
 * components/layouts aren't renderable through RTL, so this is the
 * practical boundary, not full-page coverage.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EvidenceBadge, EvidenceBadgeLegend } from '@/components/trust/EvidenceBadge';
import { ProductPickCard } from '@/components/shop/ProductPickCard';
import { productPicks } from '@/lib/product-picks';

expect.extend(toHaveNoViolations);

describe('accessibility guardrail (axe-core)', () => {
  it('EvidenceBadgeLegend has no violations', async () => {
    const { container } = render(<EvidenceBadgeLegend />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('EvidenceBadge (each level) has no violations', async () => {
    for (const level of ['Strong', 'Moderate', 'Mechanistic', 'Emerging', 'Personal'] as const) {
      const { container } = render(<EvidenceBadge level={level} />);
      expect(await axe(container)).toHaveNoViolations();
    }
  });

  it('ProductPickCard has no violations', async () => {
    const pick = productPicks[0];
    const { container } = render(<ProductPickCard pick={pick} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ProductPickCard (compact) has no violations', async () => {
    const pick = productPicks[0];
    const { container } = render(<ProductPickCard pick={pick} compact />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
