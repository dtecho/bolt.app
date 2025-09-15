import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./app/test-setup.ts"],
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "app/test-setup.ts",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "**/coverage/**",
        "**/dist/**",
        "**/build/**",
      ],
    },
    include: ["app/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: [
      "node_modules",
      "dist",
      ".idea",
      ".git",
      ".cache",
      "build",
    ],
  },
});