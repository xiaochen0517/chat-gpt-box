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
    <div class="overflow-hidden overflow-y-auto w-full">
      <div class="flex flex-row min-w-full py-1">
        <div v-for="(item, index) in tabNames" :key="index"
             class="p-1 mr-1 box-border border border-slate-500 rounded-md cursor-pointer" @click="activateTab(index)">
          {{ item }}
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
