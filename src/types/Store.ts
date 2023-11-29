import {RequestUtil} from "@/utils/RequestUtil.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";

export interface ChatListStore {
  chatList: ChatInfo[];
}

export interface ChatInfo {
  id: string;
  name: string;
  prompt: string;
  options: ChatOptions;
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
  request: RequestUtil | null;
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
  focusInput: KeyMapEnum[];
  openSetting: KeyMapEnum[];
  addTab: KeyMapEnum[];
  removeTab: KeyMapEnum[];
  cleanTabChat: KeyMapEnum[];
  prevTab: KeyMapEnum[];
  nextTab: KeyMapEnum[];
  addRobot: KeyMapEnum[];
  switchRobot: KeyMapEnum[];
  prevRobot: KeyMapEnum[];
  nextRobot: KeyMapEnum[];
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
