import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { HubPage } from "@/components/app/HubPage";

export const Route = createFileRoute("/labs")({ component: Page });

function Page() {
  return (
    <AppShell>
      <HubPage id="labs" />
    </AppShell>
  );
}
