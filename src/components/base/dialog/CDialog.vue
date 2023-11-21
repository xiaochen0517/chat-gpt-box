<script setup lang="ts">

import {getCurrentInstance, inject, ref, watch} from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  cancelText: {
    type: String,
    default: "CANCEL"
  },
  okText: {
    type: String,
    default: "OK"
  },
  description: {
    type: String,
    default: ""
  }
});

const showDialog = ref(false);
watch(() => props.visible, (value) => {
  showDialog.value = value;
})
watch(showDialog, (value) => {
  if (!instance) return;
  instance.emit("update:visible", value);
})

const instance = getCurrentInstance();
const cancelDialog = () => {
  showDialog.value = false;
  instance.emit("cancel");
}

const dialogWidth = inject("dialogWidth");
</script>

<template>
  <el-dialog v-model="showDialog" close-on-click-modal :show-close="false" :width="dialogWidth">
    <div class="bg-neutral-100 dark:bg-neutral-800">
      <div v-if="title && title.length !== 0" slot="title">
        <div class="text-base leading-10 text-center">{{ title }}</div>
        <div v-if="description && description.length !== 0" class="px-4 pb-1">
          <i class="iconfont icon-info-circle text-neutral-500 dark:text-neutral-400"></i>
          {{ description }}
        </div>
      </div>
      <div class="w-full px-4 pt-1 pb-4 flex flex-row">
        <slot></slot>
      </div>
      <div class="flex flex-row text-center text-md leading-10 border-t border-neutral-100 dark:border-neutral-700 select-none">
        <div
            class="flex-1 cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 hover:dark:bg-neutral-700 active:dark:bg-neutral-600"
            @click.stop="cancelDialog">
          {{ cancelText }}
        </div>
        <div class="border-l border-neutral-100 dark:border-neutral-700 box-border"></div>
        <div
            class="flex-1 cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 hover:dark:bg-neutral-700 active:dark:bg-neutral-600"
            @click.stop="$emit('ok')">
          {{ okText }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="less">

</style>