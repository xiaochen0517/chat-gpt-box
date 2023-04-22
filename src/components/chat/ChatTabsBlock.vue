<script setup>
import {nextTick, onMounted, onUnmounted, ref, computed} from "vue";
import ChatMsgListBlock from "./ChatMsgListBlock.vue";
import {useStore} from "vuex";
import AddTabDialog from "../dialog/AddTabDialog.vue";

const props = defineProps({
  robotIndex: {
    type: Number,
    default: 0
  },
});

const activeTabIndex = ref(0);
onMounted(() => {
});
onUnmounted(() => {
});
const chatTabsChange = (index) => {
  activeTabIndex.value = index;
  nextTick(() => {
    scrollToBottom();
  });
};

const store = useStore();
const chatTabsSize = computed(() => store.state.chatHistory[props.robotIndex].length);
const addTabDialogRefs = ref(null);
const chatTabsEdit = (targetKey, action) => {
  console.log("action", targetKey, action);
  if (action === "remove") {
    console.log("remove", props.robotIndex, targetKey);
    store.commit("removeChatTab", {
      robotIndex: props.robotIndex,
      tabIndex: targetKey
    });
  } else if (action === "add") {
    addTabDialogRefs.value.show();
  }
};

const chatTabNameList = computed(() => {
  const chatTabList = store.state.chatHistory[props.robotIndex];
  let chatTabNameList = [];
  for (let chatTab of chatTabList) {
    const name = chatTab.name;
    const generating = chatTab.generating;
    chatTabNameList.push(name + (generating ? "..." : ""));
  }
  return chatTabNameList;
});

const getTabIndex = () => {
  return activeTabIndex.value;
};
const chatMsgListBlockRefs = ref([]);
const scrollToBottom = () => {
  chatMsgListBlockRefs.value[activeTabIndex.value].scrollToBottom();
};

defineExpose({
  getTabIndex,
  scrollToBottom,
});
</script>

<template>
  <div class="chat-tabs-block">
    <a-tabs class="chat-scroll-content" v-model:activeKey="activeTabIndex" type="editable-card" @edit="chatTabsEdit"
            size="small" @change="chatTabsChange">
      <a-tab-pane v-for="(item, index) in chatTabsSize" :key="index" :tab="chatTabNameList[index]">
        <ChatMsgListBlock ref="chatMsgListBlockRefs" :robotIndex="props.robotIndex" :tabIndex="index"/>
      </a-tab-pane>
    </a-tabs>
    <AddTabDialog ref="addTabDialogRefs" :robot-index="props.robotIndex"/>
  </div>
</template>

<style lang="less" scoped>
.chat-tabs-block {
  height: 100%;
  padding-bottom: 100px;
  position: relative;

}
</style>
