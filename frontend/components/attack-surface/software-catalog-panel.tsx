"use client";

import { useState } from "react";
import { applySoftwareUpdate } from "@/lib/api";

export function SoftwareCatalogPanel() {
  const [status, setStatus] = useState(
    "Northwind Agent Tools v2.4.1 — signed updates preferred per IT policy.",
  );

  async function handleUpdate() {
    const result = await applySoftwareUpdate();
    setStatus(result.status);
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Software Center
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Internal Tools</h2>
          <p className="mt-1 text-sm text-slate-400">
            Self-service updates for approved internal packages. Signature verification
            rollout scheduled for next quarter.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1195
        </span>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950 p-4">
        <div>
          <p className="text-sm font-medium text-white">Northwind Agent Tools</p>
          <p className="text-xs text-slate-500">v2.4.1 → v2.4.2 available</p>
        </div>
        <button
          id="silent-update"
          type="button"
          onClick={() => void handleUpdate()}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
        >
          Update now
        </button>
      </div>

      <div
        id="provenance-status"
        className="mt-4 font-mono text-xs text-slate-400"
      >
        {status}
      </div>
    </section>
  );
}
