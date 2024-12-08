import { z } from "zod";
import { DocumentModel } from "./document.model";

export namespace SessionModel {
  export const Chat = z.object({
    sessionId: z.string().uuid(),
    name: z.string(),
    createdAt: z.string(),
    lastUpdatedAt: z.string(),
    latestMessage: z.string().nullable(),
    isLatestMessageFromBot: z.boolean().nullable(),
    id: z.string().uuid(),
  });
  export type Chat = z.infer<typeof Chat>;

  export const Message = z.object({
    isBot: z.boolean(),
    createdAt: z.string(),
    text: z.string(),
    document: DocumentModel.Item.nullable(),
    pictureFileId: z.string().nullable(),
  });
  export type Message = z.infer<typeof Message>;

  export const MessagesListResponse = z.object({
    messages: Message.array(),
  });
  export type MessagesListResponse = z.infer<typeof MessagesListResponse>;

  export const ListResponse = z.object({
    chats: Chat.array(),
  });
  export type ListResponse = z.infer<typeof ListResponse>;

  export const CreateChatResponse = z.object({
    sessionId: z.string().uuid(),
    chatId: z.string().uuid(),
    name: z.string(),
  });
  export type CreateChatResponse = z.infer<typeof CreateChatResponse>;
}
