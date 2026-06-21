"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { HrEnrollmentPanel } from "@/components/attack-surface/hr-enrollment-panel";
import { VendorLoginPanel } from "@/components/attack-surface/vendor-login-panel";

// T1566: Phishing / Malicious Link Injection mitigation
const ALLOWED_AUTH_DOMAINS = new Set<string>([
  "identity.acme.internal",
  "hr.acme.internal",
  "vendors.acme.internal",
  "login.microsoftonline.com",
  "accounts.google.com",
]);

const isAllowedOrigin = (url: string): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const parsed = new URL(url, window.location.origin);
    const host = parsed.hostname.toLowerCase();
    if (host === window.location.hostname.toLowerCase()) return true;
    if (ALLOWED_AUTH_DOMAINS.has(host)) return true;
    for (const allowed of ALLOWED_AUTH_DOMAINS) {
      if (host.endsWith(`.${allowed}`)) return true;
    }
    return false;
  } catch {
    return false;
  }
};

const redactCredentials = (value: string): string => {
  if (!value || typeof value !== "string") return "";
  return value
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]")
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "Bearer [REDACTED]")
    .replace(/\b(?:\d[ -]*?){13,16}\b/g, "[REDACTED_CC]")
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]");
};

const PortalSecurityBoundary = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const root = document.querySelector("[data-portal-surface]");
    if (!root) return;

    const handleSubmit = (event: Event) => {
      const form = (event.target as HTMLElement | null)?.closest("form");
      if (!form || !root.contains(form)) return;

      const action = (form.getAttribute("action") || "").trim();
      if (action && !isAllowedOrigin(action)) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof console !== "undefined") {
          console.warn("[Security] Blocked deceptive form submission:", action);
        }
        return;
      }

      form
        .querySelectorAll<HTMLInputElement>(
          'input[type="password"], input[autocomplete*="cc"], input[autocomplete*="ssn"], input[name*="token"], input[name*="secret"]'
        )
        .forEach((input) => {
          if (input.value) input.value = "";
        });
    };

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || !root.contains(anchor)) return;

      const href = (anchor.getAttribute("href") || "").trim();
      if (!href || href.startsWith("#")) return;
      if (href.startsWith("javascript:")) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const portalAction = (anchor.getAttribute("data-portal-action") || "").toLowerCase();
      const isAuthLink = portalAction === "auth" || /login|signin|auth|oauth|sso/i.test(href);
      if (isAuthLink && !isAllowedOrigin(href)) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof console !== "undefined") {
          console.warn("[Security] Blocked navigation to non-allowlisted auth domain:", href);
        }
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (event.message) {
        event.preventDefault();
        const safe = redactCredentials(event.message);
        if (typeof console !== "undefined") {
          console.error("[Portal Error]", safe);
        }
      }
    };

    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("error", handleError);

    return () => {
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return <div data-portal-surface>{children}</div>;
};

export default function PortalPage() {
  return (
    <AppShell>
      <PortalSecurityBoundary>
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
      </PortalSecurityBoundary>
    </AppShell>
  );
}