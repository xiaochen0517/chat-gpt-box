<script setup lang="ts">
import {ref} from "vue";

const isOpen = ref(false);

type Props = {
  content: string;
};
withDefaults(defineProps<Props>(), {
  content: "",
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="w-full">
    <!-- 触发按钮 -->
    <button
        @click="toggle"
        class="flex items-center gap-1 px-3 py-1 rounded transition-colors"
        :class="[
          isOpen ? 'bg-cyan-500 dark:bg-cyan-600' : 'bg-cyan-400 dark:bg-cyan-700',
        ]"
    >
      <span class="text-sm">推理过程</span>
      <i
          class="iconfont icon-caret-up transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- 展开内容 -->
    <transition
        enter-active-class="transition-[opacity,max-height] duration-300 ease-out"
        leave-active-class="transition-[opacity,max-height] duration-300 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[1000px]"
        leave-from-class="opacity-100 max-h-[1000px]"
        leave-to-class="opacity-0 max-h-0"
    >
      <div
          v-if="isOpen"
          class="mt-2 p-3 text-neutral-700  dark:text-neutral-300 bg-white dark:bg-gray-700 rounded shadow-sm border border-gray-100 dark:border-gray-600 break-words whitespace-pre-wrap"
      >
        {{ content }}
      </div>
    </transition>
  </div>
</template>
