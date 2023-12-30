<script setup lang="ts">
import {getCurrentInstance, inject, onMounted, ref, watch} from "vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;

const keys = useMagicKeys();
const instance = getCurrentInstance();
whenever(keys["escape"], () => {
  cancelDialog();
});
whenever(keys["enter"], () => {
  instance?.emit("ok");
});

type Props = {
  visible: boolean,
  title: string,
  cancelText?: string | null,
  okText?: string | null,
  description?: string
  size?: "default" | "large"
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: "",
  cancelText: null,
  okText: null,
  description: "",
  size: "default",
});

const propsCancelText = ref("CANCEL");
const propsOkText = ref("OK");

onMounted(() => {
  propsCancelText.value = !props.cancelText ? t("dialog.cancel") : props.cancelText;
  propsOkText.value = !props.okText ? t("dialog.confirm") : props.okText;
});

const showDialog = ref(false);
watch(() => props.visible, (value) => {
  showDialog.value = value;
});
watch(showDialog, (value) => {
  if (!instance) return;
  instance.emit("update:visible", value);
});

const cancelDialog = () => {
  if (!instance) return;
  showDialog.value = false;
  instance.emit("cancel");
};

const dialogWidth = inject("dialogWidth");
const dialogWidthLg = inject("dialogWidthLg");
</script>

<template>
  <el-dialog
      v-model="showDialog"
      close-on-click-modal
      :show-close="false"
      :width="size == 'large' ? dialogWidthLg : dialogWidth"
  >
    <div class="bg-neutral-100 dark:bg-neutral-800">
      <div v-if="title && title.length !== 0" slot="title">
        <div class="text-lg leading-12 text-center">{{ title }}</div>
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
            @click.stop="cancelDialog"
        >
          {{ propsCancelText }}
        </div>
        <div class="border-l border-neutral-100 dark:border-neutral-700 box-border"></div>
        <div
            class="flex-1 cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 hover:dark:bg-neutral-700 active:dark:bg-neutral-600"
            @click.stop="$emit('ok')"
        >
          {{ propsOkText }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>