import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Browser test config for the multithreaded encoder. Serves the test page with
// COOP/COEP so it is cross-origin isolated (crossOriginIsolated === true), which
// is what enables SharedArrayBuffer / wasm threads. Kept separate from the main
// config so these headers don't affect the other browser suites.
export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  },
  test: {
    server: {
      deps: {
        external: [/\/src\/basis\/basis_encoder\.js$/, /\/src\/basis-threads\/basis_encoder_threads\.js$/]
      }
    },
    browser: {
      provider: playwright(),
      instances: [{ browser: "chromium" }]
    }
  }
});
