<script setup lang="ts">
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
  <div class="mx-2 py-3 flex flex-row items-center select-none rounded-b-xl border shadow-md bg-neutral-100 dark:border-0 dark:bg-neutral-800">
    <div
        class="w-8 h-8 ml-4 rounded-lg flex justify-center cursor-pointer bg-neutral-200 dark:bg-neutral-700 hover:dark:bg-neutral-600"
        @click.stop="$emit('backClick')"
    >
      <i class="iconfont icon-left-arrow text-base leading-8"/>
    </div>
    <div class="ml-4 text-lg">{{ props.title }}</div>
    <div v-if="saveButton" class="ml-auto">
      <div
          class="w-14 mr-4 rounded-lg flex justify-center items-center cursor-pointer bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-500"
          @click="$emit('saveClick')"
      >
        <div class="text-md leading-8">{{ props.saveButtonText }}</div>
      </div>
    </div>
  </div>
</template>