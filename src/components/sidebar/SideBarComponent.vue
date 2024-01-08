<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import ChatBotListComponent from "./ChatBotListComponent.vue";
import BottomMenuComponent from "./BottomMenuComponent.vue";

import {ChatInfo} from "@/types/chat/ChatInfo.ts";

const instance = getCurrentInstance();
const changeChatClick = (chatInfo: ChatInfo) => {
  if (!instance) return;
  instance.emit("changeChatClick", chatInfo);
};

const robotListBlockRefs = ref<InstanceType<typeof ChatBotListComponent> | null>(null);
const robotListScrollToBottom = () => {
  if (!robotListBlockRefs.value) return;
  robotListBlockRefs.value.scrollToBottom();
};
</script>

<template>
  <div class="h-full w-80 flex flex-col box-border border-r-2 dark:border-0 bg-neutral-50 dark:bg-neutral-800">
    <ChatBotListComponent class="flex-1" ref="robotListBlockRefs" @changeChatClick="changeChatClick"/>
    <BottomMenuComponent @added-robot="robotListScrollToBottom"/>
  </div>
</template>
