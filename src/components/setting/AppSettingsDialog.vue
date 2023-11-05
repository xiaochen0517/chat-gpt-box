<script setup>

import {ref} from "vue";
import ShortcutSettingsBlock from "@/components/setting/ShortcutSettingsBlock.vue";
import BaseSettingsBlock from "@/components/setting/BaseSettingsBlock.vue";

const dialogVisible = ref(false);

const activeCollNames = ref(["0"]);

const baseSettingsBlockRefs = ref(null);
const shortcutSettingsBlockRefs = ref(null);
const saveSettings = async () => {
  try {
    await baseSettingsBlockRefs.value.saveData();
    await shortcutSettingsBlockRefs.value.saveData();
    // 刷新页面
    dialogVisible.value = false;
  } catch (ignore) {
  }
};

const show = () => {
  dialogVisible.value = true;
};

defineExpose({
  show
});
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Settings">
    <el-collapse v-model="activeCollNames">
      <el-collapse-item title="Base Settings" name="0">
        <BaseSettingsBlock ref="baseSettingsBlockRefs"/>
      </el-collapse-item>
      <el-collapse-item title="Shortcut Settings" name="1">
        <ShortcutSettingsBlock ref="shortcutSettingsBlockRefs"/>
      </el-collapse-item>
    </el-collapse>
    <template #footer>
      <div>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveSettings">Save Settings</el-button>
      </div>
    </template>
  </el-dialog>
</template>
