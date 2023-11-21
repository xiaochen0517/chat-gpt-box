<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useStore} from "@/store/store.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
}
defineExpose({
  show
})

const store = useStore();

const apiUrl = ref("");
onMounted(() => {
  apiUrl.value = store.config.base.apiUrl;
})

const save = () => {
  if (apiUrl.value.length === 0) {
    ElMessage.error("Api key can not be empty!");
    return;
  }
  store.setApiUrl(apiUrl.value);
  showDialog.value = false;
}
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Api Url" @ok="save">
    <el-input v-model="apiUrl" placeholder="Please input Api url. eg: https://api.openai.com/"/>
  </CDialog>
</template>
