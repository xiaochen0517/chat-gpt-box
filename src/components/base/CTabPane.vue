<script setup>

import {computed, getCurrentInstance, inject, onMounted} from "vue";

const instance = getCurrentInstance();

const parentActiveKey = inject("activeKey");
const currentKey = computed(() => {
  return instance.vnode.key;
});

const isActive = computed(() => {
  return currentKey.value === parentActiveKey.value;
});

onMounted(() => {
});
</script>

<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>
