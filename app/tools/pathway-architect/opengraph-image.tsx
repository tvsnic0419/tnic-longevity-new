import { OgImage } from '@/lib/og-image';
import { COMPOUND_DB, PATHWAY_LABELS } from '@/lib/compound-engine-data';

export const alt = 'TNiC — Pathway Architect';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return OgImage({
    title: 'Pathway Architect',
    subtitle: `Build a protocol from ${COMPOUND_DB.length} evidence-graded compounds across ${Object.keys(PATHWAY_LABELS).length} molecular pathways — live synergy intelligence`,
    accent: '#c084fc',
  });
}
