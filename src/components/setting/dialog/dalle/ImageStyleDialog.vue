<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

type ImageStyleListType = {
  label: string;
  value: string;
}
const ImageStyleList: ImageStyleListType[] = [
  {
    label: "vivid",
    value: "vivid"
  },
  {
    label: "natural",
    value: "natural"
  }
];

const showDialog = ref(false);
const imageStyle = ref("vivid");
const show = (value: string | null) => {
  showDialog.value = true;
  if (!value) return;
  imageStyle.value = value;
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
  if (!imageStyle.value || imageStyle.value.length === 0) {
    ElMessage.error("Image style it cannot be empty!");
    return;
  }
  instance?.emit("save", "imageStyle", imageStyle.value);
};
const description = "This parameter is ignored when the model is dall-e-3 because the dall-4-3 model can only generate one image. " +
    "When the model is dall-e-2, this parameter indicates the number of images generated.";
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Image Count" :description="description" @ok="save">
    <el-select v-model="imageStyle" placeholder="Please select a quality" width="100%">
      <el-option
          v-for="item in ImageStyleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </CDialog>
</template>
