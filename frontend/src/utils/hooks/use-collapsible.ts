import { useEffect, useRef } from "react";

export const useCollapsible = (isOpen: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  const toggleHeight = () => {
    if (!ref.current) return;

    const current = ref.current;

    current.style.maxHeight = isOpen ? current.scrollHeight + "px" : "0px";
    current.style.opacity = isOpen ? "1" : "0";

    const transitionEnd = () => {
      if (!isOpen) {
        current.style.maxHeight = "auto";
      }
      current.removeEventListener("transitionend", transitionEnd);
    };

    current.addEventListener("transitionend", transitionEnd);
  };

  useEffect(toggleHeight, [isOpen]);

  return ref;
};
