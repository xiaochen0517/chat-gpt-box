<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

const showDialog = ref(false);
const imageCount = ref(1);
const show = (value: number | null) => {
  showDialog.value = true;
  if (!value) return;
  imageCount.value = value;
};
const hide = () => {
  showDialog.value = false;
};
defineExpose({
  show,
  hide
});

const instance = getCurrentInstance();
const save = () => {
  if (imageCount.value < 1 || imageCount.value > 10) {
    ElMessage.error("Image count must be between 1 and 10!");
    return;
  }
  instance?.emit("save", "imageCount", imageCount.value);
};
const description = "This parameter is ignored when the model is dall-e-3 because the dall-4-3 model can only generate one image. " +
    "When the model is dall-e-2, this parameter indicates the number of images generated.";
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Image Count" :description="description" @ok="save">
    <el-slider
        class="px-2"
        v-model="imageCount"
        :min="1"
        :max="10"
        :step="1"
        show-input
        size="small"
    />
  </CDialog>
</template>
