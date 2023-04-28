<script setup>
import {ref, onMounted, nextTick} from "vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import {emit} from "@tauri-apps/api/event";
import {appWindow} from "@tauri-apps/api/window";
import BaseSettingsBlock from "../components/setting/BaseSettingsBlock.vue";
import ShortcutSettingsBlock from "../components/setting/ShortcutSettingsBlock.vue";
import {notification} from 'ant-design-vue';
import {relaunch} from "@tauri-apps/api/process";

BScroll.use(MouseWheel);
BScroll.use(ScrollBar);

let bScroll = null;
onMounted(() => {
  createAppCloseListener();
  bScroll = createBScroll();
});

const scrollWrapperRefs = ref(null);
const createBScroll = () => {
  return new BScroll(scrollWrapperRefs.value, {
    disableMouse: true,
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
const createAppCloseListener = () => {
  appWindow.onCloseRequested(() => {
    emit("resetSettingsWindow");
  });
};

const activeCollIndex = ref(["0"]);
const collapseChange = () => {
  setTimeout(() => {
    nextTick(() => {
      bScroll.refresh();
    });
  }, 300);
};

const openNotification = (type, message) => {
  notification[type]({
    message: message,
    description: "",
    duration: 1
  });
};

const baseSettingsBlockRefs = ref(null);
const shortcutSettingsBlockRefs = ref(null);
const submit = () => {
  baseSettingsBlockRefs.value.saveData();
  shortcutSettingsBlockRefs.value.saveData();
  // 保存后重启应用
  relaunch();
};

const cancel = () => {
  emit("resetSettingsWindow");
  appWindow.close();
};
</script>

<template>
  <div class="settings-page">
    <div ref="scrollWrapperRefs" class="scroll-wrapper">
      <div class="settings-form-box wrapper-content">
        <h1 style="font-weight: bold;">Settings</h1>
        <a-collapse v-model:activeKey="activeCollIndex" @change="collapseChange">
          <a-collapse-panel header="Base Settings" key="0" :forceRender="true">
            <BaseSettingsBlock ref="baseSettingsBlockRefs"/>
          </a-collapse-panel>
          <a-collapse-panel header="Shortcut Settings" key="1" :forceRender="true">
            <ShortcutSettingsBlock ref="shortcutSettingsBlockRefs"/>
          </a-collapse-panel>
        </a-collapse>
        <div class="commit-button-box flex-row">
          <a-button @click="cancel">取消</a-button>
          <a-button type="primary" @click="submit" style="margin-left: 50px">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.settings-page {
  width: 100%;
  height: 100vh;

  .scroll-wrapper {
    height: 100vh;
    overflow: hidden;
  }

  .settings-form-box {
    padding: 20px 60px;

    .commit-button-box {
      justify-content: center;
      margin: 20px 0;
    }
  }
}
</style>

<style lang="less">
.ant-collapse-content {
  background-color: @primary-bg-color;
}
</style>
