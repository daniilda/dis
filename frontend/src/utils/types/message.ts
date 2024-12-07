export interface Message {
  id: number;
  message?: string;
  isLoading?: boolean;
  timestamp: string;
  isBot?: boolean;
}

export interface Chat {
  id: number;
  name: string;
  messages: Message[];
}

export interface DatabaseFile {
  id: number;
  name: string;
  uploadDate: string;
  selected: boolean;
  isUploading: boolean;
}
