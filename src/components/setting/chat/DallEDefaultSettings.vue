<script setup lang="ts">
import CListItem from "@/components/base/list/CListItem.vue";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {DallESettingsDialogUtil} from "@/utils/settings/DallESettingsDialogUtil.ts";
import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";
import {DALLE2ImageSizeList, DALLE3ImageSizeList} from "@/models/DallEModelList.ts";

const configStore = useConfigStore();
const settingsDialogRefs = ref<InstanceType<typeof CSettingsDialog> | null>(null);
const openApiUrlDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showApiDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.dallE.apiUrl)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Api url can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.dallE.apiUrl = value;
        settingsDialogRefs.value.hide();
      });
};
const openModelDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showDallEModelDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.dallE.model)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Model can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.dallE.model = value;
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
      configStore.defaultChatConfig.openAi.dallE.imageCount)
      .then((value: string | number) => {
        value = Number(value);
        if (!value || value <= 0 || value > 4) {
          ElMessage.warning("Image count can not be empty and must be between 1 and 4");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.dallE.imageCount = value;
        settingsDialogRefs.value.hide();
      });
};
const openImageSizeDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showImageSizeDialog(
      settingsDialogRefs.value,
      getImageSizeList(),
      configStore.defaultChatConfig.openAi.dallE.imageSize)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Image size can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.dallE.imageSize = value;
        settingsDialogRefs.value.hide();
      });
};
const getImageSizeList = (): SelectOptionItem[] => {
  return configStore.defaultChatConfig.openAi.dallE.model === "dall-e-3" ? DALLE3ImageSizeList : DALLE2ImageSizeList;
};
const openImageStyleDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showImageStyleDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.dallE.imageStyle ?? "vivid")
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Image style can not be empty");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.dallE.imageStyle = value;
        settingsDialogRefs.value.hide();
      });
};
const openImageQualityDialog = () => {
  if (!settingsDialogRefs.value) return;
  DallESettingsDialogUtil.showImageQualityDialog(
      settingsDialogRefs.value,
      configStore.defaultChatConfig.openAi.dallE.imageQuality ?? "standard")
      .then((value: string | number) => {
        value = String(value);
        if (!value || value === "") {
          ElMessage.warning("Image quality can not be empty and must be between 1 and 100");
          return;
        }
        if (!settingsDialogRefs.value) return;
        configStore.defaultChatConfig.openAi.dallE.imageQuality = value;
        settingsDialogRefs.value.hide();
      });
};
</script>

<template>
  <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
    <CListItem content="Api url" left-icon="icon-discount" @click="openApiUrlDialog"/>
    <CListItem content="Default model" left-icon="icon-connections" @click="openModelDialog"/>
    <CListItem content="Image count" left-icon="icon-hot-for-ux" @click="openImageCountDialog"/>
    <CListItem content="Image size" left-icon="icon-file-text" @click="openImageSizeDialog"/>
    <CListItem content="Image style" left-icon="icon-translate" @click="openImageStyleDialog"/>
    <CListItem
        content="Image quality"
        left-icon="icon-rollback"
        :bottom-border="false"
        @click="openImageQualityDialog"
    />
    <CSettingsDialog ref="settingsDialogRefs"/>
  </div>
</template>