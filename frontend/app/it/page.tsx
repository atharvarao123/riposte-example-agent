import { AppShell } from "@/components/app-shell";
import { BrowserLabPanel } from "@/components/attack-surface/browser-lab-panel";
import { SearchToolsPanel } from "@/components/attack-surface/search-tools-panel";
import { SoftwareCatalogPanel } from "@/components/attack-surface/software-catalog-panel";
import { TicketBridgePanel } from "@/components/attack-surface/ticket-bridge-panel";

const IT_TOOL_ARTIFACTS = [
  {
    id: "browser-lab",
    name: "Browser Lab",
    version: process.env.NEXT_PUBLIC_BROWSER_LAB_VERSION ?? "unknown",
    signature: process.env.NEXT_PUBLIC_BROWSER_LAB_SIGNATURE ?? "",
    approved: process.env.NEXT_PUBLIC_BROWSER_LAB_APPROVED === "true",
  },
  {
    id: "ticket-bridge",
    name: "Ticket Bridge",
    version: process.env.NEXT_PUBLIC_TICKET_BRIDGE_VERSION ?? "unknown",
    signature: process.env.NEXT_PUBLIC_TICKET_BRIDGE_SIGNATURE ?? "",
    approved: process.env.NEXT_PUBLIC_TICKET_BRIDGE_APPROVED === "true",
  },
  {
    id: "software-catalog",
    name: "Software Catalog",
    version: process.env.NEXT_PUBLIC_SOFTWARE_CATALOG_VERSION ?? "unknown",
    signature: process.env.NEXT_PUBLIC_SOFTWARE_CATALOG_SIGNATURE ?? "",
    approved: process.env.NEXT_PUBLIC_SOFTWARE_CATALOG_APPROVED === "true",
  },
  {
    id: "search-tools",
    name: "Search Tools",
    version: process.env.NEXT_PUBLIC_SEARCH_TOOLS_VERSION ?? "unknown",
    signature: process.env.NEXT_PUBLIC_SEARCH_TOOLS_SIGNATURE ?? "",
    approved: process.env.NEXT_PUBLIC_SEARCH_TOOLS_APPROVED === "true",
  },
] as const;

export default function ItPage() {
  const blockingTools = IT_TOOL_ARTIFACTS.filter(
    (tool) => !tool.approved || !tool.signature,
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">IT Tools</h1>
          <p className="mt-2 text-sm text-slate-400">
            Browser automation QA, vendor ticket bridge, software center, and internal
            search.
          </p>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-500 sm:grid-cols-2">
            {IT_TOOL_ARTIFACTS.map((tool) => (
              <div
                key={tool.id}
                className="rounded border border-slate-800 p-2"
              >
                <dt className="font-medium text-slate-300">{tool.name}</dt>
                <dd>Version: {tool.version}</dd>
                <dd>Signature: {tool.signature ? "present" : "missing"}</dd>
                <dd>Approval: {tool.approved ? "granted" : "pending"}</dd>
              </div>
            ))}
          </dl>
        </div>

        {blockingTools.length > 0 ? (
          <div
            role="alert"
            className="rounded-md border border-yellow-600 bg-yellow-950 p-4"
          >
            <h2 className="text-lg font-semibold text-yellow-200">
              Explicit approval required
            </h2>
            <p className="mt-2 text-sm text-yellow-300">
              The following tools cannot be loaded until they are signed and
              explicitly approved:{" "}
              {blockingTools.map((t) => t.name).join(", ")}.
            </p>
          </div>
        ) : (
          <>
            <BrowserLabPanel />
            <TicketBridgePanel />
            <SoftwareCatalogPanel />
            <SearchToolsPanel />
          </>
        )}
      </div>
    </AppShell>
  );
}