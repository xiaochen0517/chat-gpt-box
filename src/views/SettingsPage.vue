<script setup lang="ts">
import {defineComponent, markRaw, nextTick, onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import ApiKeyDialog from "@/components/setting/dialog/ApiKeyDialog.vue";
import ApiUrlDialog from "@/components/setting/dialog/ApiUrlDialog.vue";
import ModelDialog from "@/components/setting/dialog/ModelDialog.vue";
import TemperatureDialog from "@/components/setting/dialog/TemperatureDialog.vue";
import ContextMaxMsgsDialog from "@/components/setting/dialog/ContextMaxMsgsDialog.vue";
import ContextMaxTokensDialog from "@/components/setting/dialog/ContextMaxTokensDialog.vue";
import ResponseMaxTokensDialog from "@/components/setting/dialog/ResponseMaxTokensDialog.vue";
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";

import {BaseConfigTypes} from "@/types/chat/BaseConfigTypes.ts";

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

type ComponentMap = {
  [key: string]: ReturnType<typeof defineComponent>;
};

const components: ComponentMap = {
  ApiKeyDialog,
  ApiUrlDialog,
  ModelDialog,
  TemperatureDialog,
  ContextMaxMsgsDialog,
  ContextMaxTokensDialog,
  ResponseMaxTokensDialog,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentDialogRefs = ref<any>(null);
const currentDialog = ref<string | ReturnType<typeof defineComponent>>("");
const openDialog = (name: string, key: keyof BaseConfigTypes) => {
  if (!components[name]) return;
  currentDialog.value = markRaw(components[name]);
  nextTick(() => {
    if (!currentDialogRefs.value) return;
    currentDialogRefs.value.show(configStore.baseConfig[key]);
  });
};

const saveConfig = <K extends keyof BaseConfigTypes>(key: K, value: BaseConfigTypes[K]) => {
  configStore.setBaseConfig(key, value);
  if (!currentDialogRefs.value) return;
  currentDialogRefs.value.hide();
};
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar title="Settings" @backClick="jumpToHomePage"/>
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem content="Api key" left-icon="icon-lock" @click.stop="openDialog('ApiKeyDialog', 'apiKey')"/>
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
        <CListItem content="Api url" left-icon="icon-link1" @click.stop="openDialog('ApiUrlDialog', 'apiUrl')"/>
        <CListItem
            content="Dark Mode"
            :left-icon="isDarkMode?'icon-night-mode':'icon-daytime-mode'"
            switch-enabled
            v-model:switch-value="isDarkMode"
            :bottom-border="false"
        />
      </div>
      <div class="mt-1 text-lg leading-13">Advanced Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
        <CListItem content="Default Model" left-icon="icon-connections" @click="openDialog('ModelDialog', 'model')"/>
        <CListItem
            content="Temperature"
            left-icon="icon-hot-for-ux"
            @click="openDialog('TemperatureDialog', 'temperature')"
        />
        <CListItem
            content="Context max msgs"
            left-icon="icon-file-text"
            @click="openDialog('ContextMaxMsgsDialog', 'contextMaxMessage')"
        />
        <CListItem
            content="Context max tokens"
            left-icon="icon-translate"
            @click="openDialog('ContextMaxTokensDialog', 'contextMaxTokens')"
        />
        <CListItem
            content="Response max tokens"
            left-icon="icon-rollback"
            @click="openDialog('ResponseMaxTokensDialog', 'responseMaxTokens')"
        />
        <CListItem
            content="KeyMap"
            left-icon="icon-gold"
            :bottom-border="false"
            @click="jumpToKeyMapSettingPage"
        />
      </div>
    </div>
    <Component
        ref="currentDialogRefs"
        :is="currentDialog"
        v-if="currentDialog"
        @commit="saveConfig"
    />
  </div>
</template>
