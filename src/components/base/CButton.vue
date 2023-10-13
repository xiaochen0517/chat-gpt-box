<script setup>

import {onMounted, ref} from "vue";

let props = defineProps({
  type: {
    type: String,
    default: 'primary'
  }
});

let buttonStyleClass = ref("");

onMounted(() => {
  switch (props.type) {
    case 'primary':
      // light mode bg
      buttonStyleClass.value = "bg-blue-500 hover:bg-blue-600 active:bg-blue-700";
      // dark mode bg
      buttonStyleClass.value += " dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-900";
      // border
      buttonStyleClass.value += " border-solid border-2 border-blue-500 dark:border-gray-800";
      // text
      buttonStyleClass.value += " text-white dark:text-gray-200";
      break;
    case 'success':
      // light mode bg
      buttonStyleClass.value = "bg-green-500 hover:bg-green-600 active:bg-green-700";
      // dark mode bg
      buttonStyleClass.value += " dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-900";
      // border
      buttonStyleClass.value += " border-solid border-2 border-green-500 dark:border-gray-800";
      // text
      buttonStyleClass.value += " text-white dark:text-gray-200";
      break;
    case 'warning':
      // light mode bg
      buttonStyleClass.value = "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700";
      break;
    case 'danger':
      // light mode bg
      buttonStyleClass.value = "bg-red-500 hover:bg-red-600 active:bg-red-700";
      break;
    default:
      // light mode bg
      buttonStyleClass.value = "bg-blue-500 hover:bg-blue-600 active:bg-blue-700";
      break;
  }
});

</script>

<template>
  <button
    class="rounded-md box-border p-1 w-full shadow-md"
    :class="buttonStyleClass"
    @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<style scoped lang="less">

</style>
