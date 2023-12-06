<script setup lang="ts">

import {computed, getCurrentInstance, inject, onMounted, Ref} from "vue";
import {ComponentInternalInstance} from "vue";

const instance: ComponentInternalInstance | null = getCurrentInstance();

const parentActiveKey = inject<Ref<number> | null>("activeKey");
const currentKey = computed(() => {
  return instance?.vnode.key;
});

const isActive = computed(() => {
  return currentKey?.value === parentActiveKey?.value;
});

onMounted(() => {
});
</script>

<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>
