import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    devSourcemap: false,
  },
  build: {
    outDir: "build",
    sourcemap: false,
    cssCodeSplit: true,
    modulePreload: false,
    assetsInlineLimit: 8192,
    chunkSizeWarningLimit: 600,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["pure", "console.log", "console.info", "console.debug"],
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react/") ||
              id.includes("react-dom") ||
              id.includes("react-router") ||
              id.includes("@remix-run") ||
              id.includes("scheduler")
            ) {
              return "vendor-react";
            }

            if (
              id.includes("antd") ||
              id.includes("@ant-design") ||
              id.includes("rc-")
            ) {
              return "vendor-antd";
            }

            if (
              id.includes("jspdf") ||
              id.includes("html2canvas")
            ) {
              return "vendor-pdf";
            }

            if (id.includes("framer-motion")) {
              return "vendor-animation";
            }

            if (id.includes("react-icons")) {
              return "vendor-icons";
            }

            if (
              id.includes("@tanstack") ||
              id.includes("axios") ||
              id.includes("query-string") ||
              id.includes("decode-uri-component") ||
              id.includes("split-on-first") ||
              id.includes("filter-obj")
            ) {
              return "vendor-data";
            }

            if (
              id.includes("dayjs") ||
              id.includes("react-helmet-async") ||
              id.includes("react-markdown") ||
              id.includes("unified") ||
              id.includes("remark-") ||
              id.includes("rehype-") ||
              id.includes("vfile") ||
              id.includes("unist-") ||
              id.includes("mdast-") ||
              id.includes("micromark") ||
              id.includes("parse5") ||
              id.includes("trough") ||
              id.includes("bail") ||
              id.includes("is-plain-obj") ||
              id.includes("property-information") ||
              id.includes("space-separated-tokens") ||
              id.includes("comma-separated-tokens") ||
              id.includes("web-namespaces") ||
              id.includes("html-void-elements") ||
              id.includes("zwitch") ||
              id.includes("longest-streak") ||
              id.includes("markdown-table") ||
              id.includes("decode-named-character") ||
              id.includes("character-entities")
            ) {
              return "vendor-utils";
            }

            if (id.includes("@fontsource")) {
              return "vendor-fonts";
            }

            return "vendor-others";
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});

