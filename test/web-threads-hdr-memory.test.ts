// Manual, non-gating near-limit UASTC HDR memory probe for D4. The generated
// Radiance file is scanline-RLE compressed, but decodes to 11.94 Mpix.
import { expect, test } from "vitest";
import { read } from "ktx-parse";
import { BrowserBasisEncoder } from "../src/web/BrowserBasisEncoder";

const WIDTH = 3456;
const HEIGHT = 3456;

function appendRun(target: number[], value: number): void {
  let remaining = WIDTH;
  while (remaining > 0) {
    const length = Math.min(remaining, 127);
    target.push(128 + length, value);
    remaining -= length;
  }
}

function createRadianceHdr(): Uint8Array {
  const header = new TextEncoder().encode(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${HEIGHT} +X ${WIDTH}\n`);
  const pixels: number[] = [];
  for (let y = 0; y < HEIGHT; y++) {
    pixels.push(2, 2, WIDTH >>> 8, WIDTH & 0xff);
    appendRun(pixels, 64 + (y % 128));
    appendRun(pixels, 64 + ((y >>> 3) % 128));
    appendRun(pixels, 128);
    appendRun(pixels, 136);
  }
  const result = new Uint8Array(header.byteLength + pixels.length);
  result.set(header);
  result.set(pixels, header.byteLength);
  return result;
}

test("near-limit threaded UASTC HDR heap", { timeout: 300_000 }, async () => {
  expect(self.crossOriginIsolated).toBe(true);
  const encoder = new BrowserBasisEncoder();
  const module = await encoder.init({ useThreads: true, wasmUrl: "/basis_encoder_threads.wasm" });
  const started = performance.now();
  const result = await encoder.encode(createRadianceHdr(), {
    isHDR: true,
    imageType: "hdr",
    generateMipmap: false,
    useThreads: true,
    numThreads: 8,
    wasmUrl: "/basis_encoder_threads.wasm"
  });
  const heap = Reflect.get(module, "HEAP8");
  expect(heap).toBeInstanceOf(Int8Array);
  if (!(heap instanceof Int8Array)) throw new Error("threaded module did not expose HEAP8");
  const heapMiB = heap.buffer.byteLength / 1024 / 1024;
  const container = read(result);
  expect(container.pixelWidth).toBe(WIDTH);
  expect(container.pixelHeight).toBe(HEIGHT);
  console.log(
    `[threads HDR memory] ${WIDTH}x${HEIGHT}: heap=${heapMiB.toFixed(1)} MiB, ` +
      `output=${(result.byteLength / 1024 / 1024).toFixed(1)} MiB, time=${(performance.now() - started).toFixed(1)}ms`
  );
});
