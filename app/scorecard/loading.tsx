import { SectionSkeleton } from '@/components/ui/SectionSkeleton';

/** Instant, spatially-stable placeholder for /scorecard while its interactive
 *  bundle loads — the branded skeleton previews the layout (no spinner, no CLS). */
export default function ScorecardLoading() {
  return (
    <div className="pt-24">
      <SectionSkeleton height="md" />
    </div>
  );
}
