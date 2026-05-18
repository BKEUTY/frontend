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
    // Inline small CSS files to reduce render-blocking requests
    devSourcemap: false,
  },
  build: {
    outDir: "build",
    sourcemap: false,
    cssCodeSplit: true,
    // Inline CSS files smaller than 8KB to reduce render-blocking requests
    assetsInlineLimit: 8192,
    chunkSizeWarningLimit: 600,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Core React runtime - needed immediately
            if (
              id.includes("react/") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("scheduler")
            )
              return "vendor-react";

            // Ant Design - split into separate chunk (heavy, partially tree-shakeable)
            if (id.includes("antd") || id.includes("@ant-design"))
              return "vendor-antd";

            // Heavy libs that can be deferred - only needed on specific pages
            if (
              id.includes("jspdf") ||
              id.includes("html2canvas") ||
              id.includes("jspdf-autotable")
            )
              return "vendor-pdf";

            // Animation library - not critical for initial render
            if (id.includes("framer-motion")) return "vendor-animation";

            // Icons - large but tree-shakeable
            if (id.includes("react-icons")) return "vendor-icons";

            // Data fetching layer
            if (
              id.includes("@tanstack/react-query") ||
              id.includes("axios") ||
              id.includes("query-string")
            )
              return "vendor-data";

            // Utility libs
            if (
              id.includes("dayjs") ||
              id.includes("react-helmet-async") ||
              id.includes("react-markdown")
            )
              return "vendor-utils";

            // Font files
            if (id.includes("@fontsource")) return "vendor-fonts";

            // Remaining node_modules
            return "vendor";
          }
        },
        chunkFileNames: "assets/chunk-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});

