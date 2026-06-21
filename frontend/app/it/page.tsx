import { AppShell } from "@/components/app-shell";
import { BrowserLabPanel } from "@/components/attack-surface/browser-lab-panel";
import { SearchToolsPanel } from "@/components/attack-surface/search-tools-panel";
import { SoftwareCatalogPanel } from "@/components/attack-surface/software-catalog-panel";
import { TicketBridgePanel } from "@/components/attack-surface/ticket-bridge-panel";

export default function ItPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">IT Tools</h1>
          <p className="mt-2 text-sm text-slate-400">
            Browser automation QA, vendor ticket bridge, software center, and internal
            search.
          </p>
        </div>
        <BrowserLabPanel />
        <TicketBridgePanel />
        <SoftwareCatalogPanel />
        <SearchToolsPanel />
      </div>
    </AppShell>
  );
}