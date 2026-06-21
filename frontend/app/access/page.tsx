import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

export const metadata: Metadata = {
  title: "Access & Integrations",
  description: "Account settings, SSO handoffs, and partner resource downloads.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
  other: {
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "manifest-src 'self'",
      "worker-src 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join("; "),
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-DNS-Prefetch-Control": "off",
    "X-Download-Options": "noopen",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Permissions-Policy":
      "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Resource-Policy": "same-origin",
  },
};

export default function AccessPage() {
  return (
    <AppShell>
      <div
        className="space-y-6"
        data-sandbox-root="access"
        data-isolation="strict"
      >
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Access &amp; Integrations
          </h1>
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