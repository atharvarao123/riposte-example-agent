import { AppShell } from "@/components/app-shell";
import { BrowserLabPanel } from "@/components/attack-surface/browser-lab-panel";
import { SearchToolsPanel } from "@/components/attack-surface/search-tools-panel";
import { SoftwareCatalogPanel } from "@/components/attack-surface/software-catalog-panel";
import { TicketBridgePanel } from "@/components/attack-surface/ticket-bridge-panel";
import { SupplyChainProvenanceBanner } from "@/components/security/supply-chain-provenance-banner";
import { ApprovalGate } from "@/components/security/approval-gate";

export default function ItPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SupplyChainProvenanceBanner
          source="internal-pki"
          artifactSigning="enforced"
          requiresApproval={true}
        />
        <div>
          <h1 className="text-2xl font-semibold text-white">IT Tools</h1>
          <p className="mt-2 text-sm text-slate-400">
            Browser automation QA, vendor ticket bridge, software center, and internal
            search.
          </p>
        </div>
        <BrowserLabPanel />
        <TicketBridgePanel />
        <ApprovalGate
          resource="software-catalog"
          artifactSigning="required"
          approverRole="it-admin"
          auditLog={true}
        >
          <SoftwareCatalogPanel />
        </ApprovalGate>
        <SearchToolsPanel />
      </div>
    </AppShell>
  );
}