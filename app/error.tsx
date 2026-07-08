'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[tnic.help]', error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-rose/10 border border-accent-rose/25">
          <AlertTriangle className="w-7 h-7 text-accent-rose" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-body-sm text-muted-foreground mt-2">
            The Longevity OS hit an unexpected error. Your local data is unaffected.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button icon={RefreshCw} onClick={reset}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" icon={Home}>
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}