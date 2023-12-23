<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const apiUrl = ref("");
const show = (value: number | string | null) => {
  showDialog.value = true;
  if (typeof value !== "string") return;
  apiUrl.value = value;
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
  if (apiUrl.value.length === 0) {
    ElMessage.error("Api url can not be empty!");
    return;
  }
  instance?.emit("saveOption", "apiUrl", apiUrl.value);
};
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Api Url" @ok="save">
    <el-input v-model="apiUrl" placeholder="Please input Api url. eg: https://api.openai.com/"/>
  </CDialog>
</template>
