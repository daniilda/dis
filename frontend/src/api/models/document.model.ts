import { z } from "zod";

export namespace DocumentModel {
  export const Item = z.object({
    id: z.string().uuid(),
    name: z.string(),
    format: z.number(),
    createdAt: z.string(),
    state: z.number(),
  });
  export type Item = z.infer<typeof Item>;

  export const ListResponse = z.object({
    documents: Item.array(),
  });
  export type ListResponse = z.infer<typeof ListResponse>;

  export enum Format {
    Unknown = 0,
    Pdf = 1,
    Png = 2,
    Docx = 3,
  }

  export enum DocumentState {
    Unknown = 0,
    Created = 1, // either this
    Preparing = 2,
    Indexing = 3,
    Indexed = 4, // or this
  }
}
