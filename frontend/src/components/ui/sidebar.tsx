"use client";

import { BookIcon, Search, SquarePen } from "lucide-react";
import { cn } from "@/utils/cn";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { vm } from "@/stores/store";
import { ChatBubbleAvatar } from "./chat/chat-bubble";
import { observer } from "mobx-react-lite";
import { IconInput } from "./input";
import { useState } from "react";
import { ScrollArea } from "./scroll-area";
import { DatabaseDrawer } from "../modals/database";
import { useDebouncedEffect } from "@/utils/hooks/use-debounce";

interface SidebarProps {
  isCollapsed: boolean;
  onClick?: () => void;
  isMobile: boolean;
}

export const Sidebar = observer(({ isCollapsed, isMobile }: SidebarProps) => {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState(vm.chats);
  useDebouncedEffect(
    () => {
      setChats(
        vm.chats.filter((chat) =>
          chat.name.toLowerCase().includes(search.trim().toLowerCase()),
        ),
      );
    },
    [vm.chats, search],
    500,
  );

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full overflow-hidden bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      {isCollapsed ? (
        <div className="flex items-center justify-center w-full">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => vm.setSelectedChat(null)}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-11 w-11 md:h-16 md:w-16 mx-auto rounded-xl",
                  )}
                >
                  <SquarePen size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Создать чат</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-between p-2 items-center">
            <div className="flex gap-2 items-center text-2xl">
              <p className="font-medium">Чаты</p>
              <span className="text-zinc-300">({vm.chats.length})</span>
            </div>

            <div>
              <button
                onClick={() => vm.setSelectedChat(null)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                )}
              >
                <SquarePen size={20} />
              </button>
            </div>
          </div>
          <div className="flex px-2 w-full">
            <IconInput
              placeholder="Поиск"
              containerClassName="w-full"
              className="!outline-transparent"
              leftIcon={<Search />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}
      <ScrollArea className="h-full">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {chats?.map((chat, index) =>
            isCollapsed ? (
              <TooltipProvider key={index}>
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => vm.setSelectedChat(chat)}
                      className={cn(
                        buttonVariants({
                          variant:
                            vm.selectedChat === chat ? "default" : "ghost",
                          size: "icon",
                        }),
                        "h-11 w-11 md:h-16 md:w-16 group",
                        // chat.variant === "secondary" &&
                        //   "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                      )}
                    >
                      <ChatBubbleAvatar
                        className={cn(
                          "relative rounded-md sm:rounded-full",
                          vm.selectedChat === chat && "bg-transparent",
                        )}
                      >
                        <div
                          className={cn(
                            "sm:hidden !size-5 right-1/2 top-1/2 bg-primary text-primary-foreground overflow-hidden flex items-center justify-center rounded-full",
                            vm.selectedChat === chat && "bg-transparent",
                          )}
                        >
                          {vm.chats.length - vm.chats.indexOf(chat)}
                        </div>
                        <BookIcon className="hidden sm:block" />
                      </ChatBubbleAvatar>{" "}
                      <span className="sr-only">{chat.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {chat.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button
                key={index}
                onClick={() => vm.setSelectedChat(chat)}
                className={cn(
                  buttonVariants({
                    variant: vm.selectedChat === chat ? "default" : "ghost",
                    size: "xl",
                  }),
                  // chat.variant === "secondary" &&
                  //   "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
                  "justify-start gap-4 text-left",
                )}
              >
                <ChatBubbleAvatar className="text-foreground">
                  <BookIcon />
                </ChatBubbleAvatar>
                <div className="flex flex-col max-w-28">
                  <span>{chat.name}</span>
                  {chat.messages.length > 0 && (
                    <span className="text-zinc-300 text-xs truncate">
                      Бот:{" "}
                      {chat.messages[chat.messages.length - 1].isLoading
                        ? "Печатает..."
                        : chat.messages[chat.messages.length - 1].message}
                    </span>
                  )}
                </div>
              </button>
            ),
          )}
          {chats.length === 0 && (
            <div className="flex justify-center items-center h-full pt-4">
              <p className="text-muted-foreground">Нет чатов</p>
            </div>
          )}
        </nav>
      </ScrollArea>
      <DatabaseDrawer isCollapsed={isCollapsed} />
    </div>
  );
});
