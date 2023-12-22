<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {ElMessage} from "element-plus";
import {GeminiSettingsDialogUtil} from "@/utils/settings/GeminiSettingsDialogUtil.ts";

const configStore = useConfigStore();
const settingsDialogRefs = ref<InstanceType<typeof CSettingsDialog> | null>(null);
const openModelDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showGeminiModelDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.google.gemini.model)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Model can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.google.gemini.model = value;
        settingsDialogRefs.value.hide();
      });
};
const openMaxOutputTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showMaxOutputTokensDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.google.gemini.maxOutputTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Max output tokens can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.google.gemini.maxOutputTokens = value;
        settingsDialogRefs.value.hide();
      });
};
const openTemperatureDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showTemperatureDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.google.gemini.temperature)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0 || value > 1) {
          ElMessage.warning("Temperature can not be empty or less than 0 or greater than 1");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.google.gemini.temperature = value;
        settingsDialogRefs.value.hide();
      });
};
const openContextMaxMsgsDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showContextMaxMessagesDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.google.gemini.contextMaxMessage)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Context max message can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.google.gemini.contextMaxMessage = value;
        settingsDialogRefs.value.hide();
      });
};
const openContextMaxTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showContextMaxTokensDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.google.gemini.contextMaxTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Context max tokens can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.google.gemini.contextMaxTokens = value;
        settingsDialogRefs.value.hide();
      });
};
const openTopKDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showTopKDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.google.gemini.topK ?? 1)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Top K can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.google.gemini.topK = value;
        settingsDialogRefs.value.hide();
      });
};
const openTopPDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showTopPDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.google.gemini.topP ?? 1)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0 || value > 1) {
          ElMessage.warning("Top P can not be empty or less than 0 or greater than 1");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.google.gemini.topP = value;
        settingsDialogRefs.value.hide();
      });
};
</script>

<template>
  <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
    <CListItem content="Default model" left-icon="icon-connections" @click="openModelDialog"/>
    <CListItem content="Max output tokens" left-icon="icon-hot-for-ux" @click="openMaxOutputTokensDialog"/>
    <CListItem content="Temperature" left-icon="icon-file-text" @click="openTemperatureDialog"/>
    <CListItem content="Top K" left-icon="icon-translate" @click="openTopKDialog"/>
    <CListItem content="Top P" left-icon="icon-translate" @click="openTopPDialog"/>
    <CListItem content="Context max messages" left-icon="icon-file-text" @click="openContextMaxMsgsDialog"/>
    <CListItem
        content="Context max tokens"
        left-icon="icon-translate"
        @click="openContextMaxTokensDialog"
        :bottom-border="false"
    />
    <CSettingsDialog ref="settingsDialogRefs"/>
  </div>
</template>