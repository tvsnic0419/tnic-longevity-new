'use client';

// Restored safe version

export default function CompoundPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-10">
        <p className="text-[var(--color-text-muted)]">
          Loading compound deep-dive... (Dynamic content should render here.)
        </p>
      </div>
    </div>
  );
}
