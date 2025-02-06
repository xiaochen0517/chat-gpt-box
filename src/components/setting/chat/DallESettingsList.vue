<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {DallESettingsDialogUtil} from "@/utils/settings/DallESettingsDialogUtil.ts";
import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";
import {DALLE2ImageSizeList, DALLE3ImageSizeList} from "@/models/DallEModelList.ts";
import {OpenAiDallEConfig} from "@/types/chat/BaseConfig.ts";
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
const currentDallEConfig = ref<OpenAiDallEConfig>({
  apiUrl: "",
  model: "dall-e-3",
  imageCount: 1,
  imageSize: "1024x1024",
  imageStyle: "vivid",
  imageQuality: "standard",
});
onMounted(() => {
  if (!props.chatId || props.chatId === "add") {
    currentDallEConfig.value = _.cloneDeep(configStore.defaultChatConfig.openAi.dallE);
    return;
  }
  currentDallEConfig.value = _.cloneDeep(chatListStore.getChatInfo(props.chatId)?.options as OpenAiDallEConfig);
});
const getConfig = (): OpenAiDallEConfig => {
  if (props.noDefault) {
    return currentDallEConfig.value;
  }
  return configStore.defaultChatConfig.openAi.dallE;
};
defineExpose({
  getConfig,
});
const setConfig = <K extends keyof OpenAiDallEConfig>(key: K, value: OpenAiDallEConfig[K]) => {
  if (props.noDefault) {
    if (props.chatId) {
      chatListStore.setDallEChatOptions(props.chatId, key, value);
    }
    currentDallEConfig.value[key] = value;
  } else {
    configStore.defaultChatConfig.openAi.dallE[key] = value;
  }
};

const openApiUrlDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showApiDialog(
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
  DallESettingsDialogUtil.showModelDialog(
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
        if (configStore.defaultChatConfig.openAi.dallE.imageSize !== "1024x1024") {
          configStore.defaultChatConfig.openAi.dallE.imageSize = "1024x1024";
        }
        settingsDialogRefs.value.hide();
      });
};
const openImageCountDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showImageCountDialog(
      settingsDialogRefs.value,
      getConfig().imageCount)
      .then((value: string | number) => {
        value = Number(value);
        if (value <= 0 || value > 4) {
          ElMessage.warning("Image count can not be empty and must be between 1 and 4");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("imageCount", value);
        settingsDialogRefs.value.hide();
      });
};
const openImageSizeDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showImageSizeDialog(
      settingsDialogRefs.value,
      getImageSizeList(),
      getConfig().imageSize)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Image size can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("imageSize", value);
        settingsDialogRefs.value.hide();
      });
};
const getImageSizeList = (): SelectOptionItem[] => {
  return getConfig().model === "dall-e-3" ? DALLE3ImageSizeList : DALLE2ImageSizeList;
};
const openImageStyleDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showImageStyleDialog(
      settingsDialogRefs.value,
      getConfig().imageStyle ?? "vivid")
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Image style can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("imageStyle", value);
        settingsDialogRefs.value.hide();
      });
};
const openImageQualityDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showImageQualityDialog(
      settingsDialogRefs.value,
      getConfig().imageQuality ?? "standard")
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Image quality can not be empty and must be between 1 and 100");
          return;
        }
        if (!settingsDialogRefs.value) return;
        setConfig("imageQuality", value);
        settingsDialogRefs.value.hide();
      });
};

const expandClick = (content: string | number, key: ApiDialogExpandButtons) => {
  if (key === ApiDialogExpandButtons.ApiAllChange && !props.noDefault) {
    configStore.defaultChatConfig.openAi.dallE["apiUrl"] = content as string;
    chatListStore.setAllDallEChatOptions("apiUrl", content as string);
    settingsDialogRefs.value?.hide();
    return;
  }
};
</script>

<template>
  <div class="flex flex-col gap-2 rounded-2xl p-2 overflow-hidden text-base select-none border dark:border-0 bg-neutral-100 dark:bg-neutral-900">
    <CListItem :content="$t('settings.apiUrl.title')" left-icon="icon-link1" @click="openApiUrlDialog"/>
    <CListItem :content="$t('settings.model.title')" left-icon="icon-rocket" @click="openModelDialog"/>
    <CListItem
        :content="$t('settings.dalle.imageCount.title')"
        left-icon="icon-Field-number"
        @click="openImageCountDialog"
    />
    <CListItem
        :content="$t('settings.dalle.imageSize.title')"
        left-icon="icon-arrawsalt"
        @click="openImageSizeDialog"
    />
    <CListItem :content="$t('settings.dalle.imageStyle.title')" left-icon="icon-picture" @click="openImageStyleDialog"/>
    <CListItem
        :content="$t('settings.dalle.imageQuality.title')"
        left-icon="icon-picture-search"
        :bottom-border="false"
        @click="openImageQualityDialog"
    />
    <CBaseDialog ref="settingsDialogRefs" @expand-click="expandClick"/>
  </div>
</template>
