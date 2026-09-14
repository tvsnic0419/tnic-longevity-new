import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DepthBarChart } from '@/components/ui/DepthBarChart';

/**
 * Smoke-test the diligence bar instrument: renders without throw and exposes
 * an accessible chart surface. Full Recharts layout is measured in jsdom loosely.
 */
describe('DepthBarChart', () => {
  it('renders with sample ranking data', () => {
    const { container } = render(
      <DepthBarChart
        data={[
          { name: 'GlyNAC', value: 88, fullName: 'GlyNAC', color: 'var(--accent-emerald)' },
          { name: 'NMN', value: 76, fullName: 'NMN', color: 'var(--accent-cyan)' },
          { name: 'Sleep', value: 64, fullName: 'Sleep optimization', color: 'var(--accent-violet)' },
        ]}
        height={240}
        valueLabel="Impact score"
        max={100}
      />,
    );

    expect(container.querySelector('.depth-bar-chart')).toBeTruthy();
    // Recharts mounts an svg (or role=application wrapper depending on version)
    const svg = container.querySelector('svg');
    expect(svg || container.querySelector('[class*="recharts"]')).toBeTruthy();
  });

  it('accepts vertical layout without crashing', () => {
    render(
      <DepthBarChart
        layout="vertical"
        data={[
          { name: 'H1', value: 40 },
          { name: 'H6', value: 72 },
        ]}
        valueLabel="Priority"
      />,
    );
    expect(document.body.textContent).toBeTruthy();
  });
});
