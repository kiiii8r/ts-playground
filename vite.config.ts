import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["app/src/**/*.{test,spec}.{js,ts}"],
  },
});
