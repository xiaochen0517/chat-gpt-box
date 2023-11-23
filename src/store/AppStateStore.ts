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
    setWindowSize(width: number, height: number) {
      if (width < 400 || height < 200) return;
      this.windowSize.width = width;
      this.windowSize.height = height;
    },
    setWindowPosition(x: number, y: number) {
      if (x < 0 || y < 0) return;
      if (x > 1800 || y > 1000) return;
      this.windowPosition.x = x;
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