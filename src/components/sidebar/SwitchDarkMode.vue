<script setup>
import {ref} from "vue";

const setProperty = (name, value) => {
  document.documentElement.style.setProperty(name, value);
};

const setColor = (mode) => {
  if (mode) {
    setProperty('--primary-bg-color', '#000000');
    setProperty('--border-color', '#eaeaea');
    setProperty('--primary-text-color', '#ffffff');
  } else {
    setProperty('--primary-bg-color', '#fff');
    setProperty('--border-color', '#d9d9d9');
    setProperty('--primary-text-color', '#333');
  }
};

const isDarkMode = ref(true);
const handleChange = () => {
  if (isDarkMode.value) {
    setColor(false);
    isDarkMode.value = false;
  } else {
    setColor(true);
    isDarkMode.value = true;
  }
};
</script>

<template>
  <div class="switch-dark-mode">
    <a-button type="primary" @click="handleChange">Red</a-button>
  </div>
</template>

<style lang="less" scoped>

</style>
