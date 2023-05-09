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
    <a-button type="primary" @click="handleChange">{{ isDarkMode ? 'Dark' : 'Light' }}</a-button>
  </div>
</template>

<style lang="less" scoped>

</style>
