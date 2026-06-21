"use client";

import { useState } from "react";
import { submitEnrollment } from "@/lib/api";

export function HrEnrollmentPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [log, setLog] = useState("Activity trace enabled for IT support.");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await submitEnrollment(email, password);
    setLog(result.activity_log);
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            HR Self-Service
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Annual Benefits Enrollment
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Confirm your portal credentials to access enrollment forms. Debug trace
            left on for Q1 rollout support.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1056.003
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs text-slate-400">
            Portal email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label htmlFor="portal-password" className="mb-1 block text-xs text-slate-400">
            Portal password
          </label>
          <input
            id="portal-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Continue enrollment
        </button>
      </form>
      <div
        id="portal-activity-log"
        className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-400"
      >
        {log}
      </div>
    </section>
  );
}
