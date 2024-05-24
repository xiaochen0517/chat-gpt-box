<script setup lang="ts">
import {getCurrentInstance, inject, onMounted, ref, watch} from "vue";
import {useMagicKeys, whenever} from "@vueuse/core";
import i18n from "@/i18n/i18n.ts";
import {ExpandButton} from "@/types/base/CSettingDialog.ts";

const {t} = i18n.global;

const keys = useMagicKeys();
const instance = getCurrentInstance();
whenever(keys["escape"], () => {
  if (props.disableEscape) return;
  cancelDialog();
});
whenever(keys["enter"], () => {
  if (props.disableEnter) return;
  instance?.emit("okClick");
});

type Props = {
  visible: boolean,
  title: string,
  cancelText?: string | null,
  okText?: string | null,
  description?: string,
  descAlign?: "left" | "center" | "right",
  size?: "default" | "large",
  disableEnter?: boolean
  disableEscape?: boolean
  expandButtons?: ExpandButton[]
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: "",
  cancelText: null,
  okText: null,
  description: "",
  descAlign: "left",
  size: "default",
  disableEnter: false,
  disableEscape: false,
  expandButtons: () => [],
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
  instance.emit("cancelClick");
};

const dialogWidth = inject("dialogWidth");
const dialogWidthLg = inject("dialogWidthLg");

defineEmits(["update:visible", "okClick", "cancelClick", "expandClick"]);
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
        <div
            v-if="description && description.length !== 0"
            class="px-4 pb-1 flex flex-row gap-1"
            :class="{'justify-end': descAlign === 'right', 'justify-center': descAlign === 'center'}"
        >
          <i class="iconfont icon-info-circle text-neutral-500 dark:text-neutral-400"></i>
          {{ description }}
        </div>
      </div>
      <div class="w-full px-4 pt-1 pb-4 flex flex-row">
        <slot></slot>
      </div>
      <div class="flex flex-row gap-2 justify-end p-2 text-center border-t border-neutral-100 dark:border-neutral-700 select-none">
        <div
            class="border rounded-md dark:border-neutral-700 text-base leading-8 px-2 cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 hover:dark:bg-neutral-700 active:dark:bg-neutral-600"
            @click.stop="cancelDialog"
        >
          {{ propsCancelText }}
        </div>
        <div
            v-for="expandInfo in expandButtons"
            :key="expandInfo.key"
            class="border rounded-md dark:border-cyan-800 text-base leading-8 px-2 cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 dark:bg-cyan-700 hover:dark:bg-cyan-800 active:dark:bg-cyan-900"
            @click.stop="$emit('expandClick', expandInfo.key)"
        >
          {{ expandInfo.text }}
        </div>
        <div
            class="border rounded-md dark:border-cyan-800 text-base leading-8 px-2 cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 dark:bg-cyan-700 hover:dark:bg-cyan-800 active:dark:bg-cyan-900"
            @click.stop="$emit('okClick')"
        >
          {{ propsOkText }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
