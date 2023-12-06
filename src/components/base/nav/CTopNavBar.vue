<script setup lang="ts">
import {useMagicKeys, whenever} from "@vueuse/core";
import {getCurrentInstance} from "vue";

const keys = useMagicKeys();
const instance = getCurrentInstance();
whenever(keys["escape"], () => {
  instance?.emit("backClick");
});
whenever(keys["enter"], () => {
  if (!props.saveButton) return;
  instance?.emit("saveClick");
});

type Props = {
  title: string,
  saveButton?: boolean,
  saveButtonText?: string,
}
const props = withDefaults(defineProps<Props>(), {
  title: "Default Title",
  saveButton: false,
  saveButtonText: "Save",
});
</script>

<template>
  <div class="w-full flex flex-row items-center select-none rounded-b-2xl bg-neutral-100 dark:bg-neutral-800">
    <div
        class="w-10 h-10 ml-4 rounded-xl flex justify-center cursor-pointer bg-neutral-200 dark:bg-neutral-700 hover:dark:bg-neutral-600"
        @click.stop="$emit('backClick')"
    >
      <i class="iconfont icon-left-arrow text-xl leading-10"/>
    </div>
    <div class="ml-4 text-xl leading-16">{{ props.title }}</div>
    <div v-if="saveButton" class="ml-auto">
      <div
          class="w-20 h-10 mr-4 rounded-xl flex justify-center items-center cursor-pointer bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-500"
          @click="$emit('saveClick')"
      >
        <div class="text-md leading-10">{{ props.saveButtonText }}</div>
      </div>
    </div>
  </div>
</template>