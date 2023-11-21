<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useStore} from "@/store/store.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
}
defineExpose({
  show
})

const store = useStore();

const contextMaxMessage = ref(2);
onMounted(() => {
  contextMaxMessage.value = store.config.base.context_max_message;
})

const save = () => {
  store.setContextMaxMessage(contextMaxMessage.value);
  showDialog.value = false;
}

const description = "If the number of tokens in a message exceeds the maximum number of tokens configured for the current request, " +
    "the number of messages sent will be appropriately reduced until it conforms to the limit set by the maximum tokens configuration."
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Context Max Messages" :description="description" @ok="save">
    <el-slider class="px-2" v-model="contextMaxMessage" :min="0" :max="20" :step="1" show-input size="small"/>
  </CDialog>
</template>
