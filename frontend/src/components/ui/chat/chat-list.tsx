import { useRef, useEffect } from "react";
import { ChatBottombar } from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
} from "./chat-bubble";
import { ChatMessageList } from "./chat-message-list";
import { BotIcon, DownloadIcon, User2Icon } from "lucide-react";
import { Message } from "@/utils/types/message";
import { observer } from "mobx-react-lite";
import { formatDate } from "@/utils/format/date";
import { cn } from "@/utils/cn";

interface ChatListProps {
  messages: Message[];
  isMobile: boolean;
}

export const ChatList = observer(({ messages, isMobile }: ChatListProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const actionIcons = [{ icon: DownloadIcon, type: "Download" }] as const;

  return (
    <div className="w-full overflow-y-auto h-full flex flex-col">
      {messages.length === 0 && (
        <div className="text-center text-sm text-muted-foreground flex-1 h-full flex items-center justify-center">
          Начните диалог с ботом
        </div>
      )}
      {messages.length > 0 && (
        <div className="sm:px-4 flex-1 flex-col flex overflow-hidden">
          <ChatMessageList ref={messagesContainerRef}>
            <AnimatePresence>
              {messages.map((message, index) => {
                const variant = message.isBot ? "received" : "sent";
                return (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                    transition={{
                      opacity: { duration: 0.1 },
                      layout: {
                        type: "spring",
                        bounce: 0.3,
                        duration: index * 0.05 + 0.2,
                      },
                    }}
                    style={{ originX: 0.5, originY: 0.5 }}
                    className="flex flex-col gap-2 p-4"
                  >
                    {/* Usage of ChatBubble component */}
                    <ChatBubble variant={variant}>
                      <ChatBubbleAvatar className="hidden sm:flex">
                        {message.isBot ? <BotIcon /> : <User2Icon />}
                      </ChatBubbleAvatar>
                      <ChatBubbleMessage isLoading={message.isLoading}>
                        {message.message}
                        {message.timestamp && (
                          <ChatBubbleTimestamp
                            timestamp={formatDate(
                              message.timestamp,
                              "MMMddHHmm",
                            )}
                          />
                        )}
                      </ChatBubbleMessage>
                      {message.isBot && (
                        <ChatBubbleActionWrapper>
                          {actionIcons.map(({ icon: Icon, type }) => (
                            <ChatBubbleAction
                              className={cn("size-7")}
                              key={type}
                              icon={<Icon className="size-4" />}
                              onClick={() => {
                                console.log(
                                  "Action " +
                                    type +
                                    " clicked for message " +
                                    index,
                                );
                              }}
                            />
                          ))}
                        </ChatBubbleActionWrapper>
                      )}
                    </ChatBubble>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </ChatMessageList>
        </div>
      )}
      <ChatBottombar isMobile={isMobile} />
    </div>
  );
});
