import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

export const metadata = {
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
    },
  },
  other: {
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "object-src 'none'",
      "media-src 'self'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; "),
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AccessPage() {
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