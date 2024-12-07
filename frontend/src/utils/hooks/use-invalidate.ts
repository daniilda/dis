import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { Route } from "../routes/valid-routes";

interface InvalidateOptions {
  fullPath: Route;
  params?: Record<string, string | number>;
}

/**
 * @description Invalidate the loader of the provided route and all its parents
 */
export const useInvalidate = (options: InvalidateOptions) => {
  const router = useRouter();

  return useCallback(() => {
    router.invalidate({
      filter: (d) =>
        d.fullPath === options.fullPath &&
        (!options.params ||
          Object.entries(options.params).every(([key, value]) => {
            return (d.params as any)[key] === value;
          })),
    });
  }, [router, options]);
};
