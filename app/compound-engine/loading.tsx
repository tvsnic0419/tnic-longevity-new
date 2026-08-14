import { SectionSkeleton } from '@/components/ui/SectionSkeleton';

/** Instant, spatially-stable placeholder for /compound-engine while its interactive
 *  bundle loads — the branded skeleton previews the layout (no spinner, no CLS). */
export default function CompoundEngineLoading() {
  return (
    <div className="pt-24">
      <SectionSkeleton height="lg" />
    </div>
  );
}
