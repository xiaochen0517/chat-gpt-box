<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from "vue";
import {useStore} from "vuex";
import {listen} from '@tauri-apps/api/event';
import {WebviewWindow} from '@tauri-apps/api/window';
import AddRobotDialog from "../dialog/EditRobotDialog.vue";

/**
 * 初始化BScroll和监听窗口关闭事件
 */
let settingsWindowCloseUnListenFunc = null;
onMounted(async () => {
  // 不知道为什么在子窗口中调用close方法onCloseRequested回调不执行，只有在点击右上角关闭按钮时才会执行
  settingsWindowCloseUnListenFunc = await createSettingsWindowCloseListener();
});
const createBScroll = () => {
};
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
const store = useStore();
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
    title: 'test',
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
        Add Robot
      </a-button>
      <a-button class="add-robot-button" type="primary" @click="openSettingsWindow">Open Settings</a-button>
    </div>
    <AddRobotDialog ref="addRobotDialogRefs" @commit="$emit('addedRobot')"/>
  </div>
</template>

<style lang="less" scoped>
.menu-list-block {
  border-top: 1px solid #e8e8e8;

  .control-box {
    background-color: white;
    padding: 10px;

    > button {
      margin-top: 10px;
    }
  }
}
</style>
