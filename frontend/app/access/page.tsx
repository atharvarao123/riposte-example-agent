import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";
import { getServerSession } from "@/lib/auth";
import { hasRole, requireStepUpAuth } from "@/lib/access-control";

export default async function AccessPage() {
  // Server-side role enforcement to prevent unauthorized valid-account access (T1078)
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Enforce least privilege: verify user has a role permitted for this section
  const canAccess = await hasRole(userId, ["admin", "partner"]);

  if (!canAccess) {
    redirect("/unauthorized");
  }

  // Step-up auth required for access management operations
  const stepUpValid = await requireStepUpAuth(userId, "access-management");

  if (!stepUpValid) {
    redirect("/auth/verify");
  }

  // Resolve fine-grained role flags to render only authorized panels
  const isAdmin = await hasRole(userId, "admin");
  const isPartner = await hasRole(userId, "partner");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Access & Integrations</h1>
          <p className="mt-2 text-sm text-slate-400">
            Account settings, SSO handoffs, and partner resource downloads.
          </p>
        </div>
        {isAdmin && <AdminAccessPanel />}
        {isPartner && <SsoPanel />}
        {isPartner && <PartnerResourcesPanel />}
      </div>
    </AppShell>
  );
}