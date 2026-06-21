import { AppShell } from "@/components/app-shell";
import { DocumentsPanel } from "@/components/documents-panel";
import { PolicyViewerPanel } from "@/components/attack-surface/policy-viewer-panel";

export default function DocsPage() {
  return (
    <AppShell>
      <DocumentsPanel />
      <PolicyViewerPanel />
    </AppShell>
  );
}
