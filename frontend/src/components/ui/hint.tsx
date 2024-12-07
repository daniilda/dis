import { CircleHelpIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { buttonVariants } from "./button";
import { cn } from "@/utils/cn";
import { PopoverContentProps } from "@radix-ui/react-popover";

export const Hint = ({
  children,
  side,
  big = false,
}: {
  children: React.ReactNode;
  side?: PopoverContentProps["side"];
  big?: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "text-muted-foreground",
          !big && "min-w-6 size-6 rounded-full [&_svg]:size-4",
        )}
      >
        <CircleHelpIcon />
      </PopoverTrigger>
      <PopoverContent className="max-w-sm" side={side}>
        {children}
      </PopoverContent>
    </Popover>
  );
};
