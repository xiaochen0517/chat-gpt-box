<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";

const showDialog = ref(false);
const responseMaxTokens = ref(0);
const show = (value: number | string | null) => {
  if (typeof value !== "number") return;
  responseMaxTokens.value = value;
  showDialog.value = true;
}
const hide = () => {
  showDialog.value = false;
}
defineExpose({
  show,
  hide
})

const instance = getCurrentInstance();
const save = () => {
  instance?.emit("commit", "response_max_tokens", responseMaxTokens.value);
}
</script>

<template>
  <CDialog
      v-model:visible="showDialog"
      title="Response Max Tokens"
      description="When the value is 0, the number of tokens returned is automatic."
      @ok="save">
    <el-slider class="px-2" v-model="responseMaxTokens" :min="0" :max="4000" :step="1" show-input size="small"/>
  </CDialog>
</template>
