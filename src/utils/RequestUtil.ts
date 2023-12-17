import {useChatListStore} from "@/store/ChatListStore.ts";
import {ChatGptRequest} from "@/service/request/ChatGptRequest.ts";
import {DallERequest} from "@/service/request/DallERequest.ts";
import {ChatInfo, ChatType} from "@/types/chat/ChatInfo.ts";

const chatListStore = useChatListStore();
export const createRequest = (chatInfo: ChatInfo) => {
  switch (chatInfo.chatType) {
    case ChatType.CHAT_GPT:
      return new ChatGptRequest(chatInfo);
    case ChatType.DALL_E:
      return new DallERequest(chatInfo);
    default:
      chatListStore.setChatInfo(chatInfo.id, "chatType", ChatType.CHAT_GPT);
      return new ChatGptRequest(chatInfo);
  }
};
