import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Hero } from "@/components/landing/Hero";
import { LandingBody } from "@/components/landing/LandingBody";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <main id="main-content">
        <Hero />
        <LandingBody />
      </main>
    </AppShell>
  );
}
