import {ChatInfo, ChatType} from "@/types/Store.ts";
import {ChatGptRequest} from "@/utils/request/ChatGptRequest.ts";
import {DallERequest} from "@/utils/request/DallERequest.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";

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
}
