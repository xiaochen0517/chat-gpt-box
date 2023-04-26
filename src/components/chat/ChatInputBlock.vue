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

const enterSend = computed(() => store.state.config.enterSend);
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
  <div class="chat-input-block">
    <textarea ref="chatInputTextAreaRefs" class="chat-input" v-model="chatInputContent"
              @keydown.enter.prevent.exact="enterKeyDown" @keydown.shift.enter.prevent.exact="shiftEnterKeyDown"/>
    <send-outlined class="send-icon" @click.stop="commitContent"/>
  </div>
</template>

<style lang="less" scoped>
.chat-input-block {
  position: relative;
  padding: 10px 40px;
  border-top: 1px solid #e8e8e8;
  background-color: white;

  .chat-input {
    padding: 5px;
    padding-right: 30px;
    width: 100%;
    height: 100px;
    border: 1px solid #e8e8e8;
    resize: none;
    border-radius: 5px;

    &:focus {
      outline: none;
      border: 1px solid #d7d7d7;
    }
  }

  .send-icon {
    font-size: 16px;
    color: #00000030;
    cursor: pointer;
    position: absolute;
    right: 50px;
    top: 50%-8px;

    &:hover {
      color: #00000070;
    }
  }
}
</style>
