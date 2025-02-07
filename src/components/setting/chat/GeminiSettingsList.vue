<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {onMounted, ref} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {ElMessage} from "element-plus";
import {GeminiSettingsDialogUtil} from "@/utils/settings/GeminiSettingsDialogUtil.ts";
import {GoogleGeminiConfig} from "@/types/chat/BaseConfig.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import _ from "lodash";
import {ApiDialogExpandButtons} from "@/utils/settings/BaseSettingsDialogUtil.ts";

const configStore = useConfigStore();
const chatListStore = useChatListStore();
const settingsDialogRefs = ref<InstanceType<typeof CBaseDialog> | null>(null);

type Props = {
  noDefault?: boolean,
  chatId?: string | null,
}
const props = withDefaults(defineProps<Props>(), {
  noDefault: false,
  chatId: null,
});
const currentChatGptConfig = ref<GoogleGeminiConfig>({
  apiUrl: "",
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

const openApiUrlDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showApiUrlDialog(
      settingsDialogRefs.value,
      getConfig().apiUrl,
      props.noDefault)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("API URL can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("apiUrl", value);
        settingsDialogRefs.value.hide();
      });
};
const openModelDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showModelDialog(
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
const openResponseMaxTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  GeminiSettingsDialogUtil.showResponseMaxTokensDialog(
      settingsDialogRefs.value,
      getConfig().maxOutputTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (value < 0) {
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
        if (value < 0 || value > 1) {
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
        if (value < 0) {
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
        if (value < 0) {
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
        if (value < 0) {
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
        if (value < 0 || value > 1) {
          ElMessage.warning("Top P can not be empty or less than 0 or greater than 1");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("topP", value);
        settingsDialogRefs.value.hide();
      });
};

const expandClick = (content: string | number, key: ApiDialogExpandButtons) => {
  if (key === ApiDialogExpandButtons.ApiAllChange && !props.noDefault) {
    configStore.defaultChatConfig.google.gemini["apiUrl"] = content as string;
    chatListStore.setAllGeminiChatOptions("apiUrl", content as string);
    settingsDialogRefs.value?.hide();
    return;
  }
};
</script>

<template>
  <div class="flex flex-col gap-2 rounded-2xl p-2 overflow-hidden text-base select-none border dark:border-0 bg-neutral-100 dark:bg-neutral-900">
    <CListItem :content="$t('settings.apiUrl.title')" left-icon="icon-link1" @click="openApiUrlDialog"/>
    <CListItem :content="$t('settings.model.title')" left-icon="icon-rocket" @click="openModelDialog"/>
    <CListItem :content="$t('settings.temperature.title')" left-icon="icon-hot-for-ux" @click="openTemperatureDialog"/>
    <CListItem content="Top K" left-icon="icon-boxplot" @click="openTopKDialog"/>
    <CListItem content="Top P" left-icon="icon-sliders" @click="openTopPDialog"/>
    <CListItem
        :content="$t('settings.contextMaxMessages.title')"
        left-icon="icon-file-text"
        @click="openContextMaxMsgsDialog"
    />
    <CListItem
        :content="$t('settings.contextMaxTokens.title')"
        left-icon="icon-build"
        @click="openContextMaxTokensDialog"
    />
    <CListItem
        :content="$t('settings.responseMaxTokens.title')"
        left-icon="icon-catalog-download"
        :bottom-border="false"
        @click="openResponseMaxTokensDialog"
    />
    <CBaseDialog ref="settingsDialogRefs" @expand-click="expandClick"/>
  </div>
</template>
