<script setup>
import {ref} from "vue";
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

const commit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      store.commit("updateMessage", {
        robotIndex: robotIndex.value,
        tabIndex: tabIndex.value,
        messageIndex: messageIndex.value,
        message: formData.value
      });
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
</script>

<template>
  <div class="edit-message-dialog">
    <el-dialog v-model="dialogVisible" title="Edit message" @ok="commit" @cancel="dialogVisible = false"
               width="50%">
      <el-form ref="rulesFormRef" :model="formData" :rules="formRules" :label-col="{ span: 4 }">
        <el-form-item label="Role" name="role">
          <el-select v-model:value="formData.role" placeholder="Please select role">
            <el-option value="system">system</el-option>
            <el-option value="user">user</el-option>
            <el-option value="assistant">assistant</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Message" name="content">
          <el-input type="textarea" v-model:value="formData.content" :auto-size="{ minRows: 3, maxRows: 6 }"/>
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
