<script setup lang="ts">
import {computed, nextTick, ref} from "vue";
import {useStore} from "vuex";
import AddRobotDialog from "../chat/dialog/EditRobotDialog.vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import AppSettingsDialog from "@/components/setting/AppSettingsDialog.vue";

const store = useStore();

const isDarkMode = computed(() => store.state.config.isDarkMode);
const handleChange = () => {
  store.commit("setDarkMode", !isDarkMode.value);
};

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
    <div class="flex flex-col gap-2">
      <el-button type="primary" @click="addRobotClick">Add Chat
      </el-button>
      <div class="flex flex-row">
        <el-button class="flex-grow" type="primary" @click="openSettingsWindow">Open Settings
        </el-button>
        <el-button type="primary" @click="handleChange">{{ isDarkMode ? 'Dark' : 'Light' }}
        </el-button>
      </div>
    </div>
    <AddRobotDialog ref="addRobotDialogRefs" @commit="$emit('addedRobot')"/>
    <AppSettingsDialog ref="appSettingsDialogRefs"/>
  </div>
</template>
