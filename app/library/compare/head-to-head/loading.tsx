import { SectionSkeleton } from '@/components/ui/SectionSkeleton';

/**
 * Scoped deliberately to this route, not to the whole /library segment.
 *
 * A `loading.tsx` wraps its entire segment subtree in a Suspense boundary. On
 * /library that boundary sat inside SubPageLayout's <main>, so every async
 * library page — all 141 of them, compound deep-dives included — shipped this
 * skeleton as its server-rendered <main> and streamed the real content in
 * *after* </footer>. Crawlers and AI answer engines reading the initial HTML
 * saw an empty <main> followed by a footer.
 *
 * head-to-head is the one library route that is genuinely dynamic (it awaits
 * searchParams) and has no prerendered children, so a loading state earns its
 * place here and costs nothing elsewhere.
 */
export default function HeadToHeadLoading() {
  return (
    <div className="pt-24">
      <SectionSkeleton height="lg" />
    </div>
  );
}
