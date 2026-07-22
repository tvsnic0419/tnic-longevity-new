import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../lib/library-modules.ts', import.meta.url);
const workflowPath = 'C:/Users/tom2t/AppData/Local/Temp/claude/C--Users-tom2t/0734cdfd-4f27-496f-bc8c-cde2aa209c5f/tasks/wpi5qq3fj.output';
const workflow = JSON.parse(await readFile(workflowPath, 'utf8'));
let source = await readFile(file, 'utf8');

for (const item of workflow.result.full) {
  const needle = `    "slug": "${item.slug}",`;
  const start = source.indexOf(needle);
  if (start < 0) continue;
  const end = source.indexOf('\n  },', start);
  if (end < 0) throw new Error(`Could not locate module boundary for ${item.slug}`);
  let block = source.slice(start, end);
  if (!block.includes('"category": "compounds"')) {
    block = block.replace(needle, `${needle}\n    "category": "compounds",`);
  }
  if (!block.includes('"mdxSlug":')) {
    block += `\n    "mdxSlug": "${item.slug}",`;
  }
  source = source.slice(0, start) + block + source.slice(end);
}

source = source.replace(/(\n    \])\n    "mdxSlug"/g, '$1,\n    "mdxSlug"');
source = source.replace(/\n    "mdxSlug": ("[^"]+"),\n    "mdxSlug": \1,/g, '\n    "mdxSlug": $1,');
await writeFile(file, source, 'utf8');

const titleFile = new URL('../lib/breadcrumb-titles.ts', import.meta.url);
let titlesSource = await readFile(titleFile, 'utf8');
const moduleEntries = [];
for (const match of source.matchAll(/\{([\s\S]*?)\n  \},/g)) {
  const body = match[1];
  const slug = body.match(/(?:slug: '([^']+)'|"slug": "([^"]+)")/)?.slice(1).find(Boolean);
  const category = body.match(/(?:category: '([^']+)'|"category": "([^"]+)")/)?.slice(1).find(Boolean);
  const title = body.match(/(?:title: '([^']+)'|"title": "([^"]+)")/)?.slice(1).find(Boolean);
  if (slug && category && title) moduleEntries.push(`  '${category}/${slug}': ${JSON.stringify(title)},`);
}
titlesSource = titlesSource.replace(
  /export const libraryModuleTitles: Record<string, string> = \{[\s\S]*?\n\};/,
  `export const libraryModuleTitles: Record<string, string> = {\n${moduleEntries.join('\n')}\n};`,
);
await writeFile(titleFile, titlesSource, 'utf8');
