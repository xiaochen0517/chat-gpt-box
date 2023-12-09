import {ChatInfoTypes} from "@/types/chat/ChatInfoTypes.ts";
import {ChatTabInfoTypes} from "@/types/chat/ChatTabInfoTypes.ts";
import {BaseConfigTypes, ShortcutConfig} from "@/types/chat/BaseConfigTypes.ts";

export type ChatListStore = {
  chatList: ChatInfoTypes[];
}

export type ChatTabsStore = {
  chatTabs: {
    [key: string]: ChatTabInfoTypes[];
  };
}

export type ConfigStore = {
  isDarkMode: boolean;
  baseConfig: BaseConfigTypes;
  shortcut: ShortcutConfig;
  shortcutKeyMapMaxSize: number;
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
