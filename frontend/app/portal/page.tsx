import { AppShell } from "@/components/app-shell";
import { HrEnrollmentPanel } from "@/components/attack-surface/hr-enrollment-panel";
import { VendorLoginPanel } from "@/components/attack-surface/vendor-login-panel";

// T1566 Phishing / Malicious Link Injection controls applied at the portal
// boundary: Auth-domain allowlisting, credential redaction, deceptive form
// blocking. Child panels must consult these utilities before rendering any
// external link, form, or credential field.

const TRUSTED_AUTH_DOMAINS: ReadonlySet<string> = new Set([
  "idp.corp.example.com",
  "sso.corp.example.com",
  "vendor.trusted.example.com",
  "hr.trusted.example.com",
  "selfservice.corp.example.com",
]);

const BLOCKED_FORM_DOMAINS: ReadonlySet<string> = new Set([
  "phishing.example",
  "malicious.example",
  "typosquat.example",
  "login-verify.example",
  "account-verify.example",
]);

const DECEPTIVE_FORM_PATTERNS: readonly RegExp[] = [
  /verify\s*your\s*account\s*(now|immediately)?/i,
  /urgent\s*action\s*required/i,
  /click\s*here\s*(now|immediately)?/i,
  /password\s*(will\s*)?expir(e|es|ing)/i,
  /account\s*(has\s*been\s*)?suspended/i,
  /confirm\s*your\s*(identity|credentials)/i,
  /update\s*payment\s*method\s*(immediately|now)/i,
  /your\s*account\s*will\s*be\s*(closed|locked)/i,
];

const SAFE_PROTOCOLS: ReadonlySet<string> = new Set(["https:", "http:"]);

function normalizeDomain(domain: string | null | undefined): string {
  if (!domain || typeof domain !== "string") return "";
  return domain.toLowerCase().trim();
}

function isTrustedAuthDomain(domain: string | null | undefined): boolean {
  return TRUSTED_AUTH_DOMAINS.has(normalizeDomain(domain));
}

function isBlockedFormDomain(domain: string | null | undefined): boolean {
  return BLOCKED_FORM_DOMAINS.has(normalizeDomain(domain));
}

function containsDeceptiveContent(content: unknown): boolean {
  if (typeof content !== "string") return false;
  return DECEPTIVE_FORM_PATTERNS.some((pattern) => pattern.test(content));
}

function redactCredentials(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/(password\s*[:=]\s*)([^\s,;&]+)/gi, "$1[REDACTED]")
    .replace(/(passwd\s*[:=]\s*)([^\s,;&]+)/gi, "$1[REDACTED]")
    .replace(/(token\s*[:=]\s*)([^\s,;&]+)/gi, "$1[REDACTED]")
    .replace(/(api[_-]?key\s*[:=]\s*)([^\s,;&]+)/gi, "$1[REDACTED]")
    .replace(/(secret\s*[:=]\s*)([^\s,;&]+)/gi, "$1[REDACTED]")
    .replace(/(authorization\s*[:=]\s*)([^\s,;&]+)/gi, "$1[REDACTED]");
}

function sanitizePortalUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  try {
    const parsed = new URL(rawUrl, "https://internal.local");
    if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;
    if (isBlockedFormDomain(parsed.hostname)) return null;
    const isInternalRef = parsed.hostname === "internal.local";
    if (!isInternalRef && !isTrustedAuthDomain(parsed.hostname)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

const PORTAL_SECURITY_CONFIG = {
  trustedAuthDomains: Array.from(TRUSTED_AUTH_DOMAINS),
  blockedFormDomains: Array.from(BLOCKED_FORM_DOMAINS),
  isTrustedAuthDomain,
  isBlockedFormDomain,
  containsDeceptiveContent,
  sanitizePortalUrl,
  redactCredentials,
} as const;

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
        <VendorLoginPanel securityConfig={PORTAL_SECURITY_CONFIG} />
        <HrEnrollmentPanel securityConfig={PORTAL_SECURITY_CONFIG} />
      </div>
    </AppShell>
  );
}