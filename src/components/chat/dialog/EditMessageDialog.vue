<script setup lang="ts">
import {inject, ref} from "vue";
import {useStore} from "@/store/store.ts";
import _ from "lodash";
import {ElForm, ElMessage} from "element-plus";
import {ChatMessage} from "@/types/Store.ts";

const store = useStore();
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

const robotIndex = ref<number>(0);
const tabIndex = ref<number>(0);
const messageIndex = ref<number>(0);

const editMessageFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const commit = async () => {
  if (!editMessageFormRef.value) return;
  if (!robotIndex.value || !tabIndex.value || !messageIndex.value) {
    ElMessage.warning("Please select a message first")
    return;
  }
  await editMessageFormRef.value.validate((valid, fields) => {
    if (valid) {
      store.updateMessage(robotIndex.value, tabIndex.value, messageIndex.value, formData.value);
      dialogVisible.value = false;
    } else {
      console.log('error', fields);
    }
  });
};

const show = (chatId: string, tIndex: number, mIndex: number) => {
  robotIndex.value = chatId;
  tabIndex.value = tIndex;
  messageIndex.value = mIndex;
  const message = store.chatHistory[chatId][tIndex].chat[mIndex];
  formData.value = _.cloneDeep(message);
  dialogVisible.value = true;
};

defineExpose({
  show
});

const dialogWidth = inject("dialogWidth");
</script>

<template>
  <div class="edit-message-dialog">
    <el-dialog v-model="dialogVisible" title="Edit message" @ok="commit" @cancel="dialogVisible = false" :width="dialogWidth">
      <el-form ref="editMessageFormRef" :model="formData" :rules="formRules" label-width="120px">
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
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="commit">
          Confirm
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
