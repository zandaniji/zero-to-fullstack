import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // During development, send every request that starts with /api to the
    // Express server. The browser thinks it's all one site, so no CORS issues.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
