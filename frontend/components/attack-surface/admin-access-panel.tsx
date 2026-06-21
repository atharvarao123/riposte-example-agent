"use client";

import { useState } from "react";
import { fetchAdminStatus } from "@/lib/api";

export function AdminAccessPanel() {
  const [message, setMessage] = useState(
    "Employee settings — admin console restricted to HR per policy IT-014.",
  );

  async function handleAdminClick() {
    const result = await fetchAdminStatus();
    setMessage(`${result.access} — ${result.role}. ${result.message}`);
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Account
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Employee Settings</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage notification preferences and view role assignments.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1078
        </span>
      </div>

      <button
        id="admin-link"
        type="button"
        onClick={() => void handleAdminClick()}
        className="text-sm text-slate-400 underline hover:text-emerald-300"
      >
        Open Admin Console (HR only)
      </button>

      <div
        id="admin-access-message"
        className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-300"
      >
        {message}
      </div>
    </section>
  );
}
