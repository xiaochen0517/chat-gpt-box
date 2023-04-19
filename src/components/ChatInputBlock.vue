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
</script>

<template>
  <div class="chat-input-block">
    <a-textarea class="chat-input" v-model:value="chatInputContent" :autoSize="{ minRows: 4, maxRows: 4 }"></a-textarea>
    <send-outlined class="send-icon" @click.stop="commitContent"/>
  </div>
</template>

<style lang="less" scoped>
.chat-input-block {
  position: relative;

  .chat-input {
    padding-right: 30px;
  }

  .send-icon {
    font-size: 16px;
    color: #00000030;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 50%-8px;

    &:hover {
      color: #00000070;
    }
  }
}
</style>
