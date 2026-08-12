import Link from 'next/link';

/**
 * CountLink — an inline, editorial deep-link for a count referenced in prose
 * ("the 12 hallmarks of aging", "9 elite interventions"). Shares the site's
 * accent-cyan link language so a clickable number reads the same everywhere:
 * in a hub stat rail, in body copy, or in a cross-reference rail.
 */
export function CountLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`focus-ring rounded-sm font-medium text-[var(--accent-cyan)] underline decoration-[color-mix(in_srgb,var(--accent-cyan)_40%,transparent)] underline-offset-2 transition-colors hover:decoration-[var(--accent-cyan)] ${className}`}
    >
      {children}
    </Link>
  );
}
