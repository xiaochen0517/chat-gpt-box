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
    <a-form :model="shortcut" :rules="formRules" label-align="left" :label-col="{span: 4}">
      <a-form-item label="Focus Input" name="focusInput" v-bind="validateInfos.focusInput">
        <a-input v-model:value="shortcut.focusInput" placeholder="Focus Input"/>
      </a-form-item>
      <a-form-item label="Setting Page" name="openSetting" v-bind="validateInfos.openSetting">
        <a-input v-model:value="shortcut.openSetting" placeholder="Open Setting Page"/>
      </a-form-item>
      <a-form-item label="Add Tab" name="addTab" v-bind="validateInfos.addTab">
        <a-input v-model:value="shortcut.addTab" placeholder="Add Tab"/>
      </a-form-item>
      <a-form-item label="Remove Tab" name="removeTab" v-bind="validateInfos.removeTab">
        <a-input v-model:value="shortcut.removeTab" placeholder="Remove Tab"/>
      </a-form-item>
      <a-form-item label="Clean Tab Chat" name="cleanTabChat" v-bind="validateInfos.cleanTabChat">
        <a-input v-model:value="shortcut.cleanTabChat" placeholder="Clean Tab Chat"/>
      </a-form-item>
      <a-form-item label="Prev Tab" name="prevTab" v-bind="validateInfos.prevTab">
        <a-input v-model:value="shortcut.prevTab" placeholder="Prev Tab"/>
      </a-form-item>
      <a-form-item label="Next Tab" name="nextTab" v-bind="validateInfos.nextTab">
        <a-input v-model:value="shortcut.nextTab" placeholder="Next Tab"/>
      </a-form-item>
      <a-form-item label="Add Robot" name="addRobot" v-bind="validateInfos.addRobot">
        <a-input v-model:value="shortcut.addRobot" placeholder="Add Robot"/>
      </a-form-item>
      <a-form-item label="Switch Robot" name="switchRobot" v-bind="validateInfos.switchRobot">
        <a-input v-model:value="shortcut.switchRobot" placeholder="Switch Robot"/>
      </a-form-item>
      <a-form-item label="Prev Robot" name="prevRobot" v-bind="validateInfos.prevRobot">
        <a-input v-model:value="shortcut.prevRobot" placeholder="Prev Robot"/>
      </a-form-item>
      <a-form-item label="Next Robot" name="nextRobot" v-bind="validateInfos.nextRobot">
        <a-input v-model:value="shortcut.nextRobot" placeholder="Next Robot"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="less" scoped>

</style>
