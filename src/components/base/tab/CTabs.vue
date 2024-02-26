<script setup lang="ts">
import {computed, getCurrentInstance, onMounted, provide, ref, watch} from "vue";
import {useConfigStore} from "@/store/ConfigStore.ts";
import {useAppStateStore} from "@/store/AppStateStore.ts";
import CTabButton from "@/components/base/tab/CTabButton.vue";

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

const activeClass = ref("text-green-500 dark:text-green-400 shadow dark:shadow-neutral-900");
const inactiveClass = ref("text-neutral-500 dark:text-neutral-400");

const closeActiveClass = ref("hover:bg-neutral-300 dark:hover:bg-neutral-700");
const closeInactiveClass = ref("hover:bg-neutral-400 dark:hover:bg-neutral-600");

const instance = getCurrentInstance();
const lockScrollDownClick = () => {
  appStateStore.lockScrollDown = !appStateStore.lockScrollDown;
  instance?.emit("lockScrollDownClick");
};

const tabBarContainerRefs = ref<HTMLElement | null>(null);
// horizontal scroll without shift key
onMounted(() => {
  if (!tabBarContainerRefs.value) return;
  tabBarContainerRefs.value.addEventListener("wheel", function (event) {
    if (!tabBarContainerRefs.value) return;
    event.preventDefault();
    tabBarContainerRefs.value.scrollLeft += Math.floor(event.deltaY*.3) as number;
  }, {passive: false});
});
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="w-full p-2 pb-3 overflow-hidden rounded-lg rounded-t-none bg-neutral-100 dark:bg-neutral-800 shadow-md flex flex-row gap-2 min-w-full box-border">
      <!--menu button-->
      <CTabButton
          class="block mobile:hidden"
          icon="icon-category"
          title="Show slide side bar"
          @click="$emit('showSlideSideBarClick')"
      />
      <!--tab bar-->
      <div class="flex-1 h-full relative">
        <div
            ref="tabBarContainerRefs"
            class="tab-bar pb-1 absolute left-0 right-0 flex flex-row gap-1 overflow-hidden overflow-x-auto"
        >
          <div
              v-for="(item, index) in propsTabNames"
              :key="index"
              class="px-2 py-1.5 box-border rounded-lg cursor-pointer border select-none flex flex-row items-center whitespace-nowrap border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
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
              class="px-2 py-1.5 mr-1 box-border rounded-lg cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-900  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
              title="Add tab"
              @click="$emit('addTabClick')"
          >
            <i class="iconfont icon-add text-md leading-3 font-bold mx-1"/>
          </div>
        </div>
      </div>
      <!--ctrl button-->
      <CTabButton icon="icon-clear" title="Clean current tab chat messages" @click="$emit('cleanChatClick')"/>
      <CTabButton icon="icon-upload1" title="Export chat info" @click="$emit('exportChatClick')"/>
      <CTabButton
          v-if="!forceScrollToBottom"
          title="Lock scroll down"
          :active="lockScrollDown"
          @click="lockScrollDownClick"
      />
    </div>
    <slot></slot>
  </div>
</template>

<style scoped lang="postcss">
.tab-bar::-webkit-scrollbar {
  @apply h-1.5 mt-0.5;
}
</style>
