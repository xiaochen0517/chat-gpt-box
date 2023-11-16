<script setup lang="ts">
import {SendOutlined} from "@ant-design/icons-vue";
import {computed, getCurrentInstance, ref} from "vue";
import {useStore} from "vuex";
import {useMagicKeys, whenever} from "@vueuse/core";
import {ComponentInternalInstance} from "@vue/runtime-core";

const store = useStore();
const keys = useMagicKeys();
const shortcut = computed(() => store.state.config.shortcut);
const focusInputKey = keys[shortcut.value.focusInput];
whenever(focusInputKey, () => {
  focusInput();
});
const chatInputTextAreaRefs = ref<InstanceType<typeof HTMLTextAreaElement> | null>(null);
const focusInput = () => {
  if (!chatInputTextAreaRefs.value) return;
  chatInputTextAreaRefs.value.focus();
};

const instance: ComponentInternalInstance | null = getCurrentInstance();
const chatInputContent = ref("");
const commitContent = () => {
  if (!instance) return;
  if (chatInputContent.value.length <= 0 || /^\s*$/.test(chatInputContent.value)) return;
  instance.emit("commit", chatInputContent.value);
  chatInputContent.value = "";
};

const breakLine = () => {
  chatInputContent.value += "\n";
};

const enterSend = computed(() => store.state.config.base.enterSend);
const ctrlEnterSend = computed(() => store.state.config.base.ctrlEnterSend);
const enterKeyDown = () => {
  if (enterSend.value) {
    commitContent();
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
    commitContent();
  }
};
const ctrlEnterKeyDown = () => {
  if (!ctrlEnterSend.value) {
    return;
  }
  if (enterSend.value) {
    breakLine();
  } else {
    commitContent();
  }
};

</script>

<template>
  <div class="px-2 py-4 flex flex-row">
    <textarea
        ref="chatInputTextAreaRefs"
        class="flex-1 h-full m-0 p-2 inline-block bg-gray-100 dark:bg-slate-900 rounded-md box-border border-2 border-gray-300 focus:border-slate-400 dark:border-slate-600 dark:focus:border-slate-400 resize-none"
        v-model="chatInputContent"
        placeholder="Please input message"
        @keydown.enter.prevent.exact="enterKeyDown"
        @keydown.shift.enter.prevent.exact="shiftEnterKeyDown"
        @keydown.ctrl.enter.prevent.exact="ctrlEnterKeyDown"
        rows="3"/>
    <div
        @click.stop="commitContent"
        class="w-16 h-full rounded-md flex justify-center items-center ml-2 cursor-pointer hover:bg-slate-200 active:bg-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-800 border-2 border-slate-200 hover:border-slate-300 active:border-slate-400 dark:border-slate-600">
      <send-outlined/>
    </div>
  </div>
</template>
