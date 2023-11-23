<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
}
defineExpose({
  show
})

const configStore = useConfigStore();

const apiKey = ref("");
onMounted(() => {
  apiKey.value = configStore.baseConfig.apiKey;
})

const save = () => {
  if (apiKey.value.length === 0) {
    ElMessage.error("Api key can not be empty!");
    return;
  }
  configStore.setApiKey(apiKey.value);
  showDialog.value = false;
}
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Api Key" @ok="save">
    <el-input v-model="apiKey" placeholder="Please input Api key. eg: sk-xxx"/>
  </CDialog>
</template>
