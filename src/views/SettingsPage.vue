<script setup lang="ts">
import {ref} from "vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import CAnimationTabs from "@/components/base/tab/CAnimationTabs.vue";
import ChatGptSettingsList from "@/components/setting/chat/ChatGptSettingsList.vue";
import DallESettingsList from "@/components/setting/chat/DallESettingsList.vue";
import GeminiSettingsList from "@/components/setting/chat/GeminiSettingsList.vue";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";
import {ElMessage} from "element-plus";
import {storeToRefs} from "pinia";
import {AppStateStore, ChatListStore, ChatTabsStore, ConfigStore} from "@/types/StoreTypes.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";
import {useChatListStore} from "@/store/ChatListStore.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {FileUtil} from "@/utils/FileUtil.ts";
import i18n from "@/i18n/i18n.ts";

const jumpToHomePage = () => {
  router.back();
};

const jumpToKeyMapSettingPage = () => {
  router.push({path: "/settings/keyMap"});
};

const configStore = useConfigStore();
const {isDarkMode, baseConfig} = storeToRefs(configStore);

const currentDialogRefs = ref<InstanceType<typeof CSettingsDialog> | null>(null);
const openLanguageDialog = () => {
  if (!currentDialogRefs.value) return;
  BaseSettingsDialogUtil.showLanguageDialog(currentDialogRefs.value, configStore.baseConfig.language)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value.length === 0) {
          ElMessage.warning("Please enter the language");
          return;
        }
        configStore.baseConfig.language = value;
        currentDialogRefs.value?.hide();
        i18n.global.locale = value as "zh-CN" | "en";
      });
};
const openOpenaiKeyDialog = () => {
  if (!currentDialogRefs.value) return;
  BaseSettingsDialogUtil.showApiKeyDialog(currentDialogRefs.value, configStore.defaultChatConfig.openAi.base.apiKey)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value.length === 0) {
          ElMessage.warning("Please enter the OpenAI API Key");
          return;
        }
        configStore.defaultChatConfig.openAi.base.apiKey = value;
        currentDialogRefs.value?.hide();
      });
};
const openGoogleKeyDialog = () => {
  if (!currentDialogRefs.value) return;
  BaseSettingsDialogUtil.showApiKeyDialog(
      currentDialogRefs.value,
      configStore.defaultChatConfig.google.base.apiKey)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value.length === 0) {
          ElMessage.warning("Please enter the Google API Key");
          return;
        }
        configStore.defaultChatConfig.google.base.apiKey = value;
        currentDialogRefs.value?.hide();
      });
};
const openChatTemplateUrlDialog = () => {
  if (!currentDialogRefs.value) return;
  BaseSettingsDialogUtil.showChatTemplateUrlDialog(
      currentDialogRefs.value,
      configStore.baseConfig.chatTemplateUrl)
      .then((value: string | number) => {
        value = String(value);
        if (!value || value.length === 0) {
          ElMessage.warning("Please enter the chat template url");
          return;
        }
        configStore.baseConfig.chatTemplateUrl = value;
        currentDialogRefs.value?.hide();
      });
};
const chatTabsStore = useChatTabsStore();
const chatListStore = useChatListStore();
const appStateStore = useAppStateStore();
type ExportOrImportConfigType = {
  appState: AppStateStore,
  chatList: ChatListStore,
  chatTabs: ChatTabsStore,
  config: ConfigStore,
  version: number,
}
const importConfig = () => {
  openFileSelector().then((importConfig) => {
    if (importConfig.version !== Number(import.meta.env.VITE_STORE_VERSION)) {
      ElMessage.warning("This config file version is not supported. " +
          `Current version is ${import.meta.env.VITE_STORE_VERSION}, but the config file version is ${importConfig.version}`);
      return;
    }
    appStateStore.$patch(importConfig.appState);
    chatListStore.$patch(importConfig.chatList);
    chatTabsStore.$patch(importConfig.chatTabs);
    configStore.$patch(importConfig.config);
    localStorage.setItem("version", String(importConfig.version));
    ElMessage.success("Import config success");
  }).catch((e) => {
    ElMessage.error(e.message);
  });
};
const openFileSelector = (): Promise<ExportOrImportConfigType> => {
  return new Promise<ExportOrImportConfigType>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      if (!input.files) {
        reject(new Error("No file selected"));
        return;
      }
      const file = input.files[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }
      readerFile(file).then((fileContentStr) => {
        const importConfig: ExportOrImportConfigType = JSON.parse(fileContentStr);
        resolve(importConfig);
      }).catch((e) => {
        reject(e);
      });
    };
    input.click();
  });
};
const readerFile = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (!result) {
        reject(new Error("This config file is not supported"));
        return;
      }
      const fileContentStr = result.toString();
      if (!fileContentStr || fileContentStr.length === 0) {
        reject(new Error("File content is empty"));
        return;
      }
      resolve(fileContentStr);
    };
    reader.readAsText(file);
  });
};
const exportConfig = () => {
  const version = Number(localStorage.getItem("version"));
  const exportConfig: ExportOrImportConfigType = {
    appState: appStateStore.$state,
    chatList: chatListStore.$state,
    chatTabs: chatTabsStore.$state,
    config: configStore.$state,
    version,
  };
  const exportConfigString = JSON.stringify(exportConfig, null, 2);
  FileUtil.startDownLoad("config.json", exportConfigString);
};

const activeTabName = ref("");
const tabNames = ref(["GPT", "DALL-E", "Gemini"]);
</script>

<template>
  <div class="w-full h-screen  bg-neutral-50 dark:bg-neutral-900 overflow-y-auto">
    <CTopNavBar :title="$t('settings.pageTitle')" @backClick="jumpToHomePage"/>
    <div class="px-2 xl:p-0 max-w-content m-auto pt-2 pb-6">
      <div class="mt-1 text-lg leading-13">{{ $t("settings.basicSettings") }}</div>
      <div class="rounded-xl overflow-hidden text-base select-none border dark:border-0">
        <CListItem
            :content="$t('settings.basic.language.title')"
            left-icon="icon-translate1"
            @click="openLanguageDialog"
        />
        <CListItem
            :content="$t('settings.basic.enterLineBreak.title')"
            left-icon="icon-enter"
            :tooltip="$t('settings.basic.enterLineBreak.description')"
            switch-enabled
            v-model:switch-value="baseConfig.enterSend"
        />
        <CListItem
            :content="$t('settings.basic.enableCtrlEnter.title')"
            left-icon="icon-retweet"
            :tooltip="$t('settings.basic.enableCtrlEnter.description')"
            switch-enabled
            v-model:switch-value="baseConfig.ctrlEnterSend"
        />
        <CListItem
            :content="$t('settings.basic.enableBubbleMessage.title')"
            left-icon="icon-message"
            :tooltip="$t('settings.basic.enableBubbleMessage.description')"
            switch-enabled
            v-model:switch-value="baseConfig.bubbleMessage"
        />
        <CListItem
            :content="$t('settings.basic.forceScrollToBottom.title')"
            left-icon="icon-down-arrow"
            :tooltip="$t('settings.basic.forceScrollToBottom.description')"
            switch-enabled
            v-model:switch-value="baseConfig.forceScrollToBottom"
        />
        <CListItem
            :content="$t('settings.basic.darkMode.title')"
            :left-icon="isDarkMode?'icon-night-mode':'icon-daytime-mode'"
            switch-enabled
            v-model:switch-value="isDarkMode"
        />
        <CListItem
            :content="$t('settings.basic.openaiApiKey.title')"
            left-icon="icon-key"
            @click="openOpenaiKeyDialog"
        />
        <CListItem
            :content="$t('settings.basic.googleApiKey.title')"
            left-icon="icon-key"
            @click="openGoogleKeyDialog"
        />
        <CListItem
            :content="$t('settings.basic.chatTemplateUrl.title')"
            left-icon="icon-template-success"
            @click="openChatTemplateUrlDialog"
        />
        <CListItem
            :content="$t('settings.basic.shortcuts.title')"
            left-icon="icon-gold"
            @click="jumpToKeyMapSettingPage"
        />
        <CListItem :content="$t('settings.basic.import.title')" left-icon="icon-Import" @click="importConfig"/>
        <CListItem
            :content="$t('settings.basic.export.title')"
            left-icon="icon-export"
            :bottom-border="false"
            @click="exportConfig"
        />
      </div>
      <div class="mt-1 text-lg leading-13">{{ $t("settings.chatDefaultSettings") }}</div>
      <CAnimationTabs v-model:active-name="activeTabName" :tab-names="tabNames"/>
      <div class="pt-4 overflow-hidden">
        <Transition name="slip" mode="out-in">
          <ChatGptSettingsList v-if="activeTabName === 'GPT'"/>
          <DallESettingsList v-else-if="activeTabName === 'DALL-E'"/>
          <GeminiSettingsList v-else-if="activeTabName === 'Gemini'"/>
        </Transition>
      </div>
    </div>
    <CSettingsDialog ref="currentDialogRefs"/>
  </div>
</template>
