<script setup lang="ts">
import {getCurrentInstance, inject, nextTick, ref, onMounted} from "vue";
import _ from "lodash";
import modelList from "@/utils/ModelList.ts";
import {ElForm, ElInput} from "element-plus";
import {ChatInfo} from "@/types/Store.ts";
import {useChatListStore} from "@/store/ChatList.ts";

const chatListStore = useChatListStore();

const isEdit = ref(false);

const dialogVisible = ref(false);
const formData = ref<ChatInfo>({
  id: "",
  name: "Default Chat",
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

const currentChatInfo = ref<ChatInfo | null>(null);

const rulesFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const commit = async () => {
  if (!rulesFormRef.value) return;
  await rulesFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (isEdit.value) {
        updateRobot();
      } else {
        addRobot();
      }
      dialogVisible.value = false;
    } else {
      console.log('error', fields);
    }
  });
};

const updateRobot = () => {
  if (currentChatInfo.value == null) {
    return;
  }
  chatListStore.updateChat(currentChatInfo.value.id, formData.value);
};

const instance = getCurrentInstance();
const addRobot = () => {
  chatListStore.addChat(formData.value);
  if (!instance) return;
  instance.emit("commit", formData.value);
};

const robotNameInputRefs = ref<InstanceType<typeof ElInput> | null>(null);
const focusNameInput = () => {
  nextTick(() => {
    if (!robotNameInputRefs.value) return;
    robotNameInputRefs.value.focus();
  });
};

const show = (edit: boolean, chatInfo: ChatInfo | null) => {
  isEdit.value = edit;
  if (isEdit.value) {
    if (chatInfo == null) {
      console.error("edit chat info can not be null.")
      return;
    }
    currentChatInfo.value = chatInfo;
    formData.value = _.cloneDeep(chatInfo);
  }
  dialogVisible.value = true;
  focusNameInput();
};

defineExpose({
  show
});

const dialogWidth = inject("dialogWidth");
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="isEdit?'Edit robot':'Add robot'" :width="dialogWidth">
    <el-form ref="rulesFormRef" :model="formData" :rules="formRules" label-width="150px">
      <el-form-item label="Robot Name" prop="name">
        <el-input ref="robotNameInputRefs" v-model="formData.name" @pressEnter="commit"/>
      </el-form-item>
      <el-form-item label="Robot Prompt" prop="prompt">
        <el-input v-model="formData.prompt" @pressEnter="commit"/>
      </el-form-item>
      <el-form-item label="Enable Option">
        <el-switch v-model="formData.options.enabled"/>
      </el-form-item>
      <el-form-item v-if="formData.options.enabled" label="Api Url" prop="apiUrl">
        <el-input v-model="formData.options.apiUrl"/>
      </el-form-item>
      <el-form-item v-if="formData.options.enabled" label="Model" prop="model">
        <el-select v-model="formData.options.model">
          <el-option v-for="(item, index) in modelList" :key="index" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.options.enabled" label="Temperature" prop="temperature">
        <el-slider class="ml-2" v-model="formData.options.temperature" :min="0" :max="1" :step="0.1" show-input/>
      </el-form-item>
      <el-form-item v-if="formData.options.enabled" label="Context Msg" prop="context_max_message">
        <el-slider
            class="ml-2"
            v-model="formData.options.context_max_message"
            :min="0"
            :max="20"
            :step="2"
            show-input/>
      </el-form-item>
      <el-form-item v-if="formData.options.enabled" label="Context Token" prop="context_max_tokens">
        <el-slider
            class="ml-2"
            v-model="formData.options.context_max_tokens"
            :min="0"
            :max="4000"
            :step="1"
            show-input/>
      </el-form-item>
      <el-form-item v-if="formData.options.enabled" label="Res Token" prop="response_max_tokens">
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
        <el-button type="primary" @click="commit">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
