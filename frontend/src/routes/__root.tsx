import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AuthService } from "@/stores/auth.service";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotFoundLayout } from "@/components/layouts/not-found.layout";

const ModalPresenter = React.lazy(() =>
  import("@/components/ui/modal/modal-presenter").then((m) => ({
    default: m.ModalPresenter,
  })),
);

const Page = React.memo(() => {
  return (
    <TooltipProvider>
      <Outlet />
      <React.Suspense>
        <ModalPresenter />
      </React.Suspense>
    </TooltipProvider>
  );
});

export const Route = createRootRoute({
  component: Page,
  beforeLoad: () => AuthService.waitInit(),
  notFoundComponent: NotFoundLayout,
});
