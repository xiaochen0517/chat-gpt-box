<script setup lang="ts">
type Props = {
  title: string,
  saveButton?: boolean,
  saveButtonText?: string,
  saveButtonIcon?: string,
}
const props = withDefaults(defineProps<Props>(), {
  title: "Default Title",
  saveButton: false,
});
</script>

<template>
  <div class="mx-2 mt-2 py-3 flex flex-row items-center select-none rounded-2xl bg-neutral-100 dark:bg-neutral-900">
    <div
        class="w-8 h-8 ml-4 rounded-md flex justify-center cursor-pointer bg-neutral-200 dark:bg-neutral-700 hover:dark:bg-neutral-600"
        @click.stop="$emit('backClick')"
    >
      <i class="iconfont icon-left-arrow text-base leading-8"/>
    </div>
    <div class="ml-4 text-lg">{{ props.title }}</div>
    <div v-if="saveButton" class="ml-auto">
      <div
          class="w-14 h-8 mr-4 rounded-md flex flex-row justify-center items-center cursor-pointer bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 dark:bg-neutral-700 hover:dark:bg-neutral-600 active:dark:bg-neutral-500"
          @click="$emit('saveClick')"
      >
        <div v-if="props.saveButtonText && props.saveButtonText.length > 0" class="text-md leading-8">
          {{ props.saveButtonText }}
        </div>
        <i v-else class="iconfont text-base" :class="props.saveButtonIcon"/>
      </div>
    </div>
  </div>
</template>
