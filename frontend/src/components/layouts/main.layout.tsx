import { Outlet } from "@tanstack/react-router";
import { FC, PropsWithChildren } from "react";

export const MainLayout: FC<PropsWithChildren> = ({
  children = <Outlet />,
}) => {
  return (
    <main className="layout-main appear h-full overflow-hidden flex flex-col py-4">
      {children}
    </main>
  );
};
