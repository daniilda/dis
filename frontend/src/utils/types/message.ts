import { DocumentModel } from "@/api/models/document.model";

export interface Message {
  id: number;
  message: string;
  isLoading?: boolean;
  document: DocumentModel.Item | null;
  timestamp: string;
  isBot: boolean;
  image: string | null;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
}

export interface DatabaseFile {
  id: string;
  name: string;
  uploadDate: string;
  selected: boolean;
  isUploading: boolean;
}
