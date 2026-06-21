"use client";

import { useState } from "react";

export function SsoPanel() {
  const [fragment, setFragment] = useState(
    "Connect third-party integrations via corporate SSO.",
  );

  function handleSso() {
    const token = "stub-token-in-url-fragment";
    window.location.hash = `access_token=${token}`;
    setFragment(`token-fragment: access_token=${token}`);
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Identity
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">SSO Integrations</h2>
          <p className="mt-1 text-sm text-slate-400">
            Authorize third-party apps via Okta. Token handling follows legacy redirect
            flow pending migration.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1133
        </span>
      </div>

      <button
        id="sso-link"
        type="button"
        onClick={handleSso}
        className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
      >
        Sign in with Okta
      </button>

      <div
        id="token-fragment"
        className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-400"
      >
        {fragment}
      </div>
    </section>
  );
}
