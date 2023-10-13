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
  <div>
    <textarea ref="chatInputTextAreaRefs" class="chat-input" v-model="chatInputContent"
              @keydown.enter.prevent.exact="enterKeyDown" @keydown.shift.enter.prevent.exact="shiftEnterKeyDown"/>
    <send-outlined class="send-icon" @click.stop="commitContent"/>
  </div>
</template>
