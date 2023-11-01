<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useStore} from "vuex";

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

const commit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      addTab();
    } else {
      console.log('error', fields);
    }
  });
};
const addTab = () => {
  store.commit("addChatTab", {
    robotIndex: props.robotIndex,
    tabName: formData.value.name,
  });
  dialogVisible.value = false;
};

const addTabInputRefs = ref(null);
const focusNameInput = () => {
  nextTick(() => {
    addTabInputRefs.value.focus();
  });
};
const show = () => {
  dialogVisible.value = true;
  focusNameInput();
};
defineExpose({
  show
});
</script>

<template>
  <div class="add-tab-dialog">
    <el-dialog v-model="dialogVisible" title="Add Tab">
      <el-form ref="rulesFormRef" :model="formData" :rules="formRules">
        <el-form-item label="Tab Name" name="name">
          <el-input ref="addTabInputRefs" v-model="formData.name" @pressEnter="commit"/>
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
