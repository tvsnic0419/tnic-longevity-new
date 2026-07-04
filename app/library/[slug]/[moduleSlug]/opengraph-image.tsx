import { OgImage } from '@/lib/og-image';
import { getAllModuleParams, getModuleBySlug, libraryCategoryMeta, type LibraryModuleCategory } from '@/lib/library-modules';

export const alt = 'TNiC — Compound Deep-Dive';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllModuleParams().map((p) => ({ slug: p.slug, moduleSlug: p.moduleSlug }));
}

const accentByCategory: Record<LibraryModuleCategory, string> = {
  compounds: '#22d3ee',
  synergies: '#a78bfa',
  lifestyle: '#f59e0b',
  guides: '#34d399',
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; moduleSlug: string }>;
}) {
  const { slug, moduleSlug } = await params;
  const category = slug as LibraryModuleCategory;
  const mod = getModuleBySlug(category, moduleSlug);

  if (!mod) {
    return OgImage({ title: 'Anti-Aging Library', accent: '#22d3ee' });
  }

  const categoryLabel = libraryCategoryMeta[mod.category]?.label ?? 'Library';
  const accent = accentByCategory[mod.category] ?? '#22d3ee';

  return OgImage({
    title: mod.title,
    subtitle: `${categoryLabel} · ${mod.tagline}`,
    accent,
  });
}
