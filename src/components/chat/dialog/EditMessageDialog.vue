<script setup lang="ts">
import {ref} from "vue";
import _ from "lodash";
import {ElForm, ElInput, ElMessage} from "element-plus";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ChatMessage, ChatMessageRole} from "@/types/chat/ChatTabInfo.ts";
import logger from "@/utils/logger/Logger.ts";

const dialogVisible = ref(false);

const formData = ref<ChatMessage>({
  role: ChatMessageRole.System,
  content: "",
});
const formRules = ref({
  content: [
    {
      required: true,
      message: "Please input message",
      trigger: "blur",
    },
  ],
});

const chatId = ref<string | null>(null);
const tabIndex = ref<number>(0);
const messageIndex = ref<number>(0);

const editMessageFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const chatTabsStore = useChatTabsStore();
const commit = async () => {
  if (!editMessageFormRef.value) return;
  const errorMessage = checkParams();
  if (errorMessage && errorMessage.length > 0) {
    ElMessage.error(errorMessage);
    return;
  }
  await editMessageFormRef.value.validate((valid, fields) => {
    if (valid && chatId.value) {
      chatTabsStore.updateMessage(chatId.value, tabIndex.value, messageIndex.value, formData.value);
      dialogVisible.value = false;
    } else {
      logger.error("Edit message form validate failure", fields);
    }
  });
};

const checkParams = (): string | null => {
  if (!chatId.value || chatId.value.length === 0) {
    return "Chat ID is empty";
  }
  if (tabIndex.value < 0) {
    return "Tab index is invalid";
  }
  if (messageIndex.value < 0) {
    return "Message index is invalid";
  }
  return null;
};

const show = (message: ChatMessage, id: string, tIndex: number, mIndex: number) => {
  chatId.value = id;
  tabIndex.value = tIndex;
  messageIndex.value = mIndex;
  formData.value = _.cloneDeep(message);
  dialogVisible.value = true;
};

defineExpose({
  show,
});
</script>

<template>
  <CDialog
      v-model:visible="dialogVisible"
      title="Edit Message"
      size="large"
      :disable-enter="true"
      @okClick="commit"
  >
    <el-form
        class="w-full"
        ref="editMessageFormRef"
        :model="formData"
        :rules="formRules"
    >
      <el-form-item prop="content">
        <el-input type="textarea" v-model="formData.content" :rows="15" :auto-size="{ minRows: 15, maxRows: 20 }"/>
      </el-form-item>
    </el-form>
  </CDialog>
</template>
