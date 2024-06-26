import path from 'path';
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000', 
        // changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
});
