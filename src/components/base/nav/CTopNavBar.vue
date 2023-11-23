<script setup lang="ts">

type Props = {
  title: string,
}
const props = withDefaults(defineProps<Props>(), {
  title: "Default Title",
});
</script>

<template>
  <div class="w-full flex flex-row items-center select-none rounded-b-2xl bg-neutral-100 dark:bg-neutral-800">
    <div
        class="w-10 h-10 ml-4 rounded-xl flex justify-center cursor-pointer bg-neutral-200 dark:bg-neutral-700 hover:dark:bg-neutral-600"
        @click.stop="$emit('backClick')">
      <i class="iconfont icon-left-arrow text-xl leading-10"/>
    </div>
    <div class="w-full ml-4 text-xl leading-16">{{ props.title }}</div>
  </div>
</template>