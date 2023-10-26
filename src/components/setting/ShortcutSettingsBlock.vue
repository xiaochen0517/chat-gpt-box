<script setup>
import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";

const store = useStore();
const shortcut = ref({});
onMounted(() => {
  initSettingsData();
});
const initSettingsData = () => {
  shortcut.value = _.cloneDeep(store.state.config.shortcut);
};

const formRulesRef = ref(null);
const saveData = async () => {
  if (!formRulesRef) return;
  await formRulesRef.validate((valid, fields) => {
    if (valid) {
      store.commit("saveShortcutConfig", shortcut.value);
    } else {
      console.log('error', fields);
    }
  });
};
defineExpose({
  saveData
});
</script>

<template>
  <div class="shortcut-settings-block">
    <el-form ref="formRulesRef" :model="shortcut">
      <el-form-item label="Focus Input" name="focusInput">
        <el-input v-model:value="shortcut.focusInput" placeholder="Focus Input"/>
      </el-form-item>
      <el-form-item label="Setting Page" name="openSetting">
        <el-input v-model:value="shortcut.openSetting" placeholder="Open Setting Page"/>
      </el-form-item>
      <el-form-item label="Add Tab" name="addTab">
        <el-input v-model:value="shortcut.addTab" placeholder="Add Tab"/>
      </el-form-item>
      <el-form-item label="Remove Tab" name="removeTab">
        <el-input v-model:value="shortcut.removeTab" placeholder="Remove Tab"/>
      </el-form-item>
      <el-form-item label="Clean Tab Chat" name="cleanTabChat">
        <el-input v-model:value="shortcut.cleanTabChat" placeholder="Clean Tab Chat"/>
      </el-form-item>
      <el-form-item label="Prev Tab" name="prevTab">
        <el-input v-model:value="shortcut.prevTab" placeholder="Prev Tab"/>
      </el-form-item>
      <el-form-item label="Next Tab" name="nextTab">
        <el-input v-model:value="shortcut.nextTab" placeholder="Next Tab"/>
      </el-form-item>
      <el-form-item label="Add Robot" name="addRobot">
        <el-input v-model:value="shortcut.addRobot" placeholder="Add Robot"/>
      </el-form-item>
      <el-form-item label="Switch Robot" name="switchRobot">
        <el-input v-model:value="shortcut.switchRobot" placeholder="Switch Robot"/>
      </el-form-item>
      <el-form-item label="Prev Robot" name="prevRobot">
        <el-input v-model:value="shortcut.prevRobot" placeholder="Prev Robot"/>
      </el-form-item>
      <el-form-item label="Next Robot" name="nextRobot">
        <el-input v-model:value="shortcut.nextRobot" placeholder="Next Robot"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>

</style>
