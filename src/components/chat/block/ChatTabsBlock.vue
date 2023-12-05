<script setup lang="ts">
import {computed, getCurrentInstance, nextTick, ref, watch} from "vue";
import ChatMsgListBlock from "./ChatMsgListBlock.vue";
import AddTabDialog from "../dialog/AddTabDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import CTabs from "@/components/base/tab/CTabs.vue";
import CTabPane from "@/components/base/tab/CTabPane.vue";
import {ElMessageBox} from "element-plus";
import {ChatInfo, ChatOptions, ChatTabInfo} from "@/types/Store.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";

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
  }
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
  }
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
const robotOptions = computed((): ChatOptions => {
  if (!propsActiveChat.value) return {
    enabled: false,
    apiUrl: "",
    model: "",
    temperature: 0,
    context_max_message: 0,
    context_max_tokens: 0,
    response_max_tokens: 0,
  };
  return propsActiveChat.value.options;
});
const removeTabClick = (index: number) => {
  ElMessageBox.confirm("Are you sure to remove this tab?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(() => {
    removeTab(index);
  }).catch(() => {
  });
};

const getTabIndex = () => {
  return activeTabIndex.value;
};
const scrollContainerRefs = ref();
const scrollToBottom = () => {
  nextTick(() => {
    scrollContainerRefs.value.scrollTop = scrollContainerRefs.value.scrollHeight;
  });
};
defineExpose({
  getTabIndex,
  scrollToBottom,
});
</script>

<template>
  <div
      ref="scrollContainerRefs"
      class="overflow-hidden overflow-y-auto box-border scroll-container"
      :class="robotOptions.enabled?'options-enabled':'options-disabled'"
  >
    <CTabs
        v-model:activeKey="activeTabIndex"
        :tabNames="chatTabNameList"
        :chatOptions="robotOptions"
        @addTabClick="addTab"
        @removeTabClick="removeTabClick"
        @showSlideSideBarClick="$emit('showSlideSideBarClick')"
    >
      <CTabPane v-for="(_number, index) in chatTabNameList.length" :key="index">
        <ChatMsgListBlock :chatInfo="propsActiveChat" :tabIndex="index"/>
      </CTabPane>
    </CTabs>
    <AddTabDialog ref="addTabDialogRefs" :chat-id="props.activeChat?.id"/>
  </div>
</template>

<style scoped lang="less">
.options-enabled {
@apply pt-32;

  &::-webkit-scrollbar-track {
  @apply mt-32;
  }
}

.options-disabled {
@apply pt-20;

  &::-webkit-scrollbar-track {
  @apply mt-20;
  }
}
</style>
