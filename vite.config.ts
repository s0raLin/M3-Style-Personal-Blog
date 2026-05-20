import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig(({ command }) => {
  // command 有两个可能的值：
  // 1. 'serve' -> 代表本地开发环境（你在终端运行了 npm run dev / vite）
  // 2. 'build' -> 代表生产环境打包（你在终端运行了 npm run build / vite build）
  const isDev = command === "serve";
  return {
    base: "./",
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      nodePolyfills({
        // 明确指定需要 polyfill 的模块
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      // 2. 将输出目录修改为 docs
      outDir: "docs",
      // 防止 Vite 在构建时清空 docs 目录之外的文件（如果有的话）
      emptyOutDir: true,

      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          // 只有在开发环境时，才把 admin 属性混入到对象中
          ...(isDev && { admin: path.resolve(__dirname, "admin.html") }),
        },
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ["**/*.svg", "**/*.csv"],

    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
  };
});
