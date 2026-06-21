"use client";

import { useEffect, useState } from "react";
import { fetchPolicyView } from "@/lib/api";

export function PolicyViewerPanel() {
  const [trusted, setTrusted] = useState("");
  const [injected, setInjected] = useState("");

  useEffect(() => {
    void fetchPolicyView("policy-mfa").then((result) => {
      setTrusted(result.trusted_content);
      setInjected(result.injected_content);
    });
  }, []);

  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Policy Viewer
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">MFA Security Policy</h2>
          <p className="mt-1 text-sm text-slate-400">
            Full document view with collaborator comments. Comment sanitization
            scheduled for next release.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1659
        </span>
      </div>

      <article
        id="trusted-content"
        className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200"
      >
        {trusted || "Loading policy…"}
      </article>

      <article
        id="injected-content"
        style={{ display: "none" }}
        className="text-sm"
      >
        {injected}
      </article>
    </section>
  );
}
