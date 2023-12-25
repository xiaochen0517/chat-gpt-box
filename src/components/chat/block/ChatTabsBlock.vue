<script setup lang="ts">
import {computed, getCurrentInstance, nextTick, onMounted, ref, watch} from "vue";
import ChatMsgListBlock from "./ChatMsgListBlock.vue";
import AddTabDialog from "../dialog/AddTabDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import CTabs from "@/components/base/tab/CTabs.vue";
import CTabPane from "@/components/base/tab/CTabPane.vue";
import {ElMessageBox} from "element-plus";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {ChatTabInfo} from "@/types/chat/ChatTabInfo.ts";

/**
 * register shortcut
 */
const configStore = useConfigStore();
const shortcutStringConfig = computed(() => configStore.shortcutStringConfig);
const keys = useMagicKeys();
const addTabKey = keys[shortcutStringConfig.value.addTab];
const addTabDialogRefs = ref<InstanceType<typeof AddTabDialog> | null>(null);
whenever(addTabKey, () => {
  if (!addTabDialogRefs.value) return;
  addTabDialogRefs.value.show(chatTabNameList.value.length + 1);
});
const removeTabKey = keys[shortcutStringConfig.value.removeTab];
whenever(removeTabKey, () => {
  confirmRemoveTab(activeTabIndex.value);
});
const prevTabKey = keys[shortcutStringConfig.value.prevTab];
whenever(prevTabKey, () => {
  const targetIndex = activeTabIndex.value - 1;
  if (targetIndex >= 0) {
    activeTabIndex.value = targetIndex;
  }
});
const nextTabKey = keys[shortcutStringConfig.value.nextTab];
whenever(nextTabKey, () => {
  const targetIndex = activeTabIndex.value + 1;
  if (targetIndex < chatTabNameList.value.length) {
    activeTabIndex.value = targetIndex;
  }
});
const cleanTabChatKey = keys[shortcutStringConfig.value.cleanTabChat];
whenever(cleanTabChatKey, () => {
  cleanTabChat();
});

type Props = {
  activeChat: ChatInfo | null,
  tabIndex: number
}
const props = withDefaults(defineProps<Props>(), {
  activeChat: null,
  tabIndex: 0,
});

const propsActiveChat = ref<ChatInfo | null>(props.activeChat);
watch(
    () => props.activeChat,
    (value) => {
      propsActiveChat.value = value;
    },
);

const chatTabsStore = useChatTabsStore();
const cleanTabChat = () => {
  if (!propsActiveChat.value) return;
  chatTabsStore.cleanTabChat(propsActiveChat.value.id, activeTabIndex.value);
};

const instance = getCurrentInstance();
const activeTabIndex = ref<number>(0);
watch(
    () => activeTabIndex.value,
    () => {
      scrollToBottom();
      if (!instance) return;
      instance.emit("update:tabIndex", activeTabIndex.value);
    },
);
const confirmRemoveTab = (targetKey: number) => {
  removeTab(targetKey);
};

const addTab = () => {
  if (!addTabDialogRefs.value) return;
  let tabsSize = chatTabNameList.value.length;
  addTabDialogRefs.value.show(tabsSize + 1);
};

const removeTab = (targetKey: number) => {
  if (!propsActiveChat.value) return;
  // if the tab to be removed is the active tab, switch to the previous tab
  if (activeTabIndex.value === targetKey) {
    // switch tab
    if (targetKey === chatTabNameList.value.length - 1) {
      // if this tab is last tab, don't switch
      if (targetKey !== 0) activeTabIndex.value = targetKey - 1;
    } else {
      activeTabIndex.value = targetKey;
    }
  }
  // remove tab
  chatTabsStore.removeChatTab(propsActiveChat.value.id, targetKey);
};

const chatTabNameList = computed(() => {
  if (!propsActiveChat.value) return [];
  let chatTabList = chatTabsStore.chatTabs[propsActiveChat.value.id];
  if (!chatTabList) return [];
  return chatTabList
      .map((item: ChatTabInfo) => item.name);
});
const removeTabClick = (index: number) => {
  ElMessageBox.confirm("Are you sure to remove this tab?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(() => {
    removeTab(index);
  }).catch(() => {
  });
};

const getTabIndex = () => {
  return activeTabIndex.value;
};

const appStateStore = useAppStateStore();
const scrollContainerRefs = ref<HTMLElement | null>(null);
const scrollToBottom = () => {
  nextTick(() => {
    if (!configStore.baseConfig.forceScrollToBottom && !appStateStore.lockScrollDown) return;
    if (!scrollContainerRefs.value) return;
    scrollContainerRefs.value.scrollTop = scrollContainerRefs.value.scrollHeight;
  });
};
defineExpose({
  getTabIndex,
  scrollToBottom,
});
const containerSize = ref(0);
const scrollContainerContentRefs = ref<HTMLElement | null>(null);
onMounted(() => {
  if (!scrollContainerContentRefs.value) return;
  containerSize.value = scrollContainerContentRefs.value.clientHeight;
});
const scrollHandle = (event: UIEvent) => {
  // get container size
  if (!scrollContainerContentRefs.value) return;
  let currentContainerSize = scrollContainerContentRefs.value.clientHeight;
  // if container size changed, scroll to bottom
  if (currentContainerSize !== containerSize.value) {
    containerSize.value = currentContainerSize;
    scrollToBottom();
    return;
  }
  const element = event.target as HTMLElement;
  const scrollTop = Math.round(element.scrollTop);
  const clientHeight = Math.round(element.clientHeight);
  const scrollHeight = Math.round(element.scrollHeight);
  let isLock = scrollTop + clientHeight >= scrollHeight;
  if (appStateStore.lockScrollDown !== isLock) {
    appStateStore.lockScrollDown = isLock;
  }
};
</script>

<template>
  <div
      ref="scrollContainerRefs"
      class="scroll-container overflow-hidden overflow-y-auto box-border pt-14"
      @scroll="scrollHandle"
  >
    <div ref="scrollContainerContentRefs">
      <CTabs
          v-model:activeKey="activeTabIndex"
          :tabNames="chatTabNameList"
          @addTabClick="addTab"
          @removeTabClick="removeTabClick"
          @showSlideSideBarClick="$emit('showSlideSideBarClick')"
          @lockScrollDownClick="scrollToBottom"
      >
        <CTabPane v-for="(_number, index) in chatTabNameList.length" :key="index">
          <ChatMsgListBlock :chatInfo="propsActiveChat" :tabIndex="index"/>
        </CTabPane>
      </CTabs>
    </div>
    <AddTabDialog ref="addTabDialogRefs" :chat-id="props.activeChat?.id"/>
  </div>
</template>

<style scoped lang="less">
.scroll-container {
  &::-webkit-scrollbar-track {
  @apply mt-14;
  }
}
</style>
