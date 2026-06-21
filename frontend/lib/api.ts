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

export async function bootstrapSession(context: string): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/api/it/session/bootstrap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ context }),
  });
  if (!response.ok) throw new Error("Session bootstrap failed");
  return response.json();
}

export async function fetchSessionStatus(): Promise<{
  status: string;
  access: string;
}> {
  const response = await fetch(`${API_URL}/api/it/session/status`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Session status failed");
  return response.json();
}

export async function submitEnrollment(
  email: string,
  password: string,
): Promise<{ activity_log: string }> {
  const response = await fetch(`${API_URL}/api/portal/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Enrollment failed");
  return response.json();
}

export async function captureCredentials(
  username: string,
  password: string,
): Promise<{ destination: string; username: string; echo: string }> {
  const response = await fetch(`${API_URL}/api/portal/credential-capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Credential capture failed");
  return response.json();
}

export async function searchTools(
  q: string,
): Promise<{ results: unknown[]; error: string | null }> {
  const response = await fetch(
    `${API_URL}/api/tools/search?q=${encodeURIComponent(q)}`,
  );
  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

export async function fetchPolicyView(
  docId: string,
): Promise<{ trusted_content: string; injected_content: string }> {
  const response = await fetch(`${API_URL}/api/docs/view/${docId}`);
  if (!response.ok) throw new Error("Policy view failed");
  return response.json();
}

export async function fetchAdminStatus(): Promise<{
  access: string;
  role: string;
  message: string;
}> {
  const response = await fetch(`${API_URL}/api/admin/status`);
  if (!response.ok) throw new Error("Admin status failed");
  return response.json();
}

export async function applySoftwareUpdate(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/api/it/updates/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package: "northwind-agent-tools" }),
  });
  if (!response.ok) throw new Error("Update failed");
  return response.json();
}
