<script setup>
import {computed, onMounted} from "vue";
import {switchMode} from "@/util/ThemeMode.js";
import {useStore} from "vuex";

const store = useStore();
const isDarkMode = computed(() => store.state.config.isDarkMode);
onMounted(() => {
  // 获取当前主题模式
  switchMode(isDarkMode.value);
});

const handleChange = () => {
  if (isDarkMode.value) {
    switchMode(false);
  } else {
    switchMode(true);
  }
};
</script>

<template>
  <div class="switch-dark-mode">
    <button
      class="border-solid border-2 border-sky-500 rounded-md box-border p-1 w-full bg-sky-400 hover:bg-sky-500 hover:border-sky-600 active:bg-sky-700 active:border-sky-800"
      @click="handleChange">{{ isDarkMode ? 'Dark' : 'Light' }}
    </button>
  </div>
</template>

<style lang="less" scoped>

</style>
