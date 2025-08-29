import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      bin: "src/bin.ts",
      deploy: "src/deploy.ts",
      config: "src/config.ts",
      setup: "src/setup.ts",
      templates: "src/templates.ts",
      aws: "src/aws.ts",
      printers: "src/printers.ts",
      exec: "src/exec.ts",
      utils: "src/utils.ts",
      "domain-switch": "src/domain-switch.ts",
      "env-files": "src/env-files.ts",
    },
    format: ["esm"],
    outDir: "dist/esm",
    target: "node20",
    sourcemap: true,
    dts: true,
    clean: true,
    treeshake: true,
    minify: false,
  },
  {
    entry: {
      deploy: "src/deploy.ts",
      config: "src/config.ts",
      setup: "src/setup.ts",
    },
    format: ["cjs"],
    outDir: "dist/cjs",
    target: "node20",
    sourcemap: true,
    dts: false,
    clean: false,
    treeshake: true,
    minify: false,
  },
]);
