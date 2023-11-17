<script setup lang="ts">
import {computed, nextTick, ref} from "vue";
import {useStore} from "@/store/store.ts";
import AddRobotDialog from "../chat/dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import AppSettingsDialog from "@/components/setting/AppSettingsDialog.vue";

const store = useStore();

const isDarkMode = computed(() => store.config.isDarkMode);
const handleChange = () => {
  store.setDarkMode(!isDarkMode.value);
};

const shortcut = computed(() => store.config.shortcut);
const keys = useMagicKeys();
const addRobotKey = keys[shortcut.value.addRobot];
whenever(addRobotKey, () => {
  addRobotClick();
});
const openSettingKey = keys[shortcut.value.openSetting];
whenever(openSettingKey, () => {
  openSettingsWindow();
});

/**
 * 初始化机器人列表
 */
const addRobotDialogRefs = ref<InstanceType<typeof AddRobotDialog> | null>(null);
const addRobotClick = () => {
  nextTick(() => {
    if (!addRobotDialogRefs.value) return;
    addRobotDialogRefs.value.show(false, 0);
  });
};

const appSettingsDialogRefs = ref<InstanceType<typeof AppSettingsDialog> | null>(null);
const openSettingsWindow = () => {
  if (!appSettingsDialogRefs.value) return;
  appSettingsDialogRefs.value.show();
};
</script>

<template>
  <div class="menu-list-block p-2">
    <div class="w-full h-14 px-2 flex flex-row items-center rounded-xl border border-neutral-200 dark:border-neutral-700 gap-2">
      <div
          class="group h-10 flex-1 flex justify-center items-center rounded-xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-700 cursor-pointer"
          @click="addRobotClick">
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
          <i v-if="isDarkMode" class="iconfont icon-daytime-mode text-xl transition ease-in-out group-hover:rotate-180 duration-700"/>
          <i v-else class="iconfont icon-night-mode text-xl transition ease-in-out group-hover:rotate-180 duration-700"/>
        </transition>
      </div>
    </div>
    <AddRobotDialog ref="addRobotDialogRefs" @commit="$emit('addedRobot')"/>
    <AppSettingsDialog ref="appSettingsDialogRefs"/>
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
