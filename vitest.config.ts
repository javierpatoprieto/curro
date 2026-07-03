import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Tests de lógica de negocio (parsers, máquina de estados, activación Stripe).
    // No necesitamos jsdom: probamos funciones puras del servidor.
    environment: "node",
    include: [
      "tests/**/*.test.ts",
      "lib/**/*.test.ts",
      "app/**/*.test.ts",
    ],
    globals: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
