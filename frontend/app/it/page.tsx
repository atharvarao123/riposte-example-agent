import { AppShell } from "@/components/app-shell";
import { BrowserLabPanel } from "@/components/attack-surface/browser-lab-panel";
import { SearchToolsPanel } from "@/components/attack-surface/search-tools-panel";
import { SoftwareCatalogPanel } from "@/components/attack-surface/software-catalog-panel";
import { TicketBridgePanel } from "@/components/attack-surface/ticket-bridge-panel";

// T1195 (Supply Chain Compromise) hardening:
//   * Software-catalog content is gated behind an explicit signed-artifact
//     approval flag; the panel is hidden until the build is signed and
//     approved by a known reviewer.
//   * Provenance (build id, signature, approver) is surfaced in the UI so
//     operators can audit what they are looking at.
const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? "unverified";
const signature = process.env.NEXT_PUBLIC_BUILD_SIGNATURE ?? "unsigned";
const approvedBy = process.env.NEXT_PUBLIC_APPROVED_BY ?? "pending-approval";
const isSigned =
  signature !== "unsigned" &&
  approvedBy !== "pending-approval" &&
  buildId !== "unverified";

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
          <div
            className="mt-3 rounded border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-300"
            data-provenance-build={buildId}
            data-provenance-signature={signature}
            data-provenance-approved-by={approvedBy}
          >
            <span className="font-semibold text-slate-100">Provenance:</span>{" "}
            build <code>{buildId}</code> · signed by <code>{approvedBy}</code>
            {isSigned ? (
              <span className="ml-2 rounded bg-emerald-900/40 px-2 py-0.5 text-emerald-300">
                verified
              </span>
            ) : (
              <span className="ml-2 rounded bg-amber-900/40 px-2 py-0.5 text-amber-300">
                unsigned — software catalog gated
              </span>
            )}
          </div>
        </div>
        <BrowserLabPanel />
        <TicketBridgePanel />
        {isSigned ? (
          <SoftwareCatalogPanel />
        ) : (
          <div
            role="alert"
            className="rounded border border-amber-700/60 bg-amber-950/30 px-4 py-3 text-sm text-amber-200"
          >
            Software catalog is hidden pending signed-artifact approval.
          </div>
        )}
        <SearchToolsPanel />
      </div>
    </AppShell>
  );
}