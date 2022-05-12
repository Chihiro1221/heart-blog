import AutoImport from 'unplugin-auto-import/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  // 解析
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '#': resolve(__dirname, './types'),
    },
  },
  // 插件
  plugins: [
    vue(),
    // 可视化打包
    visualizer(),
    // 自动导入api
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
      dts: 'types/auto-imports.d.ts',
    }),
    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: ['src/components'],
      directoryAsNamespace: true,
      dts: 'types/components.d.ts',
    }),
  ],
  // 分块打包
  build: {
    outDir: '../server/dist/apps/web',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  // 自动导入css变量
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/_variable.scss";',
      },
    },
  },
  // 跨域
  server: {
    proxy: {
      // 音乐资源
      '/meting/api': {
        target: 'https://api.i-meto.com/meting/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
