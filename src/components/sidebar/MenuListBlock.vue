<script setup lang="ts">
import {computed} from "vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import router from "@/router/Router.ts";
import {useConfigStore} from "@/store/ConfigStore.ts";


const configStore = useConfigStore();

const isDarkMode = computed(() => configStore.isDarkMode);
const handleChange = () => {
  configStore.setDarkMode(!isDarkMode.value);
};

const shortcut = computed(() => configStore.shortcut);
const shortcutStringConfig = computed(() => configStore.shortcutStringConfig);
const keys = useMagicKeys();
const addRobotKey = keys[shortcutStringConfig.value.addRobot];
whenever(addRobotKey, () => {
  addChatClick();
});
const openSettingKey = keys[shortcutStringConfig.value.openSetting];
whenever(openSettingKey, () => {
  openSettingsWindow();
});

const addChatClick = () => {
  router.push({path: "/chat/editor/add"});
};

const openSettingsWindow = () => {
  router.push({path: "/settings"});
};
</script>

<template>
  <div class="menu-list-block p-2">
    <div
        class="w-full h-14 px-2 flex flex-row items-center rounded-xl border border-neutral-200 dark:border-neutral-700 gap-2">
      <div
          class="group h-10 flex-1 flex justify-center items-center rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-700 cursor-pointer"
          @click="addChatClick">
        <i class="iconfont icon-add text-xl transition ease-in-out group-hover:rotate-180 duration-700"/>
      </div>
      <div
          class="group w-10 h-10 flex justify-center items-center rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-700 cursor-pointer"
          @click="openSettingsWindow">
        <i class="iconfont icon-settings text-xl transition ease-in-out group-hover:rotate-180 duration-700"/>
      </div>
      <div
          class="group w-10 h-10 flex justify-center items-center rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-700 cursor-pointer"
          @click="handleChange">
        <transition name="fade" mode="out-in">
          <i
              v-if="isDarkMode"
              class="iconfont icon-daytime-mode text-xl transition ease-in-out group-hover:rotate-180 duration-700"/>
          <i
              v-else
              class="iconfont icon-night-mode text-xl transition ease-in-out group-hover:rotate-180 duration-700"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
/* Enter and leave active styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

/* Enter from and leave to styles (initial/end states) */
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Enter to and leave from styles (final/start states) */
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
