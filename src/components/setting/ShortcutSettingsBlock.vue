<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useStore} from "@/store/store.ts";
import _ from "lodash";
import {ElForm} from "element-plus";

import shortcutState from "@/components/setting/ShortcutState";
import {ShortcutState} from "@/types/State.ts";

const store = useStore();
const shortcut = ref<ShortcutState>(shortcutState);
onMounted(() => {
  initSettingsData();
});
const initSettingsData = () => {
  shortcut.value = {...shortcutState, ..._.cloneDeep(store.config.shortcut)};
};

const formRulesRef = ref<InstanceType<typeof ElForm> | null>(null);
const saveData = async () => {
  if (!formRulesRef.value) return;
  await formRulesRef.value.validate((valid, fields) => {
    if (valid) {
      store.saveShortcutConfig(shortcut.value);
    } else {
      console.log('error', fields);
      throw new Error("表单验证失败");
    }
  });
};
defineExpose({
  saveData
});
</script>

<template>
  <div class="shortcut-settings-block">
    <el-form ref="formRulesRef" :model="shortcut" label-width="120px">
      <el-form-item label="Focus Input" name="focusInput">
        <el-input v-model="shortcut.focusInput" placeholder="Focus Input"/>
      </el-form-item>
      <el-form-item label="Setting Page" name="openSetting">
        <el-input v-model="shortcut.openSetting" placeholder="Open Setting Page"/>
      </el-form-item>
      <el-form-item label="Add Tab" name="addTab">
        <el-input v-model="shortcut.addTab" placeholder="Add Tab"/>
      </el-form-item>
      <el-form-item label="Remove Tab" name="removeTab">
        <el-input v-model="shortcut.removeTab" placeholder="Remove Tab"/>
      </el-form-item>
      <el-form-item label="Clean Tab Chat" name="cleanTabChat">
        <el-input v-model="shortcut.cleanTabChat" placeholder="Clean Tab Chat"/>
      </el-form-item>
      <el-form-item label="Prev Tab" name="prevTab">
        <el-input v-model="shortcut.prevTab" placeholder="Prev Tab"/>
      </el-form-item>
      <el-form-item label="Next Tab" name="nextTab">
        <el-input v-model="shortcut.nextTab" placeholder="Next Tab"/>
      </el-form-item>
      <el-form-item label="Add Robot" name="addRobot">
        <el-input v-model="shortcut.addRobot" placeholder="Add Robot"/>
      </el-form-item>
      <el-form-item label="Switch Robot" name="switchRobot">
        <el-input v-model="shortcut.switchRobot" placeholder="Switch Robot"/>
      </el-form-item>
      <el-form-item label="Prev Robot" name="prevRobot">
        <el-input v-model="shortcut.prevRobot" placeholder="Prev Robot"/>
      </el-form-item>
      <el-form-item label="Next Robot" name="nextRobot">
        <el-input v-model="shortcut.nextRobot" placeholder="Next Robot"/>
      </el-form-item>
    </el-form>
  </div>
</template>
