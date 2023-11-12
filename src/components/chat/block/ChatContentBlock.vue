<script setup>
import {nextTick, ref} from "vue";
import ChatTabsBlock from "./ChatTabsBlock.vue";
import ChatInputBlock from "./ChatInputBlock.vue";
import {useStore} from "vuex";
import {RequestUtil} from "@/util/RequestUtil.js";

const store = useStore();

const robotIndex = ref(0);
const chatTabsBlockRefs = ref(null);
const commitMsgContent = (msgContent) => {
  const tabIndex = chatTabsBlockRefs.value.getTabIndex();
  let requestUtil = new RequestUtil();
  requestUtil.sendRequest({
    robotIndex: robotIndex.value,
    tabIndex: tabIndex,
    content: msgContent,
  }, () => {
    chatTabsBlockRefs.value.scrollToBottom();
  });
};

const changeRobot = (index, item) => {
  robotIndex.value = index;
  nextTick(() => {
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
      <ChatTabsBlock class="flex-1" ref="chatTabsBlockRefs" :robot-index="robotIndex"/>
      <ChatInputBlock @commit="commitMsgContent"/>
    </div>
  </div>
</template>
