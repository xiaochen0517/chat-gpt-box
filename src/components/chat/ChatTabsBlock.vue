<script setup>
import {nextTick, onMounted, onUnmounted, ref, computed, watch} from "vue";
import ChatMsgListBlock from "./ChatMsgListBlock.vue";
import {useStore} from "vuex";
import AddTabDialog from "../dialog/AddTabDialog.vue";
import {Modal} from "ant-design-vue";
import {useMagicKeys, whenever} from "@vueuse/core";

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
  if (targetIndex < chatTabsSize.value) {
    activeTabIndex.value = targetIndex;
  }
});
const cleanTabChatKey = keys[shortcut.value.cleanTabChat];
whenever(cleanTabChatKey, () => {
  cleanTabChat();
});
const cleanTabChat = () => {
  Modal.confirm({
    title: "Clean chat history",
    content: "Are you sure to clean chat history?",
    onOk: () => {
      store.commit("cleanTabChat", {
        robotIndex: props.robotIndex,
        tabIndex: activeTabIndex.value,
      });
    },
  });
};

const activeTabIndex = ref(0);
watch(
  () => activeTabIndex.value,
  (newVal, oldVal) => {
    scrollToBottom();
  }
);
const chatTabsSize = computed(() => store.state.chatHistory[props.robotIndex].length);
const addTabDialogRefs = ref(null);
const chatTabsEdit = (targetKey, action) => {
  if (action === "remove") {
    confirmRemoveTab(targetKey);
  } else if (action === "add") {
    addTabDialogRefs.value.show();
  }
};
const confirmRemoveTab = (targetKey) => {
  Modal.confirm({
    title: "Confirm",
    content: "Are you sure to remove this tab?",
    onOk: () => {
      removeTab(targetKey);
    },
    onCancel: () => {
    },
  });
};
const removeTab = (targetKey) => {
  if (activeTabIndex.value == targetKey) {
    // 切换tab
    if (targetKey == chatTabsSize.value - 1) {
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
  nextTick(() => {
    let refs = chatMsgListBlockRefs.value[activeTabIndex.value];
    if (refs != undefined) {
      refs.scrollToBottom();
    }
  });
};

defineExpose({
  getTabIndex,
  scrollToBottom,
});
</script>

<template>
  <div class="chat-tabs-block">
    <a-tabs class="chat-scroll-content" type="editable-card" v-model:activeKey="activeTabIndex" @edit="chatTabsEdit"
            size="small" tabPosition="top">
      <a-tab-pane v-for="(item, index) in chatTabsSize" :key="index" :tab="chatTabNameList[index]"
                  :forceRender="true">
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

<style lang="less">
.ant-tabs-nav-wrap{
  background-color: @primary-bg-color !important;
}

.ant-tabs-tab {
  border: 1px solid @border-color !important;
  background-color: @primary-bg-color !important;
}

.ant-tabs-nav-add{
  border: 1px solid @border-color !important;
  background-color: @primary-bg-color !important;
}
</style>
