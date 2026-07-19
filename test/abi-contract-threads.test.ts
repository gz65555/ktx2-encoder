import { describe, expect, test } from "vitest";
import { BrowserBasisEncoder } from "../src/web/BrowserBasisEncoder";
import { expectEncoderSurface, expectModuleSurface } from "./abi-contract";

describe("browser WASM variant ABI", () => {
  test("environment supports WASM threads", () => {
    expect(self.crossOriginIsolated).toBe(true);
    expect(typeof SharedArrayBuffer).toBe("function");
  });

  test.each([
    ["single-threaded", false, "/basis_encoder.wasm"],
    ["multithreaded", true, "/basis_encoder_threads.wasm"]
  ] as const)("%s module has the expected surface", async (_name, useThreads, wasmUrl) => {
    const module = await new BrowserBasisEncoder().init({ useThreads, wasmUrl });
    expectModuleSurface(module);
    expectEncoderSurface(module);
  });
});
