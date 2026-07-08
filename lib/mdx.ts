import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import type { LibraryModuleCategory } from './library-modules';

export interface MdxDocument {
  slug: string;
  category?: LibraryModuleCategory | 'hallmarks';
  frontmatter: Record<string, string>;
  body: string;
}

export function parseMdx(raw: string): { frontmatter: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };

  const frontmatter: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = val;
    }
  });
  return { frontmatter, body: match[2].trim() };
}

function resolveMdxPath(slug: string, category: LibraryModuleCategory | 'hallmarks' = 'hallmarks'): string | null {
  const filePath = path.join(process.cwd(), 'content', category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return filePath;
}

/** Cached per-request/build — avoids re-reading MDX files during SSG */
export const loadMdx = cache(
  (slug: string, category: LibraryModuleCategory | 'hallmarks' = 'hallmarks'): MdxDocument | null => {
    const filePath = resolveMdxPath(slug, category);
    if (!filePath) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = parseMdx(raw);
    return { slug, category, frontmatter, body };
  },
);

export function listMdxSlugs(category: LibraryModuleCategory | 'hallmarks' = 'hallmarks'): string[] {
  const dir = path.join(process.cwd(), 'content', category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}