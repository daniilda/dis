import { FC, useEffect, useRef, useState } from "react";

export type FCVM<T, P = {}> = FC<{ vm: T } & P>;

export interface DisposableVm {
  dispose(): void;
}

export const useViewModel = <T extends DisposableVm>(
  _vm: () => T,
  deps?: unknown[],
): T => {
  const isFirstRender = useRef(true);
  const [vm, setVm] = useState(() => _vm());

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return () => vm.dispose();
    }

    setVm(_vm());

    return () => vm.dispose();
  }, deps);

  return vm;
};
