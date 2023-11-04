<script setup>
import {computed, nextTick, onMounted, ref, toRef, watch} from "vue";
import ChatMsgListBlock from "./ChatMsgListBlock.vue";
import {useStore} from "vuex";
import AddTabDialog from "../dialog/AddTabDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import CTabs from "@/components/base/CTabs.vue";
import CTabPane from "@/components/base/CTabPane.vue";

const props = defineProps({
  robotIndex: {
    type: Number,
    default: 0
  },
});

/**
 * 注册操作tab的快捷键
 */
const store = useStore();
const shortcut = computed(() => store.state.config.shortcut);
const keys = useMagicKeys();
const addTabKey = keys[shortcut.value.addTab];
whenever(addTabKey, () => {
  addTabDialogRefs.value.show();
});
const removeTabKey = keys[shortcut.value.removeTab];
whenever(removeTabKey, () => {
  confirmRemoveTab(activeTabIndex.value);
});
const prevTabKey = keys[shortcut.value.prevTab];
whenever(prevTabKey, () => {
  const targetIndex = activeTabIndex.value - 1;
  if (targetIndex >= 0) {
    activeTabIndex.value = targetIndex;
  }
});
const nextTabKey = keys[shortcut.value.nextTab];
whenever(nextTabKey, () => {
  const targetIndex = activeTabIndex.value + 1;
  if (targetIndex < chatTabNameList.value.length) {
    activeTabIndex.value = targetIndex;
  }
});
const cleanTabChatKey = keys[shortcut.value.cleanTabChat];
whenever(cleanTabChatKey, () => {
  cleanTabChat();
});
const cleanTabChat = () => {
  // TODO 二次确认
  store.commit("cleanTabChat", {
    robotIndex: props.robotIndex,
    tabIndex: activeTabIndex.value,
  });
};

const activeTabIndex = ref(0);
watch(
    () => activeTabIndex.value,
    () => {
      scrollToBottom();
    }
);

const addTabDialogRefs = ref(null);
const confirmRemoveTab = (targetKey) => {
  removeTab(targetKey);
};

const addTab = () => {
  addTabDialogRefs.value.show();
}

const removeTab = (targetKey) => {
  if (activeTabIndex.value === targetKey) {
    // 切换tab
    if (targetKey === chatTabNameList.value.length - 1) {
      activeTabIndex.value = targetKey - 1;
    } else {
      activeTabIndex.value = targetKey;
    }
  }
  store.commit("removeChatTab", {
    robotIndex: props.robotIndex,
    tabIndex: targetKey
  });
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
};

defineExpose({
  getTabIndex,
  scrollToBottom,
});
</script>

<template>
  <div class="overflow-hidden overflow-y-auto">
    <c-tabs v-model:activeKey="activeTabIndex" :tabNames="chatTabNameList" @addTabClick="addTab">
      <c-tab-pane v-for="(number, index) in chatTabNameList.length" :key="index">
        <chat-msg-list-block ref="chatMsgListBlockRefs" :robotIndex="props.robotIndex" :tabIndex="index"/>
      </c-tab-pane>
    </c-tabs>
    <AddTabDialog ref="addTabDialogRefs" :robotIndex="props.robotIndex"/>
  </div>
</template>
