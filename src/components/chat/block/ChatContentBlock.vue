<script setup lang="ts">
import {nextTick, ref} from "vue";
import ChatTabsBlock from "./ChatTabsBlock.vue";
import ChatInputBlock from "./ChatInputBlock.vue";
import {Robot} from "@/types/State.ts";

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
  nextTick(() => {
    if (!chatTabsBlockRefs.value) return;
    chatTabsBlockRefs.value.scrollToBottom();
  });
};

defineExpose({
  changeRobot
});
</script>

<template>
  <div class="w-full box-border dark:bg-gray-800 relative">
    <div class="h-full w-full px-2 lg:px-0 lg:max-w-5xl mx-auto flex flex-col">
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
