<script setup lang="ts">
import {computed, defineAsyncComponent, getCurrentInstance, ref, Ref} from "vue";
import {useStore} from "@/store/store.ts";
import {useMagicKeys, whenever} from "@vueuse/core";
import {ElMessage} from "element-plus";
import {RequestUtil} from "@/util/RequestUtil.ts";
import {RobotTabChatInfo} from "@/types/State.ts";

const SendOutlined = defineAsyncComponent(() => import("@ant-design/icons-vue/SendOutlined"));

const props = defineProps({
  robotIndex: {
    type: Number,
    default: 0
  },
  tabIndex: {
    type: Number,
    default: 0
  }
});

const store = useStore();
const keys = useMagicKeys();
const shortcut = computed(() => store.config.shortcut);
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

const isGenerating: Ref<boolean> = computed(() => store.chatHistory[props.robotIndex][props.tabIndex].generating);
const tabChatsInfo: Ref<RobotTabChatInfo> = computed(() => store.chatHistory[props.robotIndex][props.tabIndex]);
const submitContent = () => {
  if (!instance) return;
  if (isGenerating.value) {
    tabChatsInfo.value.request?.cancel();
    return;
  }
  if (chatInputContent.value.length <= 0 || /^\s*$/.test(chatInputContent.value)) return;
  tabChatsInfo.value.request = new RequestUtil();
  tabChatsInfo.value.request.sendRequest({
    robotIndex: props.robotIndex,
    tabIndex: props.tabIndex,
    content: chatInputContent.value.trim(),
  }, () => {
    instance.emit("refresh", chatInputContent.value);
  });
  chatInputContent.value = "";
};

const breakLine = () => {
  chatInputContent.value += "\n";
};

const enterSend = computed(() => store.config.base.enterSend);
const ctrlEnterSend = computed(() => store.config.base.ctrlEnterSend);
const enterKeyDown = () => {
  if (enterSend.value) {
    if (isGenerating.value) {
      ElMessage.warning("对话正在生成中，请稍后再试");
      return;
    }
    submitContent();
  } else {
    breakLine();
  }
};
const shiftEnterKeyDown = () => {
  if (ctrlEnterSend.value) {
    return;
  }
  if (enterSend.value) {
    breakLine();
  } else {
    if (isGenerating.value) {
      ElMessage.warning("对话正在生成中，请稍后再试");
      return;
    }
    submitContent();
  }
};
const ctrlEnterKeyDown = () => {
  if (!ctrlEnterSend.value) {
    return;
  }
  if (enterSend.value) {
    breakLine();
  } else {
    if (isGenerating.value) {
      ElMessage.warning("对话正在生成中，请稍后再试");
      return;
    }
    submitContent();
  }
};

</script>

<template>
  <div class="px-2 py-4 flex flex-row">
    <textarea
        ref="chatInputTextAreaRefs"
        class="flex-1 h-full m-0 p-2 inline-block rounded-md bg-neutral-100 box-border border-2 border-neutral-300 focus:border-neutral-400 dark:bg-neutral-800 dark:border-neutral-600 dark:focus:border-neutral-400 resize-none"
        v-model="chatInputContent"
        placeholder="Please input message"
        @keydown.enter.prevent.exact="enterKeyDown"
        @keydown.shift.enter.prevent.exact="shiftEnterKeyDown"
        @keydown.ctrl.enter.prevent.exact="ctrlEnterKeyDown"
        rows="3"/>
    <div
        @click.stop="submitContent"
        class="w-16 h-full rounded-md flex justify-center items-center ml-2 text-sm cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 border-2 border-neutral-200 hover:border-neutral-300 active:border-neutral-400 dark:border-neutral-600">
      <i class="iconfont icon-stop-fill text-xl" v-if="isGenerating"/>
      <send-outlined v-else/>
    </div>
  </div>
</template>
