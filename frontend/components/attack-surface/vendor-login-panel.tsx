"use client";

import { useState } from "react";
import { captureCredentials } from "@/lib/api";

export function VendorLoginPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [echo, setEcho] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await captureCredentials(username, password);
    setEcho(
      `Submitted to ${result.destination} — username: ${result.username}, password echoed for ${result.username}`,
    );
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Benefits Integration
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            HealthBridge Vendor Login
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Single sign-on for annual benefits enrollment. Managed by IT — domain
            verification pending rollout.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1566
        </span>
      </div>

      <form id="login-form" onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="username" className="mb-1 block text-xs text-slate-400">
            Work email
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="you@northwind.corp"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs text-slate-400">
            Password
          </label>
          <input
            id="password"
            name="password"
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
          Sign in to HealthBridge
        </button>
      </form>
      <div id="credential-echo" className="mt-4 font-mono text-xs text-slate-400">
        {echo}
      </div>
    </section>
  );
}
