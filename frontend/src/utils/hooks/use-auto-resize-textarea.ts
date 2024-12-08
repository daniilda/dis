import { ForwardedRef, useEffect, useImperativeHandle, useRef } from "react";

export const useAutoResizeTextarea = (
  ref: ForwardedRef<HTMLTextAreaElement>,
  autoResize: boolean,
) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => textAreaRef.current!);

  useEffect(() => {
    const ref = textAreaRef?.current;

    const updateTextareaHeight = () => {
      if (ref && autoResize) {
        ref.style.height = "auto";
        ref.style.height = ref?.scrollHeight + "px";
      }
    };

    updateTextareaHeight();

    ref?.addEventListener("input", updateTextareaHeight);

    return () => ref?.removeEventListener("input", updateTextareaHeight);
  }, []);

  return { textAreaRef };
};
