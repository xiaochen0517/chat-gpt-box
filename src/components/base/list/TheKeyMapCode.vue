<script setup lang="ts">

import {KeyMapEnum} from "@/enum/KeyMapEnum.ts";
import {computed} from "vue";
import {KeyMapUtil} from "@/utils/KeyMapUtil.ts";

type Props = {
  keyMapCode: string,
  size: number
}
const props = withDefaults(defineProps<Props>(), {
  keyMapCode: "",
  size: 100
});

let keyMapCodeClassNameEnum = {
  [KeyMapEnum.UP]: "icon-arrowup",
  [KeyMapEnum.DOWN]: "icon-arrowdown",
  [KeyMapEnum.LEFT]: "icon-arrowleft",
  [KeyMapEnum.RIGHT]: "icon-arrowright",
}

let iconClass = computed(() => {
  for (const key in keyMapCodeClassNameEnum) {
    if (key === props.keyMapCode) {
      return keyMapCodeClassNameEnum[key as keyof typeof keyMapCodeClassNameEnum];
    }
  }
  return "";
});

</script>

<template>
  <span class="font-bold text-sm px-2 py-1 opacity-60 bg-gray-400 bg-opacity-10" :class="`scale-${props.size}`">
    <i v-if="iconClass" class="iconfont  " :class="iconClass"/>
    <span v-else>{{ KeyMapUtil.formatShortcutKeyMap2ShowCode(props.keyMapCode) }}</span>
  </span>
</template>

<style scoped lang="less">

</style>
