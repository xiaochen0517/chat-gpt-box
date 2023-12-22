<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
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

onMounted(() => {
  console.log("onMounted");
  isDarkMode.value = configStore.isDarkMode;
  enterSend.value = configStore.baseConfig.enterSend;
  ctrlEnterSend.value = configStore.baseConfig.ctrlEnterSend;
});

const jumpToHomePage = () => {
  router.push({path: "/"});
};

const jumpToKeyMapSettingPage = () => {
  router.push({path: "/settings/keyMap"});
};

const configStore = useConfigStore();

const isDarkMode = ref(false);
const enterSend = ref(false);
const ctrlEnterSend = ref(false);

watch(isDarkMode, (value) => {
  configStore.setDarkMode(value);
});
watch(enterSend, (value) => {
  configStore.setEnterSend(value);
});

const currentDialogRefs = ref<InstanceType<typeof CSettingsDialog> | null>(null);
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
  BaseSettingsDialogUtil.showApiKeyDialog(currentDialogRefs.value, configStore.defaultChatConfig.google.base.apiKey)
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

const activeTabName = ref("");
const tabNames = ref(["GPT", "DALL-E", "Gemini"]);
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar title="Settings" @backClick="jumpToHomePage"/>
    <div class="px-2 xl:p-0 max-w-content m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem
            content="Enter Line break"
            left-icon="icon-enter"
            tooltip="After enabling, press Enter to start a new line, and Shift+Enter to send the message."
            switch-enabled
            v-model:switch-value="enterSend"
        />
        <CListItem
            content="Enable Ctrl+Enter"
            left-icon="icon-a-sorting2"
            tooltip="Use ctrl+enter to replace shift+enter."
            switch-enabled
            v-model:switch-value="ctrlEnterSend"
        />
        <CListItem
            content="Dark Mode"
            :left-icon="isDarkMode?'icon-night-mode':'icon-daytime-mode'"
            switch-enabled
            v-model:switch-value="isDarkMode"
        />
        <CListItem
            content="Openai API Key"
            left-icon="icon-gold"
            @click="openOpenaiKeyDialog"
        />
        <CListItem
            content="Google API Key"
            left-icon="icon-gold"
            @click="openGoogleKeyDialog"
        />
        <CListItem
            content="KeyMap"
            left-icon="icon-gold"
            :bottom-border="false"
            @click="jumpToKeyMapSettingPage"
        />
      </div>
      <div class="mt-1 text-lg leading-13">Chat Default Settings</div>
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

<style lang="less" scoped>
.slip-enter-active, .slip-leave-active {
  transition: all 0.2s ease-in-out;
}

.slip-leave-to {
  transform: translateX(-100%);
  opacity: .2;
}

.slip-enter-from {
  transform: translateX(100%);
  opacity: .2;
}

.slip-enter-to, .slip-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
