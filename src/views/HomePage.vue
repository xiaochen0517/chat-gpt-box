<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import SideBarBlock from "@/components/sidebar/SideBarBlock.vue";
import {appWindow} from "@tauri-apps/api/window";
import {exit} from '@tauri-apps/api/process';
import ChatContentBlock from "@/components/chat/block/ChatContentBlock.vue";
import {ChatInfo} from "@/types/Store.ts";

/**
 * Listen for the window close event and exit the program directly.
 */
onMounted(() => {
  checkConfig();
  addWindowsCloseListener();
});

const addWindowsCloseListener = () => {
  if (!(window as any).__TAURI__ || !(window as any).__TAURI__.isRunningInTauri) return;
  appWindow.onCloseRequested(async () => {
    await exit(0);
  });
};

/**
 * Check the content of the configuration items.
 */
const checkConfig = () => {
};

const chatContentBlockRefs = ref<InstanceType<typeof ChatContentBlock> | null>(null);
const changeChatClick = (chatInfo: ChatInfo) => {
  nextTick(() => {
    if (!chatContentBlockRefs.value) return;
    chatContentBlockRefs.value.changeChat(chatInfo);
  });
};
</script>

<template>
  <div class="w-full h-full flex flex-row box-border">
    <SideBarBlock class="hidden lg:flex" @changeChatClick="changeChatClick"/>
    <ChatContentBlock class="flex-1" ref="chatContentBlockRefs"/>
  </div>
</template>
