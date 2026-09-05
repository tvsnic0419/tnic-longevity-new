/**
 * Placeholder shown while a route/section loads. Uses the branded `.skeleton`
 * shimmer (theme-aware, matches skeleton-shimmer in globals.css) and previews
 * the real layout — an eyebrow + heading + lead, then a three-card grid echoing
 * the premium-card grids most pages open with — so the load reads as the page
 * assembling rather than a generic gray pulse.
 *
 * The wrapper is a polite live region (`role="status"`) carrying an sr-only
 * label, so assistive tech announces the load; the shimmer geometry itself is
 * decorative (`aria-hidden`).
 */
export function SectionSkeleton({
  height = 'md',
  label = 'Loading…',
}: {
  height?: 'sm' | 'md' | 'lg';
  label?: string;
}) {
  const h = { sm: 'min-h-[200px]', md: 'min-h-[320px]', lg: 'min-h-[480px]' }[height];
  return (
    <div className={`${h} py-16`} role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="container-page" aria-hidden="true">
        <div className="space-y-4">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-9 w-72 max-w-full" />
          <div className="skeleton h-4 w-full max-w-xl" />
        </div>
        {height === 'sm' ? null : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-border/60 p-5">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-40" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-5/6" />
                <div className="skeleton h-3 w-4/6" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
