import { observer } from "mobx-react-lite";
import { ModalFC } from "../ui/modal/types";
import { Button } from "../ui/button";
import { useAction } from "@/utils/hooks/use-action";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ReactNode } from "react";
import { useModalBusy } from "../ui/modal/modal.context";

export const ConfirmationModal: ModalFC<
  {
    action: () => Promise<unknown>;
    title: string;
    description?: string | ReactNode;
    destructive?: boolean;
    buttonText?: string;
  },
  boolean
> = observer((x) => {
  const [action, { isLoading }] = useAction(async () => {
    await x.action();
    return x.done(true);
  });

  useModalBusy(isLoading);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{x.title}</DialogTitle>
        {x.description && (
          <DialogDescription>{x.description}</DialogDescription>
        )}
      </DialogHeader>
      <DialogFooter className="flex flex-col sm:flex-row justify-end gap-y-2 flex-wrap w-full">
        <Button
          variant="outline"
          onClick={() => x.done(false)}
          disabled={isLoading}
        >
          Отмена
        </Button>
        <Button
          variant={x.destructive ? "destructive" : "default"}
          onClick={action}
          loading={isLoading}
          disabled={isLoading}
        >
          {x.buttonText ?? "Ок"}
        </Button>
      </DialogFooter>
    </>
  );
});
