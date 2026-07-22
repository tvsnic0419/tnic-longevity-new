/**
 * Longevity Inventory Forecast — projects how much of each compound a user
 * will consume over an adherence-weighted protocol cycle, and how many
 * containers they need to buy to avoid running out.
 *
 * Pure, deterministic, and side-effect free so it can be unit tested and
 * reused by any UI (the tool component, a future export, etc.). It reads the
 * canonical `compounds` dataset and never touches storage or the DOM.
 */

import { compounds } from '../data';
import type { Compound } from '../types';

/** A full protocol cycle: 24 weeks × 7 days — the GlyNAC/GlyNAC-ET trial window. */
export const CYCLE_WEEKS = 24;
export const DAYS_PER_WEEK = 7;
export const FULL_CYCLE_DAYS = CYCLE_WEEKS * DAYS_PER_WEEK; // 168

/** Default container size when a compound does not declare its own count. */
export const DEFAULT_SERVINGS_PER_CONTAINER = 60;

export interface InventoryForecastInput {
  /** Compound ids from the active stack. Unknown ids are ignored. */
  compoundIds: string[];
  /** Adherence as a percentage (0–100). Scales expected consumption. */
  adherencePct: number;
  /** Cycle length in days. Defaults to a full 24-week (168-day) cycle. */
  cycleDays?: number;
  /** Servings per container (bottle/pouch). Defaults to 60. */
  servingsPerContainer?: number;
}

export interface InventoryLineItem {
  compoundId: string;
  name: string;
  dose: string;
  timing: Compound['timing'];
  /** Doses taken per day, derived from AM / PM / AM+PM timing. */
  dosesPerDay: number;
  /** Doses required if adherence were perfect across the whole cycle. */
  plannedDoses: number;
  /** Doses actually expected, scaled by adherence (rounded up). */
  expectedDoses: number;
  /** Containers to purchase to cover expected consumption. */
  containersNeeded: number;
  /** Days one container lasts at this adherence, or null if it never depletes. */
  daysPerContainer: number | null;
}

export interface InventoryForecast {
  cycleDays: number;
  cycleWeeks: number;
  adherencePct: number;
  servingsPerContainer: number;
  items: InventoryLineItem[];
  totals: {
    /** Sum of expected doses across every compound in the cycle. */
    expectedDoses: number;
    /** Total containers to buy for the whole cycle. */
    containersNeeded: number;
    /** Approximate containers consumed per 30-day month. */
    containersPerMonth: number;
  };
}

/** AM+PM protocols consume two servings a day; single-window ones consume one. */
export function dosesPerDay(timing: Compound['timing']): number {
  return timing === 'AM/PM' ? 2 : 1;
}

function clampPct(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function forecastInventory({
  compoundIds,
  adherencePct,
  cycleDays = FULL_CYCLE_DAYS,
  servingsPerContainer = DEFAULT_SERVINGS_PER_CONTAINER,
}: InventoryForecastInput): InventoryForecast {
  const adherence = clampPct(adherencePct);
  const adherenceFraction = adherence / 100;
  const days = Math.max(0, Math.round(cycleDays));
  const perContainer = Math.max(1, Math.round(servingsPerContainer));

  const selected = compoundIds
    .map((id) => compounds.find((c) => c.id === id))
    .filter((c): c is Compound => Boolean(c));

  const items: InventoryLineItem[] = selected.map((c) => {
    const perDay = dosesPerDay(c.timing);
    const plannedDoses = perDay * days;
    const expectedDoses = Math.ceil(plannedDoses * adherenceFraction);
    const containersNeeded = Math.ceil(expectedDoses / perContainer);
    const dailyBurn = perDay * adherenceFraction;
    const daysPerContainer = dailyBurn > 0 ? Math.floor(perContainer / dailyBurn) : null;

    return {
      compoundId: c.id,
      name: c.name,
      dose: c.dose,
      timing: c.timing,
      dosesPerDay: perDay,
      plannedDoses,
      expectedDoses,
      containersNeeded,
      daysPerContainer,
    };
  });

  const expectedDoses = items.reduce((sum, i) => sum + i.expectedDoses, 0);
  const containersNeeded = items.reduce((sum, i) => sum + i.containersNeeded, 0);
  const containersPerMonth = days > 0 ? Math.round((containersNeeded / days) * 30 * 10) / 10 : 0;

  return {
    cycleDays: days,
    cycleWeeks: Math.round((days / DAYS_PER_WEEK) * 10) / 10,
    adherencePct: adherence,
    servingsPerContainer: perContainer,
    items,
    totals: {
      expectedDoses,
      containersNeeded,
      containersPerMonth,
    },
  };
}
