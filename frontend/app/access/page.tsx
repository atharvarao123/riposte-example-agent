import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";
import { useAuth } from "@/hooks/use-auth";
import { useStepUpAuth } from "@/hooks/use-step-up-auth";
import { hasRole, type Role } from "@/lib/auth/roles";
import { Forbidden } from "@/components/forbidden";

// Least-privilege role mappings. T1078 mitigation: never trust a valid
// session alone for sensitive panels - require explicit role membership
// and step-up auth for high-risk surfaces.
const ADMIN_ROLES: Role[] = ["admin", "security_admin"];
const SSO_ROLES: Role[] = ["admin", "security_admin", "sso_admin"];
const PARTNER_ROLES: Role[] = ["admin", "partner_manager", "partner"];
const STEP_UP_TTL_SECONDS = 300;

function sanitizeRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  const allowed: Role[] = [
    "admin",
    "security_admin",
    "sso_admin",
    "partner_manager",
    "partner",
    "user",
  ];
  return allowed.includes(value as Role) ? (value as Role) : null;
}

export default function AccessPage() {
  const { user, status } = useAuth();
  const { isStepUpValid, requireStepUp } = useStepUpAuth({
    ttlSeconds: STEP_UP_TTL_SECONDS,
  });

  if (status === "loading") {
    return (
      <AppShell>
        <div className="flex items-center justify-center p-12 text-sm text-slate-400">
          Verifying access...
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <Forbidden reason="unauthenticated" />
      </AppShell>
    );
  }

  const userRoles = (user.roles ?? [])
    .map(sanitizeRole)
    .filter((r): r is Role => r !== null);

  const isAdmin = userRoles.some((r) => ADMIN_ROLES.includes(r));
  const canViewSso = userRoles.some((r) => SSO_ROLES.includes(r));
  const canViewPartner = userRoles.some((r) => PARTNER_ROLES.includes(r));

  if (!isAdmin && !canViewSso && !canViewPartner) {
    return (
      <AppShell>
        <Forbidden reason="insufficient_role" requiredRoles={[...ADMIN_ROLES, ...SSO_ROLES, ...PARTNER_ROLES]} />
      </AppShell>
    );
  }

  const needsStepUp = isAdmin || canViewSso;
  const stepUpOk = needsStepUp ? isStepUpValid() : true;

  if (needsStepUp && !stepUpOk) {
    return (
      <AppShell>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Access & Integrations</h1>
            <p className="mt-2 text-sm text-slate-400">
              Step-up authentication is required to view sensitive account settings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => requireStepUp()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Verify identity to continue
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Access & Integrations</h1>
          <p className="mt-2 text-sm text-slate-400">
            Account settings, SSO handoffs, and partner resource downloads.
          </p>
        </div>
        {isAdmin ? <AdminAccessPanel /> : null}
        {canViewSso ? <SsoPanel /> : null}
        {canViewPartner ? <PartnerResourcesPanel /> : null}
      </div>
    </AppShell>
  );
}