import { fallback } from "@tanstack/router-zod-adapter";
import { z } from "zod";

type FallbackOptional<T extends z.ZodObject<any>> = {
  [K in keyof T["shape"]]: T["shape"][K] extends z.ZodTypeAny
    ? ReturnType<typeof fallback<T["shape"][K]>>
    : never;
};

export const makeOptionalWithFallback = <T extends z.ZodObject<any>>(
  schema: T,
  defaults: Partial<Record<keyof T["shape"], any>> = {},
): z.ZodObject<FallbackOptional<T>> => {
  const shape = Object.keys(schema.shape).reduce(
    (acc, key) => {
      const defaultValue = defaults[key as keyof T["shape"]];
      acc[key] = fallback(
        schema.shape[key as keyof T["shape"]].optional().default(defaultValue),
        undefined,
      );
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>,
  );

  return z.object(shape) as z.ZodObject<FallbackOptional<T>>;
};
