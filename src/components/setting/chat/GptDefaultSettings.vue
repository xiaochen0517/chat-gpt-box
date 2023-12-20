<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import {ref} from "vue";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";

const settingsDialogRefs = ref<CSettingsDialog | null>(null);
const openApiUrlDialog = () => {
  if (!settingsDialogRefs.value) return;
  settingsDialogRefs.value.show({
    type: "input",
    title: "Api url",
    placeholder: "Please input api url.",
    content: "https://api-inference.huggingface.co/models/"
  }).then((value) => {
    console.log("then", value);
  });
};
</script>

<template>
  <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
    <CListItem content="Api url" left-icon="icon-discount" :bottom-border="false" @click="openApiUrlDialog"/>
    <CSettingsDialog ref="settingsDialogRefs"/>
  </div>
</template>