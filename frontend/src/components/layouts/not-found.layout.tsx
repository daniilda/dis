import { FC } from "react";
import { PlaceholderLayout } from "./placeholder.layout";
import { Link, NotFoundRouteProps } from "@tanstack/react-router";
import { buttonVariants } from "../ui/button";
import { cn } from "@/utils/cn";
import { MainLayout } from "./main.layout";

export const NotFoundLayout: FC<NotFoundRouteProps> = (x) => {
  return (
    <MainLayout>
      <PlaceholderLayout
        title="Страница не найдена"
        description="Страница, которую вы ищете, не существует."
      >
        <Link
          to="/"
          className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
        >
          Вернуться на главную
        </Link>
      </PlaceholderLayout>
    </MainLayout>
  );
};
