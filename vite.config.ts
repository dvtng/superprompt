import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    "import.meta.vitest": "undefined",
  },

  test: {
    includeSource: ["src/**/*.{js,ts}"],
    environment: "happy-dom",
  },
});
