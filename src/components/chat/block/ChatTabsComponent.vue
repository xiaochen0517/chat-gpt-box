<script setup lang="ts">
import {computed, getCurrentInstance, nextTick, onMounted, ref, watch} from "vue";
import ChatMessagesListComponent from "./ChatMessagesListComponent.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import CTabs from "@/components/base/tab/CTabs.vue";
import CTabPane from "@/components/base/tab/CTabPane.vue";
import {ElMessage} from "element-plus";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {ChatMessage, ChatTabInfo} from "@/types/chat/ChatTabInfo.ts";
import {FileUtil} from "@/utils/FileUtil.ts";
import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {ChatTabDialogUtil} from "@/utils/dialog/ChatTabDialogUtil.ts";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;

/**
 * register shortcut
 */
const configStore = useConfigStore();
const shortcutStringConfig = computed(() => configStore.shortcutStringConfig);
const keys = useMagicKeys();
const addTabKey = keys[shortcutStringConfig.value.addTab];
whenever(addTabKey, () => {
  openAddTabDialog();
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

const instance = getCurrentInstance();
const propsActiveChat = ref<ChatInfo | null>(props.activeChat);
const activeTabIndex = ref<number>(props.tabIndex);
watch(
    () => props.activeChat,
    (value) => {
      propsActiveChat.value = value;
    },
);
watch(
    () => activeTabIndex.value,
    () => {
      scrollToBottom();
      if (!instance) return;
      instance.emit("update:tabIndex", activeTabIndex.value);
    },
);
watch(
    () => props.tabIndex,
    (value) => {
      activeTabIndex.value = value;
    },
);

const chatTabsStore = useChatTabsStore();
const cleanTabChat = () => {
  if (!propsActiveChat.value) return;
  chatTabsStore.cleanTabChat(propsActiveChat.value.id, activeTabIndex.value);
};
const confirmRemoveTab = (targetIndex: number) => {
  if (!baseDialogRefs.value) return;
  ChatTabDialogUtil.showCloseTabDialog(baseDialogRefs.value, chatTabNameList.value[targetIndex])
      .then(() => {
        removeTab(targetIndex);
        baseDialogRefs.value?.hide();
      })
      .catch(() => {
      });
};
const baseDialogRefs = ref<InstanceType<typeof CBaseDialog> | null>(null);
const openAddTabDialog = () => {
  if (!baseDialogRefs.value) return;
  const currentTabSize = chatTabNameList.value.length + 1;
  const defaultTabName = t("tab.addTab.prefix") + currentTabSize;
  ChatTabDialogUtil.showAddTabDialog(baseDialogRefs.value, defaultTabName, "")
      .then((result: string | number) => {
        result = String(result);
        if (result.length > 20) {
          ElMessage.warning(t("tab.addTab.errorMessages.nameTooLong"));
          return;
        }
        if (!propsActiveChat.value) {
          ElMessage.warning(t("tab.addTab.errorMessages.noActiveChat"));
          return;
        }
        // if the tab name is empty, use the default name
        if (result.length <= 0) {
          result = defaultTabName;
        }
        chatTabsStore.addChatTab(propsActiveChat.value?.id, result);
        if (!baseDialogRefs.value) return;
        baseDialogRefs.value.hide();
      })
      .catch(() => {
      });
};
const removeTab = (targetKey: number) => {
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
  // remove tab, use nextTick to avoid removing a tab without the current tab switching to the previous tab
  nextTick(() => {
    if (!propsActiveChat.value) return;
    chatTabsStore.removeChatTab(propsActiveChat.value.id, targetKey);
  });
};
const chatTabNameList = computed(() => {
  if (!propsActiveChat.value) return [];
  let chatTabList = chatTabsStore.chatTabs[propsActiveChat.value.id];
  if (!chatTabList) return [];
  return chatTabList
      .map((item: ChatTabInfo) => item.name);
});
const removeTabClick = (index: number) => {
  confirmRemoveTab(index);
};

const exportChatInfo = () => {
  if (!propsActiveChat.value) return;
  const chatTabInfo = chatTabsStore.getChatTabInfo(propsActiveChat.value.id, activeTabIndex.value);
  if (!chatTabInfo) {
    ElMessage.warning("No chat history");
    return;
  }
  let chatInfoMarkdown = `# Chat Name: ${propsActiveChat.value.name}\n\n`;
  chatInfoMarkdown += `## Chat Tab: ${chatTabInfo.name}\n\n`;
  chatTabInfo.chat.forEach((item: ChatMessage) => {
    chatInfoMarkdown += `### ${item.role}:\n\n`;
    chatInfoMarkdown += `${item.content}\n\n`;
  });
  FileUtil.startDownLoad(`${propsActiveChat.value.name}_export.md`, chatInfoMarkdown);
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
      class="overflow-hidden box-border"
      @scroll="scrollHandle"
  >
    <div class="content:max-w-content content:m-auto w-full h-full">
      <CTabs
          v-model:activeKey="activeTabIndex"
          :tabNames="chatTabNameList"
          @addTabClick="openAddTabDialog"
          @removeTabClick="removeTabClick"
          @showSlideSideBarClick="$emit('showSlideSideBarClick')"
          @cleanChatClick="cleanTabChat"
          @exportChatClick="exportChatInfo"
          @lockScrollDownClick="scrollToBottom"
      >
        <CTabPane
            ref="scrollContainerRefs"
            class="overflow-hidden overflow-y-auto box-border"
            v-for="(_number, index) in chatTabNameList.length"
            :key="index"
        >
          <ChatMessagesListComponent
              ref="scrollContainerContentRefs"
              class="absolute"
              :chatInfo="propsActiveChat"
              :tabIndex="index"
              @regenerating="$emit('regenerating')"
          />
        </CTabPane>
      </CTabs>
    </div>
    <CBaseDialog ref="baseDialogRefs"/>
  </div>
</template>
