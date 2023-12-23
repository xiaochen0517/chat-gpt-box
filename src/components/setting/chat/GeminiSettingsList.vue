<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {ElMessage} from "element-plus";
import {GeminiSettingsDialogUtil} from "@/utils/settings/GeminiSettingsDialogUtil.ts";
import {GoogleGeminiConfig} from "@/types/chat/BaseConfig.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import _ from "lodash";

const configStore = useConfigStore();
const chatListStore = useChatListStore();
const settingsDialogRefs = ref<InstanceType<typeof CSettingsDialog> | null>(null);

type Props = {
  noDefault?: boolean,
  chatId?: string | null,
}
const props = withDefaults(defineProps<Props>(), {
  noDefault: false,
  chatId: null,
});
const currentChatGptConfig = ref<GoogleGeminiConfig>({
  model: "",
  maxOutputTokens: 0,
  temperature: 0,
  topK: 0,
  topP: 0,
  contextMaxMessage: 0,
  contextMaxTokens: 0,
});
onMounted(() => {
  if (!props.chatId || props.chatId === "add") {
    currentChatGptConfig.value = _.cloneDeep(configStore.defaultChatConfig.google.gemini);
    return;
  }
  currentChatGptConfig.value = _.cloneDeep(chatListStore.getChatInfo(props.chatId)?.options as GoogleGeminiConfig);
});
const getConfig = (): GoogleGeminiConfig => {
  if (props.noDefault) {
    return currentChatGptConfig.value;
  }
  return configStore.defaultChatConfig.google.gemini;
};
defineExpose({
  getConfig,
});
const setConfig = <K extends keyof GoogleGeminiConfig>(key: K, value: GoogleGeminiConfig[K]) => {
  if (props.noDefault) {
    if (props.chatId) {
      chatListStore.setGeminiChatOptions(props.chatId, key, value);
    }
    currentChatGptConfig.value[key] = value;
  } else {
    configStore.defaultChatConfig.google.gemini[key] = value;
  }
};

const openModelDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showGeminiModelDialog(
      settingsDialogRefs.value,
      getConfig().model)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Model can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("model", value);
        settingsDialogRefs.value.hide();
      });
};
const openMaxOutputTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showMaxOutputTokensDialog(
      settingsDialogRefs.value,
      getConfig().maxOutputTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Max output tokens can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("maxOutputTokens", value);
        settingsDialogRefs.value.hide();
      });
};
const openTemperatureDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showTemperatureDialog(
      settingsDialogRefs.value,
      getConfig().temperature)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0 || value > 1) {
          ElMessage.warning("Temperature can not be empty or less than 0 or greater than 1");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("temperature", value);
        settingsDialogRefs.value.hide();
      });
};
const openContextMaxMsgsDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showContextMaxMessagesDialog(
      settingsDialogRefs.value,
      getConfig().contextMaxMessage)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Context max message can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("contextMaxMessage", value);
        settingsDialogRefs.value.hide();
      });
};
const openContextMaxTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showContextMaxTokensDialog(
      settingsDialogRefs.value,
      getConfig().contextMaxTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Context max tokens can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("contextMaxTokens", value);
        settingsDialogRefs.value.hide();
      });
};
const openTopKDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showTopKDialog(
      settingsDialogRefs.value,
      getConfig().topK ?? 1)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0) {
          ElMessage.warning("Top K can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("topK", value);
        settingsDialogRefs.value.hide();
      });
};
const openTopPDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showTopPDialog(
      settingsDialogRefs.value,
      getConfig().topP ?? 1)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value < 0 || value > 1) {
          ElMessage.warning("Top P can not be empty or less than 0 or greater than 1");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("topP", value);
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