<script setup>
import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";
import {Form} from 'ant-design-vue';

const store = useStore();

const useForm = Form.useForm;
const baseConfig = ref({});
const formRules = ref({
  apiKey: [
    {required: true, message: "Please input ApiKey", trigger: "blur"}
  ],
  enterSend: [
    {required: true, message: "Please select enterSend", trigger: "blur"}
  ]
});

onMounted(() => {
  initSettingsData();
});
const initSettingsData = () => {
  baseConfig.value = _.cloneDeep(store.state.config.base);
};

const {validate, validateInfos} = useForm(baseConfig, formRules);
const saveData = () => {
  validate().then(() => {
    store.commit("saveBaseConfig", baseConfig.value);
  }).catch((err) => {
    console.log('error', err);
  });
};
defineExpose({
  saveData
});
</script>

<template>
  <div class="base-setting-block">
    <a-form :model="baseConfig" :rules="formRules">
      <a-form-item label="ApiKey" name="apiKey" v-bind="validateInfos.apiKey">
        <a-input v-model:value="baseConfig.apiKey" type="password" placeholder="Please input ApiKey"/>
      </a-form-item>
      <a-form-item label="Enter Key Send" name="enterSend" v-bind="validateInfos.enterSend">
        <a-switch v-model:checked="baseConfig.enterSend"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="less" scoped>

</style>
