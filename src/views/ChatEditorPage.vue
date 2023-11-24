<script setup lang="ts">
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import ApiKeyDialog from "@/components/setting/dialog/ApiKeyDialog.vue";
import TemperatureDialog from "@/components/setting/dialog/TemperatureDialog.vue";
import ResponseMaxTokensDialog from "@/components/setting/dialog/ResponseMaxTokensDialog.vue";
import ContextMaxMsgsDialog from "@/components/setting/dialog/ContextMaxMsgsDialog.vue";
import ContextMaxTokensDialog from "@/components/setting/dialog/ContextMaxTokensDialog.vue";
import ApiUrlDialog from "@/components/setting/dialog/ApiUrlDialog.vue";
import ModelDialog from "@/components/setting/dialog/ModelDialog.vue";

const jumpToHomePage = () => {
  router.push({path: "/"});
}
</script>

<template>
  <div class="w-full h-full bg-neutral-50 dark:bg-neutral-900">
    <CTopNavBar title="Chat Editor" @backClick="jumpToHomePage"/>

    <div class="px-2 xl:p-0 max-w-2xl m-auto mt-2">
      <div class="mt-1 text-lg leading-13">Basic Settings</div>
      <div class="rounded-xl overflow-hidden text-base select-none">
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
    <ApiUrlDialog ref="apiUrlDialogRefs"/>
    <ModelDialog ref="modelDialogRefs"/>
    <TemperatureDialog ref="temperatureDialogRefs"/>
    <ContextMaxMsgsDialog ref="contextMaxMsgsDialogRefs"/>
    <ContextMaxTokensDialog ref="contextMaxTokensDialogRefs"/>
    <ResponseMaxTokensDialog ref="responseMaxTokensDialogRefs"/>
  </div>
</template>