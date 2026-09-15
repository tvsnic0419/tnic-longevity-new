/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeInstrumentStrip } from '@/components/home/HomeInstrumentStrip';

describe('HomeInstrumentStrip', () => {
  it('renders gauge + elite ranking instruments inside bezel chrome', () => {
    const { container } = render(<HomeInstrumentStrip />);
    expect(screen.getByRole('heading', { name: /diligence-grade readouts/i })).toBeTruthy();
    expect(container.querySelector('.instrument-bezel')).toBeTruthy();
    expect(container.querySelector('.instrument-bezel__chrome')).toBeTruthy();
    expect(container.querySelector('.bio-age-gauge')).toBeTruthy();
    expect(container.querySelector('.depth-bar-chart')).toBeTruthy();
    expect(container.querySelector('.instrument-module')).toBeTruthy();
    expect(screen.getAllByText(/educational/i).length).toBeGreaterThan(0);
  });

  it('shows intentional standby chrome before scan (not a bare dash)', () => {
    const { container } = render(<HomeInstrumentStrip />);
    const standby = container.querySelector('.bio-age-standby');
    expect(standby).toBeTruthy();
    expect(standby?.textContent).toMatch(/standby/i);
    expect(standby?.textContent).toMatch(/--\.-/);
    expect(standby?.textContent ?? '').not.toContain('—');
  });
});
