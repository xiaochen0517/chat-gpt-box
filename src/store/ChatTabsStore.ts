import {defineStore} from "pinia";
import {ChatTabsStore} from "@/types/StoreTypes.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {ChatMessage, ChatMessageRole, ChatTabInfo} from "@/types/chat/ChatTabInfo.ts";
import {ChatType} from "@/types/chat/ChatInfo.ts";

export const useChatTabsStore = defineStore("chatTabs", {
  state: (): ChatTabsStore => {
    return {
      chatTabs: {
        default: [
          {
            name: "default",
            generating: false,
            request: null,
            chat: [{role: ChatMessageRole.System, content: "You are a helpful assistant."}],
          },
        ],
        default1: [
          {
            name: "default",
            generating: false,
            request: null,
            chat: [{role: ChatMessageRole.System, content: "You are a helpful assistant. Please ask me anything."}],
          },
        ],
      }
    };
  },
  actions: {
    initGeneralStatus() {
      for (const id in this.chatTabs) {
        if (!Object.prototype.hasOwnProperty.call(this.chatTabs, id)) continue;
        for (const tabInfo of this.chatTabs[id]) {
          tabInfo.generating = false;
          tabInfo.request = null;
        }
      }
    },
    getChatTabInfo(id: string, tabIndex: number): ChatTabInfo | null {
      if (!id || !this.chatTabs[id]) return null;
      return this.chatTabs[id][tabIndex];
    },
    addDefaultChatTab(id: string) {
      this.addChatTab(id, "default");
    },
    addChatTab(id: string, tabName: string) {
      if (!id) return;
      if (!this.chatTabs[id]) this.chatTabs[id] = [];
      const chatInfo = useChatListStore().getChatInfo(id);
      if (!chatInfo) return;
      const chatMessageList = chatInfo.chatType === ChatType.DALL_E ? [] : [{
        role: ChatMessageRole.System,
        content: chatInfo.prompt
      }];
      this.chatTabs[id].push({
        name: tabName,
        generating: false,
        request: null,
        chat: chatMessageList,
      });
    },
    removeChatTabs(id: string) {
      if (!id || !this.chatTabs[id]) return;
      delete this.chatTabs[id];
    },
    cleanTabChat(id: string, tabIndex: number) {
      if (!id || !this.chatTabs[id]) return;
      const chatInfo = useChatListStore().getChatInfo(id);
      if (!chatInfo) return;
      if (chatInfo.chatType === ChatType.DALL_E) {
        this.chatTabs[id][tabIndex].chat = [];
        return;
      }
      this.chatTabs[id][tabIndex].chat = [{role: ChatMessageRole.System, content: chatInfo.prompt}];
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
    setAllTabPromptMessage(id: string, prompt: string) {
      if (!id || !this.chatTabs[id]) return;
      for (const tabInfo of this.chatTabs[id]) {
        if (tabInfo.chat.length === 0) {
          tabInfo.chat.push({role: ChatMessageRole.System, content: prompt});
          continue;
        }
        tabInfo.chat[0].content = prompt;
      }
    },
    removeChatMessage(id: string, tabIndex: number, messageIndex: number) {
      if (!id || !this.chatTabs[id] || tabIndex < 0 || messageIndex < 0) return;
      this.chatTabs[id][tabIndex].chat.splice(messageIndex, 1);
    },
    addUserMessage(id: string, tabIndex: number, content: string) {
      if (!id || !this.chatTabs[id]) return;
      this.chatTabs[id][tabIndex].chat.push({role: ChatMessageRole.User, content: content});
    },
    addAssistantMessage(id: string, tabIndex: number) {
      if (!id || !this.chatTabs[id]) return;
      this.chatTabs[id][tabIndex].chat.push({role: ChatMessageRole.Assistant, content: ""});
    },
    appendAssistantMsgContent(id: string, tabIndex: number, content: string) {
      if (!id || !this.chatTabs[id]) return;
      const chat = this.chatTabs[id][tabIndex].chat;
      if (chat.length === 0) return;
      chat[chat.length - 1].content += content;
    },
    setAssistantMsgContent(id: string, tabIndex: number, content: string) {
      if (!id || !this.chatTabs[id]) return;
      const chat = this.chatTabs[id][tabIndex].chat;
      if (chat.length === 0) return;
      chat[chat.length - 1].content = content;
    },
    setAssistantErrorMsgContent(id: string, tabIndex: number, content: string) {
      if (!id || !this.chatTabs[id]) return;
      const chat = this.chatTabs[id][tabIndex].chat;
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
    key: "ChatTabs",
  },
});