<script setup>
import {ref} from "vue";
import {useStore} from "vuex";
import {Form} from 'ant-design-vue';

const store = useStore();
const useForm = Form.useForm;

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

const {resetFields, validate} = useForm(formData, formRules);
const onSubmit = () => {
};

const commit = () => {
  console.log("commit", formData.value);
  validate().then(() => {
    store.commit("addRobot", {
      prompt: formData.value.prompt,
      name: formData.value.name,
      options: {
        model: formData.value.model,
        max_tokens: formData.value.max_tokens
      }
    });
    resetFields();
    dialogVisible.value = false;
  }).catch(err => {
    console.log('error', err);
  });
};

const show = () => {
  dialogVisible.value = true;
};

defineExpose({
  show
});
</script>

<template>
  <div class="add-robot-dialog">
    <a-modal v-model:visible="dialogVisible" title="Add robot" @ok="commit" @cancel="dialogVisible = false">
      <a-form :model="formData" :rules="formRules" :label-col="{span: 8}">
        <a-form-item label="Robot Name">
          <a-input v-model:value="formData.name"/>
        </a-form-item>
        <a-form-item label="Robot Prompt">
          <a-input v-model:value="formData.prompt"/>
        </a-form-item>
        <a-form-item label="Robot Model">
          <a-select v-model:value="formData.model">
            <a-select-option value="gpt-3.5-turbo">gpt-3.5-turbo</a-select-option>
            <a-select-option value="gpt-3.5">gpt-3.5</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Robot Max Tokens">
          <a-input-number v-model:value="formData.max_tokens"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.add-robot-dialog {

}
</style>
