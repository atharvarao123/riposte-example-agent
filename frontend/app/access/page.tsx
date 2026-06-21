import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

const ALLOWED_REDIRECT_PATHS: ReadonlySet<string> = new Set([
  "/dashboard",
  "/access",
  "/settings",
  "/admin",
  "/profile",
]);

const TOKEN_PATTERN = /^[A-Za-z0-9_\-./+]+=*$/;
const MAX_TOKEN_LENGTH = 4096;
const MIN_TOKEN_LENGTH = 16;
const MAX_PATH_LENGTH = 2048;
const DANGEROUS_PROTOCOLS = [
  "javascript:",
  "data:",
  "vbscript:",
  "file:",
  "http:",
  "https:",
];

function isSafeRedirectPath(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > MAX_PATH_LENGTH
  ) {
    return false;
  }
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\") ||
    value.startsWith("/%2f") ||
    value.startsWith("/%5c") ||
    value.startsWith("/%2F") ||
    value.startsWith("/%5C")
  ) {
    return false;
  }
  if (/[\x00-\x1f\x7f\s<>"'`{}|\\^]/.test(value)) {
    return false;
  }
  const lower = value.toLowerCase();
  for (const proto of DANGEROUS_PROTOCOLS) {
    if (lower.includes(proto)) {
      return false;
    }
  }
  const pathOnly = value.split("?")[0].split("#")[0];
  return ALLOWED_REDIRECT_PATHS.has(pathOnly);
}

function isSafeToken(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  if (value.length < MIN_TOKEN_LENGTH || value.length > MAX_TOKEN_LENGTH) {
    return false;
  }
  if (/\s/.test(value)) {
    return false;
  }
  return TOKEN_PATTERN.test(value);
}

function sanitizeParam<T>(
  value: string | string[] | undefined,
  validator: (v: unknown) => v is T
): T | null {
  if (Array.isArray(value) || value === undefined) {
    return null;
  }
  return validator(value) ? value : null;
}

interface AccessPageProps {
  searchParams: Promise<{
    redirect_uri?: string | string[];
    redirectUri?: string | string[];
    returnTo?: string | string[];
    token?: string | string[];
    access_token?: string | string[];
    id_token?: string | string[];
    state?: string | string[];
    code?: string | string[];
  }>;
}

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const params = await searchParams;

  const rawRedirect =
    params.redirect_uri ?? params.redirectUri ?? params.returnTo;
  const rawToken = params.token ?? params.access_token ?? params.id_token;

  const safeRedirectUri = sanitizeParam(rawRedirect, isSafeRedirectPath);
  const safeToken = sanitizeParam(rawToken, isSafeToken);
  const safeState = sanitizeParam(params.state, isSafeToken);
  const safeCode = sanitizeParam(params.code, isSafeToken);

  const hasSuspiciousInput =
    (rawRedirect !== undefined && safeRedirectUri === null) ||
    (params.token !== undefined && safeToken === null && params.token === rawToken) ||
    (params.access_token !== undefined && safeToken === null && params.access_token === rawToken) ||
    (params.id_token !== undefined && safeToken === null && params.id_token === rawToken) ||
    (params.state !== undefined && safeState === null) ||
    (params.code !== undefined && safeCode === null);

  if (hasSuspiciousInput) {
    redirect("/access?error=invalid_request");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Access &amp; Integrations
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Account settings, SSO handoffs, and partner resource downloads.
          </p>
        </div>
        <AdminAccessPanel />
        <SsoPanel
          redirectUri={safeRedirectUri}
          token={safeToken}
          state={safeState}
          authorizationCode={safeCode}
        />
        <PartnerResourcesPanel />
      </div>
    </AppShell>
  );
}