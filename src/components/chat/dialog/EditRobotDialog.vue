<script setup>
import {getCurrentInstance, nextTick, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";

const store = useStore();

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
});

const dialogVisible = ref(false);
const formData = ref({
  name: "",
  prompt: "",
  model: "gpt-3.5-turbo",
  max_tokens: 2048
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
  model: [
    {
      required: true,
      message: "Please input robot model",
      trigger: "blur"
    }
  ],
  max_tokens: [
    {
      required: true,
      message: "Please input robot max_tokens",
      trigger: "blur"
    }
  ]
});

const robotIndex = ref(null);
const instance = getCurrentInstance();

const commit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (props.isEdit) {
        updateRobot();
      } else {
        addRobot();
      }
      formEl.resetFields();
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
    robotIndex: robotIndex,
    robot: {
      prompt: formData.value.prompt,
      name: formData.value.name,
      options: {
        model: formData.value.model,
        max_tokens: formData.value.max_tokens
      }
    }
  });
};

const addRobot = () => {
  store.commit("addRobot", {
    prompt: formData.value.prompt,
    name: formData.value.name,
    options: {
      model: formData.value.model,
      max_tokens: formData.value.max_tokens
    }
  });
  instance.emit("commit", formData.value);
};

const robotNameInputRefs = ref(null);
const focusNameInput = () => {
  nextTick(() => {
    robotNameInputRefs.value.focus();
  });
};

const show = (index) => {
  if (props.isEdit) {
    robotIndex.value = index;
    const robotInfo = _.cloneDeep(store.state.robotList[index]);
    formData.value.name = robotInfo.name;
    formData.value.prompt = robotInfo.prompt;
    formData.value.model = robotInfo.options.model;
    formData.value.max_tokens = robotInfo.options.max_tokens;
  }
  dialogVisible.value = true;
  focusNameInput();
};

defineExpose({
  show
});
</script>

<template>
  <div class="add-robot-dialog">
    <el-dialog v-model="dialogVisible" title="Add robot">
      <el-form ref="rulesFormRef" :model="formData" :rules="formRules" :label-col="{span: 8}">
        <el-form-item label="Robot Name">
          <el-input ref="robotNameInputRefs" v-model:value="formData.name" @pressEnter="commit"/>
        </el-form-item>
        <el-form-item label="Robot Prompt">
          <el-input v-model:value="formData.prompt" @pressEnter="commit"/>
        </el-form-item>
        <el-form-item label="Robot Model">
          <el-select v-model:value="formData.model" @keydown.enter="commit">
            <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo"/>
            <el-option label="gpt-3.5-turbo-0301" value="gpt-3.5-turbo-0301"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Robot Max Tokens">
          <el-input type="number" v-model:value="formData.max_tokens" @pressEnter="commit"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="commit(rulesFormRef)">
          Confirm
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
