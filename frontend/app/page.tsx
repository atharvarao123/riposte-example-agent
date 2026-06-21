import { AppShell } from "@/components/app-shell";
import { ChatPanel } from "@/components/chat-panel";

export default function HomePage() {
  return (
    <AppShell>
      <ChatPanel />
    </AppShell>
  );
}