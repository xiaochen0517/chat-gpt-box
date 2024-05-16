<script setup lang="ts">

type CTabButtonProps = {
  hint?: string;
  active?: boolean;
  icon?: string;
}
withDefaults(defineProps<CTabButtonProps>(), {
  hint: "",
  active: false,
});
</script>

<template>
  <div
      class="px-2 py-1 box-border rounded-xl cursor-pointer bg-neutral-100 active:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:active:bg-neutral-700 select-none"
      :class="{'text-green-500 dark:text-green-400': active}"
      :title="hint"
  >
    <i class="iconfont text-md leading-3 mx-1" :class="(icon&&icon.length>0)?icon:'icon-down1'"/>
  </div>
</template>
