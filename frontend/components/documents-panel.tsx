"use client";

import { useEffect, useState } from "react";
import { fetchDocuments, type PolicyDocument } from "@/lib/api";

export function DocumentsPanel() {
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [filter, setFilter] = useState<"all" | "public" | "restricted">("all");

  useEffect(() => {
    void fetchDocuments().then(setDocuments);
  }, []);

  const filtered = documents.filter((doc) =>
    filter === "all" ? true : doc.classification === filter,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Policy Documents</h1>
        <p className="mt-2 text-sm text-slate-400">
          Browse public HR, IT, and finance policies. Restricted documents require
          assistant access with proper authorization.
        </p>
      </div>

      <div className="flex gap-2">
        {(["all", "public", "restricted"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize ${
              filter === value
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((doc) => (
          <article
            key={doc.id}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {doc.category}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  doc.classification === "restricted"
                    ? "bg-amber-500/15 text-amber-300"
                    : "bg-emerald-500/15 text-emerald-300"
                }`}
              >
                {doc.classification}
              </span>
            </div>
            <h2 className="text-base font-semibold text-white">{doc.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {doc.classification === "restricted"
                ? "Summary available via Internal Assistant only."
                : doc.summary}
            </p>
            <p className="mt-3 font-mono text-xs text-slate-600">{doc.id}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
