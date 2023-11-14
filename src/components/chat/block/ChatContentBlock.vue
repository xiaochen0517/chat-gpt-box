<script setup lang="ts">
import {nextTick, ref} from "vue";
import ChatTabsBlock from "./ChatTabsBlock.vue";
import ChatInputBlock from "./ChatInputBlock.vue";
import {RequestUtil} from "@/util/RequestUtil.ts";
import {Robot} from "@/types/State.ts";

const robotIndex = ref<number>(0);
const chatTabsBlockRefs = ref<InstanceType<typeof ChatTabsBlock> | null>(null);
const commitMsgContent = (msgContent: string) => {
  if (!chatTabsBlockRefs.value) return;
  const tabIndex = chatTabsBlockRefs.value.getTabIndex();
  let requestUtil = new RequestUtil();
  requestUtil.sendRequest({
    robotIndex: robotIndex.value,
    tabIndex: tabIndex,
    content: msgContent,
  }, () => {
    if (!chatTabsBlockRefs.value) return;
    chatTabsBlockRefs.value.scrollToBottom();
  });
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
          :robot-index="robotIndex"
          @changeRobotClick="changeRobot"/>
      <ChatInputBlock @commit="commitMsgContent"/>
    </div>
  </div>
</template>
