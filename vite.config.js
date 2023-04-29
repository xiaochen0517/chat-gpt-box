import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';

function resolve(url) {
  return path.resolve(__dirname, url);
}

export default defineConfig(async () => ({
  plugins: [vue()],
  clearScreen: false,
  server: {
    port: 8080,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
      '~@': resolve('./src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 全局添加less
        additionalData: `@import '@/assets/style/var.less';`,
        javascriptEnabled: true,
      },
    },
  },
}));
