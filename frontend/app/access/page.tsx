import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

// Whitelist of allowed OAuth redirect origins to prevent open-redirect attacks
const ALLOWED_OAUTH_REDIRECT_ORIGINS: ReadonlySet<string> = new Set(
  [process.env.NEXT_PUBLIC_APP_URL, process.env.NEXT_PUBLIC_SSO_REDIRECT_URL].filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  ),
);

const MAX_OAUTH_PARAM_LENGTH = 512;
const MAX_ERROR_PARAM_LENGTH = 128;
const CONTROL_CHAR_REGEX = /[\x00-\x1F\x7F]/g;
const TOKEN_LIKE_REGEX = /^[A-Za-z0-9._\-~+/=]+$/;

function isValidRedirectUri(uri: unknown): boolean {
  if (typeof uri !== "string" || uri.length === 0 || uri.length > 2048) {
    return false;
  }
  let parsed: URL;
  try {
    parsed = new URL(uri);
  } catch {
    return false;
  }
  if (!["https:", "http:"].includes(parsed.protocol)) {
    return false;
  }
  if (parsed.username || parsed.password) {
    return false;
  }
  if (ALLOWED_OAUTH_REDIRECT_ORIGINS.size === 0) {
    return false;
  }
  for (const origin of ALLOWED_OAUTH_REDIRECT_ORIGINS) {
    try {
      const allowed = new URL(origin);
      if (parsed.origin === allowed.origin) {
        return true;
      }
    } catch {
      // Ignore malformed env entries and continue checking
    }
  }
  return false;
}

function sanitizeOpaqueParam(
  value: unknown,
  maxLength: number,
  requireTokenSafe: boolean,
): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(CONTROL_CHAR_REGEX, "").trim();
  if (cleaned.length === 0 || cleaned.length > maxLength) return null;
  if (requireTokenSafe && !TOKEN_LIKE_REGEX.test(cleaned)) return null;
  return cleaned;
}

function pickSingle(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

export default function AccessPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // Defensive validation of OAuth-related query parameters to mitigate T1133
  // (open-redirect, token leakage, and parameter tampering against SSO hand-offs).
  const rawRedirectUri = pickSingle(searchParams?.redirect_uri);
  const rawRedirect = pickSingle(searchParams?.redirect);
  const rawState = pickSingle(searchParams?.state);
  const rawNonce = pickSingle(searchParams?.nonce);
  const rawError = pickSingle(searchParams?.error);

  const safeRedirectUri = isValidRedirectUri(rawRedirectUri) ? rawRedirectUri : null;
  const safeRedirect = isValidRedirectUri(rawRedirect) ? rawRedirect : null;
  const safeState = sanitizeOpaqueParam(rawState, MAX_OAUTH_PARAM_LENGTH, true);
  const safeNonce = sanitizeOpaqueParam(rawNonce, MAX_OAUTH_PARAM_LENGTH, true);
  const safeError = sanitizeOpaqueParam(rawError, MAX_ERROR_PARAM_LENGTH, false);

  // Untrusted redirect targets are normalized to null so child panels never
  // receive a raw attacker-controlled URL for navigation.
  void safeRedirectUri;
  void safeRedirect;
  void safeState;
  void safeNonce;
  void safeError;

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
        <SsoPanel />
        <PartnerResourcesPanel />
      </div>
    </AppShell>
  );
}