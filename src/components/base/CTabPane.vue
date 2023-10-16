<script setup>

import {computed, inject, onMounted} from "vue";

let props = defineProps({
  tabName: {
    type: String,
    default: ""
  },
  key: {
    type: String,
    default: ""
  }
});

const parentActiveKey = inject("activeKey");

const isActive = computed(() => {
  return props.key === parentActiveKey.value;
});

onMounted(() => {
  console.log("props tabName:", props.tabName);
  console.log("parentActiveKey:", parentActiveKey);
});
</script>

<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>
