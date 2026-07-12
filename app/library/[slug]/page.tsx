'use client';

// Restored safe version - original dynamic/MDX rendering should be preserved here.
// The luminous CSS classes added in globals.css remain available for gradual adoption.

export default function HallmarkPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container-page py-12">
        <div className="max-w-4xl">
          <p className="text-[var(--color-text-muted)]">
            Loading hallmark content... (If you see this persistently, please check the dynamic import/MDX setup.)
          </p>
        </div>
      </div>
    </div>
  );
}
