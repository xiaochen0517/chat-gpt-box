<script setup>
import {ref} from "vue";
import {useStore} from "vuex";

const store = useStore();

const dialogVisible = ref(false);

const key = ref("");

const saveApiKey = () => {
  if (key.value.length <= 0) {
    return;
  }
  console.log("saveApiKey", key.value);
  store.commit("setApiKey", key.value);
  dialogVisible.value = false;
};

defineExpose({
  show: () => {
    dialogVisible.value = true;
  }
});
</script>

<template>
  <div class="key-setting-dialog">
    <a-modal v-model:visible="dialogVisible" title="设置ApiKey" centered @ok="saveApiKey"
             @cancel="$emit('cancel')">
      <a-input v-model:value="key" placeholder="请输入ApiKey"/>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>

</style>
