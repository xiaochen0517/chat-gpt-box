<script setup lang="ts">
import {getCurrentInstance, nextTick, ref} from "vue";
import {useChatTabsStore} from "@/store/ChatTabsStore.ts";
import {ElForm, ElInput, ElMessage} from "element-plus";
import CDialog from "@/components/base/dialog/CDialog.vue";

type Props = {
  chatId: string | null,
}
const props = withDefaults(defineProps<Props>(), {
  chatId: null,
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

const chatTabsStore = useChatTabsStore();
const instance = getCurrentInstance();
const addTabFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const commit = async () => {
  if (!addTabFormRef.value) return;
  if (!props.chatId) {
    ElMessage.warning("Please select a robot first");
    return;
  }
  if (!formData.value.name || formData.value.name.trim() === "") {
    formData.value.name = namePlaceholder.value;
  }
  await addTabFormRef.value.validate((valid, fields) => {
    if (valid && props.chatId) {
      chatTabsStore.addChatTab(props.chatId, formData.value.name);
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
</script>

<template>
  <CDialog v-model:visible="dialogVisible" title="Add Tab" @ok.stop="commit">
    <el-form
        class="w-full"
        ref="addTabFormRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="left">
      <el-form-item label="Tab Name" prop="name">
        <el-input
            ref="addTabInputRefs"
            v-model="formData.name"
            @pressEnter.stop="commit"
            :placeholder="namePlaceholder"/>
      </el-form-item>
    </el-form>
  </CDialog>
</template>
