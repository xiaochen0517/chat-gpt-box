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
    tabBarContainerRefs.value.scrollLeft += Math.floor(event.deltaY * .3) as number;
  }, {passive: false});
});

defineEmits([
  "addTabClick",
  "removeTabClick",
  "update:activeKey",
  "showSlideSideBarClick",
  "cleanChatClick",
  "exportChatClick",
  "lockScrollDownClick",
]);
</script>

<template>
  <div class="w-full py-2 px-2.5 mt-2 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex flex-row gap-2 min-w-full box-border">
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
          class="tab-bar absolute left-0 right-0 flex flex-row items-center gap-1 overflow-hidden overflow-x-auto"
      >
        <div
            v-for="(item, index) in propsTabNames"
            :key="index"
            class="group px-2 py-1 rounded-xl cursor-pointer select-none flex flex-row items-center whitespace-nowrap bg-neutral-100 active:bg-neutral-200 hover:dark:bg-neutral-800 dark:active:bg-neutral-700"
            :class="propsActiveKey === index ? 'dark:bg-neutral-800': ' dark:bg-neutral-900'"
            :title="item"
            @click="$emit('update:activeKey', index)"
        >
          <span>{{ item }}</span>
          <div
              class="ml-1 w-5 h-5 flex justify-center items-center rounded transition-opacity delay-75 opacity-0 group-hover:opacity-100 dark:text-neutral-300 hover:dark:text-neutral-100"
              :class="propsActiveKey === index ? 'hover:text-green-300': 'hover:text-neutral-400 dark:hover:text-neutral-100'"
              @click.stop="$emit('removeTabClick', index)"
          >
            <i class="iconfont icon-close text-sm leading-3 font-bold"/>
          </div>
        </div>
        <CTabButton icon="icon-add" title="Add tab" @click="$emit('addTabClick')"/>
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
</template>

<style scoped lang="postcss">
.tab-bar::-webkit-scrollbar {
  @apply h-0.5 mt-0.5;
}
</style>
