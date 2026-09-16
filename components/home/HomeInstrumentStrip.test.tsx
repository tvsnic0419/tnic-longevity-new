/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeInstrumentStrip } from '@/components/home/HomeInstrumentStrip';
import { getScoredCompounds } from '@/lib/elite-8-data';

describe('HomeInstrumentStrip', () => {
  // Deliberately one render for all of it. BiologicalAgeGauge schedules
  // framer-motion work that can land after jsdom tears the environment down,
  // so each extra render of this strip buys a "window is not defined" uncaught
  // exception in the full-suite run (it passes in isolation, which is what
  // makes it a trap). The assertions below are all static-markup reads, so
  // sharing one tree costs nothing.
  it('renders the gauge and ranks every Elite 8 compound honestly', () => {
    const { container } = render(<HomeInstrumentStrip />);
    const expected = getScoredCompounds();

    expect(screen.getByRole('heading', { name: /diligence-grade readouts/i })).toBeTruthy();
    expect(container.querySelector('.bio-age-gauge')).toBeTruthy();
    expect(screen.getAllByText(/educational/i).length).toBeGreaterThan(0);

    // Was `.depth-bar-chart`. The ranking is no longer a Recharts bar chart:
    // the eight modeled scores cluster in a 7-point band, so on a 0–100 axis
    // every bar drew the same length. It is a ranked readout now — the number
    // leads, the meter supports it.
    expect(container.querySelector('.lq-rank')).toBeTruthy();

    const rows = [...container.querySelectorAll('.lq-rank__row')];
    // All eight, not a top-five slice — the module is the Elite *8*.
    expect(rows).toHaveLength(8);
    expect(rows).toHaveLength(expected.length);

    const names = rows.map((r) => r.querySelector('.lq-rank__name')?.textContent);
    expect(names).toEqual(expected.map((c) => c.name));

    const scores = rows.map((r) =>
      Number(r.querySelector('.lq-rank__score')?.textContent?.replace('/100', '')),
    );
    expect(scores).toEqual(expected.map((c) => Math.round(c.score)));
    // Descending, so the leading numeral and the value can never disagree.
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);

    // A truncated axis would make a 7-point spread look decisive. Each fill is
    // the score itself as a percentage, so the meter can never overstate it.
    const widths = [...container.querySelectorAll('.lq-rank__fill')].map(
      (el) => (el as HTMLElement).style.width,
    );
    expect(widths).toEqual(expected.map((c) => `${Math.round(c.score)}%`));
  });
});
