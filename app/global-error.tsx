'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[tnic.help:global]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#030712',
          color: '#f8fafc',
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            TNiC encountered a critical error
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your local stack and lab data in the browser are unaffected. Reload the page or return home.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                background: 'linear-gradient(135deg, #22d3ee, #10b981)',
                color: '#000',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error replaces the root layout; a full-document navigation deliberately resets all app state to recover from a fatal error. */}
            <a
              href="/"
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '9999px',
                border: '1px solid #334155',
                color: '#f8fafc',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
