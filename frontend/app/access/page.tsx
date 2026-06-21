"use client";

import { useEffect, useRef, ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { AdminAccessPanel } from "@/components/attack-surface/admin-access-panel";
import { PartnerResourcesPanel } from "@/components/attack-surface/partner-resources-panel";
import { SsoPanel } from "@/components/attack-surface/sso-panel";

function SecurityBoundary({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isTrustedUrl = (rawHref: string): boolean => {
      const href = rawHref.trim();
      if (!href || href.startsWith("#") || href.startsWith("/")) return true;
      if (/^(javascript|data|vbscript|file):/i.test(href)) return false;
      try {
        const url = new URL(href, window.location.href);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest("a");
      if (!target) return;
      const anchor = target as HTMLAnchorElement;
      const href = anchor.getAttribute("href") || "";

      // Navigation restrictions: block dangerous URI schemes
      if (!isTrustedUrl(href)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Download gating: require explicit confirmation for risky file downloads
      const isDownload =
        anchor.hasAttribute("download") ||
        anchor.hasAttribute("ping") ||
        /\.(exe|msi|bat|cmd|scr|zip|rar|7z|dmg|pkg|app|iso|jar|apk|hta|ps1|vbs|js|jar)$/i.test(href);

      if (isDownload) {
        let hostname = "unknown";
        try {
          hostname = new URL(href, window.location.href).hostname;
        } catch {
          /* ignore */
        }
        const confirmed = window.confirm(
          `Download gated: A file from "${hostname}" is about to be downloaded. Confirm only if you trust this source.`
        );
        if (!confirmed) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      // Navigation restrictions: enforce noopener/noreferrer on external/_blank links
      const isExternal = /^https?:\/\//i.test(href);
      if (anchor.target === "_blank" || isExternal) {
        const rel = (anchor.getAttribute("rel") || "").toLowerCase();
        if (!rel.includes("noopener")) {
          anchor.setAttribute("rel", `${rel} noopener`.trim());
        }
        if (!rel.includes("noreferrer")) {
          anchor.setAttribute("rel", `${anchor.getAttribute("rel") || ""} noreferrer`.trim());
        }
      }
    };

    // Browser sandboxing: apply restrictive sandbox to all iframes and strip dangerous permissions
    const applySandbox = () => {
      const iframes = container.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        if (!iframe.hasAttribute("sandbox")) {
          iframe.setAttribute(
            "sandbox",
            "allow-scripts allow-same-origin allow-forms allow-popups"
          );
        }
        iframe.removeAttribute("allow-top-navigation");
        iframe.removeAttribute("allow-top-navigation-by-user-activation");
        iframe.removeAttribute("allow-payment");
        iframe.removeAttribute("allowpaymentrequest");
      });

      // Sanitize object/embed tags that can host untrusted plugins
      const objects = container.querySelectorAll("object, embed");
      objects.forEach((el) => {
        el.remove();
      });
    };

    container.addEventListener("click", handleClick, true);
    applySandbox();

    // Re-apply protections when child components mount or update dynamically
    const observer = new MutationObserver(applySandbox);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      container.removeEventListener("click", handleClick, true);
      observer.disconnect();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

export default function AccessPage() {
  return (
    <AppShell>
      <SecurityBoundary>
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
      </SecurityBoundary>
    </AppShell>
  );
}