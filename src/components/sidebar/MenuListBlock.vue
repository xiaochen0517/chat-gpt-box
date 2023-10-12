<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick, computed} from "vue";
import {useStore} from "vuex";
import {listen} from '@tauri-apps/api/event';
import {WebviewWindow} from '@tauri-apps/api/window';
import AddRobotDialog from "../dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import SwitchDarkMode from "@/components/sidebar/SwitchDarkMode.vue";

const store = useStore();
const shortcut = computed(() => store.state.config.shortcut);
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
 * 初始化BScroll和监听窗口关闭事件
 */
let settingsWindowCloseUnListenFunc = null;
onMounted(async () => {
  // 不知道为什么在子窗口中调用close方法onCloseRequested回调不执行，只有在点击右上角关闭按钮时才会执行
  settingsWindowCloseUnListenFunc = await createSettingsWindowCloseListener();
});

const createSettingsWindowCloseListener = async () => {
  return await listen('resetSettingsWindow', () => {
    settingsWindow = null;
  });
};
onBeforeUnmount(() => {
  if (settingsWindowCloseUnListenFunc) {
    settingsWindowCloseUnListenFunc();
  }
});

/**
 * 初始化机器人列表
 */
const addRobotDialogRefs = ref(null);
const addRobotClick = () => {
  nextTick(() => {
    if (addRobotDialogRefs.value) {
      addRobotDialogRefs.value.show();
    }
  });
};

/**
 * 打开设置窗口
 */
let settingsWindow = null;
const openSettingsWindow = () => {
  if (settingsWindow != null) {
    settingsWindow.setFocus();
  } else {
    settingsWindow = createSettingsWindow();
  }
};
const createSettingsWindow = () => {
  return new WebviewWindow("settings", {
    url: "/settings",
    title: 'Settings',
    width: 800,
    height: 600,
    resizable: false,
    center: true,
  });
};
</script>

<template>
  <div class="menu-list-block p-2">
    <div class="flex flex-col gap-2">
      <button
        class="border-solid border-2 border-sky-500 rounded-md box-border p-1 w-full bg-sky-400 hover:bg-sky-500 hover:border-sky-600 active:bg-sky-700 active:border-sky-800"
        @click="addRobotClick">
        Add Chat
      </button>
      <div class="flex flex-row gap-2">
        <button
          class="border-solid border-2 border-sky-400 rounded-md box-border p-1 w-full bg-sky-400 hover:bg-sky-500 hover:border-sky-600 active:bg-sky-700 active:border-sky-800"
          @click="openSettingsWindow">Open Settings
        </button>
        <SwitchDarkMode/>
      </div>
    </div>
    <AddRobotDialog ref="addRobotDialogRefs" @commit="$emit('addedRobot')"/>
  </div>
</template>
