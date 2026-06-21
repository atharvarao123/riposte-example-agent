"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

// T1133 mitigation: strict allowlist for OAuth redirect URIs to prevent
// open-redirect attacks against external remote services. Only http(s)
// schemes, allowlisted hostnames, and safe path characters are permitted.
export const ALLOWED_OAUTH_REDIRECT_HOSTNAMES = new Set<string>([
  "localhost",
  "127.0.0.1",
]);

export function isSafeRedirectUri(uri: unknown): uri is string {
  if (typeof uri !== "string" || uri.length === 0 || uri.length > 2048) {
    return false;
  }
  try {
    const parsed = new URL(uri);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    if (parsed.username || parsed.password) {
      return false;
    }
    if (!ALLOWED_OAUTH_REDIRECT_HOSTNAMES.has(parsed.hostname)) {
      return false;
    }
    if (!/^\/[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]*$/.test(parsed.pathname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function sanitizeStateParameter(state: unknown): string | null {
  if (typeof state !== "string" || state.length === 0 || state.length > 512) {
    return null;
  }
  if (!/^[a-zA-Z0-9\-._~]+$/.test(state)) {
    return null;
  }
  return state;
}

function purgeUnsafeOAuthParams(rawHref: string): string {
  try {
    const url = new URL(rawHref);
    let mutated = false;

    const redirectUri = url.searchParams.get("redirect_uri");
    if (redirectUri !== null && !isSafeRedirectUri(redirectUri)) {
      url.searchParams.delete("redirect_uri");
      mutated = true;
    }

    const returnUrl =
      url.searchParams.get("returnUrl") || url.searchParams.get("next");
    if (returnUrl !== null && !isSafeRedirectUri(returnUrl)) {
      url.searchParams.delete("returnUrl");
      url.searchParams.delete("next");
      mutated = true;
    }

    const state = url.searchParams.get("state");
    if (state !== null && sanitizeStateParameter(state) === null) {
      url.searchParams.delete("state");
      mutated = true;
    }

    if (
      url.searchParams.has("code") ||
      url.searchParams.has("token") ||
      url.searchParams.has("access_token")
    ) {
      url.searchParams.delete("code");
      url.searchParams.delete("token");
      url.searchParams.delete("access_token");
      mutated = true;
    }

    if (url.hash) {
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      let hashMutated = false;
      for (const key of ["code", "token", "access_token"]) {
        if (hashParams.has(key)) {
          hashParams.delete(key);
          hashMutated = true;
        }
      }
      if (hashMutated) {
        url.hash = hashParams.toString();
        mutated = true;
      }
    }

    return mutated ? url.toString() : rawHref;
  } catch {
    return rawHref;
  }
}

export default function AccessPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const safeHref = purgeUnsafeOAuthParams(window.location.href);
    if (safeHref !== window.location.href) {
      window.history.replaceState({}, "", safeHref);
    }
  }, []);

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