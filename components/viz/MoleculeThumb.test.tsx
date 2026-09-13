// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MoleculeThumb } from './MoleculeThumb';
import { hasGeometry } from './molecule';

describe('MoleculeThumb', () => {
  it('draws a real skeleton for compounds with geometry (NMN)', () => {
    expect(hasGeometry('nmn')).toBe(true);
    const { container } = render(<MoleculeThumb id="nmn" />);
    const root = container.querySelector('[data-molecule-thumb="nmn"]');
    expect(root?.getAttribute('data-structured')).toBe('true');
    expect(container.querySelectorAll('circle').length).toBeGreaterThan(5);
    expect(container.querySelectorAll('line').length).toBeGreaterThan(4);
    expect(container.querySelector('desc')?.textContent).toMatch(/C/);
  });

  it('falls back to an orbital field when there is no molecule to draw', () => {
    expect(hasGeometry('glynac')).toBe(false);
    const { container } = render(<MoleculeThumb id="glynac" />);
    const root = container.querySelector('[data-molecule-thumb="glynac"]');
    expect(root?.getAttribute('data-structured')).toBe('false');
    // Orbital: three circles, no bonds.
    expect(container.querySelectorAll('line')).toHaveLength(0);
    expect(container.querySelectorAll('circle').length).toBeGreaterThanOrEqual(2);
  });

  it('is decorative — no accessible name of its own', () => {
    const { container } = render(<MoleculeThumb id="nmn" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });
});
