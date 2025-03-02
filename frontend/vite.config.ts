import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: ["tunedown.fr", "159.69.154.76:*"],
    cors: {
      origin: "http://tunedown.fr",
      credentials: true,
    },
    hmr: command === "serve" ? true : false,
  },
}));
