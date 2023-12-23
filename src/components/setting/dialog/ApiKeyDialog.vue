<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
};
const hide = () => {
  showDialog.value = false;
};
defineExpose({
  show,
  hide
});

const configStore = useConfigStore();

const apiKey = ref("");
onMounted(() => {
  apiKey.value = configStore.defaultChatConfig.openAi.base.apiKey;
});

const instance = getCurrentInstance();
const save = () => {
  if (apiKey.value.length === 0) {
    ElMessage.error("Api key can not be empty!");
    return;
  }
  instance?.emit("saveOption", "apiKey", apiKey.value);
};
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Api Key" @ok="save">
    <el-input v-model="apiKey" placeholder="Please input Api key. eg: sk-xxx"/>
  </CDialog>
</template>
