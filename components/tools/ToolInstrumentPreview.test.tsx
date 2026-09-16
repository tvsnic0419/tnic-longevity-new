/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ToolInstrumentPreview } from '@/components/tools/ToolInstrumentPreview';
import { toolsRegistry } from '@/lib/registry';

describe('ToolInstrumentPreview', () => {
  it.each(toolsRegistry.map((t) => t.id))('renders mini instrument for %s', (id) => {
    const { container } = render(<ToolInstrumentPreview toolId={id} />);
    expect(container.querySelector('.tool-instrument-preview')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.textContent).toMatch(/demo/i);
  });
});
