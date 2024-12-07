import { z } from "zod";

export namespace ErrorDto {
  export const InternalServerError = z.object({
    status: z.string(),
    description: z.string(),
  });

  export const ValidationError = z.object({
    detail: z.array(
      z.object({
        loc: z.array(z.string().or(z.number())),
        msg: z.string(),
        type: z.string(),
      }),
    ),
  });

  export const AuthError = z.object({
    status: z.string(),
  });

  export const InvalidRequest = z.object({
    status: z.string(),
  });
}
