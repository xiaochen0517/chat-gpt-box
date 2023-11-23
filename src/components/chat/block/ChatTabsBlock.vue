<script setup lang="ts">
import {computed, getCurrentInstance, nextTick, ref, watch} from "vue";
import ChatMsgListBlock from "./ChatMsgListBlock.vue";
import AddTabDialog from "../dialog/AddTabDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import CTabs from "@/components/base/tab/CTabs.vue";
import CTabPane from "@/components/base/tab/CTabPane.vue";
import {ElMessageBox} from "element-plus";
import SlideSideBarBlock from "@/components/sidebar/SlideSideBarBlock.vue";
import {ChatInfo, ChatOptions, ChatTabInfo} from "@/types/Store.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";

/**
 * register shortcut
 */
const configStore = useConfigStore();
const shortcut = computed(() => configStore.shortcut);
const keys = useMagicKeys();
const addTabKey = keys[shortcut.value.addTab];
const addTabDialogRefs = ref<InstanceType<typeof AddTabDialog> | null>(null);
whenever(addTabKey, () => {
  if (!addTabDialogRefs.value) return;
  addTabDialogRefs.value.show(chatTabNameList.value.length + 1);
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

const activeTabIndex = ref<number>(0);
watch(
    () => activeTabIndex.value,
    () => {
      scrollToBottom();
      if (!instance) return;
      instance.emit('update:tabIndex', activeTabIndex.value)
    }
);
const confirmRemoveTab = (targetKey: number) => {
  removeTab(targetKey);
};

const addTab = () => {
  if (!addTabDialogRefs.value) return;
  let tabsSize = chatTabNameList.value.length;
  addTabDialogRefs.value.show(tabsSize + 1);
}

const removeTab = (targetKey: number) => {
  if (activeTabIndex.value === targetKey) {
    // switch tab
    if (targetKey === chatTabNameList.value.length - 1) {
      activeTabIndex.value = targetKey - 1;
    } else {
      activeTabIndex.value = targetKey;
    }
  }
  // remove tab
  if (!propsActiveChat.value) return;
  chatTabsStore.removeChatTab(propsActiveChat.value.id, targetKey);
};

const chatTabNameList = computed(() => {
  if (!propsActiveChat.value) return [];
  return chatTabsStore.chatTabs[propsActiveChat.value.id]
      .map((item: ChatTabInfo) => item.name);
});
const robotOptions = computed((): ChatOptions => {
  if (!propsActiveChat.value) return {
    enabled: false,
    apiUrl: '',
    model: '',
    temperature: 0,
    context_max_message: 0,
    context_max_tokens: 0,
    response_max_tokens: 0,
  };
  return propsActiveChat.value.options
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

const slideSideBarBlockRefs = ref<InstanceType<typeof SlideSideBarBlock> | null>(null);
const showSlideSideBar = () => {
  if (!slideSideBarBlockRefs.value) return;
  slideSideBarBlockRefs.value.show();
};

const instance = getCurrentInstance();
const changeRobotClick = (index: number, item: ChatInfo) => {
  if (!instance) return;
  instance.emit('changeRobotClick', index, item);
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
      :class="robotOptions.enabled?'mt-28':'mt-16'">
    <CTabs
        v-model:activeKey="activeTabIndex"
        :tabNames="chatTabNameList"
        :chatOptions="robotOptions"
        @addTabClick="addTab"
        @removeTabClick="removeTabClick"
        @showSlideSideBarClick="showSlideSideBar">
      <CTabPane v-for="(_number, index) in chatTabNameList.length" :key="index">
        <ChatMsgListBlock :chatInfo="propsActiveChat" :tabIndex="index"/>
      </CTabPane>
    </CTabs>
    <AddTabDialog ref="addTabDialogRefs" :chat-id="props.activeChat?.id"/>
    <SlideSideBarBlock ref="slideSideBarBlockRefs" @onClick="changeRobotClick"/>
  </div>
</template>
