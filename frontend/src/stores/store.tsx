import { ConfirmationModal } from "@/components/modals/confirmation.modal";
import { showModal } from "@/components/ui/modal/show";
import { Chat, DatabaseFile, Message } from "@/utils/types/message";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";

export const supportedFileTypes = [
  //pdf
  "application/pdf",
  //doc
  "application/msword",
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
  { label: "Документы", value: ["pdf", "doc", "docx", "txt"] },
  { label: "Архивы", value: ["zip"] },
  { label: "Изображения", value: ["jpg", "png"] },
] as const;

export const vm = new (class {
  isLoading = false;
  chats: Chat[] = [
    {
      id: 0,
      messages: [
        {
          id: 0,
          message: "Hello, how are you?",
          isLoading: false,
          timestamp: new Date().toISOString(),
          isBot: false,
          images: [],
        },
        {
          id: 1,
          message: "I'm fine, thank you!",
          isLoading: false,
          timestamp: new Date().toISOString(),
          isBot: true,
          images: [],
        },
      ],
      name: "John Anticheat",
    },
    {
      id: 1,
      messages: [
        {
          id: 0,
          message: "I'm fine, thank you!",
          isLoading: false,
          timestamp: new Date().toISOString(),
          isBot: false,
          images: [],
        },
        {
          id: 1,
          message: "Hello, how are you?",
          isLoading: false,
          timestamp: new Date().toISOString(),
          isBot: true,
          images: [],
        },
      ],
      name: "John Doe",
    },
  ];
  selectedChat: Chat | null = null;
  get selectedFiles() {
    return this.database.filter((file) => file.selected);
  }
  async deleteFiles() {
    const deleted = await showModal(ConfirmationModal, {
      action: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
  database: DatabaseFile[] = [
    {
      id: 0,
      name: "filefilefilefilefilefilefilefilefilefile.pdf",
      uploadDate: new Date().toISOString(),
      selected: false,
      isUploading: false,
    },
    {
      id: 1,
      name: "file2.pdf",
      uploadDate: new Date().toISOString(),
      selected: false,
      isUploading: false,
    },
    {
      id: 2,
      name: "file3.pdf",
      uploadDate: new Date().toISOString(),
      selected: false,
      isUploading: true,
    },
  ];

  setSelectedChat(chat: Chat | null) {
    this.selectedChat = chat;
  }

  async sendMessage(message: Message) {
    if (!this.selectedChat) {
      this.selectedChat = {
        id: this.chats.length,
        messages: [],
        name: "Новый чат",
      };
      this.chats.push(this.selectedChat);
    }

    this.isLoading = true;

    this.selectedChat.messages.push(message);
    // TODO: send message to backend
    this.isLoading = false;
  }

  async uploadFiles(files: File[]) {
    // TODO: send files to backend
    const action = async () => {
      if (files.length === 0) {
        throw new Error("Выберите файлы для загрузки");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(files);
    };

    toast.promise(action(), {
      loading: "Загружаем файлы...",
      success: "Файлы загружены!",
      error: "Выбраны неверные файлы",
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
})();
