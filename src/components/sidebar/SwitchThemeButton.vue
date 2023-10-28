<script setup>
import {computed} from "vue";
import {useStore} from "vuex";
import CButton from "@/components/base/CButton.vue";

const store = useStore();
const isDarkMode = computed(() => store.state.config.isDarkMode);

const handleChange = () => {
  store.commit("setDarkMode", !isDarkMode.value);
};
</script>

<template>
  <c-button type="primary" @click="handleChange">{{ isDarkMode ? 'Dark' : 'Light' }}</c-button>
</template>
