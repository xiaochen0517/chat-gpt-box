<script setup lang="ts">
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import CDialog from "@/components/base/dialog/CDialog.vue";
import {ElMessage} from "element-plus";
import {ChatInfoTypes, DallEChatOptions} from "@/types/chat/ChatInfoTypes.ts";

type ImageSizeListType = {
  label: string;
  value: string;
}
const DALLE2ImageSizeList: ImageSizeListType[] = [
  {
    label: "256x256",
    value: "256x256"
  },
  {
    label: "512x512",
    value: "512x512"
  },
  {
    label: "1024x1024",
    value: "1024x1024"
  }
];
const DALLE3ImageSizeList: ImageSizeListType[] = [
  {
    label: "1024x1024",
    value: "1024x1024"
  },
  {
    label: "1792x1024",
    value: "1792x1024"
  },
  {
    label: "1024x1792",
    value: "1024x1792"
  }
];

type Props = {
  chatInfo: ChatInfoTypes | null,
}
const props = withDefaults(defineProps<Props>(), {
  chatInfo: null,
});
const imageSizeList = ref<ImageSizeListType[]>([]);
onMounted(() => {
  if (!props.chatInfo) return;
  imageSizeList.value = (props.chatInfo.options as DallEChatOptions).model === "dall-e-3" ? DALLE3ImageSizeList : DALLE2ImageSizeList;
});
watch(() => props.chatInfo, (newValue) => {
  if (!newValue) return;
  imageSizeList.value = (newValue.options as DallEChatOptions).model === "dall-e-3" ? DALLE3ImageSizeList : DALLE2ImageSizeList;
});

const showDialog = ref(false);
const imageSize = ref("1024x1024");
const show = (value: string | null) => {
  showDialog.value = true;
  if (!value) return;
  imageSize.value = value;
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
  if (!imageSize.value || imageSize.value.length === 0) {
    ElMessage.error("Image size it cannot be empty!");
    return;
  }
  instance?.emit("saveOption", "imageSize", imageSize.value);
};
const description = "This parameter is ignored when the model is dall-e-3 because the dall-4-3 model can only generate one image. " +
    "When the model is dall-e-2, this parameter indicates the number of images generated.";
</script>

<template>
  <CDialog v-model:visible="showDialog" title="Image Size" :description="description" @ok="save">
    <el-select v-model="imageSize" placeholder="Please select a quality" width="100%">
      <el-option
          v-for="item in imageSizeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </CDialog>
</template>
