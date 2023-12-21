<script setup lang="ts">
import CDialog from "@/components/base/dialog/CDialog.vue";
import {getCurrentInstance, ref} from "vue";
import {ShowOption} from "@/types/base/CSettingDialog.ts";

const dialogOptions = ref<ShowOption>({
  type: "input",
  title: "None",
  content: ""
});
const defaultOption: ShowOption = {
  type: "input",
  title: "None",
  description: "",
  placeholder: "",
  content: "",
  sliderOptions: {
    min: 0,
    max: 20,
    step: 1,
    showInput: true,
    size: "small"
  }
};

const showDialog = ref(false);
let resolveFunc: ((value: string | number | PromiseLike<string | number>) => void) | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rejectFunc: ((reason?: any) => void) | null = null;
const show = (option: ShowOption): Promise<string | number> => {
  dialogOptions.value = {
    ...defaultOption,
    ...option
  };
  showDialog.value = true;
  return new Promise<string | number>((resolve, reject) => {
    resolveFunc = resolve;
    rejectFunc = reject;
  });
};
const hide = () => {
  showDialog.value = false;
};
defineExpose({
  show,
  hide
});

const instance = getCurrentInstance();
const ok = () => {
  if (!instance) return;
  instance.emit("ok");
  if (!resolveFunc) return;
  resolveFunc(dialogOptions.value.content);
};
const cancel = () => {
  if (!instance || !rejectFunc) return;
  showDialog.value = false;
  instance.emit("cancel");
  rejectFunc();
};
</script>

<template>
  <CDialog
      v-model:visible="showDialog"
      :title="dialogOptions.title"
      :description="dialogOptions.description"
      @cancel="cancel"
      @ok="ok()"
  >
    <div class="px-2 w-full">
      <el-input
          v-if="dialogOptions.type === 'input'"
          v-model="dialogOptions.content"
          :placeholder="dialogOptions.placeholder"
      />
      <el-slider
          v-else-if="dialogOptions.type === 'slider'"
          v-model="dialogOptions.content"
          :min="dialogOptions.sliderOptions?.min"
          :max="dialogOptions.sliderOptions?.max"
          :step="dialogOptions.sliderOptions?.step"
          show-input
          size="small"
      />
      <el-select v-else-if="dialogOptions.type === 'select'" v-model="dialogOptions.content">
        <el-option
            v-for="item in dialogOptions.selectOptions?.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
  </CDialog>
</template>