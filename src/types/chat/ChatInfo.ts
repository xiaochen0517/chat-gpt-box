import {
  GoogleGeminiConfig,
  OllamaDefaultConfig,
  OpenAiChatGptConfig,
  OpenAiDallEConfig,
} from "@/types/chat/BaseConfig.ts";
import {IAvatarProps} from "vue3-avataaars";

export type ChatInfo = {
  id: string;
  name: string;
  avatar?: Partial<IAvatarProps>,
  prompt: string;
  chatType: ChatType;
  options: ChatOptions;
}

export enum ChatType {
  CHAT_GPT = "chat_gpt",
  DALL_E = "dall_e",
  GEMINI = "gemini",
  OLLAMA = "ollama"
}

export type ChatOptions = OpenAiChatGptConfig | OpenAiDallEConfig | GoogleGeminiConfig | OllamaDefaultConfig;