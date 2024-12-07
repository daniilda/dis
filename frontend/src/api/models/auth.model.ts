import { z } from "zod";

export namespace AuthDto {
  export const Token = z.object({
    access_token: z.string(),
    status: z.string(),
  });
  export type Token = z.infer<typeof Token>;

  export const User = z.object({
    status: z.string(),
    username: z.string(),
  });
  export type User = z.infer<typeof User>;
}
