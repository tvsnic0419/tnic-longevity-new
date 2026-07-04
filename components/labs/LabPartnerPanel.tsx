'use client';

import { useState } from 'react';
import { FlaskConical, Bell, CheckCircle2 } from 'lucide-react';
import { labPartnerPanels, LAB_PARTNER_WAITLIST_KEY } from '@/lib/lab-partners';
import { LABS_PARTNER_TAB_EVENT } from './BiomarkerInput';
import { LabPartnerOAuthFlow } from './LabPartnerOAuthFlow';
import { SITE } from '@/lib/site';

export function LabPartnerPanel() {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState('');

  const joinWaitlist = (panelId: string) => {
    if (!email.trim()) return;
    try {
      const existing = JSON.parse(localStorage.getItem(LAB_PARTNER_WAITLIST_KEY) ?? '[]') as string[];
      const entry = `${panelId}:${email}:${new Date().toISOString()}`;
      localStorage.setItem(LAB_PARTNER_WAITLIST_KEY, JSON.stringify([...existing, entry]));
    } catch {
      /* ignore */
    }
    const subject = encodeURIComponent(`Lab partner waitlist: ${panelId}`);
    const body = encodeURIComponent(
      `Panel: ${panelId}\nEmail: ${email}\n\nInterested in TNiC Lab Hub auto-import when available.`,
    );
    window.location.href = `mailto:${SITE.contactEmail}?subject=${subject}&body=${body}`;
    setJoined(true);
  };

  return (
    <section
      id="lab-partners"
      className="mt-12 pt-10 border-t border-border"
      aria-labelledby="lab-partners-heading"
    >
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="w-4 h-4 text-accent-rose" />
        <p className="text-label text-accent-rose">Lab partners · OAuth + import live</p>
      </div>
      <h2 id="lab-partners-heading" className="text-xl font-bold mb-2">
        Partner export & order-at-home (beta)
      </h2>
      <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
        Import TNiC Partner v1 CSV/JSON in the Input tab → <strong>Partner Beta</strong>, or connect
        the demo OAuth flow below to order panels and auto-import results. POST to{' '}
        <code className="text-accent-cyan text-xs">/api/labs/partner-import</code> for stateless
        normalization.
      </p>

      <LabPartnerOAuthFlow />
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new Event(LABS_PARTNER_TAB_EVENT));
          document.getElementById('partner-import')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="focus-ring inline-flex text-sm font-semibold text-accent-cyan hover:underline mb-6 rounded"
      >
        Open Partner Import →
      </button>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {labPartnerPanels.map((panel) => (
          <div key={panel.id} className="glass rounded-xl p-5">
            <span className="text-[10px] font-mono text-accent-amber uppercase tracking-wider">
              {panel.status} · {panel.eta}
            </span>
            <h3 className="font-bold mt-2 mb-2">{panel.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{panel.description}</p>
            <div className="flex flex-wrap gap-1">
              {panel.markers.map((m) => (
                <span
                  key={m}
                  className="text-[9px] font-mono bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {joined ? (
        <div className="flex items-center gap-3 glass rounded-xl p-4 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
          <p className="text-sm text-muted-foreground">
            Waitlist request prepared — complete send in your mail client.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for waitlist"
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm focus-ring"
            aria-label="Waitlist email"
          />
          <button
            type="button"
            onClick={() => joinWaitlist('longevity-baseline')}
            className="focus-ring inline-flex items-center justify-center gap-2 bg-accent-rose/20 border border-accent-rose/30 text-accent-rose px-5 py-3 rounded-xl font-semibold text-sm hover:bg-accent-rose/30 transition shrink-0"
          >
            <Bell className="w-4 h-4" />
            Join waitlist
          </button>
        </div>
      )}
    </section>
  );
}