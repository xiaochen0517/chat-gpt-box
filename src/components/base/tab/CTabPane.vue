<script setup lang="ts">

import {ComponentInternalInstance, computed, getCurrentInstance, inject, onMounted, Ref} from "vue";

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
  <div v-if="isActive" class="flex-1 w-full h-full mt-1 relative">
    <slot></slot>
  </div>
</template>
