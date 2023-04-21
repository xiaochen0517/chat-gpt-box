<script setup>
import {ref, computed, onMounted, onBeforeUnmount, nextTick, getCurrentInstance} from "vue";
import {useStore} from "vuex";
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import ScrollBar from '@better-scroll/scroll-bar';
import {tauri} from "@tauri-apps/api";
import {WebviewWindow} from '@tauri-apps/api/window';

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

const store = useStore();
let bScroll = null;
const robotListRefs = ref(null);
onMounted(() => {
  bScroll = new BScroll(robotListRefs.value, {
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
});

onBeforeUnmount(() => {
  if (bScroll) {
    bScroll.destroy();
  }
});

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
const instance = getCurrentInstance();
const robotListClick = (index, item) => {
  console.log(index, item);
  instance.emit("onClick", index, item);
};

let settingsWindow = null;
const openSettingsWindow = () => {
  if (settingsWindow != null) {
    settingsWindow.setFocus();
  } else {
    settingsWindow = new WebviewWindow("设置", {
      url: "/settings",
      title: 'test',
      width: 800,
      height: 600,
      resizable: false,
      center: true,
    });
    settingsWindow.onCloseRequested((event) => {
      settingsWindow = null;
      event.preventDefault();
    });
  }
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
