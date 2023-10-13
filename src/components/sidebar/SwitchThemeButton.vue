<script setup>
import {computed, onMounted} from "vue";
import {switchMode} from "@/util/ThemeMode.js";
import {useStore} from "vuex";
import CButton from "@/components/base/CButton.vue";

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
  <c-button type="primary" @click="handleChange">{{ isDarkMode ? 'Dark' : 'Light' }}</c-button>
</template>
