<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import {ref} from "vue";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {SettingsUtil} from "@/utils/SettingsUtil.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";

const configStore = useConfigStore();
const settingsDialogRefs = ref<InstanceType<typeof CSettingsDialog> | null>(null);
const openApiUrlDialog = () => {
  if (!settingsDialogRefs.value) return;
  SettingsUtil.showApiDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.chatGpt.apiUrl)
      .then((value: string) => {
        console.log("then", value);
      });
};
const openTemperatureDialog = () => {
  if (!settingsDialogRefs.value) return;
  SettingsUtil.showTemperatureDialog(settingsDialogRefs.value, 0.7)
      .then((value: string) => {
        console.log("then", value);
      });
};
</script>

<template>
  <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
    <CListItem content="Api url" left-icon="icon-discount" @click="openApiUrlDialog"/>
    <CListItem content="Default Model" left-icon="icon-connections" @click=""/>
    <CListItem content="Temperature" left-icon="icon-hot-for-ux" @click="openTemperatureDialog"/>
    <CListItem content="Context max msgs" left-icon="icon-file-text" @click=""/>
    <CListItem content="Context max tokens" left-icon="icon-translate" @click=""/>
    <CListItem content="Response max tokens" left-icon="icon-rollback" :bottom-border="false" @click=""/>
    <CSettingsDialog ref="settingsDialogRefs"/>
  </div>
</template>