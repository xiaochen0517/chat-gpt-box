<script lang="ts">
import {nextTick, onMounted, Ref, ref, watch} from "vue";
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

export default {
  name: "SettingsPage",
  components: {
    CListItem,
    ApiKeyDialog,
    ApiUrlDialog,
    ModelDialog,
    TemperatureDialog,
    ContextMaxMsgsDialog,
    ContextMaxTokensDialog,
    ResponseMaxTokensDialog,
    CTopNavBar
  },
  setup: () => {

    onMounted(() => {
      console.log("onMounted")
      isDarkMode.value = configStore.isDarkMode;
      enterSend.value = configStore.baseConfig.enterSend;
      ctrlEnterSend.value = configStore.baseConfig.ctrlEnterSend;
    })

    const jumpToHomePage = () => {
      router.push({path: "/"});
    }

    const configStore = useConfigStore();

    const isDarkMode = ref(false);
    const enterSend = ref(false);
    const ctrlEnterSend = ref(false);

    watch(isDarkMode, (value) => {
      configStore.setDarkMode(value);
    })
    watch(enterSend, (value) => {
      configStore.setEnterSend(value);
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

    const currentDialogRefs = ref<any>(null);
    const currentDialog: Ref<string | null> = ref(null);
    const openDialog = (name: string) => {
      console.log(`openDialog: ${name}`)
      currentDialog.value = name;
      nextTick(() => {
        if (!currentDialogRefs.value) return;
        currentDialogRefs.value.show();
      })
    }

    const saveConfig = (key: string, value: any) => {
      configStore.setBaseConfig(key, value);
    }

    return {
      jumpToHomePage,
      isDarkMode,
      enterSend,
      ctrlEnterSend,
      openApiKeyDialog,
      openApiUrlDialog,
      openModelDialog,
      openTemperatureDialog,
      openContextMaxMsgsDialog,
      openContextMaxTokensDialog,
      openResponseMaxTokensDialog,
      currentDialog,
      currentDialogRefs,
      saveConfig,
      openDialog
    }
  }
}
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar title="Settings" @backClick="jumpToHomePage"/>
    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
        <CListItem content="Api key" left-icon="icon-lock" @click.stop="openDialog('ApiKeyDialog')"/>
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
        <CListItem content="Api url" left-icon="icon-link1" @click.stop="openDialog('ApiUrlDialog')"/>
        <CListItem
            content="Dark Mode"
            :left-icon="isDarkMode?'icon-night-mode':'icon-daytime-mode'"
            switch-enabled
            v-model:switch-value="isDarkMode"
            :bottom-border="false"/>
      </div>
      <div class="mt-1 text-lg leading-13">Advanced Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none bg-neutral-100 dark:bg-neutral-800">
        <CListItem content="Default Model" left-icon="icon-connections" @click="openDialog('ModelDialog')"/>
        <CListItem content="Temperature" left-icon="icon-hot-for-ux" @click="openDialog('TemperatureDialog')"/>
        <CListItem content="Context max msgs" left-icon="icon-file-text" @click="openDialog('ContextMaxMsgsDialog')"/>
        <CListItem
            content="Context max tokens"
            left-icon="icon-translate"
            @click="openDialog('ContextMaxTokensDialog')"/>
        <CListItem
            content="Response max tokens"
            left-icon="icon-rollback"
            :bottom-border="false"
            @click="openDialog('ResponseMaxTokensDialog')"/>
      </div>
    </div>
    <Component ref="currentDialogRefs" :is="currentDialog" v-if="currentDialog" @ok.stop="saveConfig"/>
  </div>
</template>
