import { observer } from "mobx-react-lite";
import { FC, useCallback, useState } from "react";
import { $modals, ModalContext } from "./modal.context";
import { Dialog, DialogContent } from "../dialog";
import { Defined, ModalRequest } from "./types";

const Modal: FC<ModalRequest> = observer((x) => {
  const [modalBusy, setModalBusy] = useState(false);
  const [closed, setClosed] = useState(false);

  const onClose = useCallback(
    (data: Defined | undefined) => {
      setClosed(true);
      x.callback(data);
    },
    [x],
  );

  return (
    <ModalContext.Provider value={{ modalBusy, setModalBusy }}>
      <Dialog
        open={!closed}
        onOpenChange={(v) => !modalBusy && !v && onClose(undefined)}
      >
        <DialogContent className="w-fit min-w-96" disableClose={modalBusy}>
          <x.component {...x.props} done={onClose} />
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
});

export const ModalPresenter: FC = observer(() => {
  return $modals.map((v) => <Modal {...v} key={v.key} />);
});
