import { DocumentsEndpoint } from "@/api/endpoints/documents.endpoint";
import { SessionEndpoint } from "@/api/endpoints/session.endpoint";
import { DocumentModel } from "@/api/models/document.model";
import { ConfirmationModal } from "@/components/modals/confirmation.modal";
import { CreateChatModal } from "@/components/modals/create-chat.modal";
import { showModal } from "@/components/ui/modal/show";
import { Chat, DatabaseFile, Message } from "@/utils/types/message";
import { makeAutoObservable, observable } from "mobx";
import { toast } from "sonner";

export const supportedFileTypes = [
  //pdf
  "application/pdf",
  //docx
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //txt
  "text/plain",
  //zip
  "application/zip",
  //jpg
  "image/jpeg",
  //png
  "image/png",
] as const;

export const supportedFileExtensions: {
  label: string;
  value: string[];
}[] = [
  { label: "PDF", value: ["pdf"] },
  { label: "DOCX", value: ["docx"] },
  { label: "TXT", value: ["txt"] },
  { label: "Изображения", value: ["jpg", "png"] },
] as const;

export const vm = new (class {
  isLoading = false;
  chats: Chat[] = [];
  selectedChat: Chat | null = null;
  get selectedFiles() {
    return this.database.filter((file) => file.selected);
  }
  async deleteFiles() {
    const deleted = await showModal(ConfirmationModal, {
      action: async () => {
        for (const file of this.selectedFiles) {
          await DocumentsEndpoint.remove(file.id).run();
        }
      },
      title: "Удалить файлы",
      description: "Вы уверены, что хотите удалить выбранные файлы?",
      destructive: true,
      buttonText: "Удалить",
    });
    if (deleted) {
      this.database = this.database.filter((file) => !file.selected);
    }
  }
  database: DatabaseFile[] = [];

  async createChat(): Promise<Chat | null> {
    const res = await showModal(CreateChatModal, {});
    if (!res) return null;

    const chat = await SessionEndpoint.createChat(
      this.sessionId,
      res.name,
    ).run();

    this.selectedChat = {
      id: chat.chatId,
      messages: [],
      name: chat.name,
    };
    this.chats.push(this.selectedChat);

    return this.selectedChat;
  }

  async setSelectedChat(chat: Chat | null) {
    this.selectedChat = chat;

    if (!this.selectedChat) return;

    const res = await SessionEndpoint.getChat(
      this.sessionId,
      this.selectedChat.id,
    ).run();

    this.selectedChat.messages = res.messages.map((v, i) => ({
      id: i,
      message: v.text,
      isLoading: false,
      timestamp: v.createdAt,
      document: v.document,
      isBot: v.isBot,
      image: v.pictureFileId,
    }));
  }

  async sendMessage(message: Message) {
    if (!this.selectedChat) {
      await this.createChat();
    }

    if (!this.selectedChat) return;

    this.isLoading = true;

    this.selectedChat.messages.push(message);
    const botMessage: Message = observable({
      id: this.selectedChat.messages.length,
      timestamp: new Date().toISOString(),
      isBot: true,
      image: null,
      message: "",
      document: null,
      isLoading: true,
    } satisfies Message);
    this.selectedChat.messages.push(botMessage);

    const res = await SessionEndpoint.sendMessage(
      this.sessionId,
      this.selectedChat.id,
      message.message,
    ).run();

    botMessage.message = res.message.text;
    botMessage.image = res.message.pictureFileId;
    botMessage.isLoading = false;
    this.isLoading = false;
  }

  async deleteChat() {
    if (!this.selectedChat) return;

    const ok = await showModal(ConfirmationModal, {
      action: async () => {
        await SessionEndpoint.deleteChat(
          this.sessionId,
          this.selectedChat!.id,
        ).run();

        return true;
      },
      title: "Удалить чат",
      description: "Вы уверены, что хотите удалить чат?",
      destructive: true,
      buttonText: "Удалить",
    });
    if (ok) {
      this.chats = this.chats.filter((v) => v.id !== this.selectedChat!.id);
      this.selectedChat = null;
    }
  }

  async fetchDocuments() {
    const res = await DocumentsEndpoint.list.run();
    this.database = res.documents.map((v) => ({
      id: v.id.toString(),
      isUploading: v.state === DocumentModel.DocumentState.Created,
      name: v.name,
      uploadDate: v.createdAt,
      selected: false,
    }));

    if (this.database.some((v) => v.isUploading)) {
      setTimeout(() => this.fetchDocuments(), 5000);
    }
  }

  async uploadFiles(files: File[]) {
    const action = async () => {
      if (files.length === 0) {
        throw new Error("Выберите файлы для загрузки");
      }

      await DocumentsEndpoint.create(files).then((v) => {
        console.log(v);
      });

      this.fetchDocuments();

      return true;
    };

    toast.promise(action(), {
      loading: "Загружаем файлы...",
      success: "Файлы загружены!",
      error: (v) => {
        console.log(v);
        return "Выбраны неверные файлы";
      },
    });
  }

  constructor() {
    makeAutoObservable(this);
    void this.init();
  }

  sessionId: string = localStorage.getItem("sessionId") ?? "";
  async init() {
    if (!this.sessionId) {
      const session = await SessionEndpoint.createSession.run();
      this.sessionId = session;
      localStorage.setItem("sessionId", session);
    }

    this.fetchDocuments();
    const chats = await SessionEndpoint.getChats(this.sessionId).run();

    this.chats = chats.chats.map((v) => ({
      id: v.id,
      name: v.name,
      messages: [],
    }));
  }
})();
