"use client";

import { useState } from "react";
import { searchTools } from "@/lib/api";

export function SearchToolsPanel() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const result = await searchTools(query);
    if (result.error) {
      setError(result.error);
    } else {
      setError(`Found ${result.results.length} result(s).`);
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Knowledge Base
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Internal Search</h2>
          <p className="mt-1 text-sm text-slate-400">
            Search IT procedures and policy snippets. Verbose error mode enabled for
            staging diagnostics.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1190
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          id="query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search policies, procedures…"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Search
        </button>
      </form>

      <pre
        id="error-panel"
        className="mt-4 max-h-48 overflow-auto rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-red-300"
      >
        {error || "No errors."}
      </pre>
    </section>
  );
}
