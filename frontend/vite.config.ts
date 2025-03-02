import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ["tunedown.fr", "159.69.154.76:*"],
    hmr: {
      host: "tunedown.fr",
      protocol: "ws",
    },
    cors: {
      origin: "http://tunedown.fr:8000",
      credentials: true,
    },
  },
});
