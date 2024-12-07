import { vm } from "@/stores/store";
import { ChatList } from "./chat-list";
import ChatTopbar from "./chat-topbar";
import { observer } from "mobx-react-lite";

interface ChatProps {
  isMobile: boolean;
}

export const Chat = observer(({ isMobile }: ChatProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar />

      <ChatList
        messages={vm.selectedChat?.messages ?? []}
        isMobile={isMobile}
      />
    </div>
  );
});
