import { AppShell } from "@/components/app-shell";
import { HrEnrollmentPanel } from "@/components/attack-surface/hr-enrollment-panel";
import { VendorLoginPanel } from "@/components/attack-surface/vendor-login-panel";

export default function PortalPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Employee Portal</h1>
          <p className="mt-2 text-sm text-slate-400">
            External vendor integrations and HR self-service workflows.
          </p>
        </div>
        <VendorLoginPanel />
        <HrEnrollmentPanel />
      </div>
    </AppShell>
  );
}
