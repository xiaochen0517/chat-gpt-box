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
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-hidden overflow-x-auto w-full p-2 box-border">
      <div class="flex flex-row min-w-full p-1.5 dark:bg-gray-950 rounded-md">
        <div v-for="(item, index) in tabNames" :key="index" @click="activateTab(index)"
             class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border border-slate-700 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 select-none">
          {{ item }}
        </div>
        <div
          class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border border-slate-700 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 select-none">
          ADD
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
