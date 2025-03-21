import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "./client",                 // ✅ Set the root to client
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src")  // ✅ Ensure alias is correct
    }
  },
  build: {
    outDir: "../dist",             // ✅ Build dist outside client
    emptyOutDir: true,             // ✅ Clean dist before building
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
