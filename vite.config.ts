import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';
import packageJson from './package.json'

function resolve(url: string) {
  return path.resolve(__dirname, url);
}

export default defineConfig({
  plugins: [vue()],
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
  define: {
    'process.env': {},
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version)
  }
});
