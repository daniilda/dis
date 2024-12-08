import * as React from "react";
import { cn } from "@/utils/cn";
import { ScrollArea } from "../scroll-area";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, ...props }, ref) => (
    <ScrollArea ref={ref} className="size-full">
      <div className={cn("flex flex-col gap-6 pt-4", className)} {...props}>
        {children}
      </div>
    </ScrollArea>
  ),
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
