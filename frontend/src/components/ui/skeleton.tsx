import { cn } from "@/utils/cn";
import { ElementRef, forwardRef } from "react";

const Skeleton = forwardRef<
  ElementRef<"div">,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
});

export { Skeleton };
