<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const chatPrompt = ref("");
const show = (value: number | string | null) => {
  showDialog.value = true;
  if (typeof value !== "string") return;
  chatPrompt.value = value;
};
const hide = () => {
  showDialog.value = false;
};
defineExpose({
  show,
  hide
});

const instance = getCurrentInstance();
const save = () => {
  if (chatPrompt.value.length === 0) {
    ElMessage.error("Chat prompt can not be empty!");
    return;
  }
  instance?.emit("save", "prompt", chatPrompt.value);
};
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Chat Prompt" @ok="save">
    <el-input v-model="chatPrompt" placeholder="Please input chat prompt."/>
  </CDialog>
</template>
