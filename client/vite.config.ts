import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          firebase: ["firebase"],
          maps: ["leaflet", "react-leaflet"],
          ui: ["@headlessui/react", "@heroicons/react"]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 4173,
    strictPort: true
  }
});