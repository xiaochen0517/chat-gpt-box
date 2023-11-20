<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useStore} from "@/store/store.ts";
import _ from "lodash";
import modelList from "@/util/ModelList";
import {BaseConfig} from "@/types/State.ts";
import {ElForm} from "element-plus";

const store = useStore();

const baseConfig = ref<BaseConfig>({
  apiKey: "",
  enterSend: true,
  ctrlEnterSend: false,
  apiUrl: "https://api.openai.com/",
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  context_max_message: 1,
  context_max_tokens: 2048,
  response_max_tokens: 0
});
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
  const config = _.cloneDeep(store.config.base);
  baseConfig.value = {...baseConfig.value, ...config};
};

const rulesFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const saveData = async () => {
  if (!rulesFormRef.value) return;
  await rulesFormRef.value.validate((valid, fields) => {
    if (valid) {
      store.saveBaseConfig(baseConfig.value);
    } else {
      console.log('error', fields);
      throw new Error("Please check the form data");
    }
  });
};
defineExpose({
  saveData
});
</script>

<template>
  <div class="base-setting-block">
    <el-form
        ref="rulesFormRef"
        :model="baseConfig"
        :rules="formRules"
        label-width="130px">
      <el-form-item
          label="ApiKey"
          prop="apiKey">
        <el-input
            v-model="baseConfig.apiKey"
            placeholder="Please input ApiKey"/>
      </el-form-item>
      <el-form-item
          label="Enter Key Send"
          prop="enterSend">
        <el-switch v-model="baseConfig.enterSend"/>
      </el-form-item>
      <el-form-item
          label="Ctrl+Enter Break"
          prop="ctrlEnterSend">
        <el-switch v-model="baseConfig.ctrlEnterSend"/>
      </el-form-item>
      <el-form-item
          label="Api Url"
          prop="apiUrl">
        <el-input v-model="baseConfig.apiUrl"/>
      </el-form-item>
      <el-form-item
          label="Model"
          prop="model">
        <el-select v-model="baseConfig.model">
          <el-option
              v-for="(item, index) in modelList"
              :key="index"
              :label="item.label"
              :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item
          label="temperature"
          prop="temperature">
        <el-slider
            class="ml-2"
            v-model="baseConfig.temperature"
            :min="0"
            :max="1"
            :step="0.1"
            show-input/>
      </el-form-item>
      <el-form-item
          label="Context Msg"
          prop="context_max_message">
        <el-slider
            class="ml-2"
            v-model="baseConfig.context_max_message"
            :min="0"
            :max="20"
            :step="2"
            show-input/>
      </el-form-item>
      <el-form-item
          label="Context Token"
          prop="context_max_tokens">
        <el-slider
            class="ml-2"
            v-model="baseConfig.context_max_tokens"
            :min="0"
            :max="4000"
            :step="1"
            show-input/>
      </el-form-item>
      <el-form-item
          label="Res Token"
          prop="response_max_tokens">
        <el-slider
            class="ml-2"
            v-model="baseConfig.response_max_tokens"
            :min="0"
            :max="4000"
            :step="1"
            show-input/>
      </el-form-item>
    </el-form>
  </div>
</template>
