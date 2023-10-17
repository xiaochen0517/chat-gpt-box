<script setup>
import {SendOutlined} from "@ant-design/icons-vue";
import {ref, getCurrentInstance, computed} from "vue";
import {useStore} from "vuex";
import {useMagicKeys, whenever} from "@vueuse/core";

const store = useStore();
const keys = useMagicKeys();
const shortcut = computed(() => store.state.config.shortcut);
const focusInputKey = keys[shortcut.value.focusInput];
whenever(focusInputKey, () => {
  focusInput();
});
const chatInputTextAreaRefs = ref(null);
const focusInput = () => {
  chatInputTextAreaRefs.value.focus();
};

const instance = getCurrentInstance();
const chatInputContent = ref("");
const commitContent = () => {
  if (chatInputContent.value.length <= 0 || /^\s*$/.test(chatInputContent.value)) return;
  instance.emit("commit", chatInputContent.value);
  chatInputContent.value = "";
};

const breakLine = () => {
  chatInputContent.value += "\n";
};

const enterSend = computed(() => store.state.config.base.enterSend);
const enterKeyDown = () => {
  if (enterSend.value) {
    commitContent();
  } else {
    breakLine();
  }
};
const shiftEnterKeyDown = () => {
  if (enterSend.value) {
    breakLine();
  } else {
    commitContent();
  }
};

</script>

<template>
  <div class="w-full max-w-5xl mx-auto p-2 flex flex-row">
    <textarea ref="chatInputTextAreaRefs" class="flex-1 h-full m-0 p-0 inline-block rounded-md dark:bg-slate-800"
              v-model="chatInputContent"
              @keydown.enter.prevent.exact="enterKeyDown" @keydown.shift.enter.prevent.exact="shiftEnterKeyDown"
              rows="2"></textarea>
    <div @click.stop="commitContent"
         class="w-16 h-full border-2 border-slate-600 rounded-md flex justify-center items-center ml-2 hover:bg-slate-800 cursor-pointer">
      <send-outlined/>
    </div>
  </div>
</template>
