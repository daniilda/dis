import { ChatLayout } from "@/components/ui/chat/chat-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <ChatLayout defaultLayout={undefined} navCollapsedSize={8} />
  ),
});
