<script setup>
import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";
import {Form} from 'ant-design-vue';

const store = useStore();
const shortcut = ref({});
const formRules = ref({});
onMounted(() => {
  initSettingsData();
});
const initSettingsData = () => {
  shortcut.value = _.cloneDeep(store.state.config.shortcut);
};

const {validate, validateInfos} = Form.useForm(shortcut, formRules);
const saveData = () => {
  validate().then(() => {
    store.commit("saveShortcutConfig", shortcut.value);
  }).catch(() => {
  });
};
defineExpose({
  saveData
});
</script>

<template>
  <div class="shortcut-settings-block">
    <el-dialog :model="shortcut" :rules="formRules" label-align="left" :label-col="{span: 4}">
      <el-form-item label="Focus Input" name="focusInput" v-bind="validateInfos.focusInput">
        <el-input v-model:value="shortcut.focusInput" placeholder="Focus Input"/>
      </el-form-item>
      <el-form-item label="Setting Page" name="openSetting" v-bind="validateInfos.openSetting">
        <el-input v-model:value="shortcut.openSetting" placeholder="Open Setting Page"/>
      </el-form-item>
      <el-form-item label="Add Tab" name="addTab" v-bind="validateInfos.addTab">
        <el-input v-model:value="shortcut.addTab" placeholder="Add Tab"/>
      </el-form-item>
      <el-form-item label="Remove Tab" name="removeTab" v-bind="validateInfos.removeTab">
        <el-input v-model:value="shortcut.removeTab" placeholder="Remove Tab"/>
      </el-form-item>
      <el-form-item label="Clean Tab Chat" name="cleanTabChat" v-bind="validateInfos.cleanTabChat">
        <el-input v-model:value="shortcut.cleanTabChat" placeholder="Clean Tab Chat"/>
      </el-form-item>
      <el-form-item label="Prev Tab" name="prevTab" v-bind="validateInfos.prevTab">
        <el-input v-model:value="shortcut.prevTab" placeholder="Prev Tab"/>
      </el-form-item>
      <el-form-item label="Next Tab" name="nextTab" v-bind="validateInfos.nextTab">
        <el-input v-model:value="shortcut.nextTab" placeholder="Next Tab"/>
      </el-form-item>
      <el-form-item label="Add Robot" name="addRobot" v-bind="validateInfos.addRobot">
        <el-input v-model:value="shortcut.addRobot" placeholder="Add Robot"/>
      </el-form-item>
      <el-form-item label="Switch Robot" name="switchRobot" v-bind="validateInfos.switchRobot">
        <el-input v-model:value="shortcut.switchRobot" placeholder="Switch Robot"/>
      </el-form-item>
      <el-form-item label="Prev Robot" name="prevRobot" v-bind="validateInfos.prevRobot">
        <el-input v-model:value="shortcut.prevRobot" placeholder="Prev Robot"/>
      </el-form-item>
      <el-form-item label="Next Robot" name="nextRobot" v-bind="validateInfos.nextRobot">
        <el-input v-model:value="shortcut.nextRobot" placeholder="Next Robot"/>
      </el-form-item>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>

</style>
