import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "私記 - 離線相機記帳",
        short_name: "私記",
        description: "極簡、離線、隱私為本的相機記帳 PWA",
        theme_color: "#121212",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/PS.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/PS.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  server: {
    host: true,
  },
});
