"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchChatHistory,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/api";

const SUGGESTED_PROMPTS = [
  "How do I reset my password?",
  "What are the remote work guidelines?",
  "How do I submit an expense report?",
];

const SESSIONS_KEY = "northwind-sessions";
const CURRENT_SESSION_KEY = "northwind-session-id";
const MAX_LOCAL_SESSIONS = 12;

type LocalSession = {
  id: string;
  label: string;
  updatedAt: number;
};

function getStoredSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_SESSION_KEY);
}

function storeSessionId(id: string) {
  localStorage.setItem(CURRENT_SESSION_KEY, id);
}

function getLocalSessions(): LocalSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalSession[];
  } catch {
    return [];
  }
}

function rememberSession(id: string, label: string): LocalSession[] {
  const trimmed = label.trim().slice(0, 48) || "New chat";
  const next = [
    { id, label: trimmed, updatedAt: Date.now() },
    ...getLocalSessions().filter((session) => session.id !== id),
  ].slice(0, MAX_LOCAL_SESSIONS);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
  return next;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<LocalSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadSession = useCallback(async (id: string) => {
    const history = await fetchChatHistory(id);
    setSessionId(id);
    storeSessionId(id);
    setMessages(
      history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    );
  }, []);

  useEffect(() => {
    setSessions(getLocalSessions());
    const stored = getStoredSessionId();
    if (stored) {
      void loadSession(stored);
    }
  }, [loadSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submitMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    try {
      const result = await sendChatMessage(trimmed, sessionId);
      setSessionId(result.session_id);
      storeSessionId(result.session_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
      setSessions(rememberSession(result.session_id, trimmed));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await submitMessage(input);
  }

  function handleSuggestedPrompt(prompt: string) {
    void submitMessage(prompt);
  }

  function startNewSession() {
    setSessionId(null);
    setMessages([]);
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }

  return (
    <div className="grid flex-1 gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Sessions</h2>
          <button
            type="button"
            onClick={startNewSession}
            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
          >
            New
          </button>
        </div>
        <ul className="space-y-1">
          {sessions.map((session) => {
            const isActive = session.id === sessionId;
            return (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => void loadSession(session.id)}
                  className={`w-full truncate rounded-md px-2 py-1.5 text-left text-xs ${
                    isActive
                      ? "bg-emerald-600/15 text-emerald-300"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {session.label}
                </button>
              </li>
            );
          })}
          {sessions.length === 0 && (
            <li className="text-xs text-slate-500">No prior sessions</li>
          )}
        </ul>
      </aside>

      <section className="flex min-h-[70vh] flex-col rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="border-b border-slate-800 px-5 py-4">
          <h1 className="text-lg font-semibold text-white">
            Internal Knowledge Assistant
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ask about HR policies, IT procedures, and internal guidelines.
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center">
              <p className="text-sm text-slate-400">
                Start a conversation or try a suggested prompt below.
              </p>
            </div>
          )}
          {messages.map((message, index) => {
            const isLatestAssistant =
              message.role === "assistant" &&
              !messages.slice(index + 1).some((m) => m.role === "assistant");
            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  {...(isLatestAssistant
                    ? {
                        role: "log" as const,
                        "aria-live": "polite" as const,
                        "data-testid": "assistant-reply",
                      }
                    : {})}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-400">
                Assistant is typing…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-800 px-5 py-3">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-emerald-600 hover:text-emerald-300 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              aria-label="Message Northwind Assistant"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSubmit(e);
                }
              }}
              rows={3}
              placeholder="Ask about policies, procedures, or internal resources…"
              className="flex-1 resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="self-end rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
