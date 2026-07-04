'use client';

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SITE } from '@/lib/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { getHubContext } from '@/lib/hub-context';

const categories = [
  { id: 'stack', label: 'Stack / protocol question' },
  { id: 'labs', label: 'Labs & biomarker interpretation' },
  { id: 'library', label: 'Library content / evidence tier' },
  { id: 'platform', label: 'Platform bug or feature' },
  { id: 'partnership', label: 'Partnership / lab integration' },
  { id: 'other', label: 'Other (non-medical)' },
] as const;

type Category = (typeof categories)[number]['id'];

const STORAGE_KEY = 'tnic:contact-drafts';

export function ContactForm() {
  const [category, setCategory] = useState<Category>('stack');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const subject = encodeURIComponent(`[TNiC ${category}] Protocol question`);
    const body = encodeURIComponent(
      [
        `Category: ${categories.find((c) => c.id === category)?.label}`,
        `Reply email: ${email || '(not provided)'}`,
        '',
        message.trim(),
        '',
        '---',
        'TNiC Contact — not medical advice. Consult your physician for clinical decisions.',
      ].join('\n'),
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ category, email, message, date: new Date().toISOString() }),
      );
    } catch {
      /* ignore quota */
    }

    window.location.href = `mailto:${SITE.contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div>
      <PageHeader
        icon={MessageSquare}
        eyebrow="Protocol Questions"
        title="Ask TNiC — Not Your Doctor"
        description="Structured channel for stack, lab, and library questions. We respond to educational inquiries — never medical advice, diagnoses, or dose prescriptions."
        theme="cyan"
        align="left"
        context={getHubContext('contact')}
      />

      <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/5 p-4 mb-4 flex gap-3">
        <MessageSquare className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Partnership or affiliate inquiry?</strong>{' '}
          Select <em>Partnership / lab integration</em> below — Tommy reads these directly and responds within 48 hours.
        </p>
      </div>

      <div className="rounded-xl border border-accent-amber/25 bg-accent-amber/5 p-4 mb-8 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0" />
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Not for emergencies or clinical decisions.</strong>{' '}
          Active symptoms, medication changes, and Rx compounds (rapamycin, metformin) require your
          physician. TNiC provides evidence education only.
        </p>
      </div>

      {sent ? (
        <div className="glass rounded-2xl p-10 text-center">
          <CheckCircle2 className="w-10 h-10 text-accent-emerald mx-auto mb-4" />
          <p className="font-semibold mb-2">Mail client opened</p>
          <p className="text-sm text-muted-foreground">
            Send the pre-filled message to {SITE.contactEmail}. If nothing opened, email us directly
            with your category and question.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="max-w-xl space-y-6">
          <div>
            <label htmlFor="contact-category" className="text-label block mb-2">
              Category
            </label>
            <select
              id="contact-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus-ring"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-email" className="text-label block mb-2">
              Reply email (optional)
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus-ring"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="text-label block mb-2">
              Your question
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder="e.g. My hs-CRP rose on Starter Elite week 8 — should I add sulforaphane or fix sleep first?"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus-ring resize-y min-h-[140px]"
            />
          </div>

          <button
            type="submit"
            className="focus-ring w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-accent-cyan transition"
          >
            <Send className="w-4 h-4" />
            Open email to send
          </button>
        </form>
      )}
    </div>
  );
}