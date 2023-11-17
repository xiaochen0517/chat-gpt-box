<script setup lang="ts">
import {getCurrentInstance, inject, nextTick, ref} from "vue";
import {useStore} from "vuex";
import {ElForm, ElInput, ElMessage} from "element-plus";

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
const namePlaceholder = ref("");
const formRules = ref({
  name: [
    {
      required: true,
      message: "Please input tab name",
      trigger: "change"
    }
  ]
});

const instance = getCurrentInstance();
const addTabFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const commit = async () => {
  if (!addTabFormRef.value) return;
  if (props.robotIndex < 0) {
    ElMessage.warning("Please select a robot first");
    return;
  }
  if (!formData.value.name || formData.value.name.trim() === "") {
    formData.value.name = namePlaceholder.value;
  }
  await addTabFormRef.value.validate((valid, fields) => {
    if (valid) {
      store.commit("addChatTab", {
        robotIndex: props.robotIndex,
        tabName: formData.value.name,
      });
      dialogVisible.value = false;
      if (!instance) return;
      instance.emit("addTabSuccess");
    } else {
      console.log('error', fields);
    }
  });
};

const show = (newTabIndex: number) => {
  dialogVisible.value = true;
  namePlaceholder.value = `new tab ${newTabIndex}`;
  focusNameInput();
};
const addTabInputRefs = ref<InstanceType<typeof ElInput> | null>(null);
const focusNameInput = () => {
  setTimeout(() => {
    nextTick(() => {
      if (!addTabInputRefs.value) return;
      addTabInputRefs.value.focus();
    });
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
    <el-dialog v-model="dialogVisible" title="Add Tab" :width="dialogWidth" @submit.native.prevent="commit">
      <el-form ref="addTabFormRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="Tab Name" prop="name">
          <el-input
              ref="addTabInputRefs"
              v-model="formData.name"
              @pressEnter.stop="commit"
              :placeholder="namePlaceholder"/>
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
