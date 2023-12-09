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
  context_max_message: number;
  context_max_tokens: number;
  response_max_tokens: number;
}