import { cn } from "@/utils/cn";
import { FC, PropsWithChildren } from "react";

export const Empty: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <p className={cn("py-3.5 text-center text-muted-foreground", className)}>
      {children}
    </p>
  );
};
