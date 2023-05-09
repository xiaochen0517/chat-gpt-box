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
  <div class="menu-list-block">
    <div class="control-box flex-column">
      <a-button class="add-robot-button" type="primary" @click="addRobotClick">
        Add Chat
      </a-button>
      <div class="settings-line-box flex-row">
        <a-button class="add-robot-button" type="primary" @click="openSettingsWindow">Open Settings</a-button>
        <SwitchDarkMode/>
      </div>
    </div>
    <AddRobotDialog ref="addRobotDialogRefs" @commit="$emit('addedRobot')"/>
  </div>
</template>

<style lang="less" scoped>
.menu-list-block {
  border-top: 1px solid @border-color;

  .control-box {
    background-color: @primary-bg-color;
    padding: 10px;

    .settings-line-box {
      margin-top: 10px;

      .add-robot-button{
        flex: 8;
        margin-right: 5px;
      }

      .switch-dark-mode{
        flex: 2;
      }
    }
  }
}
</style>
