<script setup>
import {getCurrentInstance, inject, nextTick, ref} from "vue";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";

const {emit} = getCurrentInstance();

const store = useStore();

const props = defineProps({
  robotIndex: {
    type: Number,
    default: -1
  },
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

const addTabFormRef = ref(null);
const commit = async () => {
  if (!addTabFormRef) return;
  if (props.robotIndex < 0) {
    ElMessage.warning("Please select a robot first");
    return;
  }
  await addTabFormRef.value.validate((valid, fields) => {
    if (valid) {
      store.commit("addChatTab", {
        robotIndex: props.robotIndex,
        tabName: formData.value.name,
      });
      dialogVisible.value = false;
      addTabFormRef.value.resetFields();
      emit("addTabSuccess");
    } else {
      console.log('error', fields);
    }
  });
};

const show = () => {
  dialogVisible.value = true;
  focusNameInput();
};
const addTabInputRefs = ref(null);
const focusNameInput = () => {
  nextTick(() => {
    addTabInputRefs.value.focus();
  });
};

defineExpose({
  show
});

// 通过判断窗口宽度来设置对话框宽度
const dialogWidth = inject("dialogWidth");
</script>

<template>
  <div class="add-tab-dialog">
    <el-dialog
        v-model="dialogVisible"
        title="Add Tab"
        :width="dialogWidth">
      <el-form
          ref="addTabFormRef"
          :model="formData"
          :rules="formRules"
          label-width="120px">
        <el-form-item
            label="Tab Name"
            prop="name">
          <el-input
              ref="addTabInputRefs"
              v-model="formData.name"
              @pressEnter="commit"/>
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
