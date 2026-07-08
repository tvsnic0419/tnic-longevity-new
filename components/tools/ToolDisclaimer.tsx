import { AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';

export function ToolDisclaimer({ variant = 'info' }: { variant?: 'info' | 'warning' }) {
  const isWarning = variant === 'warning';
  return (
    <div
      className={`rounded-xl p-4 border flex gap-3 ${
        isWarning
          ? 'border-accent-amber/30 bg-accent-amber/5'
          : 'border-border bg-muted/30'
      }`}
    >
      {isWarning ? (
        <AlertTriangle className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
      ) : (
        <Info className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
      )}
      <p className="text-xs text-muted-foreground leading-relaxed">
        <strong className={isWarning ? 'text-amber-200' : 'text-muted-foreground'}>
          Educational tool — not medical advice.
        </strong>{' '}
        Outputs are evidence-informed models for personal exploration. Dosing suggestions derive from
        published trial ranges, not prescriptions.{' '}
        <Link href="/trust/disclaimers" className="text-accent-cyan hover:text-accent-emerald">
          Read disclaimers
        </Link>{' '}
        ·{' '}
        <Link href="/trust/methodology" className="text-accent-cyan hover:text-accent-emerald">
          Evidence methodology
        </Link>
      </p>
    </div>
  );
}