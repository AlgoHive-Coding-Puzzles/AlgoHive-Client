import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@player": path.resolve(__dirname, "./src/app/player"),
      "@admin": path.resolve(__dirname, "./src/app/admin"),
      "@shared": path.resolve(__dirname, "./src/app/shared"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@hooks": path.resolve(__dirname, "./src/lib/hooks"),
      "@contexts": path.resolve(__dirname, "./src/lib/contexts"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
