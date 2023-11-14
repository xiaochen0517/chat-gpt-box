<script setup lang="ts">

import {inject, ref} from "vue";
import ShortcutSettingsBlock from "@/components/setting/ShortcutSettingsBlock.vue";
import BaseSettingsBlock from "@/components/setting/BaseSettingsBlock.vue";

const dialogVisible = ref(false);

const activeCollNames = ref(["0"]);

const baseSettingsBlockRefs = ref<InstanceType<typeof BaseSettingsBlock> | null>(null);
const shortcutSettingsBlockRefs = ref<InstanceType<typeof ShortcutSettingsBlock> | null>(null);
const saveSettings = async () => {
  try {
    if (!baseSettingsBlockRefs.value || !shortcutSettingsBlockRefs.value) return;
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

const dialogWidth = inject("dialogWidth");
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Settings" :width="dialogWidth">
    <el-collapse v-model="activeCollNames">
      <el-collapse-item
          title="Base Settings"
          name="0">
        <BaseSettingsBlock ref="baseSettingsBlockRefs"/>
      </el-collapse-item>
      <el-collapse-item
          title="Shortcut Settings"
          name="1">
        <ShortcutSettingsBlock ref="shortcutSettingsBlockRefs"/>
      </el-collapse-item>
    </el-collapse>
    <template #footer>
      <div>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button
            type="primary"
            @click="saveSettings">Save Settings
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
