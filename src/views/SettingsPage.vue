<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useStore} from "@/store/store.ts";
import ApiKeyDialog from "@/components/setting/dialog/ApiKeyDialog.vue";
import router from "@/router/router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import ApiUrlDialog from "@/components/setting/dialog/ApiUrlDialog.vue";
import ModelDialog from "@/components/setting/dialog/ModelDialog.vue";
import TemperatureDialog from "@/components/setting/dialog/TemperatureDialog.vue";
import ContextMaxMsgsDialog from "@/components/setting/dialog/ContextMaxMsgsDialog.vue";
import ContextMaxTokensDialog from "@/components/setting/dialog/ContextMaxTokensDialog.vue";
import ResponseMaxTokensDialog from "@/components/setting/dialog/ResponseMaxTokensDialog.vue";

const jumpToHomePage = () => {
  router.push({path: "/"});
}

const store = useStore();

const isDarkMode = ref(false);
const enterSend = ref(false);
const ctrlEnterSend = ref(false);
onMounted(() => {
  isDarkMode.value = store.config.isDarkMode;
  enterSend.value = store.config.base.enterSend;
  ctrlEnterSend.value = store.config.base.ctrlEnterSend;
})

watch(isDarkMode, (value) => {
  store.setDarkMode(value);
})
watch(enterSend, (value) => {
  store.setEnterSend(value);
})

const apiKeyDialogRefs = ref<InstanceType<typeof ApiKeyDialog> | null>(null);
const openApiKeyDialog = () => {
  if (!apiKeyDialogRefs.value) return;
  apiKeyDialogRefs.value.show();
}
const apiUrlDialogRefs = ref<InstanceType<typeof ApiUrlDialog> | null>(null);
const openApiUrlDialog = () => {
  if (!apiUrlDialogRefs.value) return;
  apiUrlDialogRefs.value.show();
}
const modelDialogRefs = ref<InstanceType<typeof ModelDialog> | null>(null);
const openModelDialog = () => {
  if (!modelDialogRefs.value) return;
  modelDialogRefs.value.show();
}
const temperatureDialogRefs = ref<InstanceType<typeof TemperatureDialog> | null>(null);
const openTemperatureDialog = () => {
  if (!temperatureDialogRefs.value) return;
  temperatureDialogRefs.value.show();
}
const contextMaxMsgsDialogRefs = ref<InstanceType<typeof ContextMaxMsgsDialog> | null>(null);
const openContextMaxMsgsDialog = () => {
  if (!contextMaxMsgsDialogRefs.value) return;
  contextMaxMsgsDialogRefs.value.show();
}
const contextMaxTokensDialogRefs = ref<InstanceType<typeof ContextMaxTokensDialog> | null>(null);
const openContextMaxTokensDialog = () => {
  if (!contextMaxTokensDialogRefs.value) return;
  contextMaxTokensDialogRefs.value.show();
}
const responseMaxTokensDialogRefs = ref<InstanceType<typeof ResponseMaxTokensDialog> | null>(null);
const openResponseMaxTokensDialog = () => {
  if (!responseMaxTokensDialogRefs.value) return;
  responseMaxTokensDialogRefs.value.show();
}
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <div class="flex flex-row items-center select-none rounded-b-2xl bg-neutral-100 dark:bg-neutral-800">
      <div
          class="w-10 h-10 ml-4 rounded-xl flex justify-center cursor-pointer bg-neutral-200 dark:bg-neutral-700 hover:dark:bg-neutral-600"
          @click.stop="jumpToHomePage">
        <i class="iconfont icon-left-arrow text-xl leading-10"/>
      </div>
      <div class="w-full ml-4 text-xl leading-16"> Settings</div>
    </div>
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem content="Api key" left-icon="icon-lock" @click.stop="openApiKeyDialog"/>
        <CListItem
            content="Enter Line break"
            left-icon="icon-enter"
            tooltip="After enabling, press Enter to start a new line, and Shift+Enter to send the message."
            switch-enabled
            v-model:switch-value="enterSend"/>
        <CListItem
            content="Enable Ctrl+Enter"
            left-icon="icon-a-sorting2"
            tooltip="Use ctrl+enter to replace shift+enter."
            switch-enabled
            v-model:switch-value="ctrlEnterSend"/>
        <CListItem content="Api url" left-icon="icon-link1" @click.stop="openApiUrlDialog"/>
        <CListItem
            content="Dark Mode"
            :left-icon="isDarkMode?'icon-night-mode':'icon-daytime-mode'"
            switch-enabled
            v-model:switch-value="isDarkMode"
            :bottom-border="false"/>
      </div>
      <div class="mt-1 text-lg leading-13">Advanced Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
        <CListItem content="Default Model" left-icon="icon-connections" @click="openModelDialog"/>
        <CListItem content="Temperature" left-icon="icon-hot-for-ux" @click="openTemperatureDialog"/>
        <CListItem content="Context max msgs" left-icon="icon-file-text" @click="openContextMaxMsgsDialog"/>
        <CListItem content="Context max tokens" left-icon="icon-translate" @click="openContextMaxTokensDialog"/>
        <CListItem
            content="Response max tokens"
            left-icon="icon-rollback"
            :bottom-border="false"
            @click="openResponseMaxTokensDialog"/>
      </div>
    </div>
    <ApiKeyDialog ref="apiKeyDialogRefs"/>
    <ApiUrlDialog ref="apiUrlDialogRefs"/>
    <ModelDialog ref="modelDialogRefs"/>
    <TemperatureDialog ref="temperatureDialogRefs"/>
    <ContextMaxMsgsDialog ref="contextMaxMsgsDialogRefs"/>
    <ContextMaxTokensDialog ref="contextMaxTokensDialogRefs"/>
    <ResponseMaxTokensDialog ref="responseMaxTokensDialogRefs"/>
  </div>
</template>
