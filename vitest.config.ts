import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "dist", "demo"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      exclude: [
        "node_modules/",
        "dist/",
        "tests/",
        "demo/",
        "scripts/",
        "**/*.d.ts",
        "**/*.config.*"
      ]
    },
    globals: true
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
