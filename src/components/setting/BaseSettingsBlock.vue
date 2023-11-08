<script setup>
import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";
import modelList from "@/util/ModelList.js";

const store = useStore();

const baseConfig = ref({});
const baseConfigDefault = {
  // openai api key
  apiKey: "",
  // 聊天输入框enter键发送消息
  enterSend: true,
  // ctrl+enter或者shift+enter发送消息/换行
  ctrlEnterSend: false,
  // api请求地址
  apiUrl: "https://api.openai.com/",
  // 模型名称
  model: "gpt-3.5-turbo",
  // 温度
  temperature: 0.7,
  // 上下文消息数量
  context_max_message: 1,
  // 上下文最大token数量
  context_max_tokens: 2048,
  // 响应最大token数量
  response_max_tokens: 0
};
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
  const config = _.cloneDeep(store.state.config.base);
  baseConfig.value = {...baseConfigDefault, ...config};
};

const rulesFormRef = ref(null);
const saveData = async () => {
  if (!rulesFormRef) return;
  await rulesFormRef.value.validate((valid, fields) => {
    if (valid) {
      store.commit("saveBaseConfig", baseConfig.value);
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
  <div class="base-setting-block">
    <el-form ref="rulesFormRef" :model="baseConfig" :rules="formRules" label-width="130px">
      <el-form-item label="ApiKey" prop="apiKey">
        <el-input v-model="baseConfig.apiKey" placeholder="Please input ApiKey"/>
      </el-form-item>
      <el-form-item label="Enter Key Send" prop="enterSend">
        <el-switch v-model="baseConfig.enterSend"/>
      </el-form-item>
      <el-form-item label="Ctrl+Enter Break" prop="ctrlEnterSend">
        <el-switch v-model="baseConfig.ctrlEnterSend"/>
      </el-form-item>
      <el-form-item label="Api Url" prop="apiUrl">
        <el-input v-model="baseConfig.apiUrl"/>
      </el-form-item>
      <el-form-item label="Model" prop="model">
        <el-select v-model="baseConfig.model">
          <el-option v-for="(item, index) in modelList" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="temperature" prop="temperature">
        <el-slider class="ml-2" v-model="baseConfig.temperature" :min="0" :max="1" :step="0.1" show-input/>
      </el-form-item>
      <el-form-item label="Context Msg" prop="context_max_message">
        <el-slider class="ml-2" v-model="baseConfig.context_max_message" :min="0" :max="20" :step="2" show-input/>
      </el-form-item>
      <el-form-item label="Context Token" prop="context_max_tokens">
        <el-slider class="ml-2" v-model="baseConfig.context_max_tokens" :min="0" :max="4000" :step="1" show-input/>
      </el-form-item>
      <el-form-item label="Res Token" prop="response_max_tokens">
        <el-slider class="ml-2" v-model="baseConfig.response_max_tokens" :min="0" :max="4000" :step="1" show-input/>
      </el-form-item>
    </el-form>
  </div>
</template>
