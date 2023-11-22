<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/store/Config.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
}
defineExpose({
  show
})

const configStore = useConfigStore();

const responseMaxTokens = ref(0);
onMounted(() => {
  responseMaxTokens.value = configStore.baseConfig.response_max_tokens;
})

const save = () => {
  configStore.setResponseMaxTokens(responseMaxTokens.value);
  showDialog.value = false;
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
