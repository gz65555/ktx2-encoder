// Multithreaded-encoder browser test. Runs under vite.threads.config.ts, which
// serves the page cross-origin isolated so wasm threads are available. Verifies
// the threaded build actually loads, spawns workers, and produces a valid KTX2
// whose quality matches the single-threaded encoder (bytes are NOT asserted
// equal — thread scheduling can reorder work). See WASM_THREADS_PLAN §3b.
import { expect, test } from "vitest";
import { read } from "ktx-parse";
import { BrowserBasisEncoder } from "../src/web/BrowserBasisEncoder";
import { decodeImageBitmap } from "../src/web/decodeImageData";
import { decodeToImageData, mssim } from "./browser-quality";

const OPTIONS = { qualityLevel: 230, generateMipmap: true, imageDecoder: decodeImageBitmap } as const;

test("the test page is cross-origin isolated", () => {
  expect(self.crossOriginIsolated).toBe(true);
  expect(typeof SharedArrayBuffer).toBe("function");
});

test.each([
  ["ETC1S", false, 0.99],
  ["UASTC", true, 0.995]
] as const)("threaded %s encode produces a valid KTX2 at matching quality", async (_format, isUASTC, threshold) => {
  const buffer = new Uint8Array(await fetch("/tests/DuckCM.png").then((res) => res.arrayBuffer()));

  const single = await new BrowserBasisEncoder().encode(buffer, {
    ...OPTIONS,
    isUASTC,
    wasmUrl: "/basis_encoder.wasm"
  });
  const threaded = await new BrowserBasisEncoder().encode(buffer, {
    ...OPTIONS,
    isUASTC,
    useThreads: true,
    numThreads: 4,
    threadsWasmUrl: "/basis_encoder_threads.wasm"
  });

  // Both decode as KTX2 with matching top-level dimensions and level count.
  const a = read(single);
  const b = read(threaded);
  expect(b.pixelWidth).toBe(a.pixelWidth);
  expect(b.pixelHeight).toBe(a.pixelHeight);
  expect(b.levels.length).toBe(a.levels.length);
  expect(threaded.byteLength).toBeGreaterThan(12);

  // Thread scheduling may alter the encoded bytes, so compare independently
  // transcoded pixels instead of requiring byte-for-byte identity.
  const [singlePixels, threadedPixels] = await Promise.all([decodeToImageData(single), decodeToImageData(threaded)]);
  const score = mssim(singlePixels, threadedPixels);
  console.log(`[threads] ${_format} single/threaded SSIM=${score}`);
  expect(score).toBeGreaterThan(threshold);
});

test("one BrowserBasisEncoder caches the two variants independently", async () => {
  const encoder = new BrowserBasisEncoder();
  const single = await encoder.init({ wasmUrl: "/basis_encoder.wasm" });
  const threaded = await encoder.init({ useThreads: true, threadsWasmUrl: "/basis_encoder_threads.wasm" });

  expect(threaded).not.toBe(single);
  await expect(encoder.init({ wasmUrl: "/basis_encoder.wasm" })).resolves.toBe(single);
  await expect(encoder.init({ useThreads: true, threadsWasmUrl: "/basis_encoder_threads.wasm" })).resolves.toBe(
    threaded
  );
});

test("threaded module is shared across encoder instances (one worker pool per URL)", async () => {
  // The threaded module pre-spawns a worker pool, so separate encoders must
  // reuse one module per URL rather than each spawning their own pool.
  const first = await new BrowserBasisEncoder().init({
    useThreads: true,
    threadsWasmUrl: "/basis_encoder_threads.wasm"
  });
  const second = await new BrowserBasisEncoder().init({
    useThreads: true,
    threadsWasmUrl: "/basis_encoder_threads.wasm"
  });
  expect(second).toBe(first);
});

test("threaded UASTC HDR encode produces a valid mipmapped KTX2", { timeout: 120_000 }, async () => {
  const hdr = new Uint8Array(await fetch("/tests/pretoria_gardens_1k.hdr").then((response) => response.arrayBuffer()));
  const result = await new BrowserBasisEncoder().encode(hdr, {
    isHDR: true,
    imageType: "hdr",
    generateMipmap: true,
    useThreads: true,
    numThreads: 4,
    threadsWasmUrl: "/basis_encoder_threads.wasm"
  });

  const container = read(result);
  expect(container.pixelWidth).toBe(1024);
  expect(container.pixelHeight).toBe(512);
  expect(container.levels.length).toBeGreaterThan(1);
});
