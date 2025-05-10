import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
// import path from "node:path";

export default defineConfig({
  // resolve: {
  //   alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  // },
  test: {
    exclude: [...configDefaults.exclude],
  },
});
