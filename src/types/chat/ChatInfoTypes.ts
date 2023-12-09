export type ChatInfoTypes = {
  id: string;
  name: string;
  prompt: string;
  chatType: ChatType;
  options: ChatOptions;
}

export enum ChatType {
  CHAT_GPT = "chat_gpt",
  DALL_E = "dall_e",
}

export type ChatOptions = {
  enabled: boolean;
  apiUrl: string;
  model: string;
  temperature: number;
  contextMaxMessage: number;
  contextMaxTokens: number;
  responseMaxTokens: number;
}