import {BaseRequest} from "@/utils/request/BaseRequest.ts";

export interface ChatListStore {
  chatList: ChatInfo[];
}

export interface ChatInfo {
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

export interface ChatOptions {
  enabled: boolean;
  apiUrl: string;
  model: string;
  temperature: number;
  context_max_message: number;
  context_max_tokens: number;
  response_max_tokens: number;
}

export interface ChatTabsStore {
  chatTabs: {
    [key: string]: ChatTabInfo[];
  };
}

export interface ChatTabInfo {
  name: string;
  generating: boolean;
  request: BaseRequest | null;
  chat: ChatMessage[];
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | null;
  content: string;
}

export interface ConfigStore {
  isDarkMode: boolean;
  baseConfig: BaseConfig;
  shortcut: ShortcutConfig;
}

export interface BaseConfig {
  apiKey: string;
  enterSend: boolean;
  ctrlEnterSend: boolean;
  apiUrl: string;
  model: string;
  temperature: number;
  context_max_message: number;
  context_max_tokens: number;
  response_max_tokens: number;
}

export interface ShortcutConfig {
  focusInput: string;
  openSetting: string;
  addTab: string;
  removeTab: string;
  cleanTabChat: string;
  prevTab: string;
  nextTab: string;
  addRobot: string;
  switchRobot: string;
  prevRobot: string;
  nextRobot: string;
}

export interface AppStateStore {
  currentChatId: string | null;
  currentTabIndex: number;
  windowState: "normal" | "maximized" | "minimized";
  windowSize: {
    width: number;
    height: number;
  };
  windowPosition: {
    x: number;
    y: number;
  };
}
