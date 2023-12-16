<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";

const showDialog = ref(false);
const contextMaxMessage = ref(2);
const show = (value: number | string | null) => {
  showDialog.value = true;
  if (typeof value !== "number") return;
  contextMaxMessage.value = value;
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
  instance?.emit("saveOption", "contextMaxMessage", contextMaxMessage.value);
};

const description = "If the number of tokens in a message exceeds the maximum number of tokens configured for the current request, " +
    "the number of messages sent will be appropriately reduced until it conforms to the limit set by the maximum tokens configuration.";
</script>

<template>
  <CDialog
      v-model:visible="showDialog"
      title="Context Max Messages"
      :description="description"
      @ok="save"
  >
    <el-slider
        class="px-2"
        v-model="contextMaxMessage"
        :min="0"
        :max="20"
        :step="1"
        show-input
        size="small"
    />
  </CDialog>
</template>
