<script setup lang="ts">

type Props = {
  chatType: string
}
withDefaults(defineProps<Props>(), {
  chatType: "none"
});
</script>

<template>
  <div class="my-2 bg-neutral-200 dark:bg-amber-600 rounded-xl px-3 py-1 text-sm font-bold border border-neutral-300 dark:border-neutral-800">
    {{ chatType.toUpperCase() }}
  </div>
</template>
