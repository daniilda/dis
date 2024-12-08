import { observable } from "mobx";
import { ModalRequest } from "./types";
import { createContext, useContext, useEffect } from "react";

export const $modals = observable<ModalRequest>([]);

export const ModalContext = createContext<{
  modalBusy: boolean;
  setModalBusy: (v: boolean) => void;
}>({
  modalBusy: true,
  setModalBusy: () => {},
});

export const useModalBusy = (v: boolean) => {
  const { setModalBusy } = useContext(ModalContext);

  useEffect(() => setModalBusy(v), [v, setModalBusy]);
};
