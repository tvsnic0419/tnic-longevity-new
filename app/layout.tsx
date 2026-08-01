import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Fraunces } from 'next/font/google';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { JsonLd } from '@/components/JsonLd';
import { SkipLink } from '@/components/SkipLink';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PlatformProviderWrapper } from '@/components/PlatformProviderWrapper';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { RevealScript } from '@/components/ui/RevealScript';
import { buildRootMetadata } from '@/lib/seo';
import { AmbientLayer } from '@/components/ui/AmbientLayer';
import './globals.css';

// One typography source of truth — the cinematic stack used by the Descent
// scene and the viz family now drives the entire site. Self-hosted via
// next/font (no layout-shift, no external @import), exposed as CSS variables.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  // Optical-size + weights the display headings actually use.
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  ...buildRootMetadata(),
  verification: {
    google: 'JXl9PzynZw-9rloI6NeoW8CNLPJ6wGrpdKu9GdZtAL4',
    // Apple Business Register verifies domain ownership via DNS TXT lookup,
    // not this meta tag — this is a redundant record only, not a substitute
    // for the apple-domain-verification TXT record on the domain itself.
    other: { 'apple-domain-verification': 'Zg8sSlsVG0C6gwD4' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
        <RevealScript />
        <JsonLd />
      </head>
      <body className="min-h-full">
        <AmbientLayer />
        <SkipLink />
        <ErrorBoundary fallbackMessage="TNiC ran into an issue loading this section.">
          <PlatformProviderWrapper>
            <div className="page-canvas">{children}</div>
          </PlatformProviderWrapper>
        </ErrorBoundary>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f8fafc',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}