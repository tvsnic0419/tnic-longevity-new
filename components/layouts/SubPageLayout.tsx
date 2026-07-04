import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ContextBar } from '@/components/os/ContextBar';

export function SubPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Nav />
      <div className="pt-14 md:pt-16">
        <ContextBar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}