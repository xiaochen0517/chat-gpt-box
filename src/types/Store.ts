import {BaseRequest} from "@/service/request/BaseRequest.ts";
import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";

export type ChatListStore = {
  chatList: ChatInfo[];
}

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

export type ChatTabsStore = {
  chatTabs: {
    [key: string]: ChatTabInfo[];
  };
}

export type ChatTabInfo = {
  name: string;
  generating: boolean;
  request: BaseRequest | null;
  chat: ChatMessage[];
}

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
}

export enum ChatMessageRole {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export type ConfigStore = {
  isDarkMode: boolean;
  baseConfig: BaseConfig;
  shortcut: ShortcutConfig;
}

export type BaseConfig = {
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

export type ShortcutConfig = {
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

export type ShortcutConfigKey = keyof ShortcutConfig;

export type ShortcutStringConfig = {
  [key in ShortcutConfigKey]: string;
}

export type AppStateStore = {
  currentChatId: string | null;
  currentTabIndex: number;
  windowState: WindowState;
  windowSize: {
    width: number;
    height: number;
  };
  windowPosition: {
    x: number;
    y: number;
  };
}

export enum WindowState {
  Normal = "normal",
  Maximized = "maximized",
  Minimized = "minimized",
}
