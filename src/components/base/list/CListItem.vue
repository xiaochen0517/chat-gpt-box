<script setup lang="ts">
import {useStore} from "@/store/store.ts";
import {computed, getCurrentInstance, ref, watch} from "vue";

const store = useStore();

const props = defineProps({
  switchValue: {
    type: Boolean,
    default: false
  },
  switchEnabled: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: ""
  },
  tooltip: {
    type: String,
    default: ""
  },
  placement: {
    type: String,
    default: "top"
  },
  leftIcon: {
    type: String,
    default: "icon-lock"
  },
  rightIcon: {
    type: String,
    default: "icon-right"
  },
  bottomBorder: {
    type: Boolean,
    default: true
  }
});

const instance = getCurrentInstance();
const switchValue = ref(false);
watch(() => props.switchValue, (value) => {
  switchValue.value = value;
})
watch(switchValue, (value) => {
  if (!instance) return;
  instance.emit("update:switchValue", value);
})

const isDarkMode = computed(() => store.config.isDarkMode);
</script>

<template>
  <div
      class="leading-12 px-3 cursor-pointer bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700 active:dark:bg-neutral-600">
    <div
        class="flex flex-row items-center"
        :class="bottomBorder?'border-b border-neutral-200 dark:border-neutral-600':''">
      <div class="flex-1 flex flex-row">
        <i class="iconfont text-xl leading-12" :class="leftIcon"/>
        <span class="ml-2 text-base leading-12">{{ content }}</span>
        <el-tooltip
            v-if="tooltip && tooltip.length !== 0"
            :content="tooltip"
            :effect="isDarkMode?'dark':'light'"
            :placement="placement"
            :hide-after="0">
          <i
              v-if="tooltip && tooltip.length !== 0"
              class="iconfont icon-question-circle text-xl leading-12 ml-2"
              @click.stop=""/>
        </el-tooltip>
      </div>
      <el-switch v-if="switchEnabled" v-model="switchValue"/>
      <i v-else class="iconfont" :class="rightIcon"/>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
