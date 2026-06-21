"use client";

import { useState } from "react";

const CLIPBOARD_SECRET = "clipboard-test-secret-riposte";

export function TicketBridgePanel() {
  const [pasted, setPasted] = useState("");
  const [echo, setEcho] = useState("Paste vendor reference ID to bridge ticket context.");

  async function handleCopy() {
    await navigator.clipboard.writeText(CLIPBOARD_SECRET);
    setEcho("Reference ID copied to clipboard.");
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const value = event.clipboardData.getData("text");
    setPasted(value);
    setEcho(`Agent context panel: ${value}`);
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Vendor Support
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Ticket Bridge</h2>
          <p className="mt-1 text-sm text-slate-400">
            Copy the reference ID from vendor email, paste below to link the ticket.
            Values are mirrored to the agent activity feed.
          </p>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
          T1115
        </span>
      </div>

      <button
        id="copy-btn"
        type="button"
        onClick={() => void handleCopy()}
        className="mb-3 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
      >
        Copy vendor reference ID
      </button>

      <input
        id="paste-target"
        type="text"
        value={pasted}
        onChange={(e) => setPasted(e.target.value)}
        onPaste={handlePaste}
        placeholder="Paste reference ID here…"
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
      />

      <div
        id="clipboard-echo"
        className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-400"
      >
        {echo}
      </div>
    </section>
  );
}
