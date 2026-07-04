import Link from 'next/link';
import { SubPageLayout } from '@/components/layouts/SubPageLayout';
import { PRIORITY_INDEX_PATHS, POPULAR_GUIDE_LINKS } from '@/lib/index-priority';
import { buildSitemapEntries } from '@/lib/sitemap-urls';
import { buildPageMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildPageMetadata({
  title: 'Site Map — All Pages',
  description:
    'Complete index of TNiC longevity guides, hallmark library, evidence comparisons, compound deep-dives, tools, and Protocol Brief.',
  path: '/site-map',
  keywords: ['site map', 'longevity guides', 'NMN', 'anti-aging library'],
});

function pathFromUrl(url: string) {
  return url.replace(SITE.url, '') || '/';
}

export default function SiteMapPage() {
  const entries = buildSitemapEntries();
  const prioritySet = new Set<string>(PRIORITY_INDEX_PATHS);
  const priority = entries.filter((e) => prioritySet.has(pathFromUrl(e.url)));
  const rest = entries.filter((e) => !prioritySet.has(pathFromUrl(e.url)));

  return (
    <SubPageLayout>
      <div className="container-page py-12 md:py-16">
        <header className="mb-10">
          <h1 className="heading-section">Site Map</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Every public page on TNiC — prioritized for crawlers and readers.
          </p>
        </header>

      <section className="mb-10">
        <h2 className="heading-card mb-4">Popular guides</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {POPULAR_GUIDE_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-accent-cyan hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="heading-card mb-4">Priority pages ({priority.length})</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          {priority.map((entry) => (
            <li key={entry.url}>
              <Link href={pathFromUrl(entry.url)} className="text-accent-cyan hover:underline break-all">
                {pathFromUrl(entry.url)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="heading-card mb-4">All pages ({entries.length})</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
          {rest.map((entry) => (
            <li key={entry.url}>
              <Link href={pathFromUrl(entry.url)} className="hover:text-accent-cyan hover:underline break-all">
                {pathFromUrl(entry.url)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </SubPageLayout>
  );
}