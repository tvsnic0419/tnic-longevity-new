import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { HubPage } from "@/components/app/HubPage";

export const Route = createFileRoute("/nico")({ component: Page });

function Page() {
  return (
    <AppShell>
      <HubPage id="nico" />
    </AppShell>
  );
}
