import { SubPageLayout } from '@/components/layouts/SubPageLayout';

/**
 * The root layout renders no Nav or Footer — every route opts in. This one
 * never did, so the page rendered as bare content with no way to navigate
 * onward. See also: /trust, /contact, which already do this.
 */
export default function PathwaysLayout({ children }: { children: React.ReactNode }) {
  return <SubPageLayout>{children}</SubPageLayout>;
}
