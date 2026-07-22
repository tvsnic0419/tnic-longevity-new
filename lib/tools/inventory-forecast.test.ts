import { describe, expect, it } from 'vitest';
import { compounds } from '../data';
import {
  dosesPerDay,
  forecastInventory,
  FULL_CYCLE_DAYS,
  DEFAULT_SERVINGS_PER_CONTAINER,
} from './inventory-forecast';

// glynac is dosed AM (1/day) in the canonical dataset — a stable anchor for
// the arithmetic below. Guard it so the suite fails loudly if the data shifts.
const glynac = compounds.find((c) => c.id === 'glynac')!;

describe('inventory forecast — dose cadence', () => {
  it('AM/PM protocols consume two servings a day, single-window ones consume one', () => {
    expect(dosesPerDay('AM/PM')).toBe(2);
    expect(dosesPerDay('AM')).toBe(1);
    expect(dosesPerDay('PM')).toBe(1);
  });
});

describe('inventory forecast — full 24-week cycle', () => {
  it('defaults to a 168-day / 24-week cycle', () => {
    const f = forecastInventory({ compoundIds: ['glynac'], adherencePct: 100 });
    expect(f.cycleDays).toBe(FULL_CYCLE_DAYS);
    expect(f.cycleWeeks).toBe(24);
    expect(f.servingsPerContainer).toBe(DEFAULT_SERVINGS_PER_CONTAINER);
  });

  it('plans one dose per day at perfect adherence for an AM compound', () => {
    const f = forecastInventory({ compoundIds: ['glynac'], adherencePct: 100 });
    const item = f.items[0];
    expect(glynac.timing).toBe('AM');
    expect(item.dosesPerDay).toBe(1);
    expect(item.plannedDoses).toBe(FULL_CYCLE_DAYS); // 168
    expect(item.expectedDoses).toBe(FULL_CYCLE_DAYS);
    // 168 doses / 60 per container = 3 containers (ceil of 2.8)
    expect(item.containersNeeded).toBe(3);
  });

  it('scales expected consumption down by adherence', () => {
    const full = forecastInventory({ compoundIds: ['glynac'], adherencePct: 100 });
    const half = forecastInventory({ compoundIds: ['glynac'], adherencePct: 50 });
    expect(half.items[0].expectedDoses).toBe(Math.ceil(full.items[0].expectedDoses * 0.5));
    expect(half.items[0].plannedDoses).toBe(full.items[0].plannedDoses); // planned is adherence-independent
  });

  it('reports how long a container lasts at a given adherence', () => {
    const f = forecastInventory({ compoundIds: ['glynac'], adherencePct: 100, servingsPerContainer: 30 });
    // 30 servings ÷ 1 dose/day = 30 days
    expect(f.items[0].daysPerContainer).toBe(30);
  });
});

describe('inventory forecast — edge cases', () => {
  it('ignores unknown compound ids', () => {
    const f = forecastInventory({ compoundIds: ['not-a-real-id', 'glynac'], adherencePct: 100 });
    expect(f.items).toHaveLength(1);
    expect(f.items[0].compoundId).toBe('glynac');
  });

  it('produces zero consumption and no depletion at 0% adherence', () => {
    const f = forecastInventory({ compoundIds: ['glynac'], adherencePct: 0 });
    expect(f.items[0].expectedDoses).toBe(0);
    expect(f.items[0].containersNeeded).toBe(0);
    expect(f.items[0].daysPerContainer).toBeNull();
  });

  it('clamps out-of-range adherence to 0–100', () => {
    expect(forecastInventory({ compoundIds: ['glynac'], adherencePct: 250 }).adherencePct).toBe(100);
    expect(forecastInventory({ compoundIds: ['glynac'], adherencePct: -20 }).adherencePct).toBe(0);
  });

  it('returns empty totals for an empty stack', () => {
    const f = forecastInventory({ compoundIds: [], adherencePct: 90 });
    expect(f.items).toHaveLength(0);
    expect(f.totals.expectedDoses).toBe(0);
    expect(f.totals.containersNeeded).toBe(0);
    expect(f.totals.containersPerMonth).toBe(0);
  });

  it('aggregates totals across a multi-compound stack', () => {
    const f = forecastInventory({ compoundIds: ['glynac', 'nmn'], adherencePct: 100 });
    const sumExpected = f.items.reduce((s, i) => s + i.expectedDoses, 0);
    const sumContainers = f.items.reduce((s, i) => s + i.containersNeeded, 0);
    expect(f.totals.expectedDoses).toBe(sumExpected);
    expect(f.totals.containersNeeded).toBe(sumContainers);
    expect(f.totals.containersPerMonth).toBeGreaterThan(0);
  });
});
