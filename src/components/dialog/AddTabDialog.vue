<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {Form} from 'ant-design-vue';

const useForm = Form.useForm;

const store = useStore();

const props = defineProps({
  robotIndex: {
    type: Number,
    default: 0
  },
});

onMounted(() => {
});

const dialogVisible = ref(false);
const formData = ref({
  name: ""
});
const formRules = ref({
  name: [
    {
      required: true,
      message: "Please input tab name",
      trigger: "blur"
    }
  ]
});
const {resetFields, validate} = useForm(formData, formRules);
const commit = () => {
  validate().then(() => {
    console.log("validate success");
    addTab();
  }).catch(() => {
    console.log("validate fail");
  });
};
const addTab = () => {
  store.commit("addChatTab", {
    robotIndex: props.robotIndex,
    tabName: formData.value.name,
  });
  resetFields();
  dialogVisible.value = false;
};

const addTabInputRefs = ref(null);
const focusNameInput = () => {
  nextTick(() => {
    addTabInputRefs.value.focus();
  });
};
const show = () => {
  console.log("show");
  dialogVisible.value = true;
  focusNameInput();
};
defineExpose({
  show
});
</script>

<template>
  <div class="add-tab-dialog">
    <a-modal v-model:visible="dialogVisible" title="Add Tab" @ok="commit" @cancel="dialogVisible = false">
      <a-form :model="formData" :rules="formRules">
        <a-form-item label="Tab Name" name="name">
          <a-input ref="addTabInputRefs" v-model:value="formData.name" @pressEnter="commit"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>

</style>
