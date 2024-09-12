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
  size: 100,
});

let keyMapCodeClassNameEnum = {
  [KeyMapEnum.KEY_UP]: "icon-arrowup",
  [KeyMapEnum.KEY_DOWN]: "icon-arrowdown",
  [KeyMapEnum.KEY_LEFT]: "icon-arrowleft",
  [KeyMapEnum.KEY_RIGHT]: "icon-arrowright",
};

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
  <span
      class="font-bold text-sm mr-2 px-2 py-1 opacity-60 bg-gray-400 bg-opacity-10 rounded-xl border border-neutral-300 dark:border-neutral-700"
      :class="`scale-${props.size}`"
  >
    <i v-if="iconClass" class="iconfont" :class="iconClass"/>
    <span v-else>{{ KeyMapUtil.formatShortcutKeyMap2ShowCode(props.keyMapCode) }}</span>
  </span>
</template>
