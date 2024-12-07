import { observable } from "mobx";
import {
  ModalFC,
  ModalRequest,
  UnwrapModalProps,
  UnwrapModalReturn,
} from "./types";
import { $modals } from "./modal.context";

let key = 0;
export async function showModal<TModal extends ModalFC<any, any>>(
  modal: TModal,
  ...props: UnwrapModalProps<TModal> extends undefined
    ? []
    : [UnwrapModalProps<TModal>, React.RefObject<HTMLDivElement>?]
): Promise<UnwrapModalReturn<TModal> | undefined> {
  return await new Promise<UnwrapModalReturn<TModal> | undefined>((resolve) => {
    const modalRequest: ModalRequest<
      UnwrapModalProps<TModal>,
      UnwrapModalReturn<TModal>
    > = observable(
      {
        key: key++,
        component: modal,
        closed: false,
        callback: (r) => {
          $modals.remove(modalRequest as never);
          resolve(r);
        },
        props: props[0] as UnwrapModalProps<TModal>,
      },
      {
        component: false,
        callback: false,
        props: false,
        closed: false,
      },
      {},
    );

    $modals.push(modalRequest as never);
  });
}

export function closeAllModals() {
  for (const modal of $modals) {
    modal.callback(undefined);
  }
}
