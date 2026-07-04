import { getAllBriefIssues } from './brief-research-sync';
import { buildUnsubscribeUrl } from './brief-unsubscribe';
import { SITE } from './site';

export function buildBriefDigestHtml(issueIndex = 0, email?: string): string {
  const issues = getAllBriefIssues();
  const issue = issues[issueIndex] ?? issues[0];
  const pmidLinks = issue.pmids
    .map(
      (p) =>
        `<a href="https://pubmed.ncbi.nlm.nih.gov/${p}/" style="color:#22d3ee;margin-right:8px;">PMID ${p}</a>`,
    )
    .join('');

  const libraryLinks = issue.libraryHrefs
    .map(
      (l) =>
        `<li style="margin-bottom:6px;"><a href="${SITE.url}${l.href}" style="color:#22d3ee;">${l.label}</a></li>`,
    )
    .join('');

  const unsubPath = email ? buildUnsubscribeUrl(email) : null;
  const unsubLink = unsubPath
    ? `<a href="${SITE.url}${unsubPath}" style="color:#64748b;">Unsubscribe</a>`
    : '';

  return `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:#030712;color:#f8fafc;padding:32px;max-width:600px;">
  <p style="font-size:12px;color:#a78bfa;letter-spacing:0.1em;text-transform:uppercase;">TNiC Protocol Brief</p>
  <h1 style="font-size:22px;margin:0 0 12px;">${issue.headline}</h1>
  <p style="color:#94a3b8;line-height:1.6;">${issue.summary}</p>
  <div style="background:#1e1b4b33;border:1px solid #a78bfa33;border-radius:12px;padding:16px;margin:20px 0;">
    <p style="font-size:11px;color:#a78bfa;margin:0 0 8px;">TAKEAWAY</p>
    <p style="margin:0;font-weight:600;">${issue.takeaway}</p>
  </div>
  <p style="font-size:13px;">${pmidLinks}</p>
  <ul style="padding-left:20px;color:#94a3b8;">${libraryLinks}</ul>
  <hr style="border:none;border-top:1px solid #334155;margin:24px 0;" />
  <p style="font-size:11px;color:#64748b;">
    Educational only — not medical advice. <a href="${SITE.url}/brief" style="color:#22d3ee;">Read online</a>
    · <a href="${SITE.url}/brief/feed.xml" style="color:#22d3ee;">RSS</a>
    ${unsubLink ? ` · ${unsubLink}` : ''}
  </p>
</body>
</html>`;
}

export function buildBriefDigestSubject(issueIndex = 0): string {
  const issues = getAllBriefIssues();
  const issue = issues[issueIndex] ?? issues[0];
  return `Protocol Brief: ${issue.headline}`;
}