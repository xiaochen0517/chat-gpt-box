<script setup>
import {ref} from "vue";
import {invoke} from "@tauri-apps/api/tauri";
import {appWindow, LogicalSize} from "@tauri-apps/api/window";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsg.value = await invoke("greet", {name: name.value});
}

const width = ref(0);
const height = ref(0);
const resize = async () => {
  await appWindow.setSize(new LogicalSize(width.value, height.value));
};
</script>

<template>
  <div class="card">
    <input id="greet-input" v-model="name" placeholder="Enter a name..."/>
    <button type="button" @click="greet()">Greet</button>
  </div>

  <p>{{ greetMsg }}</p>
  <input v-model="width" type="number" placeholder="width">
  <input v-model="height" type="number" placeholder="width">
  <button type="button" @click="resize()">Resize</button>
</template>
