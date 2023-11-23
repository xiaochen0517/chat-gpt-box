import {defineStore} from "pinia";
import {ConfigStore} from "@/types/Store.ts";

export const useConfigStore = defineStore("config", {
  state: (): ConfigStore => {
    return {
      isDarkMode: true,
      baseConfig: {
        apiKey: "",
        enterSend: true,
        ctrlEnterSend: false,
        apiUrl: "https://api.openai.com/",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        context_max_message: 2,
        context_max_tokens: 2000,
        response_max_tokens: 0,
      },
      shortcut: {
        focusInput: "ctrl+/",
        openSetting: "ctrl+s",
        addTab: "ctrl+t",
        removeTab: "ctrl+w",
        cleanTabChat: "ctrl+e",
        prevTab: "ctrl+left",
        nextTab: "ctrl+right",
        addRobot: "ctrl+n",
        switchRobot: "ctrl+tab",
        prevRobot: "ctrl+up",
        nextRobot: "ctrl+down",
      },
    }
  },
  actions: {
    setDarkMode(isDarkMode: boolean) {
      this.isDarkMode = isDarkMode;
    },
    setBaseConfig(config: any) {
      this.baseConfig = config;
    },
    setApiKey(apiKey: string) {
      this.baseConfig.apiKey = apiKey;
    },
    setEnterSend(enterSend: boolean) {
      this.baseConfig.enterSend = enterSend;
    },
    setCtrlEnterSend(ctrlEnterSend: boolean) {
      this.baseConfig.ctrlEnterSend = ctrlEnterSend;
    },
    setApiUrl(apiUrl: string) {
      this.baseConfig.apiUrl = apiUrl;
    },
    setModel(model: string) {
      this.baseConfig.model = model;
    },
    setTemperature(temperature: number) {
      this.baseConfig.temperature = temperature;
    },
    setContextMaxMessage(contextMaxMessage: number) {
      this.baseConfig.context_max_message = contextMaxMessage;
    },
    setContextMaxTokens(contextMaxTokens: number) {
      this.baseConfig.context_max_tokens = contextMaxTokens;
    },
    setResponseMaxTokens(responseMaxTokens: number) {
      this.baseConfig.response_max_tokens = responseMaxTokens;
    },
    setShortcut(config: any) {
      this.shortcut = config;
    },
    setFocusInput(shortcut: string) {
      this.shortcut.focusInput = shortcut;
    },
    setOpenSetting(shortcut: string) {
      this.shortcut.openSetting = shortcut;
    },
    setAddTab(shortcut: string) {
      this.shortcut.addTab = shortcut;
    },
    setRemoveTab(shortcut: string) {
      this.shortcut.removeTab = shortcut;
    },
    setCleanTabChat(shortcut: string) {
      this.shortcut.cleanTabChat = shortcut;
    },
    setPrevTab(shortcut: string) {
      this.shortcut.prevTab = shortcut;
    },
    setNextTab(shortcut: string) {
      this.shortcut.nextTab = shortcut;
    },
    setAddRobot(shortcut: string) {
      this.shortcut.addRobot = shortcut;
    },
    setSwitchRobot(shortcut: string) {
      this.shortcut.switchRobot = shortcut;
    },
    setPrevRobot(shortcut: string) {
      this.shortcut.prevRobot = shortcut;
    },
    setNextRobot(shortcut: string) {
      this.shortcut.nextRobot = shortcut;
    },
  },
  persist: {
    key: 'Config',
  },
})