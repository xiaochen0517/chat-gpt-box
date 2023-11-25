<script setup lang="ts">
import {ref} from "vue";
import _ from "lodash";
import {ElForm, ElInput, ElMessage} from "element-plus";
import {ChatMessage} from "@/types/Store.ts";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import CDialog from "@/components/base/dialog/CDialog.vue";

const dialogVisible = ref(false);

const formData = ref<ChatMessage>({
  role: "system",
  content: ""
});
const formRules = ref({
  role: [
    {
      required: true,
      message: "Please input role",
      trigger: "blur"
    }
  ],
  content: [
    {
      required: true,
      message: "Please input message",
      trigger: "blur"
    }
  ]
});

const chatId = ref<string | null>(null);
const tabIndex = ref<number>(0);
const messageIndex = ref<number>(0);

const editMessageFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const chatTabsStore = useChatTabsStore();
const commit = async () => {
  if (!editMessageFormRef.value) return;
  if (!chatId.value || !tabIndex.value || !messageIndex.value) {
    ElMessage.warning("Please select a message first")
    return;
  }
  await editMessageFormRef.value.validate((valid, fields) => {
    if (valid && chatId.value) {
      chatTabsStore.updateMessage(chatId.value, tabIndex.value, messageIndex.value, formData.value);
      dialogVisible.value = false;
    } else {
      console.log('error', fields);
    }
  });
};

const show = (id: string, tIndex: number, mIndex: number) => {
  chatId.value = id;
  tabIndex.value = tIndex;
  messageIndex.value = mIndex;
  const message = chatTabsStore.chatTabs[chatId.value][tIndex].chat[mIndex];
  formData.value = _.cloneDeep(message);
  dialogVisible.value = true;
};

defineExpose({
  show
});
</script>

<template>
  <CDialog v-model:visible="dialogVisible" title="Edit Message" @ok.stop="commit" size="large">
    <el-form
        class="w-full"
        ref="editMessageFormRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="left">
      <el-form-item label="Role" prop="role">
        <el-select v-model="formData.role" placeholder="Please select role">
          <el-option value="system">system</el-option>
          <el-option value="user">user</el-option>
          <el-option value="assistant">assistant</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Message" prop="content">
        <el-input type="textarea" v-model="formData.content" :auto-size="{ minRows: 3, maxRows: 6 }"/>
      </el-form-item>
    </el-form>
  </CDialog>
</template>
