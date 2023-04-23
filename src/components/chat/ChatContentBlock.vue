<script setup>
import {nextTick, ref} from "vue";
import ChatTabsBlock from "./ChatTabsBlock.vue";
import ChatInputBlock from "./ChatInputBlock.vue";
import {useStore} from "vuex";
import {sendRequest} from "../../util/RequestUtil.js";

const store = useStore();

const robotIndex = ref(0);
const chatTabsBlockRefs = ref(null);
const commitMsgContent = (msgContent) => {
  const tabIndex = chatTabsBlockRefs.value.getTabIndex();
  sendRequest({
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
  <div class="chat-content-block">
    <ChatTabsBlock ref="chatTabsBlockRefs" :robot-index="robotIndex"/>
    <ChatInputBlock class="chat-input-block" @commit="commitMsgContent"/>
  </div>
</template>

<style lang="less" scoped>
.chat-content-block {
  position: relative;

  .chat-input-block {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
