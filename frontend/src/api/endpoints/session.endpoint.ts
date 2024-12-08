import { z } from "zod";
import { api } from "../utils/api";
import { SessionModel } from "../models/session.model";

export namespace SessionEndpoint {
  export const createSession = api("/sessions").post.expectSchema(z.string());

  export const getChats = (sessionId: string) =>
    api(`/sessions/${sessionId}/chats`).get.expectSchema(
      SessionModel.ListResponse,
    );

  export const createChat = (sessionId: string, name: string) =>
    api(`/sessions/chat`)
      .post.withBody({
        sessionId,
        name,
      })
      .expectSchema(
        z.object({
          sessionId: z.string(),
          chatId: z.string(),
          name: z.string(),
        }),
      );

  export const deleteChat = (sessionId: string, chatId: string) =>
    api(`/sessions/${sessionId}/chats/${chatId}`).delete.expectSchema(z.void());

  export const getChat = (sessionId: string, chatId: string) =>
    api(`/sessions/${sessionId}/chats/${chatId}`).get.expectSchema(
      SessionModel.MessagesListResponse,
    );

  export const sendMessage = (
    sessionId: string,
    chatId: string,
    message: string,
  ) =>
    api(`/sessions/${sessionId}/chats/${chatId}/response`)
      .post.withBody(message)
      .expectSchema(
        z.object({
          message: SessionModel.Message,
        }),
      );
}
