/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolEmptyState } from '@/components/ui/ToolEmptyState';

describe('ToolEmptyState', () => {
  it('renders skeleton chrome + CTA', () => {
    const { container } = render(
      <ToolEmptyState
        title="Nothing here"
        detail="Add data to continue."
        ctaLabel="Go labs"
        ctaHref="/labs"
        theme="rose"
      />,
    );
    expect(screen.getByRole('status')).toBeTruthy();
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /go labs/i })).toBeTruthy();
  });
});
