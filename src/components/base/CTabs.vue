<script setup>

import {computed, provide, ref, watch} from "vue";

const props = defineProps({
  activeKey: {
    type: Number,
    default: 0
  },
  tabNames: {
    type: Array,
    default: () => []
  }
});

const propsTabNames = computed(() => props.tabNames);

const propsActiveKey = ref(props.activeKey);
provide("activeKey", propsActiveKey);
watch(() => props.activeKey, (newVal) => {
  propsActiveKey.value = newVal;
});

const activeClass = ref("border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:border-slate-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:active:bg-gray-700 text-green-500 dark:text-green-400 font-bold");
const inactiveClass = ref("border-gray-400 bg-gray-200 hover:bg-gray-300 hover:text-gray-900 active:bg-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:active:bg-gray-600 text-gray-500 dark:text-gray-500 font-bold");

const closeActiveClass = ref("hover:bg-gray-200 dark:hover:bg-gray-700");
const closeInactiveClass = ref("hover:bg-gray-400 dark:hover:bg-gray-600");
</script>

<template>
  <div class="flex flex-col w-full">
    <div
        class="absolute z-10 top-0 left-0 w-full px-1 lg:px-0 box-border opacity-80 backdrop-blur-md bg-gray-50 dark:bg-gray-800">
      <div
          class="max-w-5xl m-auto my-2 overflow-hidden overflow-x-auto w-full p-2 box-border bg-gray-100 dark:bg-gray-950 rounded-md">
        <div class="flex flex-row min-w-full">
          <div
              class="block lg:hidden px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border border-slate-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:border-slate-700  dark:bg-gray-900  dark:hover:bg-gray-800  dark:active:bg-gray-700 select-none"
              @click="$emit('addTabClick')">
            <i class="iconfont icon-category text-xs leading-3 font-bold mx-1"/>
          </div>
          <div v-for="(item, index) in propsTabNames" :key="index" @click="$emit('update:activeKey', index)"
               class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border select-none flex flex-row items-center"
               :class="propsActiveKey === index ? activeClass: inactiveClass">
            {{ item }}
            <div class="ml-1 w-5 h-5 flex justify-center items-center rounded hover:bg-gray-400"
                 :class="propsActiveKey === index ? closeActiveClass: closeInactiveClass"
                 @click.stop="$emit('removeTabClick', index)">
              <i class="iconfont icon-close text-xs leading-3 font-bold"/>
            </div>
          </div>
          <div
              class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border border-slate-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:border-slate-700  dark:bg-gray-900  dark:hover:bg-gray-800  dark:active:bg-gray-700 select-none"
              @click="$emit('addTabClick')">
            <i class="iconfont icon-add text-xs leading-3 font-bold mx-1"/>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
