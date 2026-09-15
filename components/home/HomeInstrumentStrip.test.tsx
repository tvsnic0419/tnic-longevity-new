/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeInstrumentStrip } from '@/components/home/HomeInstrumentStrip';

describe('HomeInstrumentStrip', () => {
  it('renders gauge + elite ranking instruments', () => {
    const { container } = render(<HomeInstrumentStrip />);
    expect(screen.getByRole('heading', { name: /diligence-grade readouts/i })).toBeTruthy();
    expect(container.querySelector('.bio-age-gauge')).toBeTruthy();
    expect(container.querySelector('.depth-bar-chart')).toBeTruthy();
    expect(screen.getAllByText(/educational/i).length).toBeGreaterThan(0);
  });
});
