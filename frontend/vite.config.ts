import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Nornikel",
        short_name: "Nornikel",
        description: "Nornikel chat app",
        theme_color: "#004c97",
        icons: [
          {
            src: "/vite.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      api: path.resolve(__dirname, "./src/api"),
    },
  },
});
