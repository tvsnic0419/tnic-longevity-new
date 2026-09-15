/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeSystemOvertureGate } from './HomeSystemOvertureGate';

describe('HomeSystemOvertureGate', () => {
  it('renders explore control', () => {
    render(<HomeSystemOvertureGate />);
    expect(screen.getByRole('button', { name: /explore the system/i })).toBeTruthy();
  });
});
