import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/geoservice": {
        target: "http://localhost:5216",
        changeOrigin: true,
        secure: false,
      },
      "/api/translations": {
        target: "http://localhost:5035",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
