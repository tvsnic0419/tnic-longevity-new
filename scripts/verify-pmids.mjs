#!/usr/bin/env node
/**
 * verify-pmids.mjs — citation integrity audit.
 *
 * Scans every content/data file in the repo for PubMed IDs, resolves each one
 * against NCBI E-utilities `esummary`, and compares the metadata stored next to
 * the PMID in our own source against what PubMed actually says.
 *
 * Flags two classes of problem:
 *   DEAD     — the PMID does not resolve to a real PubMed record.
 *   MISMATCH — the stored first author / title / journal / year disagrees with
 *              the real record.
 *
 * Writes reports/pmid-audit.md, sorted worst-first.
 *
 * Usage:  node scripts/verify-pmids.mjs [--json]
 * Env:    NCBI_API_KEY (optional) raises the NCBI rate limit.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_PATH = path.join(ROOT, 'reports', 'pmid-audit.md');

const SCAN_DIRS = ['content', 'lib', 'app', 'components', 'hooks', 'scripts', 'public'];
const SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.vercel', 'reports', 'coverage']);
/**
 * Test fixtures contain synthetic PMIDs, and `.promote-audit.json` is a
 * generated snapshot of `lib/data.ts` — auditing either is double-counted noise.
 */
const SKIP_FILE = /(\.(test|spec)\.(ts|tsx|js|mjs)|^\.promote-audit\.json|^verify-pmids\.mjs)$/;

const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 350;
const ESUMMARY = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';

// ---------------------------------------------------------------------------
// 1. Scan
// ---------------------------------------------------------------------------

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(full, out);
    } else if (SCAN_EXTS.has(path.extname(entry.name)) && !SKIP_FILE.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Every way a PMID is written in this repo. `kind` is carried into the report
 * so a reviewer can tell a structured field from a bare number in prose.
 */
const PATTERNS = [
  { kind: 'field', re: /\bpmid\s*[:=]\s*['"`]?(\d{4,8})['"`]?/gi },
  { kind: 'prose', re: /\bPMID\s*[:#]?\s*(\d{4,8})\b/g },
  { kind: 'url', re: /pubmed\.ncbi\.nlm\.nih\.gov\/(\d{4,8})/gi },
  // `| Igarashi 2022 (36482258) | RCT |` — evidence tables cite bare parenthesised IDs.
  { kind: 'bare', re: /\((\d{7,8})\)/g },
];

const PMID_ARRAY = /\bpmids?\s*[:=]\s*\[([^\]]*)\]/gi;

function lineAt(text, index) {
  return text.slice(0, index).split('\n').length;
}

/** Innermost `{ … }` object literal containing `idx`, or null. */
function enclosingBlock(text, idx, maxBack = 1800) {
  let depth = 0;
  let start = -1;
  for (let i = idx; i >= 0 && idx - i < maxBack; i--) {
    const c = text[i];
    if (c === '}') depth += 1;
    else if (c === '{') {
      if (depth === 0) {
        start = i;
        break;
      }
      depth -= 1;
    }
  }
  if (start < 0) return null;
  depth = 0;
  for (let i = start; i < text.length && i - start < maxBack * 2; i += 1) {
    const c = text[i];
    if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

/**
 * Prose fallback: the single line the PMID sits on. Deliberately NOT the
 * preceding line — in a markdown evidence table each row is its own citation,
 * so a wider window attributes the neighbouring row's author to this PMID.
 */
function lineContext(text, idx) {
  const start = text.lastIndexOf('\n', Math.max(0, idx - 1));
  const after = text.indexOf('\n', idx);
  return text.slice(start < 0 ? 0 : start + 1, after < 0 ? text.length : after);
}

function scanFile(rel, text) {
  const hits = new Map(); // offset -> occurrence

  const record = (pmid, index, kind) => {
    if (hits.has(index)) return;
    const block = kind === 'prose' || kind === 'bare' ? null : enclosingBlock(text, index);
    hits.set(index, {
      pmid,
      kind,
      file: rel,
      line: lineAt(text, index),
      block,
      context: lineContext(text, index),
      index,
    });
  };

  for (const { kind, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) record(m[1], m.index, kind);
  }

  PMID_ARRAY.lastIndex = 0;
  let arr;
  while ((arr = PMID_ARRAY.exec(text)) !== null) {
    const inner = arr[1];
    const base = arr.index + arr[0].indexOf(inner);
    const num = /\d{4,8}/g;
    let n;
    while ((n = num.exec(inner)) !== null) record(n[0], base + n.index, 'field');
  }

  return [...hits.values()];
}

// ---------------------------------------------------------------------------
// 2. Resolve against PubMed
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchBatch(ids) {
  const params = new URLSearchParams({ db: 'pubmed', retmode: 'json', id: ids.join(',') });
  if (process.env.NCBI_API_KEY) params.set('api_key', process.env.NCBI_API_KEY);
  const url = `${ESUMMARY}?${params.toString()}`;

  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'tnic-pmid-audit/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      await sleep(1000 * 2 ** attempt);
    }
  }
  throw new Error(`esummary failed for batch of ${ids.length}: ${lastError?.message}`);
}

/** PubMed returns an entry for unknown IDs too — a real record has a title. */
function normaliseRecord(uid, raw) {
  if (!raw || raw.error) return { uid, resolves: false, reason: raw?.error ?? 'not found' };
  const title = (raw.title ?? '').trim();
  const journal = (raw.source ?? '').trim();
  if (!title && !journal) return { uid, resolves: false, reason: 'empty PubMed record' };

  const authors = (raw.authors ?? []).map((a) => a.name).filter(Boolean);
  const yearOf = (s) => {
    const m = /\b(19|20)\d{2}\b/.exec(s ?? '');
    return m ? Number(m[0]) : null;
  };

  return {
    uid,
    resolves: true,
    title: title.replace(/\.$/, ''),
    journal,
    fullJournal: (raw.fulljournalname ?? '').trim(),
    authors,
    firstAuthor: authors[0] ?? '',
    year: yearOf(raw.pubdate),
    epubYear: yearOf(raw.epubdate),
    pubdate: raw.pubdate ?? '',
    volume: raw.volume ?? '',
    issue: raw.issue ?? '',
    pages: raw.pages ?? '',
  };
}

// ---------------------------------------------------------------------------
// 3. Compare stored metadata against the real record
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  'of', 'the', 'and', 'for', 'a', 'an', 'in', 'on', 'to', 'with', 'by', 'its',
]);

/** Fold accents first — otherwise "López-Otín" normalises to "l pez ot n". */
const norm = (s) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Name particles that are never the distinguishing part of a surname. */
const PARTICLES = new Set(['de', 'del', 'della', 'da', 'dos', 'van', 'von', 'der', 'den', 'la', 'le', 'di', 'du', 'el', 'al']);

function field(block, names) {
  if (!block) return null;
  for (const name of names) {
    const re = new RegExp(`\\b${name}\\s*[:=]\\s*(?:['"\`]([^'"\`]*)['"\`]|(\\d{4}))`, 'i');
    const m = re.exec(block);
    if (m) return (m[1] ?? m[2] ?? '').trim();
  }
  return null;
}

/** "Cell Metab" vs "Cell metabolism": each stored word prefixes a real word, in order. */
function journalMatches(stored, rec) {
  const s = norm(stored);
  if (!s) return true;
  for (const candidate of [rec.journal, rec.fullJournal]) {
    const c = norm(candidate);
    if (!c) continue;
    if (s === c) return true;
    const want = s.split(' ').filter((w) => !STOPWORDS.has(w));
    const have = c.split(' ').filter((w) => !STOPWORDS.has(w));
    let i = 0;
    for (const w of have) {
      if (i < want.length && (w.startsWith(want[i]) || want[i].startsWith(w))) i += 1;
    }
    if (i === want.length) return true;
  }
  return false;
}

/**
 * Every name token PubMed lists, not just the first word. "Asadi Shahmirzadi A"
 * is cited in our copy as "Shahmirzadi et al." — matching only the leading token
 * would call that a mismatch. Trailing initials ("A", "SI") are dropped.
 */
function surnamesOf(rec) {
  const out = new Set();
  for (const author of rec.authors) {
    // PubMed formats authors as "Surname XY" — the trailing token is initials.
    // Drop only that, and keep tokens down to two letters: "Yi L" and "Xu J"
    // are real surnames, and excluding them made correct citations read as
    // mismatches.
    const tokens = norm(author).split(' ').filter(Boolean);
    const names = tokens.length > 1 ? tokens.slice(0, -1) : tokens;
    for (const token of names) {
      if (token.length >= 2 && !PARTICLES.has(token)) out.add(token);
    }
  }
  return out;
}

/** First surname out of "Fukamizu Y et al." / "Rajman L, Chwalek K, Sinclair DA". */
function storedSurname(authors) {
  const first = authors.split(/,| and /)[0].replace(/\bet al\.?/i, '').trim();
  const words = norm(first).split(' ').filter((w) => w.length > 1 && !PARTICLES.has(w));
  return words[0] ?? null;
}

/**
 * Words that pass a "Capitalised + year" shape but are never author surnames:
 * trial acronyms, journal names, study-design nouns.
 */
const NOT_A_SURNAME = new Set([
  'science', 'nature', 'cell', 'lancet', 'jama', 'bmj', 'plos', 'aging', 'nutrients',
  'review', 'meta', 'rct', 'trial', 'study', 'cohort', 'analysis', 'guideline',
  'the', 'and', 'from', 'with', 'since', 'until', 'immun', 'both', 'peak',
  'geroscience', 'metab', 'metabolism', 'circulation', 'diabetes', 'gerontol',
  'biomedicines', 'antioxidants', 'phytomedicine', 'neurology', 'science',
]);

/**
 * The author attributed to THIS pmid in prose — the nearest "Surname et al." /
 * "Surname 2022" to the left of the ID. Only the nearest one: a line may name
 * several papers, and only the closest is the one this PMID belongs to.
 */
function proseSurname(context, pmid) {
  const cut = context.indexOf(pmid);
  const left = cut < 0 ? context : context.slice(0, cut);
  const re = /\b([A-Z][A-Za-zÀ-ÿ'’-]{1,})(?:\s+(?:meta|et)\s+al\.?|\s+et al\.?|\s+(?:19|20)\d{2})/g;
  let last = null;
  let m;
  while ((m = re.exec(left)) !== null) {
    const word = m[1];
    // Trial acronyms (GEM, HOPE-2, VITATOPS) are not authors.
    if (word === word.toUpperCase()) continue;
    const n = norm(word).split(' ')[0];
    if (!NOT_A_SURNAME.has(n)) last = n;
  }
  return last;
}

/**
 * Many `title:` fields hold a short citation label ("Hirsch 2017",
 * "HOPE-2 (Lonn 2006") rather than a real title. Comparing those against a
 * PubMed title is meaningless — but the name inside is an author claim worth
 * checking, so classify and route accordingly.
 */
function classifyStoredTitle(stored) {
  const words = stored.trim().split(/\s+/);
  const hasYear = /\b(?:19|20)\d{2}\b/.test(stored);
  if (words.length > 5 || (!hasYear && words.length > 2)) return { kind: 'title' };

  // "HOPE-2 (Lonn 2006" — the parenthesised name is the author.
  const paren = /\(\s*([A-Z][A-Za-zÀ-ÿ'’-]{2,})/.exec(stored);
  const lead = /^([A-Z][A-Za-zÀ-ÿ'’-]{2,})/.exec(stored);
  const pick = paren?.[1] ?? lead?.[1];
  if (!pick || pick === pick.toUpperCase()) return { kind: 'label', surname: null };
  const n = norm(pick).split(' ')[0];
  return { kind: 'label', surname: NOT_A_SURNAME.has(n) ? null : n };
}

function titleOverlap(stored, real) {
  const words = (s) =>
    new Set(norm(s).split(' ').filter((w) => w.length >= 4 && !STOPWORDS.has(w)));
  const a = words(stored);
  const b = words(real);
  if (!a.size || !b.size) return 1;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared += 1;
  return shared / Math.min(a.size, b.size);
}

const FIELD_WEIGHT = { author: 40, year: 30, journal: 20, title: 10 };

function compareOccurrence(occ, rec) {
  const issues = [];
  const okYears = new Set([rec.year, rec.epubYear].filter(Boolean));
  const known = surnamesOf(rec);
  const storedTitle = field(occ.block, ['title']);
  const labelled = storedTitle ? classifyStoredTitle(storedTitle) : null;

  // -- author ---------------------------------------------------------------
  const storedAuthors = field(occ.block, ['authors', 'author']);
  if (storedAuthors) {
    const sn = storedSurname(storedAuthors);
    if (sn && !known.has(sn)) {
      issues.push({ f: 'author', stored: storedAuthors, real: rec.firstAuthor });
    }
  } else if (labelled?.kind === 'label' && labelled.surname) {
    if (!known.has(labelled.surname)) {
      issues.push({ f: 'author', stored: storedTitle, real: rec.firstAuthor });
    }
  } else {
    const candidate = proseSurname(occ.context, occ.pmid);
    if (candidate && !known.has(candidate)) {
      issues.push({ f: 'author', stored: candidate, real: rec.firstAuthor });
    }
  }

  // -- year -----------------------------------------------------------------
  const storedYear = field(occ.block, ['year']) ?? null;
  if (storedYear) {
    if (!okYears.has(Number(storedYear))) {
      issues.push({ f: 'year', stored: storedYear, real: [...okYears].join(' / ') });
    }
  } else {
    // A bare ISO date (`date: '2026-06-16'`) is OUR publish date for the entry,
    // not the study's — only a human-written form like 'Dec 2022' is a claim
    // about the paper, so only that is checked against PubMed.
    const rawDate = field(occ.block, ['date', 'published']);
    const storedDate = rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate.trim()) ? null : rawDate;
    const cut = occ.context.indexOf(occ.pmid);
    const pool = storedDate ?? occ.context.slice(0, cut < 0 ? occ.context.length : cut);
    // `(?!\s*(mg|mcg|…))` — "2000 mg" is a dose, not a publication year.
    const YEAR = /\b(19[5-9]\d|20[0-2]\d)\b(?!\s*(?:mg|mcg|µg|g\b|iu|ml|kcal|participants|patients|adults|subjects|men|women))/gi;
    const years = [...pool.matchAll(YEAR)].map((m) => Number(m[0]));
    if (years.length && !years.some((y) => okYears.has(y))) {
      issues.push({ f: 'year', stored: years.join(', '), real: [...okYears].join(' / ') });
    }
  }

  // -- journal --------------------------------------------------------------
  const storedJournal = field(occ.block, ['journal', 'source']);
  if (storedJournal && !journalMatches(storedJournal, rec)) {
    issues.push({ f: 'journal', stored: storedJournal, real: rec.journal });
  }

  // -- title ----------------------------------------------------------------
  // Label-style titles were routed to the author check above; only compare
  // fields that actually claim to be a title.
  if (labelled?.kind === 'title' && titleOverlap(storedTitle, rec.title) < 0.34) {
    issues.push({ f: 'title', stored: storedTitle, real: rec.title });
  }

  return issues;
}

// ---------------------------------------------------------------------------
// 4. Report
// ---------------------------------------------------------------------------

const esc = (s) => (s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

function buildReport(entries, stats) {
  const L = [];
  L.push('# PMID audit');
  L.push('');
  L.push(`_Generated ${new Date().toISOString()} by \`scripts/verify-pmids.mjs\`._`);
  L.push('');
  L.push(
    'Every PubMed ID in `content/`, `lib/`, `app/`, `components/` and `scripts/` is resolved ' +
      'against NCBI E-utilities and compared with the metadata stored beside it in our source. ' +
      'Sorted worst-first.',
  );
  L.push('');
  L.push('## Summary');
  L.push('');
  L.push('| Metric | Count |');
  L.push('| --- | ---: |');
  L.push(`| Distinct PMIDs found | ${stats.total} |`);
  L.push(`| Total citation occurrences | ${stats.occurrences} |`);
  L.push(`| **DEAD** (does not resolve) | ${stats.dead} |`);
  L.push(`| **MISMATCH** (stored metadata disagrees) | ${stats.mismatched} |`);
  L.push(`| &nbsp;&nbsp;↳ of which likely the **wrong paper** | ${stats.wrongRecord} |`);
  L.push(`| Clean | ${stats.clean} |`);
  L.push('');
  L.push(
    '> A single disagreeing field can be honest drift — an editorial paraphrase in a ' +
      '`title`, or a print-vs-epub year. A disagreeing **journal together with a ' +
      'disagreeing author or title** means the ID points at a different paper, which is ' +
      'why those are ranked first.',
  );
  L.push('');

  const dead = entries.filter((e) => !e.record.resolves);
  const wrong = entries.filter((e) => e.wrongRecord);
  const bad = entries.filter((e) => e.record.resolves && e.issueCount > 0 && !e.wrongRecord);
  const clean = entries.filter((e) => e.record.resolves && e.issueCount === 0);

  if (dead.length) {
    L.push('## DEAD — no PubMed record');
    L.push('');
    L.push('These IDs resolve to nothing. Every claim hanging off them is uncited.');
    L.push('');
    for (const e of dead) {
      L.push(`### \`${e.pmid}\` — ${esc(e.record.reason)}`);
      L.push('');
      for (const o of e.occurrences) L.push(`- \`${o.file}:${o.line}\` — ${esc(o.context.trim())}`);
      L.push('');
    }
  }

  const renderGroup = (group, heading, blurb) => {
    if (!group.length) return;
    L.push(`## ${heading}`);
    L.push('');
    L.push(blurb);
    L.push('');
    for (const e of group) {
      const r = e.record;
      L.push(`### \`${e.pmid}\` — ${esc(r.firstAuthor)}, *${esc(r.journal)}* ${r.year}`);
      L.push('');
      L.push(`**Real record:** ${esc(r.title)}`);
      L.push('');
      L.push(
        `**Real first author:** ${esc(r.firstAuthor)} · **Journal:** ${esc(r.journal)} · ` +
          `**Year:** ${r.year}${r.epubYear && r.epubYear !== r.year ? ` (epub ${r.epubYear})` : ''}` +
          `${r.volume ? ` · ${r.volume}(${r.issue}):${r.pages}` : ''} · ` +
          `[PubMed](https://pubmed.ncbi.nlm.nih.gov/${e.pmid}/)`,
      );
      L.push('');
      L.push('| Location | Field | Stored | PubMed |');
      L.push('| --- | --- | --- | --- |');
      for (const o of e.occurrences) {
        for (const i of o.issues) {
          L.push(
            `| \`${o.file}:${o.line}\` | ${i.f} | ${esc(i.stored)} | ${esc(String(i.real))} |`,
          );
        }
      }
      L.push('');
    }
  };

  renderGroup(
    wrong,
    'WRONG PAPER — journal and author/title both disagree',
    'The stored citation and the PubMed record describe different papers. Highest-priority fixes after DEAD.',
  );
  renderGroup(
    bad,
    'MISMATCH — one stored field disagrees with PubMed',
    'A single field is off. Some of these are editorial paraphrase or print-vs-epub year; each still needs an eye.',
  );

  L.push('## Clean');
  L.push('');
  L.push('| PMID | First author | Journal | Year | Title | Uses |');
  L.push('| --- | --- | --- | ---: | --- | ---: |');
  for (const e of clean) {
    const r = e.record;
    L.push(
      `| [${e.pmid}](https://pubmed.ncbi.nlm.nih.gov/${e.pmid}/) | ${esc(r.firstAuthor)} | ` +
        `${esc(r.journal)} | ${r.year ?? ''} | ${esc(r.title)} | ${e.occurrences.length} |`,
    );
  }
  L.push('');
  return L.join('\n');
}

// ---------------------------------------------------------------------------

async function main() {
  const files = (await Promise.all(SCAN_DIRS.map((d) => walk(path.join(ROOT, d))))).flat();

  const byPmid = new Map();
  let occurrences = 0;
  for (const file of files) {
    const text = await fs.readFile(file, 'utf8');
    if (!/\d{4,8}/.test(text)) continue;
    for (const occ of scanFile(path.relative(ROOT, file), text)) {
      if (!byPmid.has(occ.pmid)) byPmid.set(occ.pmid, []);
      byPmid.get(occ.pmid).push(occ);
      occurrences += 1;
    }
  }

  const ids = [...byPmid.keys()].sort();
  process.stderr.write(`Found ${ids.length} distinct PMIDs in ${files.length} files.\n`);

  const records = new Map();
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    process.stderr.write(`  esummary batch ${i / BATCH_SIZE + 1} (${batch.length} ids)…\n`);
    const json = await fetchBatch(batch);
    const result = json?.result ?? {};
    for (const uid of batch) records.set(uid, normaliseRecord(uid, result[uid]));
    if (i + BATCH_SIZE < ids.length) await sleep(BATCH_DELAY_MS);
  }

  // A batch response can drop an entry for reasons unrelated to the ID being
  // wrong, and a false DEAD is a damaging finding. Re-check each failure on its
  // own against esearch before calling it dead.
  const suspect = ids.filter((id) => !records.get(id)?.resolves);
  if (suspect.length) {
    process.stderr.write(`  re-checking ${suspect.length} unresolved id(s) individually…\n`);
    for (const id of suspect) {
      const url =
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi' +
        `?db=pubmed&retmode=json&term=${id}%5Buid%5D`;
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'tnic-pmid-audit/1.0' } });
        const found = (await res.json())?.esearchresult?.idlist ?? [];
        if (found.includes(id)) {
          // Exists after all — resolve it on its own so the report is accurate.
          const solo = await fetchBatch([id]);
          records.set(id, normaliseRecord(id, solo?.result?.[id]));
        }
      } catch {
        /* keep the batch verdict */
      }
      await sleep(BATCH_DELAY_MS);
    }
  }

  const entries = [];
  for (const pmid of ids) {
    const record = records.get(pmid) ?? { uid: pmid, resolves: false, reason: 'no response' };
    const occs = byPmid.get(pmid).map((o) => ({
      ...o,
      issues: record.resolves ? compareOccurrence(o, record) : [],
    }));
    // One field is wrong once, however many places repeat it.
    const fields = new Set(occs.flatMap((o) => o.issues.map((i) => i.f)));
    // A single wrong field can be drift or an editorial paraphrase. Journal
    // plus author/title wrong together means the ID points at a different
    // paper entirely — a materially worse problem, so rank it separately.
    const wrongRecord =
      record.resolves &&
      fields.has('journal') &&
      (fields.has('author') || fields.has('title'));
    const severity = !record.resolves
      ? 1000
      : (wrongRecord ? 500 : 0) +
        [...fields].reduce((sum, f) => sum + (FIELD_WEIGHT[f] ?? 5), 0);
    entries.push({
      pmid,
      record,
      occurrences: occs.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line),
      issueCount: fields.size,
      wrongRecord,
      severity,
    });
  }

  entries.sort((a, b) => b.severity - a.severity || a.pmid.localeCompare(b.pmid));

  const stats = {
    total: entries.length,
    occurrences,
    dead: entries.filter((e) => !e.record.resolves).length,
    mismatched: entries.filter((e) => e.record.resolves && e.issueCount > 0).length,
    wrongRecord: entries.filter((e) => e.wrongRecord).length,
    clean: entries.filter((e) => e.record.resolves && e.issueCount === 0).length,
  };

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, buildReport(entries, stats), 'utf8');

  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify({ stats, entries }, null, 2)}\n`);
  } else {
    process.stdout.write(
      `\nTotal ${stats.total} · DEAD ${stats.dead} · MISMATCH ${stats.mismatched} · clean ${stats.clean}\n` +
        `Report: ${path.relative(ROOT, REPORT_PATH)}\n`,
    );
  }

  process.exitCode = stats.dead > 0 ? 1 : 0;
}

main().catch((err) => {
  process.stderr.write(`${err.stack ?? err}\n`);
  process.exit(2);
});
