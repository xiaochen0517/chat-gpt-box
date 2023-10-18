<script setup>
import {onMounted, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";

const store = useStore();

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

const rulesFormRef = ref(null);

const saveData = async (rulesFormRef) => {
  if (!rulesFormRef) return;
  await rulesFormRef.validate((valid, fields) => {
    if (valid) {
      store.commit("saveBaseConfig", baseConfig.value);
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
  <div class="base-setting-block">
    <el-form ref="rulesFormRef" :model="baseConfig" :rules="formRules">
      <el-form-item label="ApiKey" name="apiKey">
        <el-input v-model:value="baseConfig.apiKey" type="password" placeholder="Please input ApiKey"/>
      </el-form-item>
      <el-form-item label="Enter Key Send" name="enterSend">
        <el-switch v-model:checked="baseConfig.enterSend"/>
      </el-form-item>
    </el-form>
  </div>
</template>
