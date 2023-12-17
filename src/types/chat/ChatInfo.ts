export type ChatInfo = {
  id: string;
  name: string;
  prompt: string;
  chatType: ChatType;
  options: ChatOptions;
}

export enum ChatType {
  CHAT_GPT = "chat_gpt",
  DALL_E = "dall_e",
  GEMINI = "gemini",
}

export type ChatOptions = GPTChatOptions | DallEChatOptions;

export type GPTChatOptions = {
  enabled: boolean;
  apiUrl: string;
  model: string;
  temperature: number;
  contextMaxMessage: number;
  contextMaxTokens: number;
  responseMaxTokens: number;
}

export type DallEChatOptions = {
  enabled: boolean;
  apiUrl: string;
  model: string;
  imageCount: number;
  imageSize: string;
  imageStyle?: string;
  imageQuality?: string;
}