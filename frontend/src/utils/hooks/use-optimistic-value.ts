import { useState, useEffect, useCallback } from "react";

export const useOptimisticValue = <T>(
  initialValue: T,
): [T, (newValue: T) => void] => {
  const [optimisticValue, setOptimisticValue] = useState(initialValue);

  useEffect(() => {
    setOptimisticValue(initialValue);
  }, [initialValue]);

  const updateValueOptimistically = useCallback((newValue: T) => {
    setOptimisticValue(newValue);
  }, []);

  return [optimisticValue, updateValueOptimistically];
};
