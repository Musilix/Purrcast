import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import { isProd } from "./constants";

// https://vitejs.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    hmr: {
      clientPort: 3000,
    },
    watch: {
      usePolling: true,
    },
  },
});
