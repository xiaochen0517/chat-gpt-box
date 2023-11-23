<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";
import modelList from "@/utils/modelList.ts";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
}
defineExpose({
  show
})

const configStore = useConfigStore();

const model = ref("");
onMounted(() => {
  model.value = configStore.baseConfig.model;
})

const save = () => {
  if (model.value.length === 0) {
    ElMessage.error("Model can not be empty!");
    return;
  }
  configStore.setDefaultModel(model.value);
  showDialog.value = false;
}
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Default Model" @ok="save">
    <el-select v-model="model" placeholder="Please select a model" width="100%">
      <el-option v-for="item in modelList" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </CDialog>
</template>
