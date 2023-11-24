<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
}
const hide = () => {
  showDialog.value = false;
}
defineExpose({
  show,
  hide
})

const configStore = useConfigStore();

const apiUrl = ref("");
onMounted(() => {
  apiUrl.value = configStore.baseConfig.apiUrl;
})

const instance = getCurrentInstance();
const save = () => {
  if (apiUrl.value.length === 0) {
    ElMessage.error("Api key can not be empty!");
    return;
  }
  instance?.emit("commit", "apiUrl", apiUrl.value);
}
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Api Url" @ok="save">
    <el-input v-model="apiUrl" placeholder="Please input Api url. eg: https://api.openai.com/"/>
  </CDialog>
</template>
