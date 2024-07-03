/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "example", "index.html"),
        preview: resolve(__dirname, "example", "preview.html")
      }
    }
  },
  test: {
    deps: {
      interopDefault: true,
      optimizer: {
        web: { include: ["./src/node/basis/basis_encoder.cjs"] }
      }
    },
    server: {
      deps: {
        fallbackCJS: true
      }
    }
  }
});
