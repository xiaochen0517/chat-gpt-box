<script setup>

let props = defineProps({
  tabName: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <slot></slot>
</template>
