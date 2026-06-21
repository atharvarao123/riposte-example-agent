import { AppShell } from "@/components/app-shell";
import { ChatPanel } from "@/components/chat-panel";

export const metadata = {
  title: "Chat",
  description: "Secure chat interface",
};

export default function HomePage() {
  return (
    <AppShell>
      <ChatPanel />
    </AppShell>
  );
}