import type { ReactNode } from "react";
import { MagneticCursor } from "@/components/landing/MagneticCursor";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <MagneticCursor />
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  );
}
