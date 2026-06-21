import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";
import { AccessGuard } from "@/components/auth/access-guard";
import { useStepUpAuth } from "@/hooks/use-step-up-auth";
import { useAuth } from "@/hooks/use-auth";

export default function AccessPage() {
  const { user, isLoading, hasRole } = useAuth();
  const { requireStepUp, isStepUpVerified } = useStepUpAuth();

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-400">Verifying access...</p>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="rounded-md border border-red-900 bg-red-950/30 p-4">
          <h2 className="text-lg font-semibold text-red-300">Authentication required</h2>
          <p className="mt-1 text-sm text-slate-400">
            You must be signed in to access this page.
          </p>
        </div>
      </AppShell>
    );
  }

  const canViewAdmin = hasRole("admin") || hasRole("owner");
  const canViewSso = hasRole("admin") || hasRole("owner") || hasRole("security-admin");
  const canViewPartner = hasRole("admin") || hasRole("owner") || hasRole("partner-manager");

  const handleAdminAccess = async () => {
    if (!isStepUpVerified) {
      const verified = await requireStepUp();
      if (!verified) {
        return;
      }
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Access & Integrations</h1>
          <p className="mt-2 text-sm text-slate-400">
            Account settings, SSO handoffs, and partner resource downloads.
          </p>
        </div>
        {canViewAdmin ? (
          <AccessGuard
            requiredRoles={["admin", "owner"]}
            requireStepUp={true}
            onAccess={handleAdminAccess}
          >
            <AdminAccessPanel />
          </AccessGuard>
        ) : (
          <div className="rounded-md border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm text-slate-500">
              You do not have permission to view administrative access settings.
            </p>
          </div>
        )}
        {canViewSso ? (
          <AccessGuard requiredRoles={["admin", "owner", "security-admin"]}>
            <SsoPanel />
          </AccessGuard>
        ) : (
          <div className="rounded-md border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm text-slate-500">
              You do not have permission to view SSO configuration.
            </p>
          </div>
        )}
        {canViewPartner ? (
          <AccessGuard requiredRoles={["admin", "owner", "partner-manager"]}>
            <PartnerResourcesPanel />
          </AccessGuard>
        ) : (
          <div className="rounded-md border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm text-slate-500">
              You do not have permission to view partner resources.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}