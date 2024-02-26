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
      class="px-2 py-1.5 box-border rounded-lg cursor-pointer border border-neutral-300 bg-neutral-100 hover:bg-neutral-300 active:bg-neutral-400 dark:border-neutral-900  dark:bg-neutral-900  dark:hover:bg-neutral-800  dark:active:bg-neutral-700 select-none"
      :class="{'text-green-500 dark:text-green-400': active}"
      :title="hint"
      @click.stop="$emit('click')"
  >
    <i class="iconfont text-md leading-3 mx-1" :class="(icon&&icon.length>0)?icon:'icon-down1'"/>
  </div>
</template>
