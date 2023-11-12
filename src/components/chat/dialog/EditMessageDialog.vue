<script setup>
import {inject, ref} from "vue";
import {useStore} from "vuex";
import _ from "lodash";

const store = useStore();

const robotIndex = ref(null);
const tabIndex = ref(null);
const messageIndex = ref(null);
const dialogVisible = ref(false);

const formData = ref({
  role: "",
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

const editMessageFormRef = ref(null);
const commit = async () => {
  if (!editMessageFormRef) return;
  await editMessageFormRef.value.validate((valid, fields) => {
    if (valid) {
      store.commit("updateMessage", {
        robotIndex: robotIndex.value,
        tabIndex: tabIndex.value,
        messageIndex: messageIndex.value,
        message: formData.value
      });
      editMessageFormRef.value.resetFields();
      dialogVisible.value = false;
    } else {
      console.log('error', fields);
    }
  });
};

const show = (rIndex, tIndex, mIndex) => {
  robotIndex.value = rIndex;
  tabIndex.value = tIndex;
  messageIndex.value = mIndex;
  const message = store.state.chatHistory[rIndex][tIndex].chat[mIndex];
  formData.value = _.cloneDeep(message);
  dialogVisible.value = true;
};

defineExpose({
  show
});

// 通过判断窗口宽度来设置对话框宽度
const dialogWidth = inject("dialogWidth");
</script>

<template>
  <div class="edit-message-dialog">
    <el-dialog
        v-model="dialogVisible"
        title="Edit message"
        @ok="commit"
        @cancel="dialogVisible = false"
        ：width="dialogWidth">
      <el-form
          ref="editMessageFormRef"
          :model="formData"
          :rules="formRules"
          label-width="120px">
        <el-form-item
            label="Role"
            prop="role">
          <el-select
              v-model="formData.role"
              placeholder="Please select role">
            <el-option value="system">system</el-option>
            <el-option value="user">user</el-option>
            <el-option value="assistant">assistant</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
            label="Message"
            prop="content">
          <el-input
              type="textarea"
              v-model="formData.content"
              :auto-size="{ minRows: 3, maxRows: 6 }"/>
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
