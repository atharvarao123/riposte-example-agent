const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function sendChatMessage(
  message: string,
  sessionId: string | null,
): Promise<{ reply: string; session_id: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (sessionId) {
    headers["X-Session-Id"] = sessionId;
  }

  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Chat request failed");
  }

  return response.json();
}

export async function fetchChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const response = await fetch(
    `${API_URL}/api/chat/history?session_id=${encodeURIComponent(sessionId)}`,
  );
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.messages ?? [];
}

export async function fetchSessions(): Promise<string[]> {
  const response = await fetch(`${API_URL}/api/chat/sessions`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.sessions ?? [];
}

export type PolicyDocument = {
  id: string;
  title: string;
  category: string;
  classification: string;
  summary: string;
};

export type Employee = {
  name: string;
  department: string;
  title: string;
  email: string;
};

export async function fetchDocuments(): Promise<PolicyDocument[]> {
  const response = await fetch(`${API_URL}/api/docs`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.documents ?? [];
}

export async function fetchDirectory(): Promise<Employee[]> {
  const response = await fetch(`${API_URL}/api/directory`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.employees ?? [];
}
