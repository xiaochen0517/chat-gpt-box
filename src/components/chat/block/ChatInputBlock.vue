<script setup lang="ts">
import {computed, defineAsyncComponent, getCurrentInstance, ref, watch} from "vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import {ElMessage} from "element-plus";
import {RequestUtil} from "@/utils/RequestUtil.ts";
import {ChatTabInfo} from "@/types/Store.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";

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
const shortcut = computed(() => configStore.shortcut);
const focusInputKey = keys[shortcut.value.focusInput];
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
const propsChatId = ref(props.chatId);
watch(() => props.chatId,
    (newChatId) => {
      propsChatId.value = newChatId;
    },
    {immediate: true}
);

const chatTabsStore = useChatTabsStore();
const tabInfo = computed<ChatTabInfo>(() => {
  if (!propsChatId.value) return {generating: false} as ChatTabInfo;
  return chatTabsStore.chatTabs[propsChatId.value][props.tabIndex]
});
const submitContent = () => {
  if (!instance) return;
  if (tabInfo.value.generating) {
    tabInfo.value.request?.cancel();
    return;
  }
  if (chatInputContent.value.length <= 0 || /^\s*$/.test(chatInputContent.value)) return;
  if (!props.chatId) return;
  tabInfo.value.request = new RequestUtil();
  tabInfo.value.request.sendRequest({
    chatId: props.chatId,
    tabIndex: props.tabIndex,
    content: chatInputContent.value.trim(),
  }, () => {
    instance.emit("refresh", chatInputContent.value);
  });
  chatInputContent.value = "";
};

const enterSend = computed(() => configStore.baseConfig.enterSend);
const ctrlEnterSend = computed(() => configStore.baseConfig.ctrlEnterSend);
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
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
}
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

const resizeableDivRefs = ref<InstanceType<typeof HTMLDivElement> | null>(null);
const divHeight = ref(200); // 初始高度

let defaultCursorY: number;
let maxDivHeight: number;
let minDivHeight = 100;
const initResize = (event: MouseEvent | TouchEvent) => {
  // 当鼠标按下时，开始监听鼠标移动和鼠标松开事件
  event.preventDefault();
  defaultCursorY = ('touches' in event) ? event.touches[0].clientY : event.clientY;
  maxDivHeight = Math.floor(window.innerHeight * 0.7);
  window.addEventListener('mousemove', startResizing);
  window.addEventListener('mouseup', stopResizing);
  window.addEventListener('touchmove', startResizing);
  window.addEventListener('touchend', stopResizing);
};

const startResizing = (event: MouseEvent | TouchEvent) => {
  // 获取光标在y轴移动的距离，以及方向
  const clientY = ('touches' in event) ? event.touches[0].clientY : event.clientY;
  const distance = clientY - defaultCursorY;
  // 更新 div 的高度
  if (divHeight.value <= minDivHeight && distance > 0) return;
  if (divHeight.value >= maxDivHeight && distance < 0) return;
  divHeight.value = divHeight.value - distance;
  defaultCursorY = clientY;
};

const stopResizing = () => {
  // 移除事件监听
  window.removeEventListener('mousemove', startResizing);
  window.removeEventListener('mouseup', stopResizing);
  window.removeEventListener('touchmove', startResizing);
  window.removeEventListener('touchend', stopResizing);
};
</script>

<template>
  <div ref="resizeableDivRefs" class="pb-4" :style="{ height: divHeight + 'px' }">
    <div
        class="w-full h-3 text-[1rem] leading-[0.8rem] text-center cursor-ns-resize"
        @mousedown="initResize"
        @touchstart="initResize">
      <i class="iconfont icon-more"/>
    </div>
    <div class="w-full h-full flex flex-row relative">
      <textarea
          ref="chatInputTextAreaRefs"
          class="flex-1 w-full h-full m-0 py-2 pl-2 pr-14 block rounded-md bg-neutral-100 box-border border-2 border-neutral-300 focus:border-neutral-400 dark:bg-neutral-800 dark:border-neutral-600 dark:focus:border-neutral-400 resize-none"
          v-model="chatInputContent"
          placeholder="Please input message"
          @keydown="handleKeydown"/>
      <div
          @click.stop="submitContent"
          class="w-10 h-10 rounded-md absolute right-3 top-1/2 transform -translate-y-1/2 flex justify-center items-center ml-2 text-sm cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 border-2 border-neutral-200 hover:border-neutral-300 active:border-neutral-400 dark:border-neutral-600">
        <i class="iconfont icon-stop-fill text-xl" v-if="tabInfo.generating"/>
        <send-outlined v-else/>
      </div>
    </div>
  </div>
</template>
