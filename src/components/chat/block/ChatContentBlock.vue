<script setup lang="ts">
import {defineAsyncComponent, nextTick, ref} from "vue";
import {Robot} from "@/types/State.ts";
import ChatInputBlock from "@/components/chat/block/ChatInputBlock.vue";

const ChatTabsBlock = defineAsyncComponent(() => import("@/components/chat/block/ChatTabsBlock.vue"));

const robotIndex = ref<number>(0);
const tabIndex = ref<number>(0);
const chatTabsBlockRefs = ref<InstanceType<typeof ChatTabsBlock> | null>(null);
const messageRefresh = () => {
  if (!chatTabsBlockRefs.value) return;
  chatTabsBlockRefs.value.scrollToBottom();
};

const changeRobot = (index: number, item: Robot) => {
  console.log(`changeRobot: ${index}, ${item}`)
  robotIndex.value = index;
  setTimeout(() => {
    nextTick(() => {
      if (!chatTabsBlockRefs.value) return;
      chatTabsBlockRefs.value.scrollToBottom();
    });
  }, 100);
};

defineExpose({
  changeRobot
});
</script>

<template>
  <div class="w-full box-border relative">
    <div class="h-full w-full px-2 min-w-[12rem] xl:max-w-screen-2xl mx-auto flex flex-col">
      <ChatTabsBlock
          class="flex-1"
          ref="chatTabsBlockRefs"
          v-model:tabIndex="tabIndex"
          :robot-index="robotIndex"
          @changeRobotClick="changeRobot"/>
      <ChatInputBlock :robot-index="robotIndex" :tab-index="tabIndex" @refresh="messageRefresh"/>
    </div>
  </div>
</template>
