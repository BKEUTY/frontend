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
  build: {
    outDir: "build",
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) return "vendor-react";
            if (id.includes("antd") || id.includes("@ant-design/icons")) return "vendor-antd";
            if (id.includes("jspdf") || id.includes("html2canvas") || id.includes("jspdf-autotable")) return "vendor-pdf";
            if (id.includes("framer-motion")) return "vendor-animation";
            if (id.includes("react-icons")) return "vendor-ui";
            if (id.includes("@tanstack/react-query") || id.includes("axios") || id.includes("query-string")) return "vendor-data";
            if (id.includes("dayjs") || id.includes("react-helmet-async") || id.includes("react-markdown")) return "vendor-utils";
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
