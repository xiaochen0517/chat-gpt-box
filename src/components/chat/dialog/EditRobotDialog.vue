<script setup>
import {getCurrentInstance, inject, nextTick, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";
import modelList from "@/util/ModelList.js";

const store = useStore();

const isEdit = ref(false);

const dialogVisible = ref(false);
const formData = ref({
  name: "TestRobot",
  prompt: "You are a helpful assistant.",
  options: {
    enabled: false,
    apiUrl: "https://api.openai.com/",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    context_max_message: 1,
    context_max_tokens: 2048,
    response_max_tokens: 0
  }
});

const formRules = ref({
  name: [
    {
      required: true,
      message: "Please input robot name",
      trigger: "blur"
    }
  ],
  prompt: [
    {
      required: true,
      message: "Please input robot prompt",
      trigger: "blur"
    }
  ],
});

const robotIndex = ref(null);
const instance = getCurrentInstance();

const rulesFormRef = ref(null);
const commit = async () => {
  if (!rulesFormRef.value) return;
  await rulesFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        updateRobot();
      } else {
        addRobot();
      }
      rulesFormRef.value.resetFields();
      dialogVisible.value = false;
    } else {
      console.log('error', fields);
    }
  });
};

const updateRobot = () => {
  if (robotIndex.value == null) {
    return;
  }
  store.commit("updateRobot", {
    robotIndex: robotIndex.value,
    robot: _.cloneDeep(formData.value)
  });
};

const addRobot = () => {
  store.commit("addRobot", _.cloneDeep(formData.value));
  instance.emit("commit", formData.value);
};

const robotNameInputRefs = ref(null);
const focusNameInput = () => {
  nextTick(() => {
    robotNameInputRefs.value.focus();
  });
};

const show = (edit, index) => {
  isEdit.value = edit;
  if (isEdit.value) {
    robotIndex.value = index;
    formData.value = _.cloneDeep(store.state.robotList[index]);
  }
  dialogVisible.value = true;
  focusNameInput();
};

defineExpose({
  show
});

// 通过判断窗口宽度来设置对话框宽度
const dialogWidth = inject("dialogWidth");
</script>

<template>
  <div class="add-robot-dialog">
    <el-dialog
        v-model="dialogVisible"
        :title="isEdit?'Edit robot':'Add robot'"
        :width="dialogWidth">
      <el-form
          ref="rulesFormRef"
          :model="formData"
          :rules="formRules"
          label-width="150px">
        <el-form-item
            label="Robot Name"
            prop="name">
          <el-input
              ref="robotNameInputRefs"
              v-model="formData.name"
              @pressEnter="commit"/>
        </el-form-item>
        <el-form-item
            label="Robot Prompt"
            prop="prompt">
          <el-input
              v-model="formData.prompt"
              @pressEnter="commit"/>
        </el-form-item>
        <el-form-item label="Enable Option">
          <el-switch v-model="formData.options.enabled"/>
        </el-form-item>
        <el-form-item
            v-if="formData.options.enabled"
            label="Api Url"
            prop="apiUrl">
          <el-input v-model="formData.options.apiUrl"/>
        </el-form-item>
        <el-form-item
            v-if="formData.options.enabled"
            label="Model"
            prop="model">
          <el-select v-model="formData.options.model">
            <el-option
                v-for="(item, index) in modelList"
                :key="index"
                :label="item.label"
                :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item
            v-if="formData.options.enabled"
            label="Temperature"
            prop="temperature">
          <el-slider
              class="ml-2"
              v-model="formData.options.temperature"
              :min="0"
              :max="1"
              :step="0.1"
              show-input/>
        </el-form-item>
        <el-form-item
            v-if="formData.options.enabled"
            label="Context Msg"
            prop="context_max_message">
          <el-slider
              class="ml-2"
              v-model="formData.options.context_max_message"
              :min="0"
              :max="20"
              :step="2"
              show-input/>
        </el-form-item>
        <el-form-item
            v-if="formData.options.enabled"
            label="Context Token"
            prop="context_max_tokens">
          <el-slider
              class="ml-2"
              v-model="formData.options.context_max_tokens"
              :min="0"
              :max="4000"
              :step="1"
              show-input/>
        </el-form-item>
        <el-form-item
            v-if="formData.options.enabled"
            label="Res Token"
            prop="response_max_tokens">
          <el-slider
              class="ml-2"
              v-model="formData.options.response_max_tokens"
              :min="0"
              :max="4000"
              :step="1"
              show-input/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button
            type="primary"
            @click="commit">
          Confirm
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
