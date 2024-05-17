<script setup lang="ts">
import {nextTick, ref} from "vue";
import DefaultSideBarComponent from "@/components/sidebar/DefaultSideBarComponent.vue";
import HomeChatComponent from "@/components/chat/block/HomeChatComponent.vue";

import {ChatInfo} from "@/types/chat/ChatInfo.ts";

const chatContentBlockRefs = ref<InstanceType<typeof HomeChatComponent> | null>(null);
const changeChatClick = (chatInfo: ChatInfo) => {
  nextTick(() => {
    if (!chatContentBlockRefs.value) return;
    chatContentBlockRefs.value.changeChat(chatInfo);
  });
};
</script>

<template>
  <div class="w-full h-full flex flex-row box-border">
    <DefaultSideBarComponent class="hidden mobile:flex" @changeChatClick="changeChatClick"/>
    <HomeChatComponent class="flex-1" ref="chatContentBlockRefs"/>
  </div>
</template>
