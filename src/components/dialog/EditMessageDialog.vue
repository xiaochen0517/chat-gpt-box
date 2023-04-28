<script setup>
import {ref} from "vue";
import {useStore} from "vuex";
import {Form} from 'ant-design-vue';
import _ from "lodash";

const store = useStore();
const useForm = Form.useForm;

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

const {validate, validateInfos} = useForm(formData, formRules);
const commit = () => {
  validate().then(() => {
    store.commit("updateMessage", {
      robotIndex: robotIndex.value,
      tabIndex: tabIndex.value,
      messageIndex: messageIndex.value,
      message: formData.value
    });
    dialogVisible.value = false;
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
    <a-modal v-model:visible="dialogVisible" title="Edit message" @ok="commit" @cancel="dialogVisible = false"
             width="50%">
      <a-form :model="formData" :rules="formRules" :label-col="{ span: 4 }">
        <a-form-item label="Role" name="role" v-bind="validateInfos.role">
          <a-select v-model:value="formData.role" placeholder="Please select role">
            <a-select-option value="system">system</a-select-option>
            <a-select-option value="user">user</a-select-option>
            <a-select-option value="assistant">assistant</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Message" name="content" v-bind="validateInfos.content">
          <a-textarea v-model:value="formData.content" :auto-size="{ minRows: 3, maxRows: 6 }"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.edit-message-dialog {

}
</style>
