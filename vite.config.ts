import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 5173,
    host: true,
    fs: {
      // Allow serving files from project root
      allow: [".."],
    },
  },
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "@codemirror/lang-javascript",
      "@codemirror/lang-typescript",
      "@codemirror/lang-css",
      "@codemirror/lang-html",
      "@codemirror/lang-json",
    ],
  },
  define: {
    // Enable WebContainer API in development
    __WEBCONTAINER_API__: JSON.stringify(process.env.NODE_ENV === "development"),
  },
});