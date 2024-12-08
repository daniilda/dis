import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export const useAction = <Args extends any[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options?: {
    /**
     * @returns null if validation succeeded
     */
    validate?: () => string | null;
    /**
     * @description Debounce time in milliseconds, leave undefined to disable debounce
     */
    debounceMs?: number;
  },
): [
  (...args: Args) => Promise<Result | undefined>,
  {
    isLoading: boolean;
    isError: boolean;
    result: Result | null;
  },
] => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const { debounceMs, validate } = options ?? {};

  const action = useCallback(
    async (...args: Args): Promise<Result | undefined> => {
      setIsLoading(true);
      setIsError(false);
      setResult(null);

      const validationError = validate?.();
      if (validationError) {
        toast.warning(validationError);
        setIsLoading(false);
        return;
      }

      try {
        const fnResult = await fn(...args);
        setResult(fnResult);
        return fnResult;
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [fn, validate],
  );

  const debouncedAction = useCallback(
    (...args: Args) => {
      clearTimeout(timerRef.current);
      return new Promise<Result | undefined>((resolve) => {
        timerRef.current = setTimeout(async () => {
          const result = await action(...args);
          resolve(result);
        }, debounceMs);
      });
    },
    [action, debounceMs],
  );

  return [debouncedAction, { isLoading, isError, result }];
};
