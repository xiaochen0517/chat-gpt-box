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
  actions: {},
  persist: {
    key: 'AppState',
  },
});