<script setup>
import {ref, onMounted, nextTick, computed} from "vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ScrollBar from "@better-scroll/scroll-bar";
import {emit} from "@tauri-apps/api/event";
import {appWindow} from "@tauri-apps/api/window";
import BaseSettingsBlock from "../components/setting/BaseSettingsBlock.vue";
import ShortcutSettingsBlock from "../components/setting/ShortcutSettingsBlock.vue";
import {notification} from 'ant-design-vue';
import {relaunch} from "@tauri-apps/api/process";
import {useStore} from "vuex";
import {switchMode} from "@/util/ThemeMode.js";

const store = useStore();
const isDarkMode = computed(() => store.state.config.isDarkMode);

onMounted(() => {
  createAppCloseListener();
  switchMode(isDarkMode.value);
});

const createAppCloseListener = () => {
  appWindow.onCloseRequested(() => {
    emit("resetSettingsWindow");
  });
};

const activeCollIndex = ref(["0"]);
const collapseChange = () => {
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
        <el-collapse v-model:activeKey="activeCollIndex" @change="collapseChange">
          <el-collapse-item header="Base Settings" key="0" :forceRender="true">
            <BaseSettingsBlock ref="baseSettingsBlockRefs"/>
          </el-collapse-item>
          <el-collapse-item header="Shortcut Settings" key="1" :forceRender="true">
            <ShortcutSettingsBlock ref="shortcutSettingsBlockRefs"/>
          </el-collapse-item>
        </el-collapse>
        <div class="commit-button-box flex-row">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit" style="margin-left: 50px">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
* {
  color: @primary-text-color !important;
}

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

.ant-form-item-label > label {
  color: @primary-text-color !important;
}

.ant-collapse > .ant-collapse-item > .ant-collapse-header {
  color: @primary-text-color !important;
}

.ant-input {
  color: @primary-text-color !important;
}
</style>
