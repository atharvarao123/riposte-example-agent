import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";
import { useAccessControl } from "@/hooks/use-access-control";
import { StepUpAuthGate } from "@/components/security/step-up-auth-gate";
import { AccessDeniedNotice } from "@/components/security/access-denied-notice";

export default function AccessPage() {
  const {
    role,
    hasRole,
    isStepUpFresh,
    lastVerifiedAt,
    isLoading,
  } = useAccessControl();

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12 text-sm text-slate-400">
          Verifying access…
        </div>
      </AppShell>
    );
  }

  const canViewAdmin = hasRole("admin") || hasRole("owner");
  const canViewPartner = hasRole("admin") || hasRole("owner") || hasRole("partner");
  const canManageSso = hasRole("admin") || hasRole("owner");

  const adminFresh = canViewAdmin ? isStepUpFresh(15 * 60 * 1000) : true;
  const ssoFresh = canManageSso ? isStepUpFresh(15 * 60 * 1000) : true;
  const partnerFresh = canViewPartner ? isStepUpFresh(60 * 60 * 1000) : true;

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
          adminFresh ? (
            <AdminAccessPanel />
          ) : (
            <StepUpAuthGate
              reason="admin"
              lastVerifiedAt={lastVerifiedAt}
              maxAgeMs={15 * 60 * 1000}
            >
              <AdminAccessPanel />
            </StepUpAuthGate>
          )
        ) : null}

        {canManageSso ? (
          ssoFresh ? (
            <SsoPanel />
          ) : (
            <StepUpAuthGate
              reason="sso"
              lastVerifiedAt={lastVerifiedAt}
              maxAgeMs={15 * 60 * 1000}
            >
              <SsoPanel />
            </StepUpAuthGate>
          )
        ) : null}

        {canViewPartner ? (
          partnerFresh ? (
            <PartnerResourcesPanel />
          ) : (
            <StepUpAuthGate
              reason="partner"
              lastVerifiedAt={lastVerifiedAt}
              maxAgeMs={60 * 60 * 1000}
            >
              <PartnerResourcesPanel />
            </StepUpAuthGate>
          )
        ) : null}

        {!canViewAdmin && !canManageSso && !canViewPartner ? (
          <AccessDeniedNotice
            role={role ?? "unknown"}
            requiredRoles={["admin", "owner", "partner"]}
          />
        ) : null}
      </div>
    </AppShell>
  );
}