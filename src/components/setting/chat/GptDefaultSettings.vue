<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import {ref} from "vue";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {ChatGptSettingsDialogUtil} from "@/utils/settings/ChatGptSettingsDialogUtil.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {ElMessage} from "element-plus";

const configStore = useConfigStore();
const settingsDialogRefs = ref<InstanceType<typeof CSettingsDialog> | null>(null);
const openApiUrlDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatGptSettingsDialogUtil.showApiDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.chatGpt.apiUrl)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Api url can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.chatGpt.apiUrl = value;
        settingsDialogRefs.value.hide();
      });
};
const openModelDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatGptSettingsDialogUtil.showChatGptModelDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.chatGpt.model)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Model can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.chatGpt.model = value;
        settingsDialogRefs.value.hide();
      });
};
const openTemperatureDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatGptSettingsDialogUtil.showTemperatureDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.chatGpt.temperature)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Temperature can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.chatGpt.temperature = value;
        settingsDialogRefs.value.hide();
      });
};
const openContextMaxMsgsDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatGptSettingsDialogUtil.showContextMaxMessagesDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.chatGpt.contextMaxMessage)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Context max message can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.chatGpt.contextMaxMessage = value;
        settingsDialogRefs.value.hide();
      });
};
const openContextMaxTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatGptSettingsDialogUtil.showContextMaxTokensDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.chatGpt.contextMaxTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Context max tokens can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.chatGpt.contextMaxTokens = value;
        settingsDialogRefs.value.hide();
      });
};
const openResponseMaxTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  ChatGptSettingsDialogUtil.showResponseMaxTokensDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.chatGpt.responseMaxTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Response max tokens can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.chatGpt.responseMaxTokens = value;
        settingsDialogRefs.value.hide();
      });
};
</script>

<template>
  <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
    <CListItem content="Api url" left-icon="icon-discount" @click="openApiUrlDialog"/>
    <CListItem content="Default Model" left-icon="icon-connections" @click="openModelDialog"/>
    <CListItem content="Temperature" left-icon="icon-hot-for-ux" @click="openTemperatureDialog"/>
    <CListItem content="Context max messages" left-icon="icon-file-text" @click="openContextMaxMsgsDialog"/>
    <CListItem content="Context max tokens" left-icon="icon-translate" @click="openContextMaxTokensDialog"/>
    <CListItem
        content="Response max tokens"
        left-icon="icon-rollback"
        :bottom-border="false"
        @click="openResponseMaxTokensDialog"
    />
    <CSettingsDialog ref="settingsDialogRefs"/>
  </div>
</template>