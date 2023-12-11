<script setup lang="ts">
import {getCurrentInstance, ref} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";

type QualityListType = {
  label: string;
  value: string;
}
const QualityList: QualityListType[] = [
  {
    label: "standard",
    value: "standard"
  },
  {
    label: "hd",
    value: "hd"
  },
];

const showDialog = ref(false);
const imageQuality = ref("standard");
const show = (value: string | null) => {
  showDialog.value = true;
  if (!value) return;
  imageQuality.value = value;
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
  if (!imageQuality.value || imageQuality.value.length === 0) {
    ElMessage.error("Image quality must not be empty!");
    return;
  }
  instance?.emit("save", "imageQuality", imageQuality.value);
};
const description = "This parameter is ignored when the model is dall-e-2 because the dall-4-2 model can only support standard quality. " +
    "When the model is dall-e-3, this parameter indicates the quality of images generated.";
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Image Count" :description="description" @ok="save">
    <el-select v-model="imageQuality" placeholder="Please select a quality" width="100%">
      <el-option
          v-for="item in QualityList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </CDialog>
</template>
