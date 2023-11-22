<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import ChatListBlock from "./ChatListBlock.vue";
import MenuListBlock from "./MenuListBlock.vue";
import {ChatInfo} from "@/types/Store.ts";

const instance = getCurrentInstance();
const changeChatClick = (chatInfo: ChatInfo) => {
  if (!instance) return;
  instance.emit('changeChatClick', chatInfo);
};

const robotListBlockRefs = ref<InstanceType<typeof ChatListBlock> | null>(null);
const robotListScrollToBottom = () => {
  if (!robotListBlockRefs.value) return;
  robotListBlockRefs.value.scrollToBottom();
};

</script>

<template>
  <div class="h-full w-80 flex flex-col box-border border-r-2 dark:border-0 bg-neutral-50 dark:bg-neutral-800">
    <ChatListBlock class="flex-1" ref="robotListBlockRefs" @changeChatClick="changeChatClick"/>
    <MenuListBlock @added-robot="robotListScrollToBottom"/>
  </div>
</template>
