import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import AutoImport from "unplugin-auto-import/vite"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入组件
    Components({
      resolvers: [AntDesignVueResolver()],
      dirs: ["src/components"],
      directoryAsNamespace: true,
      dts: "types/components.d.ts",
    }),
    // 自动导入api
    AutoImport({
      resolvers: [AntDesignVueResolver()],
      imports: ["vue", "vue-router"],
      //为true时在项目根目录自动创建
      dts: "types/auto-imports.d.ts",
    }),
    // 可视化打包
    visualizer(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "#": resolve(__dirname, "./types"),
    },
  },
  build: {
    outDir: "../server/dist/apps/client",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString()
          }
        },
      },
    },
  },
})
