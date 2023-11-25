<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const chatName = ref("");
const show = (value: number | string | null) => {
  showDialog.value = true;
  if (typeof value !== "string") return;
  chatName.value = value;
}
const hide = () => {
  showDialog.value = false;
}
defineExpose({
  show,
  hide
})

const instance = getCurrentInstance();
const save = () => {
  if (chatName.value.length === 0) {
    ElMessage.error("Chat name can not be empty!");
    return;
  }
  instance?.emit("save", "name", chatName.value);
}
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Chat Name" @ok="save">
    <el-input v-model="chatName" placeholder="Please input chat name."/>
  </CDialog>
</template>
