// Manual, non-gating Phase 3 performance smoke. Kept out of `npm test` because
// the result is hardware-dependent and the 2K single-threaded encode is slow.
import { expect, test } from "vitest";
import { BrowserBasisEncoder } from "../src/web/BrowserBasisEncoder";

const SIZE = 2048;

function createDetailedRgba(): Uint8Array {
  const data = new Uint8Array(SIZE * SIZE * 4);
  let state = 0x6d2b79f5;
  for (let offset = 0; offset < data.length; offset += 4) {
    // Fixed-seed xorshift: deterministic high-detail input keeps the encoder's
    // parallel block/cluster work dominant instead of benchmarking a smooth
    // upscaled image that is mostly thread startup overhead.
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    data[offset] = state;
    data[offset + 1] = state >>> 8;
    data[offset + 2] = state >>> 16;
    data[offset + 3] = 255;
  }
  return data;
}

test("2048px ETC1S compressionLevel=2", { timeout: 120_000 }, async () => {
  expect(self.crossOriginIsolated).toBe(true);
  const input = new Uint8Array(1);
  const rgba = createDetailedRgba();
  const singleEncoder = new BrowserBasisEncoder();
  const threadedEncoder = new BrowserBasisEncoder();
  const common = {
    compressionLevel: 2,
    generateMipmap: false,
    imageDecoder: async () => ({ width: SIZE, height: SIZE, data: rgba }),
    isUASTC: false
  } as const;

  // Exclude WASM fetch/initialization and worker-pool startup from encode time.
  await singleEncoder.init({ wasmUrl: "/basis_encoder.wasm" });
  await threadedEncoder.init({ useThreads: true, wasmUrl: "/basis_encoder_threads.wasm" });

  const singleStart = performance.now();
  const single = await singleEncoder.encode(input, { ...common, wasmUrl: "/basis_encoder.wasm" });
  const singleMs = performance.now() - singleStart;

  const threadedStart = performance.now();
  const threaded = await threadedEncoder.encode(input, {
    ...common,
    useThreads: true,
    numThreads: 7,
    wasmUrl: "/basis_encoder_threads.wasm"
  });
  const threadedMs = performance.now() - threadedStart;

  console.log(
    `[threads perf] ${SIZE}x${SIZE} ETC1S CL2: single=${singleMs.toFixed(1)}ms, ` +
      `1+7 threads=${threadedMs.toFixed(1)}ms, speedup=${(singleMs / threadedMs).toFixed(2)}x, ` +
      `hardwareConcurrency=${navigator.hardwareConcurrency}`
  );
  expect(single.byteLength).toBeGreaterThan(12);
  expect(threaded.byteLength).toBeGreaterThan(12);
});
