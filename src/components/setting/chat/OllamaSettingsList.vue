<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import {onMounted, ref} from "vue";
import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {ElMessage} from "element-plus";
import {OllamaDefaultConfig} from "@/types/chat/BaseConfig.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import _ from "lodash";
import {OllamaSettingsDialogUtil} from "@/utils/settings/OllamaSettingsDialogUtil.ts";
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
const currentOllamaConfig = ref<OllamaDefaultConfig>({
  apiUrl: "",
  model: "llama2",
  temperature: 0.7,
  contextMaxMessage: 2,
  contextMaxTokens: 2048,
  responseMaxTokens: 0,
});
onMounted(() => {
  if (!props.chatId || props.chatId === "add") {
    currentOllamaConfig.value = _.cloneDeep(configStore.defaultChatConfig.ollama.default);
    return;
  }
  currentOllamaConfig.value = _.cloneDeep(chatListStore.getChatInfo(props.chatId)?.options as OllamaDefaultConfig);
});
const getConfig = (): OllamaDefaultConfig => {
  if (props.noDefault) {
    return currentOllamaConfig.value;
  }
  return configStore.defaultChatConfig.ollama.default;
};
defineExpose({
  getConfig,
});
const setConfig = <K extends keyof OllamaDefaultConfig>(key: K, value: OllamaDefaultConfig[K]) => {
  if (props.noDefault) {
    if (props.chatId) {
      chatListStore.setOllamaChatOptions(props.chatId, key, value);
    }
    currentOllamaConfig.value[key] = value;
  } else {
    configStore.defaultChatConfig.ollama.default[key] = value;
  }
};

const openApiUrlDialog = () => {
  if (!settingsDialogRefs.value) return;
  OllamaSettingsDialogUtil.showApiUrlDialog(
      settingsDialogRefs.value,
      getConfig().apiUrl,
      props.noDefault)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Api url can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("apiUrl", value);
        settingsDialogRefs.value.hide();
      });
};
const openModelDialog = () => {
  if (!settingsDialogRefs.value) return;
  OllamaSettingsDialogUtil.showModelDialog(
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
const openTemperatureDialog = () => {
  if (!settingsDialogRefs.value) return;
  OllamaSettingsDialogUtil.showTemperatureDialog(
      settingsDialogRefs.value,
      getConfig().temperature)
      .then((value: string | number) => {
        value = Number(value);
        if (value < 0) {
          ElMessage.warning("Temperature can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("temperature", value);
        settingsDialogRefs.value.hide();
      });
};
const openContextMaxMsgsDialog = () => {
  if (!settingsDialogRefs.value) return;
  OllamaSettingsDialogUtil.showContextMaxMessagesDialog(
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
  OllamaSettingsDialogUtil.showContextMaxTokensDialog(
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
const openResponseMaxTokensDialog = () => {
  if (!settingsDialogRefs.value) return;
  OllamaSettingsDialogUtil.showResponseMaxTokensDialog(
      settingsDialogRefs.value,
      getConfig().responseMaxTokens)
      .then((value: string | number) => {
        value = Number(value);
        if (value < 0) {
          ElMessage.warning("Response max tokens can not be empty or less than 0");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("responseMaxTokens", value);
        settingsDialogRefs.value.hide();
      });
};

const expandClick = (content: string | number, key: ApiDialogExpandButtons) => {
  if (key === ApiDialogExpandButtons.ApiAllChange && !props.noDefault) {
    configStore.defaultChatConfig.ollama.default["apiUrl"] = content as string;
    chatListStore.setAllOllamaChatOptions("apiUrl", content as string);
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
