<script setup>

import {getCurrentInstance, onMounted, ref, provide} from "vue";

let props = defineProps({
  activeKey: {
    type: String,
    default: ""
  }
});

provide("activeKey", props.activeKey);

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
  context.emit("update:activeKey", key);
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row w-full">
      <div>
        <div v-for="(item, index) in tabNames" :key="index" class="flex-1" @click="activateTab(index)">
          {{ item }}
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
