import { BotIcon } from "lucide-react";
import { ExpandableChatHeader } from "./expandable-chat";
import { ChatBubbleAvatar } from "./chat-bubble";
import { observer } from "mobx-react-lite";
import { vm } from "@/stores/store";
import { formatDistanceToNow } from "@/utils/format/date";
import Logo from "@/assets/logo.svg?react";
import { FC, useEffect, useState } from "react";

// export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

const Time: FC<{ date: string }> = ({ date }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((c) => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{formatDistanceToNow(new Date(date))}</span>;
};

export default observer(function ChatTopbar() {
  const selectedChat = vm.selectedChat;

  return (
    <ExpandableChatHeader>
      {selectedChat ? (
        <div className="flex items-center gap-2">
          <ChatBubbleAvatar>
            <BotIcon />
          </ChatBubbleAvatar>
          <div className="flex flex-col">
            <span className="font-medium">{selectedChat.name}</span>
            {selectedChat && (
              <span className="text-xs">
                Последнее сообщение:{" "}
                <Time
                  date={
                    selectedChat.messages[selectedChat.messages.length - 1]
                      .timestamp
                  }
                />
              </span>
            )}
          </div>
        </div>
      ) : (
        <Logo className="h-8 my-1 w-fit text-primary" />
      )}

      <div className="flex gap-1">
        {/* <button
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
          )}
        >
          <Info size={20} className="text-muted-foreground" />
        </button> */}
      </div>
    </ExpandableChatHeader>
  );
});
