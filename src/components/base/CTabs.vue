<script setup>

import {getCurrentInstance, onMounted, ref} from "vue";

let props = defineProps({
  activeKey: {
    type: String,
    default: ""
  }
});

let context = getCurrentInstance();

// 获取默认插槽中的元素
let defaultSlotElements = context.slots.default();
let tabNames = ref([]);
onMounted(() => {
  console.log(defaultSlotElements);
  if (defaultSlotElements.length <= 0) {
    return;
  }
  let tabPanes = defaultSlotElements[0].children;
  for (let tabPane of tabPanes) {
    console.log(tabPane.props);
    tabNames.value.push(tabPane.props.tabName);
  }
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row w-full">
      <div>
        <div v-for="(item, index) in tabNames" :key="index" class="flex-1">
          {{ item }}
        </div>
      </div>
    </div>
    <slot :activeKey="activeKey"></slot>
  </div>
</template>
