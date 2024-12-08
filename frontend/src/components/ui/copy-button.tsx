import { observer } from "mobx-react-lite";
import { FC, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, CopyIcon } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/utils/cn";

interface Props {
  className?: string;
  text: string;
}

export const CopyButton: FC<Props> = observer((x) => {
  const timerRef = useRef<number>();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(x.text);

    setCopied(true);

    clearTimeout(timerRef.current);

    timerRef.current = +setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          x.className,
        )}
        onClick={copy}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </TooltipTrigger>
      <TooltipContent>Скопировать текст</TooltipContent>
    </Tooltip>
  );
});
