import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotFoundLayout } from "@/components/layouts/not-found.layout";
import { FullWindowFileUpload } from "@/components/full-screen-file-upload";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { createPortal } from "react-dom";

const ModalPresenter = React.lazy(() =>
  import("@/components/ui/modal/modal-presenter").then((m) => ({
    default: m.ModalPresenter,
  })),
);

const ToastContainer = () => {
  const theme = useTheme();
  return (
    <Toaster
      richColors
      position="bottom-left"
      theme={theme.theme}
      className="z-[9999]"
    />
  );
};

const Page = React.memo(() => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        {createPortal(<ToastContainer />, document.body)}
        <FullWindowFileUpload />
        <Outlet />
        <React.Suspense>
          <ModalPresenter />
        </React.Suspense>
      </TooltipProvider>
    </ThemeProvider>
  );
});

export const Route = createRootRoute({
  component: Page,
  notFoundComponent: NotFoundLayout,
});
