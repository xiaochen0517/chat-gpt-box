import {defineStore} from "pinia";
import {AppStateStore} from "@/types/Store.ts";

export const useAppStateStore = defineStore("appState", {
  state: (): AppStateStore => {
    return {
      currentChatId: null,
      currentTabIndex: 0,
      windowState: "normal",
      windowSize: {
        width: 1400,
        height: 900,
      },
      windowPosition: {
        x: 200,
        y: 200,
      },
    }
  },
  actions: {
    setWindowWidth(width: number) {
      this.windowSize.width = width;
    },
    setWindowHeight(height: number) {
      this.windowSize.height = height;
    },
    setWindowX(x: number) {
      this.windowPosition.x = x;
    },
    setWindowY(y: number) {
      this.windowPosition.y = y;
    },
    setWindowState(state: "normal" | "maximized") {
      this.windowState = state;
    }
  },
  persist: {
    key: 'AppState',
  },
});