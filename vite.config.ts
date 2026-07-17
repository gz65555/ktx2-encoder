import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    server: {
      deps: {
        external: [/\/src\/basis\/basis_encoder\.js$/]
      }
    },
    browser: {
      provider: playwright(),
      instances: [{ browser: "chromium" }]
    }
  }
});
