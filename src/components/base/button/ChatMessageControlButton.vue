<script setup lang="ts">

type Props = {
  icon: string;
  tooltip?: string;
};
withDefaults(defineProps<Props>(), {
  icon: "icon-check",
  tooltip: "",
});
defineEmits(["click"]);
</script>

<template>
  <div class="w-fit h-fit">
    <el-tooltip :content="tooltip" placement="bottom" :show-arrow="false" :show-after="100">
      <button
          class="p-2 rounded-md flex justify-center items-center bg-gray-200 hover:bg-neutral-300 active:bg-neutral-400 text-neutral-600 hover:text-neutral-700 dark:text-neutral-100 dark:bg-transparent dark:hover:bg-neutral-700 dark:active:bg-neutral-600 cursor-pointer"
          @click="$emit('click')"
      >
        <i class="iconfont leading-4 text-neutral-700 dark:text-neutral-300" :class="icon"/>
      </button>
    </el-tooltip>
  </div>
</template>
