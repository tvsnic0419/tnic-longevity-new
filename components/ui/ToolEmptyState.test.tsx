/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolEmptyState } from '@/components/ui/ToolEmptyState';

describe('ToolEmptyState', () => {
  it('renders premium empty chrome with CTA', () => {
    const { container } = render(
      <ToolEmptyState
        title="No stack selected"
        detail="Add compounds to see synergy readouts."
        ctaLabel="Open simulator"
        ctaHref="/tools?tab=simulator"
        theme="violet"
      />,
    );
    expect(screen.getByRole('status')).toBeTruthy();
    expect(container.querySelector('.tool-empty-state')).toBeTruthy();
    expect(container.querySelector('.instrument-module')).toBeTruthy();
    expect(screen.getByRole('link', { name: /open simulator/i })).toBeTruthy();
  });
});
