<script setup lang="ts">
import {getCurrentInstance, onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";

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

const temperature = ref(0.7);
onMounted(() => {
  temperature.value = configStore.baseConfig.temperature;
})

const instance = getCurrentInstance();
const save = () => {
  instance?.emit("ok", "temperature", temperature.value);
}

const description = "The lower this value, the more rigorous the output will be; " +
    "the higher the value, the more random the output will be. " +
    "Too low or too high can both affect the quality of what's generated, generally maintaining it at 0.7 is sufficient."
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Temperature" :description="description" @ok="save">
    <el-slider v-model="temperature" :min="0" :max="1" :step="0.1" show-input/>
  </CDialog>
</template>
