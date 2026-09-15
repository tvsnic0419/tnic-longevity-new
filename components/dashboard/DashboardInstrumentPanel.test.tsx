/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/context/PlatformContext', () => ({
  usePlatform: () => ({
    selected: [],
    score: 0,
    profile: { age: 42, scanned: false, stress: 50, sleep: 60, exercise: 45 },
    defenseProfile: { biologicalAge: 42, defenseScore: 0 },
    setProfile: vi.fn(),
  }),
}));

import { DashboardInstrumentPanel } from '@/components/dashboard/DashboardInstrumentPanel';

describe('DashboardInstrumentPanel', () => {
  it('shows premium empty state when no stack/scan', () => {
    render(<DashboardInstrumentPanel />);
    expect(screen.getByText(/no instruments lit yet/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /open stack architect/i })).toBeTruthy();
  });
});
