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
    <div class="w-full z-10 absolute left-0 top-0 bottom-0 flex justify-center items-center py-1 px-4 transition-all ease-in-out duration-500" :style="slipStyle">
      <div class="w-2/3 h-full rounded-xl bg-neutral-200 dark:bg-neutral-800"/>
    </div>
    <ul class="relative flex flex-row py-1.5 px-1 list-none rounded-2xl bg-neutral-100 dark:bg-neutral-900">
      <li v-for="(item) in tabNames" :key="item" class="flex-1 z-30 text-center">
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
