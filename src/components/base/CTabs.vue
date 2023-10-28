<script setup>

import {getCurrentInstance, onMounted, ref, provide, watch} from "vue";

const props = defineProps({
  activeKey: {
    type: Number,
    default: 0
  }
});

const propsActiveKey = ref(props.activeKey);
provide("activeKey", propsActiveKey);
watch(() => props.activeKey, (newVal) => {
  propsActiveKey.value = newVal;
});

let context = getCurrentInstance();

// 获取默认插槽中的元素
let defaultSlotElements = context.slots.default();
let tabNames = ref([]);
onMounted(() => {
  if (defaultSlotElements.length <= 0) {
    return;
  }
  let tabPanes = defaultSlotElements[0].children;
  for (let tabPane of tabPanes) {
    tabNames.value.push(tabPane.props.tabName);
  }
  console.log("defaultSlotElements:", defaultSlotElements);
});

const activateTab = (key) => {
  console.log("activateTab", key);
  context.emit("update:activeKey", key);
};

const activeClass = ref("border-gray-400 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:border-slate-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-500 dark:text-gray-500");
const inactiveClass = ref("border-gray-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:border-slate-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:active:bg-gray-700 text-gray-900 dark:text-gray-100");
</script>

<template>
  <div class="flex flex-col">
    <div class="max-w-5xl m-auto overflow-hidden overflow-x-auto w-full p-2 box-border">
      <div class="flex flex-row min-w-full p-1.5 bg-gray-100 dark:bg-gray-950 rounded-md">
        <div v-for="(item, index) in tabNames" :key="index" @click="activateTab(index)"
             class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border select-none"
             :class="propsActiveKey === index ? activeClass: inactiveClass">
          {{ item }}
        </div>
        <div
            class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border border-slate-300 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:border-slate-700  dark:bg-gray-900  dark:hover:bg-gray-800  dark:active:bg-gray-700 select-none">
          ADD
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
