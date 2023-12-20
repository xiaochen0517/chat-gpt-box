<script setup lang="ts">
import CDialog from "@/components/base/dialog/CDialog.vue";
import {getCurrentInstance, ref} from "vue";

type DialogType = "input" | "slider";
type ShowOption = {
  type: DialogType;
  title: string;
  description?: string;
  placeholder?: string;
  content?: string;
};
const type = ref("input");
const title = ref("");
const description = ref("");
const placeholder = ref("");
const content = ref("");
const sliderOptions = ref({
  min: 0,
  max: 20,
  step: 1,
  showInput: true,
  size: "small"
});

const showDialog = ref(false);
let resolveFunc: (value: string | PromiseLike<string>) => void | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rejectFunc: (reason?: any) => void | null = null;
const show = (option: ShowOption): Promise<string> => {
  type.value = option.type;
  title.value = option.title;
  description.value = option.description || "";
  placeholder.value = option.placeholder || "";
  content.value = option.content || "";
  showDialog.value = true;
  return new Promise<string>((resolve, reject) => {
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
  showDialog.value = false;
  instance.emit("ok");
  if (!resolveFunc) return;
  resolveFunc(content.value);
};
const cancel = () => {
  if (!instance) return;
  showDialog.value = false;
  instance.emit("cancel");
  if (!rejectFunc) return;
  rejectFunc();
};
</script>

<template>
  <CDialog
      v-model:visible="showDialog"
      :title="title"
      :description="description"
      @cancel="cancel"
      @ok="ok($event)"
  >
    <div class="px-2 w-full">
      <el-input v-if="type === 'input'" v-model="content" :placeholder="placeholder"/>
      <el-slider
          v-else-if="type === 'slider'"
          v-model="content"
          :min="sliderOptions.min"
          :max="sliderOptions.max"
          :step="sliderOptions.step"
          show-input
          size="small"
      />
    </div>
  </CDialog>
</template>