import { getAllBriefIssues } from './brief-research-sync';
import { getWeeklyIssueIndex } from './brief-rotation';
import { buildUnsubscribeUrl } from './brief-unsubscribe';
import { SITE } from './site';

export function buildBriefWelcomeSubject(): string {
  return 'Welcome to TNiC Protocol Brief';
}

export function buildBriefWelcomeHtml(email: string): string {
  const issueIndex = getWeeklyIssueIndex();
  const issues = getAllBriefIssues();
  const preview = issues[issueIndex] ?? issues[0];
  const unsubPath = buildUnsubscribeUrl(email);
  const unsubLink = unsubPath
    ? `<a href="${SITE.url}${unsubPath}" style="color:#64748b;">Unsubscribe</a>`
    : '';

  const libraryPreview = preview.libraryHrefs
    .slice(0, 3)
    .map(
      (l) =>
        `<li style="margin-bottom:6px;"><a href="${SITE.url}${l.href}" style="color:#22d3ee;">${l.label}</a></li>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:#030712;color:#f8fafc;padding:32px;max-width:600px;">
  <p style="font-size:12px;color:#a78bfa;letter-spacing:0.1em;text-transform:uppercase;">TNiC Protocol Brief</p>
  <h1 style="font-size:22px;margin:0 0 12px;">You're subscribed</h1>
  <p style="color:#94a3b8;line-height:1.6;">
    Weekly PMID-curated research drops — tied to library modules, not coupon marketing.
    Your first digest rotates with the calendar week; here's this week's preview:
  </p>
  <div style="background:#1e1b4b33;border:1px solid #a78bfa33;border-radius:12px;padding:16px;margin:20px 0;">
    <p style="font-size:11px;color:#a78bfa;margin:0 0 8px;">THIS WEEK'S ISSUE</p>
    <p style="margin:0 0 8px;font-weight:600;">${preview.headline}</p>
    <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.5;">${preview.takeaway}</p>
  </div>
  <ul style="padding-left:20px;color:#94a3b8;">${libraryPreview}</ul>
  <p style="font-size:13px;color:#94a3b8;">
    Prefer a reader? Add
    <a href="${SITE.url}/brief/feed.xml" style="color:#22d3ee;">RSS</a>
    or
    <a href="${SITE.url}/brief/feed.json" style="color:#22d3ee;">JSON</a>.
  </p>
  <hr style="border:none;border-top:1px solid #334155;margin:24px 0;" />
  <p style="font-size:11px;color:#64748b;">
    Educational only — not medical advice.
    <a href="${SITE.url}/brief" style="color:#22d3ee;">Read online</a>
    ${unsubLink ? ` · ${unsubLink}` : ''}
  </p>
</body>
</html>`;
}