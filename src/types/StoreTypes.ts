import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {ChatTabInfo} from "@/types/chat/ChatTabInfo.ts";
import {BaseConfig, DefaultChatConfig, ShortcutConfig} from "@/types/chat/BaseConfig.ts";

export type ChatListStore = {
  chatList: ChatInfo[];
}

export type ChatTabsStore = {
  chatTabs: {
    [key: string]: ChatTabInfo[];
  };
}

export type ConfigStore = {
  isDarkMode: boolean;
  baseConfig: BaseConfig;
  defaultChatConfig: DefaultChatConfig;
  shortcut: ShortcutConfig;
  shortcutKeyMapMaxSize: number;
}

export type AppStateStore = {
  lockScrollDown: boolean;
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
