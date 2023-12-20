<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, ref} from "vue";

type Props = {
  activeName: string,
  tabNames: string[],
}

const props = withDefaults(defineProps<Props>(), {
  activeName: "NONE",
  tabNames: () => [],
});

const activeTab = ref<string>("NONE");
onMounted(() => {
  if (props.tabNames.length === 0) return;
  changeTab(props.tabNames[0]);
});
const slipStyle = computed(() => {
  return {
    width: `calc(100% / ${props.tabNames.length})`,
    transform: `translateX(calc(100% * ${props.tabNames.indexOf(activeTab.value)}))`,
  };
});
const instance = getCurrentInstance();
const changeTab = (tabName: string) => {
  activeTab.value = tabName;
  if (!instance) return;
  instance.emit("update:activeName", tabName);
  instance.emit("change", tabName);
};
</script>

<template>
  <div class="w-full relative">
    <div class="z-10 absolute left-0 top-0 bottom-0 p-1 transition-all ease-in-out duration-500" :style="slipStyle">
      <div class="w-full h-full rounded-lg bg-neutral-100 dark:bg-neutral-700"/>
    </div>
    <ul class="relative flex flex-row gap-1 p-1 list-none rounded-lg dark:bg-neutral-800">
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