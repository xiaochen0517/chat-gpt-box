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

const contextMaxMessage = ref(2);
onMounted(() => {
  contextMaxMessage.value = configStore.baseConfig.context_max_message;
})

const instance = getCurrentInstance();
const save = () => {
  instance?.emit("ok", "context_max_message", contextMaxMessage.value);
}

const description = "If the number of tokens in a message exceeds the maximum number of tokens configured for the current request, " +
    "the number of messages sent will be appropriately reduced until it conforms to the limit set by the maximum tokens configuration."
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Context Max Messages" :description="description" @ok="save">
    <el-slider class="px-2" v-model="contextMaxMessage" :min="0" :max="20" :step="1" show-input size="small"/>
  </CDialog>
</template>
