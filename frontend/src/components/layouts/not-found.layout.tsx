import { FC } from "react";
import { PlaceholderLayout } from "./placeholder.layout";
import { Link, NotFoundRouteProps } from "@tanstack/react-router";
import { buttonVariants } from "../ui/button";
import { cn } from "@/utils/cn";

export const NotFoundLayout: FC<NotFoundRouteProps> = (x) => {
  return (
    <div className="layout-main">
      <PlaceholderLayout
        title="Страница не найдена"
        description="Страница, которую вы ищете, не существует."
      >
        <Link
          to="/"
          className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
        >
          Go to home
        </Link>
      </PlaceholderLayout>
    </div>
  );
};
