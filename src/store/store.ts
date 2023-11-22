import {defineStore} from "pinia";
import {BaseConfig, ChatMessage, ChatInfo, ChatTabInfo, ShortcutConfig, ChatOptions} from "@/types/Store.ts";

export const useStore = defineStore("store", {
  state: () => {
    return {
      version: "0.2.3" as string,
      robotList: [
        {
          name: "TestRobot",
          prompt: "You are a helpful assistant.",
          options: {
            enabled: false,
            apiUrl: "https://api.openai.com/",
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            context_max_message: 1,
            context_max_tokens: 2048,
            response_max_tokens: 0
          } as ChatOptions,
        },
      ] as Array<ChatInfo>,
      chatHistory: [
        [
          {
            name: "default",
            generating: false,
            request: null,
            chat: [{role: "system", content: "You are a helpful assistant."}],
          },
        ],
      ] as Array<Array<ChatTabInfo>>,
      config: {
        isDarkMode: true as boolean,
        base: {
          apiKey: "",
          enterSend: true,
          ctrlEnterSend: false,
          apiUrl: "https://api.openai.com/",
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          context_max_message: 2,
          context_max_tokens: 2000,
          response_max_tokens: 0
        } as BaseConfig,
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
        } as ShortcutConfig,
      }
    }
  },
  actions: {
    initGeneralStatus() {
      for (let tabList of this.chatHistory) {
        for (let tab of tabList) {
          tab.generating = false;
          tab.request = null;
        }
      }
    },
    // 删除机器人
    removeRobot(index: number) {
      this.robotList.splice(index, 1);
      this.chatHistory.splice(index, 1);
    },
    addRobot(robot: ChatInfo) {
      this.robotList.push(robot);
      const defaultChatMessage: ChatMessage = {role: "system", content: robot.prompt};
      const defaultTabChatInfo: ChatTabInfo = {
        name: "default",
        generating: false,
        request: null,
        chat: [defaultChatMessage]
      };
      this.chatHistory.push([defaultTabChatInfo]);
    },
    updateRobot(robotIndex: number, robot: ChatInfo) {
      this.robotList[robotIndex] = robot;
    },
    removeChatTab(robotIndex: number, tabIndex: number) {
      this.chatHistory[robotIndex].splice(tabIndex, 1);
    },
    addChatTab(robotIndex: number, tabName: string) {
      const robotInfo = this.robotList[robotIndex];
      this.chatHistory[robotIndex].push({
        name: tabName,
        generating: false,
        request: null,
        chat: [{role: "system", content: robotInfo.prompt}]
      });
    },
    cleanTabChat(robotIndex: number, tabIndex: number) {
      const robotInfo = this.robotList[robotIndex];
      this.chatHistory[robotIndex][tabIndex].chat.splice(0);
      this.chatHistory[robotIndex][tabIndex].chat.push({role: "system", content: robotInfo.prompt});
    },
    addChatMsg(chatIndex: number, tabIndex: number, message: ChatMessage) {
      this.chatHistory[chatIndex][tabIndex].chat.push(message);
    },
    setChatContent(chatIndex: number, tabIndex: number, content: string) {
      const msgIndex = this.chatHistory[chatIndex][tabIndex].chat.length - 1;
      this.chatHistory[chatIndex][tabIndex].chat[msgIndex].content += content;
    },
    removeChatMessage(robotIndex: number, tabIndex: number, msgIndex: number) {
      this.chatHistory[robotIndex][tabIndex].chat.splice(msgIndex, 1);
    },
    cleanAllMessage(chatIndex: number, tabIndex: number) {
      const msgCount = this.chatHistory[chatIndex][tabIndex].chat.length;
      this.chatHistory[chatIndex][tabIndex].chat.splice(1, msgCount - 1);
    },
    addUserMessage(robotIndex: number, tabIndex: number, content: string) {
      this.chatHistory[robotIndex][tabIndex].chat.push({role: "user", content});
    },
    addAssistantMessage(robotIndex: number, tabIndex: number) {
      this.chatHistory[robotIndex][tabIndex].chat.push({role: "assistant", content: ""});
    },
    addAssistantMsgContent(robotIndex: number, tabIndex: number, content: string) {
      const msgIndex = this.chatHistory[robotIndex][tabIndex].chat.length - 1;
      this.chatHistory[robotIndex][tabIndex].chat[msgIndex].content += content;
    },
    setAssistantMsgContent(robotIndex: number, tabIndex: number, content: string) {
      const msgIndex: number = this.chatHistory[robotIndex][tabIndex].chat.length - 1;
      let lastMsgInfo: ChatMessage = this.chatHistory[robotIndex][tabIndex].chat[msgIndex];
      if (lastMsgInfo.role !== "assistant") {
        lastMsgInfo = {role: "assistant", content: ""};
        this.chatHistory[robotIndex][tabIndex].chat.push(lastMsgInfo);
      }
      lastMsgInfo.content = content;
    },
    updateMessage(robotIndex: number, tabIndex: number, messageIndex: number, message: ChatMessage) {
      this.chatHistory[robotIndex][tabIndex].chat[messageIndex].role = message.role;
      this.chatHistory[robotIndex][tabIndex].chat[messageIndex].content = message.content;
    },
    setGenerating(robotIndex: number, tabIndex: number, generating: boolean) {
      console.log("setGenerating", robotIndex, tabIndex, generating)
      this.chatHistory[robotIndex][tabIndex].generating = generating;
      if (!generating) this.chatHistory[robotIndex][tabIndex].request = null;
    },
    setDarkMode(darkMode: boolean) {
      this.config.isDarkMode = darkMode;
    },
    saveBaseConfig(base: BaseConfig) {
      this.config.base = base;
    },
    saveShortcutConfig(shortcut: ShortcutConfig) {
      this.config.shortcut = shortcut;
    },
    setAllData(data: any) {
      this.version = data.version;
      this.robotList = data.robotList;
      this.chatHistory = data.chatHistory;
      this.config = data.config;
    },
    setApiKey(apiKey: string) {
      this.config.base.apiKey = apiKey;
    },
    setEnterSend(enterSend: boolean) {
      this.config.base.enterSend = enterSend;
    },
    setApiUrl(apiUrl: string) {
      this.config.base.apiUrl = apiUrl;
    },
    setDefaultModel(model: string) {
      this.config.base.model = model;
    },
    setTemperature(temperature: number) {
      this.config.base.temperature = temperature;
    },
    setContextMaxMessage(context_max_message: number) {
      this.config.base.context_max_message = context_max_message;
    },
    setContextMaxTokens(context_max_tokens: number) {
      this.config.base.context_max_tokens = context_max_tokens;
    },
    setResponseMaxTokens(response_max_tokens: number) {
      this.config.base.response_max_tokens = response_max_tokens;
    }
  },
  persist: {
    key: 'state',
  },
});
