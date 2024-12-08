import { observer } from "mobx-react-lite";
import { ModalFC } from "../ui/modal/types";
import { useState } from "react";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const CreateChatModal: ModalFC<
  {},
  {
    name: string;
  }
> = observer((x) => {
  const [name, setName] = useState("");

  const onSubmit = async () => {
    if (!name.trim()) {
      toast.error("Название не может быть пустым");
      return;
    }
    x.done({ name });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Укажите название чата</DialogTitle>
        <DialogDescription>
          Так вам будет проще ориентироваться
        </DialogDescription>
      </DialogHeader>
      <form
        className="flex flex-col gap-y-2 mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Label>Название</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex justify-end mt-2">
          <Button type="submit">Создать</Button>
        </div>
      </form>
    </>
  );
});
