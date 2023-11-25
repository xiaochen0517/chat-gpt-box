<script setup lang="ts">
import {defineAsyncComponent, nextTick, ref} from "vue";
import {ChatInfo} from "@/types/Store.ts";
import ChatInputBlock from "@/components/chat/block/ChatInputBlock.vue";

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

const activeChatInfo = ref<ChatInfo | null>(null);
const changeChat = (chatInfo: ChatInfo) => {
  activeChatInfo.value = chatInfo;
  setTimeout(() => {
    nextTick(() => {
      if (!chatTabsBlockRefs.value) return;
      chatTabsBlockRefs.value.scrollToBottom();
    });
  }, 100);
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
          @changeRobotClick="changeChat"/>
      <ChatInputBlock :chat-id="activeChatInfo?.id" :tab-index="tabIndex" @refresh="messageRefresh"/>
    </div>
  </div>
</template>
