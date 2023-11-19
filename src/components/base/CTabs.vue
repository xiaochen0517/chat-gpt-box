<script setup lang="ts">

import {computed, provide, ref, watch} from "vue";
import {StoreRobotOptions} from "@/types/State.ts";

const props = defineProps({
  activeKey: {
    type: Number,
    default: 0
  },
  tabNames: {
    type: Array,
    default: () => []
  },
  robotOptions: {
    type: Object as () => StoreRobotOptions,
    default: () => {
      return {
        enabled: false,
        apiUrl: "",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        context_max_message: 0,
        context_max_tokens: 0,
        response_max_tokens: 0,
      };
    }
  }
});

const propsTabNames = computed(() => props.tabNames);

const propsActiveKey = ref(props.activeKey);
provide("activeKey", propsActiveKey);
watch(() => props.activeKey, (newVal) => {
  propsActiveKey.value = newVal;
});

const activeClass = ref("border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:active:bg-neutral-700 text-green-500 dark:text-green-400 font-bold");
const inactiveClass = ref("border-neutral-400 bg-neutral-200 hover:bg-neutral-300 hover:text-neutral-900 active:bg-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:active:bg-neutral-600 text-neutral-500 dark:text-neutral-500 font-bold");

const closeActiveClass = ref("hover:bg-neutral-300 dark:hover:bg-neutral-700");
const closeInactiveClass = ref("hover:bg-neutral-400 dark:hover:bg-neutral-600");
</script>

<template>
  <div class="flex flex-col w-full">
    <div
        class="absolute z-10 top-0 left-0 w-full px-1 lg:px-0 flex flex-col">
      <div
          class="xl:max-w-screen-2xl m-auto p-2 overflow-hidden overflow-x-auto w-full opacity-80 backdrop-blur-md">
        <div class="flex flex-row min-w-full p-2 box-border bg-neutral-200 dark:bg-neutral-950 rounded-md">
          <div
              class="absolute left-4 top-4 block lg:hidden px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-700  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
              @click="$emit('showSlideSideBarClick')">
            <i class="iconfont icon-category text-xs leading-3 font-bold mx-1"/>
          </div>
          <div class="ml-11 lg:ml-0"></div>
          <div
              v-for="(item, index) in propsTabNames"
              :key="index"
              @click="$emit('update:activeKey', index)"
              class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border select-none flex flex-row items-center whitespace-nowrap"
              :class="propsActiveKey === index ? activeClass: inactiveClass">
            {{ item }}
            <div
                class="ml-1 w-5 h-5 flex justify-center items-center rounded hover:bg-neutral-400"
                :class="propsActiveKey === index ? closeActiveClass: closeInactiveClass"
                @click.stop="$emit('removeTabClick', index)">
              <i class="iconfont icon-close text-xs leading-3 font-bold"/>
            </div>
          </div>
          <div
              class="px-2 py-1.5 mr-1 box-border rounded-md cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-700  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
              @click="$emit('addTabClick')">
            <i class="iconfont icon-add text-xs leading-3 font-bold mx-1"/>
          </div>
        </div>
        <div
            v-if="robotOptions && robotOptions.enabled"
            class="flex flex-row w-full py-2">
          <div class="border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 bg-yellow-400 dark:bg-amber-600 text-sm font-bold select-none">
            <i class="iconfont icon-settings font-normal"/>
            {{ robotOptions.model?.toUpperCase() }}
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
