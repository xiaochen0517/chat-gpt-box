<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";
import {ModelList} from "@/utils/ModelList.ts";

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

const model = ref("");
onMounted(() => {
  model.value = configStore.baseConfig.model;
})

const instance = getCurrentInstance();
const save = () => {
  if (model.value.length === 0) {
    ElMessage.error("Model can not be empty!");
    return;
  }
  instance?.emit("commit", "model", model.value);
}
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Default Model" @ok="save">
    <el-select v-model="model" placeholder="Please select a model" width="100%">
      <el-option v-for="item in ModelList" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </CDialog>
</template>
