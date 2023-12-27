<script setup lang="ts">
import {computed, getCurrentInstance, provide, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";

const configStore = useConfigStore();
const appStateStore = useAppStateStore();
const forceScrollToBottom = computed(() => configStore.baseConfig.forceScrollToBottom);
const lockScrollDown = computed(() => appStateStore.lockScrollDown);

type Props = {
  activeKey: number;
  tabNames: string[];
};

const props = withDefaults(defineProps<Props>(), {
  activeKey: 0,
  tabNames: () => [],
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

const instance = getCurrentInstance();
const lockScrollDownClick = () => {
  appStateStore.lockScrollDown = !appStateStore.lockScrollDown;
  instance?.emit("lockScrollDownClick");
};
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="absolute z-10 top-0 left-0 w-full px-2 total:px-0 flex flex-col">
      <div class="content:max-w-content content:m-auto p-2 overflow-hidden overflow-x-auto w-full rounded-lg rounded-t-none bg-neutral-100 dark:bg-neutral-800 shadow-md flex flex-row gap-2 min-w-full box-border">
        <div class="absolute block content:hidden left-2 top-2 bg-neutral-100 dark:bg-neutral-800">
          <div
              class=" px-2 py-1.5 ml-2 mr-1 box-border rounded-lg cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-700  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
              title="Show slide side bar"
              @click.stop="$emit('showSlideSideBarClick')"
          >
            <i class="iconfont icon-category text-md leading-3 font-bold mx-1"/>
          </div>
        </div>
        <div class="flex flex-row gap-1 ml-11 content:ml-0 mr-10" :class="{'mr-21':!forceScrollToBottom}">
          <div
              v-for="(item, index) in propsTabNames"
              :key="index"
              class="px-2 py-1.5 box-border rounded-lg cursor-pointer border select-none flex flex-row items-center whitespace-nowrap"
              :class="propsActiveKey === index ? activeClass: inactiveClass"
              :title="item"
              @click="$emit('update:activeKey', index)"
          >
            {{ item }}
            <div
                class="ml-1 w-5 h-5 flex justify-center items-center rounded hover:bg-neutral-400"
                :class="propsActiveKey === index ? closeActiveClass: closeInactiveClass"
                @click.stop="$emit('removeTabClick', index)"
            >
              <i class="iconfont icon-close text-sm leading-3 font-bold"/>
            </div>
          </div>
          <div
              class="px-2 py-1.5 mr-1 box-border rounded-lg cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-700  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
              title="Add tab"
              @click="$emit('addTabClick')"
          >
            <i class="iconfont icon-add text-md leading-3 font-bold mx-1"/>
          </div>
        </div>
        <div class="absolute right-2 top-2 bg-neutral-100 dark:bg-neutral-800 flex flex-row gap-1">
          <div
              class="px-2 py-1.5 ml-1 box-border rounded-lg cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-700  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
              title="Export chat info"
              @click.stop="$emit('exportChatClick')"
          >
            <i class="iconfont icon-upload1 text-md leading-3 font-bold mx-1"/>
          </div>
          <div
              v-if="!forceScrollToBottom"
              class="px-2 py-1.5 mr-2 box-border rounded-lg cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-700  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
              :class="{'text-green-500 dark:text-green-400': lockScrollDown}"
              title="Lock scroll down"
              @click.stop="lockScrollDownClick"
          >
            <i class="iconfont icon-down1 text-md leading-3 font-bold mx-1"/>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
