import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { JsonLd } from '@/components/JsonLd';
import { SkipLink } from '@/components/SkipLink';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PlatformProviderWrapper } from '@/components/PlatformProviderWrapper';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { buildRootMetadata } from '@/lib/seo';
import { AmbientLayer } from '@/components/ui/AmbientLayer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  ...buildRootMetadata(),
  verification: { google: 'JXl9PzynZw-9rloI6NeoW8CNLPJ6wGrpdKu9GdZtAL4' },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
        <JsonLd />
      </head>
      <body className="min-h-full">
        <AmbientLayer />
        <SkipLink />
        <ErrorBoundary fallbackMessage="The Longevity OS encountered an issue loading this section.">
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
      </body>
    </html>
  );
}