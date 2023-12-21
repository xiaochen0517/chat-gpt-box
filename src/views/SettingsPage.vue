<script setup lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import router from "@/router/Router.ts";
import CListItem from "@/components/base/list/CListItem.vue";
import CTopNavBar from "@/components/base/nav/CTopNavBar.vue";
import {BaseConfig} from "@/types/chat/BaseConfig.ts";
import CAnimationTabs from "@/components/base/tab/CAnimationTabs.vue";
import GptDefaultSettings from "@/components/setting/chat/GptDefaultSettings.vue";
import DallEDefaultSettings from "@/components/setting/chat/DallEDefaultSettings.vue";
import GeminiDefaultSettings from "@/components/setting/chat/GeminiDefaultSettings.vue";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentDialogRefs = ref<any>(null);
const currentDialog = ref<string | ReturnType<typeof defineComponent>>("");

const saveConfig = <K extends keyof BaseConfig>(key: K, value: BaseConfig[K]) => {
  configStore.setBaseConfig(key, value);
  if (!currentDialogRefs.value) return;
  currentDialogRefs.value.hide();
};

const activeTabName = ref("");
const tabNames = ref(["GPT", "DALL-E", "Gemini"]);
const tabChangeHandle = (tabName: string) => {
  console.log(tabName);
};
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
            content="KeyMap"
            left-icon="icon-gold"
            :bottom-border="false"
            @click="jumpToKeyMapSettingPage"
        />
      </div>
      <div class="mt-1 text-lg leading-13">Chat Default Settings</div>
      <CAnimationTabs v-model:active-name="activeTabName" :tab-names="tabNames" @change="tabChangeHandle"/>
      <div class="pt-4 overflow-hidden">
        <Transition name="slip" mode="out-in">
          <GptDefaultSettings v-if="activeTabName === 'GPT'"/>
          <DallEDefaultSettings v-else-if="activeTabName === 'DALL-E'"/>
          <GeminiDefaultSettings v-else-if="activeTabName === 'Gemini'"/>
        </Transition>
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

<style lang="less" scoped>
.slip-enter-active, .slip-leave-active {
  transition: transform 0.2s ease-in-out;
}

.slip-enter-from, .slip-leave-to {
  transform: translateX(50%);
  opacity: 0;
}

.slip-enter-to, .slip-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
