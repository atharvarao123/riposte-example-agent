import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

const ALLOWED_REDIRECT_HOSTS = new Set([
  "app.example.com",
  "admin.example.com",
  "sso.example.com",
]);

function isValidRedirectUri(uri: string | null | undefined): string | null {
  if (!uri || typeof uri !== "string") return null;
  try {
    const url = new URL(uri);
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_REDIRECT_HOSTS.has(url.hostname)) return null;
    if (url.hash || url.search) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function getSanitizedRedirectUri(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return isValidRedirectUri(params.get("redirect_uri") || params.get("returnTo"));
}

export default function AccessPage() {
  const safeRedirectUri = getSanitizedRedirectUri();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Access & Integrations</h1>
          <p className="mt-2 text-sm text-slate-400">
            Account settings, SSO handoffs, and partner resource downloads.
          </p>
        </div>
        <AdminAccessPanel />
        <SsoPanel redirectUri={safeRedirectUri} />
        <PartnerResourcesPanel />
      </div>
    </AppShell>
  );
}