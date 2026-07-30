import { describe, expect, it } from 'vitest';
import {
  citationRegistry,
  citationTypeLabels,
  translationalLabel,
  translationalLabels,
} from './trust';
import type { CitationType } from './types';

const TYPES = Object.keys(citationTypeLabels) as CitationType[];

describe('citation provenance — translational labels (no citation laundering)', () => {
  it('every citation type resolves a non-empty label', () => {
    for (const t of TYPES) {
      expect(translationalLabel(t), `${t} has no translational label`).toBeTruthy();
    }
  });

  it('preclinical evidence is never presented as human', () => {
    expect(translationalLabel('preclinical')).toBe('Preclinical');
    expect(translationalLabel('preclinical')).not.toMatch(/human/i);
    expect(translationalLabels.preclinical).not.toMatch(/human/i);
  });

  it('clinical evidence is labelled human', () => {
    expect(translationalLabel('clinical')).toMatch(/human/i);
  });

  it('unknown types fall back to the conservative Preclinical label', () => {
    expect(translationalLabel('speculative' as CitationType)).toBe('Preclinical');
  });
});

describe('citation registry supports the provenance chips', () => {
  it('carries both human and preclinical citations (both chip states exercised)', () => {
    expect(citationRegistry.some((c) => c.type === 'clinical')).toBe(true);
    expect(citationRegistry.some((c) => c.type === 'preclinical')).toBe(true);
  });

  it('every registry citation has a type the label map understands', () => {
    for (const c of citationRegistry) {
      expect(citationTypeLabels[c.type], `${c.id} has unknown type ${c.type}`).toBeTruthy();
    }
  });
});
