<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref, watch} from "vue";

type Props = {
  activeName: string,
  tabNames: string[],
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  activeName: "NONE",
  tabNames: () => [],
  disabled: false,
});

const instance = getCurrentInstance();
const activeTab = ref<string>("NONE");
onMounted(() => {
  if (props.tabNames.length === 0) return;
  if (!props.activeName) {
    activeTab.value = props.tabNames[0];
    if (!instance) return;
    instance.emit("update:activeName", activeTab.value);
    return;
  }
  activeTab.value = props.activeName;
});
watch(() => props.activeName, (newVal) => {
  activeTab.value = newVal;
});
const slipStyle = computed(() => {
  return {
    width: `calc(100% / ${props.tabNames.length})`,
    transform: `translateX(calc(100% * ${props.tabNames.indexOf(activeTab.value)}))`,
  };
});
const changeTab = (tabName: string) => {
  if (props.disabled) return;
  activeTab.value = tabName;
  if (!instance) return;
  instance.emit("update:activeName", tabName);
  instance.emit("change", tabName);
};
</script>

<template>
  <div class="w-full relative" :class="{'opacity-40':disabled}">
    <div class="z-10 absolute left-0 top-0 bottom-0 p-1 transition-all ease-in-out duration-500" :style="slipStyle">
      <div class="w-full h-full rounded-lg bg-neutral-200 dark:bg-neutral-700"/>
    </div>
    <ul class="relative flex flex-row gap-1 p-1 list-none rounded-lg bg-neutral-100 dark:bg-neutral-800">
      <li v-for="(item) in tabNames" :key="item" class="z-30 flex-auto text-center">
        <a
            class="z-20 flex items-center justify-center w-full px-0 py-1 mb-0 transition-all ease-in-out cursor-pointer"
            @click="changeTab(item)"
        >
          <span>{{ item }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>