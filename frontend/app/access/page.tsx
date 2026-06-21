import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

export const metadata = {
  title: "Access & Integrations",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccessPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Access & Integrations</h1>
          <p className="mt-2 text-sm text-slate-400">
            Account settings, SSO handoffs, and partner resource downloads.
          </p>
          <div
            role="alert"
            className="mt-4 rounded-md border border-amber-700/40 bg-amber-950/30 p-3 text-xs text-amber-200"
          >
            <strong>Security notice:</strong> Downloads on this page are gated and
            audited. Do not follow unverified links or bypass browser warnings.
            SSO handoffs use strict origin checks. This page is sandboxed and must
            not be embedded in an external frame.
          </div>
        </div>
        <AdminAccessPanel />
        <SsoPanel />
        <PartnerResourcesPanel />
      </div>
    </AppShell>
  );
}