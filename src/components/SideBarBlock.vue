<script setup>
import {ref, computed, onMounted, onBeforeUnmount, nextTick, getCurrentInstance} from "vue";
import {useStore} from "vuex";
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
import {listen} from '@tauri-apps/api/event';
import {WebviewWindow} from '@tauri-apps/api/window';

/**
 * 初始化BScroll和监听窗口关闭事件
 */
const robotListRefs = ref(null);
BScroll.use(MouseWheel);
BScroll.use(ScrollBar);
let bScroll = null;
let settingsWindowCloseUnListenFunc = null;
onMounted(async () => {
  bScroll = createBScroll();
  // 不知道为什么在子窗口中调用close方法onCloseRequested回调不执行，只有在点击右上角关闭按钮时才会执行
  settingsWindowCloseUnListenFunc = await createSettingsWindowCloseListener();
});
const createBScroll = () => {
  return new BScroll(robotListRefs.value, {
    disableMouse: false,
    disableTouch: false,
    bounce: false,
    scrollY: true,
    scrollbar: true,
    mouseWheel: {
      speed: 20,
      invert: false,
      easeTime: 300
    }
  });
};
const createSettingsWindowCloseListener = async () => {
  return await listen('resetSettingsWindow', () => {
    settingsWindow = null;
  });
};
onBeforeUnmount(() => {
  if (bScroll) {
    bScroll.destroy();
  }
  if (settingsWindowCloseUnListenFunc) {
    settingsWindowCloseUnListenFunc();
  }
});

/**
 * 初始化机器人列表
 */
const store = useStore();
const robotList = computed(() => {
  return store.state.robotList;
});
const addRobotClick = () => {
  store.commit("addRobot", {
    prompt: "test",
    name: "test",
    options: {
      model: "gpt-3.5-turbo"
    }
  });
  if (bScroll) {
    nextTick(() => {
      console.log("refresh");
      bScroll.refresh();
    });
  }
};

/**
 * 机器人列表点击事件，触发父组件的onClick事件
 */
const instance = getCurrentInstance();
const robotListClick = (index, item) => {
  console.log(index, item);
  instance.emit("onClick", index, item);
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
  <div class="side-bar-block position-relative">
    <div ref="robotListRefs" class="robot-list scroll-wrapper">
      <div class="robot-content scroll-content">
        <div v-for="(item, index) in robotList" :key="index" class="robot-list-item scroll-item"
             @click="robotListClick(index, item)">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="control-box position-absolute">
      <a-button class="add-robot-button" type="primary" @click="addRobotClick">Add Robot</a-button>
      <a-button class="add-robot-button" type="primary" @click="openSettingsWindow">Open Settings</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.side-bar-block {
  width: 20%;
  min-height: 100%;
  max-height: 100%;
  border-right: 1px solid #e8e8e8;

  .robot-list {
    max-height: 100%;
    position: relative;
    overflow: hidden;

    .robot-content {
      padding-bottom: 100px;

      .robot-list-item {
        padding: 10px;
        border-bottom: 1px solid #e8e8e8;
        cursor: pointer;
      }
    }
  }

  .control-box {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    padding: 10px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .add-robot-button {
      width: 100%;
    }
  }
}
</style>
