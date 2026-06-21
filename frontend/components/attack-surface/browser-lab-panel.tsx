"use client";

import { useState } from "react";
import { bootstrapSession, fetchSessionStatus } from "@/lib/api";

export function BrowserLabPanel() {
  const [context, setContext] = useState<"job_a" | "job_b">("job_a");
  const [status, setStatus] = useState("Select a job context to begin isolation test.");

  async function initJobA() {
    await bootstrapSession("job_a");
    setContext("job_a");
    setStatus("Job A: authenticated session token exposed — protected-content loaded.");
  }

  async function switchToJobB() {
    setContext("job_b");
    const result = await fetchSessionStatus();
    setStatus(
      `Job B: ${result.status} — ${result.access}. Session isolation check: shared cookie detected (riposte_session_a).`,
    );
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Automation QA
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Browser Agent Sandbox
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Verify session isolation between concurrent agent jobs. Contexts should
            not share authenticated state.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1185
        </span>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => void initJobA()}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            context === "job_a"
              ? "bg-emerald-600/20 text-emerald-300"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Initialize Job A
        </button>
        <button
          type="button"
          onClick={() => void switchToJobB()}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            context === "job_b"
              ? "bg-emerald-600/20 text-emerald-300"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          Switch to Job B
        </button>
      </div>

      <div
        id="session-status"
        className="rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-300"
      >
        {status}
      </div>
    </section>
  );
}
