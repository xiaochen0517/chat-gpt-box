import {defineStore} from "pinia";
import {ChatMessage, ChatTabInfo, ChatTabsStore} from "@/types/Store.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";

export const useChatTabsStore = defineStore("chatTabs", {
  state: (): ChatTabsStore => {
    return {
      chatTabs: {
        default: [
          {
            name: "default",
            generating: false,
            request: null,
            chat: [{role: "system", content: "You are a helpful assistant."}],
          },
        ],
        default1: [
          {
            name: "default",
            generating: false,
            request: null,
            chat: [{role: "system", content: "You are a helpful assistant. Please ask me anything."}],
          },
        ],
      }
    }
  },
  actions: {
    initGeneralStatus() {
      for (let id in this.chatTabs) {
        if (!this.chatTabs.hasOwnProperty(id)) continue;
        for (let tabInfo of this.chatTabs[id]) {
          tabInfo.generating = false;
          tabInfo.request = null;
        }
      }
    },
    addDefaultChatTab(id: string) {
      this.addChatTab(id, "default");
    },
    addChatTab(id: string, tabName: string) {
      if (!id) return;
      if (!this.chatTabs[id]) this.chatTabs[id] = [];
      const chatInfo = useChatListStore().getChatInfo(id);
      if (!chatInfo) return;
      this.chatTabs[id].push({
        name: tabName,
        generating: false,
        request: null,
        chat: [{role: "system", content: chatInfo.prompt}],
      });
    },
    removeChatTabs(id: string) {
      if (!id || !this.chatTabs[id]) return;
      delete this.chatTabs[id];
    },
    cleanTabChat(id: string, tabIndex: number) {
      if (!id || !this.chatTabs[id]) return;
      let chatInfo = useChatListStore().getChatInfo(id);
      if (!chatInfo) return;
      this.chatTabs[id][tabIndex].chat = [{role: "system", content: chatInfo.prompt}];
    },
    removeChatTab(id: string, tabIndex: number) {
      if (!id || !this.chatTabs[id]) return;
      this.chatTabs[id].splice(tabIndex, 1);
      if (this.chatTabs[id].length === 0) {
        this.addDefaultChatTab(id);
      }
    },
    updateMessage(id: string, tabIndex: number, messageIndex: number, content: ChatMessage) {
      if (!id || !this.chatTabs[id] || tabIndex < 0 || messageIndex < 0) return;
      this.chatTabs[id][tabIndex].chat[messageIndex] = content;
    },
    removeChatMessage(id: string, tabIndex: number, messageIndex: number) {
      if (!id || !this.chatTabs[id] || tabIndex < 0 || messageIndex < 0) return;
      this.chatTabs[id][tabIndex].chat.splice(messageIndex, 1);
    },
    addUserMessage(id: string, tabIndex: number, content: string) {
      if (!id || !this.chatTabs[id]) return;
      this.chatTabs[id][tabIndex].chat.push({role: "user", content: content});
    },
    addAssistantMessage(id: string, tabIndex: number) {
      if (!id || !this.chatTabs[id]) return;
      this.chatTabs[id][tabIndex].chat.push({role: "assistant", content: ""});
    },
    appendAssistantMsgContent(id: string, tabIndex: number, content: string) {
      if (!id || !this.chatTabs[id]) return;
      let chat = this.chatTabs[id][tabIndex].chat;
      if (chat.length === 0) return;
      chat[chat.length - 1].content += content;
    },
    setAssistantErrorMsgContent(id: string, tabIndex: number, content: string) {
      if (!id || !this.chatTabs[id]) return;
      let chat = this.chatTabs[id][tabIndex].chat;
      if (chat.length === 0) return;
      chat[chat.length - 1].content = "\n> " + content;
    },
    setGenerating(id: string, tabIndex: number, generating: boolean) {
      if (!id || !this.chatTabs[id]) return;
      const chatTabInfo: ChatTabInfo = this.chatTabs[id][tabIndex];
      chatTabInfo.generating = generating;
      if (!generating) {
        chatTabInfo.request = null;
      }
    },
  },
  persist: {
    key: 'ChatTabs',
  },
})