<script setup lang="ts">

import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {computed} from "vue";
import {KeyMapUtil} from "@/utils/KeyMapUtil.ts";

type Props = {
  keyMapCode: string,
}
const props = withDefaults(defineProps<Props>(), {
  keyMapCode: "",
});

const keyMapCodeEnum = {
  [KeyMapEnum.UP]: "icon-arrowup",
  [KeyMapEnum.DOWN]: "icon-arrowdown",
  [KeyMapEnum.LEFT]: "icon-arrowleft",
  [KeyMapEnum.RIGHT]: "icon-arrowright",
}

const iconClass = computed(() => {
  for (const key in keyMapCodeEnum) {
    if (key === props.keyMapCode) {
      return keyMapCodeEnum[key as keyof typeof keyMapCodeEnum];
    }
  }
  return "";
});

</script>

<template>
  <span class="font-bold text-sm px-2 py-1 opacity-60 bg-gray-400 bg-opacity-10 scale-75">
    <i v-if="iconClass" class="iconfont  " :class="iconClass"/>
    <span v-else>{{ KeyMapUtil.formatShortcutKeyMap2ShowCode(props.keyMapCode) }}</span>
  </span>
</template>

<style scoped lang="less">

</style>
