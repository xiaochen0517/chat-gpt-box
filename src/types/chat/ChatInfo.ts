import {GoogleGeminiConfig, OpenAiChatGptConfig, OpenAiDallEConfig} from "@/types/chat/BaseConfig.ts";

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

export type ChatOptions = OpenAiChatGptConfig | OpenAiDallEConfig | GoogleGeminiConfig;