import { SubPageLayout } from '@/components/layouts/SubPageLayout';

/**
 * The root layout renders no Nav or Footer — every route opts in. This one
 * never did, so a shared scorecard link opened onto bare content with no way
 * to navigate onward, which is the worst place to strand a first-time visitor.
 */
export default function ScorecardLayout({ children }: { children: React.ReactNode }) {
  return <SubPageLayout>{children}</SubPageLayout>;
}
