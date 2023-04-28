<script setup>
</script>

<template>
  <div class="app-container flex-row">
    <router-view/>
  </div>
</template>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
  font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: @primary-bg-color;
  border-color: @primary-bg-color;
  color: @primary-text-color;
}

#app {
  height: 100%;
  width: 100%;
}

.app-container {
  min-height: 100%;
  max-height: 100%;
  width: 100%;
}
</style>
