"use client";

import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/utils/cn";
import { Chat } from "./chat";
import { Sidebar } from "../sidebar";
import { observer } from "mobx-react-lite";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export const ChatLayout = observer(
  ({
    defaultLayout = [320, 480],
    defaultCollapsed = false,
    navCollapsedSize,
  }: ChatLayoutProps) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkScreenWidth = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      // Initial check
      checkScreenWidth();

      // Event listener for screen width changes
      window.addEventListener("resize", checkScreenWidth);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener("resize", checkScreenWidth);
      };
    }, []);

    return (
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={isMobile ? 0 : 24}
          maxSize={isMobile ? 8 : 30}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onExpand={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "min-w-[60px] md:min-w-[80px] transition-all duration-300 ease-in-out",
          )}
        >
          <Sidebar isCollapsed={isCollapsed || isMobile} isMobile={isMobile} />
        </ResizablePanel>
        <ResizableHandle withHandle={!isMobile} />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Chat isMobile={isMobile} />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  },
);
