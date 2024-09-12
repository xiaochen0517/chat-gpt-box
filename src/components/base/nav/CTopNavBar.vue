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
  <div class="w-full h-12">
    <div class="fixed w-full px-4 pt-2">
      <div class="py-1.5 flex flex-row items-center select-none rounded-2xl bg-neutral-100 border border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800">
        <div
            class="w-8 h-8 ml-4 rounded-md flex justify-center cursor-pointer hover:dark:bg-neutral-800 hover:bg-opacity-20 active:dark:bg-neutral-800 active:bg-opacity-80"
            @click.stop="$emit('backClick')"
        >
          <i class="iconfont icon-left-arrow text-base leading-8"/>
        </div>
        <div class="ml-4 text-lg font-bold">{{ props.title }}</div>
        <div v-if="saveButton" class="ml-auto">
          <div
              class="w-14 h-8 mr-4 rounded-md flex flex-row justify-center items-center cursor-pointer hover:bg-neutral-200 active:bg-neutral-300 hover:dark:bg-neutral-800 hover:bg-opacity-20 active:dark:bg-neutral-800 active:bg-opacity-80"
              @click="$emit('saveClick')"
          >
            <div v-if="props.saveButtonText && props.saveButtonText.length > 0" class="text-md leading-8">
              {{ props.saveButtonText }}
            </div>
            <i v-else class="iconfont text-base" :class="props.saveButtonIcon"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
