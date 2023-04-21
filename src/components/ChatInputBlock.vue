<script setup>
import {SendOutlined} from "@ant-design/icons-vue";
import {ref, getCurrentInstance} from "vue";

const instance = getCurrentInstance();

const chatInputContent = ref("");
const commitContent = () => {
  if (chatInputContent.value.length <= 0) return;
  instance.emit("commit", chatInputContent.value);
  chatInputContent.value = "";
};

const breakLine = () => {
  chatInputContent.value += "\n";
};

const onKeyEvent = (event) => {
  if (event.shiftKey && event.key === 'Enter') {
    // breakLine();
  } else if (event.key === 'Enter') {
    commitContent();
  }
};
</script>

<template>
  <div class="chat-input-block">
    <a-textarea class="chat-input" v-model:value="chatInputContent" :autoSize="{ minRows: 4, maxRows: 4 }"
                @keydown.enter.capture="commitContent" @keydown.shift.enter.capture="breakLine"/>
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
    padding-right: 30px;
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
