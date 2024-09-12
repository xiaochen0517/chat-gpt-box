<script setup lang="ts">
import {computed, defineAsyncComponent, getCurrentInstance, nextTick, onMounted, ref, watch} from "vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {ElMessage} from "element-plus";
import {createRequest} from "@/utils/RequestUtil.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {ChatInfo} from "@/types/chat/ChatInfo.ts";
import {ChatTabInfo} from "@/types/chat/ChatTabInfo.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";

const SendOutlined = defineAsyncComponent(() => import("@ant-design/icons-vue/SendOutlined"));

type Props = {
  chatId: string | null,
  tabIndex: number
}
const props = withDefaults(defineProps<Props>(), {
  chatId: null,
  tabIndex: 0,
});

const configStore = useConfigStore();
const keys = useMagicKeys();
const shortcutStringConfig = computed(() => configStore.shortcutStringConfig);
const focusInputKey = keys[shortcutStringConfig.value.focusInput];
whenever(focusInputKey, () => {
  focusInput();
});
const chatInputTextAreaRefs = ref<InstanceType<typeof HTMLTextAreaElement> | null>(null);
const focusInput = () => {
  if (!chatInputTextAreaRefs.value) return;
  chatInputTextAreaRefs.value.focus();
};

const instance = getCurrentInstance();
const chatInputContent = ref("");

const chatListStore = useChatListStore();
const chatInfo = ref<ChatInfo | null>(null);
watch(() => props.chatId,
    (newChatId) => {
      chatInfo.value = chatListStore.getChatInfo(newChatId ?? "");
    },
    {immediate: true},
);

const chatTabsStore = useChatTabsStore();
const tabInfo = computed<ChatTabInfo>(() => {
  if (!chatInfo.value) return {generating: false} as ChatTabInfo;
  let chatTabList = chatTabsStore.chatTabs[chatInfo.value.id];
  if (!chatTabList) return {generating: false} as ChatTabInfo;
  return chatTabList[props.tabIndex];
});
const submitContent = () => {
  if (!instance || !chatInfo.value) return;
  if (tabInfo.value.generating) {
    tabInfo.value.request?.cancel();
    return;
  }
  if (chatInputContent.value.length <= 0 || /^\s*$/.test(chatInputContent.value)) return;
  sendMessage(chatInputContent.value.trim());
  chatInputContent.value = "";
};

const sendMessage = (message: string) => {
  if (!tabInfo.value.request) {
    if (!chatInfo.value) return;
    try {
      tabInfo.value.request = createRequest(chatInfo.value, props.tabIndex, messageRefresh);
    } catch (error) {
      ElMessage.error("Failed to create request: " + error);
      return;
    }
  }
  tabInfo.value.request.sendMessage(message)
      .catch((error: Error) => {
        ElMessage.error("Failed to send message: " + error);
      });
};

const messageRefresh = () => {
  setTimeout(() => {
    nextTick(() => {
      if (!instance) return;
      instance.emit("refresh", chatInputContent.value);
    });
  }, 100);
};

const enterSend = computed(() => configStore.baseConfig.enterSend);
const ctrlEnterSend = computed(() => configStore.baseConfig.ctrlEnterSend);
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    if (event.shiftKey) {
      // shift + enter
      shiftEnterKeyDown(event);
    } else if (event.ctrlKey) {
      // ctrl + enter
      ctrlEnterKeyDown(event);
    } else {
      // enter
      enterKeyDown(event);
    }
  }
};
const enterKeyDown = (event: KeyboardEvent) => {
  if (enterSend.value) {
    event.preventDefault();
    if (tabInfo.value.generating) {
      ElMessage.warning("The conversation is being generated, please try again later.");
      return;
    }
    submitContent();
  }
};
const shiftEnterKeyDown = (event: KeyboardEvent) => {
  if (ctrlEnterSend.value) {
    return;
  }
  if (!enterSend.value) {
    event.preventDefault();
    if (tabInfo.value.generating) {
      ElMessage.warning("The conversation is being generated, please try again later.");
      return;
    }
    submitContent();
  }
};
const ctrlEnterKeyDown = (event: KeyboardEvent) => {
  if (!ctrlEnterSend.value) {
    return;
  }
  if (!enterSend.value) {
    event.preventDefault();
    if (tabInfo.value.generating) {
      ElMessage.warning("The conversation is being generated, please try again later.");
      return;
    }
    submitContent();
  }
};

const regenerating = () => {
  // get last user message
  if (!chatInfo.value) return;
  let chatTabInfo = chatTabsStore.getChatTabInfo(chatInfo.value.id, props.tabIndex);
  if (!chatTabInfo) return;
  let lastUserMessage = chatTabInfo.chat[chatTabInfo.chat.length - 2];
  if (!lastUserMessage) return;
  // delete last user and assistant message
  chatTabsStore.chatTabs[chatInfo.value.id][props.tabIndex].chat.splice(-2, 2);
  // send last user message
  sendMessage(lastUserMessage.content);
};
defineExpose({
  regenerating,
});

const resizeableDivRefs = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const divHeight = ref(80); // Initial height
const appStateStore = useAppStateStore();
onMounted(() => {
  if (appStateStore.inputHeight && appStateStore.inputHeight >= 80) {
    divHeight.value = appStateStore.inputHeight;
  }
});
let defaultCursorY: number;
let maxDivHeight: number;
let minDivHeight = 85;
const initResize = (event: MouseEvent | TouchEvent) => {
  // 当鼠标按下时，开始监听鼠标移动和鼠标松开事件
  event.preventDefault();
  defaultCursorY = ("touches" in event) ? event.touches[0].clientY : event.clientY;
  maxDivHeight = Math.floor(window.innerHeight * 0.7);
  window.addEventListener("mousemove", startResizing);
  window.addEventListener("mouseup", stopResizing);
  window.addEventListener("touchmove", startResizing);
  window.addEventListener("touchend", stopResizing);
};

const startResizing = (event: MouseEvent | TouchEvent) => {
  // Gets the distance the cursor moves on the y-axis, as well as the direction
  const clientY = ("touches" in event) ? event.touches[0].clientY : event.clientY;
  const distance = clientY - defaultCursorY;
  // Update the height of the div
  if (divHeight.value <= minDivHeight && distance > 0) return;
  if (divHeight.value >= maxDivHeight && distance < 0) return;
  divHeight.value = divHeight.value - distance;
  defaultCursorY = clientY;
};

const stopResizing = () => {
  // Remove event listeners
  window.removeEventListener("mousemove", startResizing);
  window.removeEventListener("mouseup", stopResizing);
  window.removeEventListener("touchmove", startResizing);
  window.removeEventListener("touchend", stopResizing);
  // Save the height of the div
  if (appStateStore.inputHeight !== divHeight.value) {
    appStateStore.inputHeight = divHeight.value;
  }
};
</script>

<template>
  <div ref="resizeableDivRefs" class="pb-4" :style="{ height: divHeight + 'px' }">
    <div
        class="w-full h-3 text-[1rem] leading-[0.8rem] text-center cursor-ns-resize"
        @mousedown="initResize"
        @touchstart="initResize"
    >
      <i class="iconfont icon-more"/>
    </div>
    <div class="w-full h-full py-2 flex flex-row relative">
      <textarea
          ref="chatInputTextAreaRefs"
          class="flex-1 w-full h-full m-0 py-3 pl-3 pr-14 block rounded-2xl box-border resize-none border border-neutral-300 focus-visible:ring-neutral-300 dark:border-neutral-700 focus-visible:ring-2 dark:focus-visible:ring-neutral-600"
          v-model="chatInputContent"
          :placeholder="$t('chat.input.placeholder')"
          @keydown="handleKeydown"
      />
      <div
          class="w-10 h-10 rounded-xl absolute right-3 bottom-5 flex flex-row justify-center items-center text-sm text-neutral-50 cursor-pointer border-2 bg-cyan-500 border-transparent hover:border-neutral-300 active:bg-cyan-600 dark:bg-cyan-700 dark:border-neutral-800 dark:hover:border-neutral-700 dark:active:bg-cyan-600"
          title="Send message"
          @click.stop="submitContent"
      >
        <i class="iconfont icon-stop-fill text-xl" v-if="tabInfo.generating"/>
        <send-outlined v-else/>
      </div>
    </div>
  </div>
</template>
