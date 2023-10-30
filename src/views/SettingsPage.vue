<script setup>
import {onMounted, ref} from "vue";
import {emit} from "@tauri-apps/api/event";
import {appWindow} from "@tauri-apps/api/window";
import BaseSettingsBlock from "../components/setting/BaseSettingsBlock.vue";
import ShortcutSettingsBlock from "../components/setting/ShortcutSettingsBlock.vue";
import {relaunch} from "@tauri-apps/api/process";
import {useStore} from "vuex";

const store = useStore();

onMounted(() => {
  createAppCloseListener();
});

const createAppCloseListener = () => {
  appWindow.onCloseRequested(() => {
    emit("resetSettingsWindow");
  });
};

const activeCollIndex = ref(["0"]);
const collapseChange = () => {
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
  <div>
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
</template>
