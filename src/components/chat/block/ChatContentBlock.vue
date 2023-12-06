<script setup lang="ts">
import {defineAsyncComponent, nextTick, ref} from "vue";
import {ChatInfo} from "@/types/Store.ts";
import ChatInputBlock from "@/components/chat/block/ChatInputBlock.vue";
import SlideSideBarBlock from "@/components/sidebar/SlideSideBarBlock.vue";
import {useAppStateStore} from "@/store/AppStateStore.ts";

const ChatTabsBlock = defineAsyncComponent({
  loader: () => import("@/components/chat/block/ChatTabsBlock.vue"),
  loadingComponent: {
    template: `
    <div class="flex-1 flex w-full text-center items-center">
      <div class="w-full text-2xl">Loading...</div>
    </div>
  `,
  },
  errorComponent: {
    template: `
    <div class="flex-1 flex w-full text-center items-center">
      <div class="w-full text-2xl">Error!</div>
    </div>
  `
  },
  delay: 0,
});

const tabIndex = ref<number>(0);
const chatTabsBlockRefs = ref<InstanceType<typeof ChatTabsBlock> | null>(null);
const messageRefresh = () => {
  if (!chatTabsBlockRefs.value) return;
  chatTabsBlockRefs.value.scrollToBottom();
};

const appStateStore = useAppStateStore();
const activeChatInfo = ref<ChatInfo | null>(null);
/**
 * If the chat displayed in the current app configuration is different from the chat that has been changed,
 * the new content needs to be written in. If there is a sidebar, its close function should be called. Moreover,
 * regardless of whether a new chat has been switched to or not, the content should be scrolled to the bottom.
 * @param chatInfo
 */
const changeChat = (chatInfo: ChatInfo) => {
  activeChatInfo.value = chatInfo;
  if (appStateStore.currentChatId !== chatInfo.id) {
    appStateStore.currentChatId = chatInfo.id;
    if (slideSideBarBlockRefs.value) {
      slideSideBarBlockRefs.value.hide();
    }
  }
  setTimeout(() => {
    nextTick(() => {
      if (!chatTabsBlockRefs.value) return;
      chatTabsBlockRefs.value.scrollToBottom();
    });
  }, 100);
};

const slideSideBarBlockRefs = ref<InstanceType<typeof SlideSideBarBlock> | null>(null);
const showSlideSideBar = () => {
  if (!slideSideBarBlockRefs.value) return;
  slideSideBarBlockRefs.value.show();
};
defineExpose({
  changeChat
});
</script>

<template>
  <div class="w-full box-border relative">
    <div class="h-full w-full px-2 min-w-[12rem] max-w-7xl mx-auto flex flex-col">
      <ChatTabsBlock
          class="flex-1"
          ref="chatTabsBlockRefs"
          v-model:tabIndex="tabIndex"
          :active-chat="activeChatInfo"
          @showSlideSideBarClick="showSlideSideBar"/>
      <ChatInputBlock :chat-id="activeChatInfo?.id" :tab-index="tabIndex" @refresh="messageRefresh"/>
    </div>
    <SlideSideBarBlock ref="slideSideBarBlockRefs" @changeChatClick="changeChat"/>
  </div>
</template>
