<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";

const showDialog = ref(false);
const show = () => {
  showDialog.value = true;
}
defineExpose({
  show
})

const configStore = useConfigStore();

const contextMaxTokens = ref(2000);
onMounted(() => {
  contextMaxTokens.value = configStore.baseConfig.context_max_tokens;
})

const save = () => {
  configStore.setContextMaxTokens(contextMaxTokens.value);
  showDialog.value = false;
}
const description = "The request for tokens is limited by the set number of request messages. " +
    "Calculate whether the tokens for the specified number of messages exceed this value. If they do, " +
    "reduce the number of request messages until it falls below this limit."
</script>

<template>
  <CDialog
      v-model:visible="showDialog" title="Context Max Tokens" :description="description" @ok="save">
    <el-slider class="px-1" v-model="contextMaxTokens" :min="0" :max="4000" :step="1" show-input size="small"/>
  </CDialog>
</template>
