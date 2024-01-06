import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import packageJson from "./package.json";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

function resolve(url: string) {
  return path.resolve(__dirname, url);
}

export default defineConfig({
  plugins: [
    vue(),
    wasm(),
    topLevelAwait(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  clearScreen: false,
  server: {
    port: 8080,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: process.env.TAURI_PLATFORM === "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  resolve: {
    alias: {
      "@": resolve("./src"),
      "~@": resolve("./src"),
      "vue": "vue/dist/vue.esm-bundler.js"
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 全局添加less
        additionalData: "@import '@/assets/style/var.less';",
        javascriptEnabled: true,
      },
    },
  },
  define: {
    "process.env": {},
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version)
  }
});
