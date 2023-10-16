<script setup>
</script>

<template>
  <div class="bg-white dark:bg-gray-900 flex-row w-full h-full">
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
}

#app {
  height: 100%;
  width: 100%;
}


div::-webkit-scrollbar {
@apply w-2 h-2 rounded-full;
}

div::-webkit-scrollbar-track {
@apply bg-gray-800;
}

div::-webkit-scrollbar-thumb {
@apply bg-gray-600 rounded-full;
}

div::-webkit-scrollbar-thumb:hover {
@apply bg-gray-700;
}
</style>
