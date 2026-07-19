// Phase 2 (WASM_UPDATE_PLAN §5.4/§6.3/§6.5): verify encodeWithModule's
// generation-gated behavior — HDR nit-multiplier arg, source-setter return
// checks, and the v2.5 source-texel ceiling — against BOTH WASM generations,
// using a mock module so both paths are covered in isolation, including the
// legacy branch the shipped v2.5 WASM never takes.
import { describe, expect, test, vi } from "vitest";
import { encodeWithModule } from "../src/encodeCore";
import type { IBasisModule } from "../src/type";

const ALWAYS_METHODS = [
  "setDebug",
  "setUASTC",
  "setCreateKTX2File",
  "setMipGen",
  "setYFlip",
  "setQualityLevel",
  "setKTX2UASTCSupercompression",
  "setRDOUASTC",
  "setRDOUASTCQualityScalar",
  "setPackUASTCFlags",
  "setHDR",
  "setUASTCHDRQualityLevel",
  "setPerceptual",
  "setTexType",
  "setKTX2SRGBTransferFunc",
  "setNormalMap",
  "setCompressionLevel"
];

const noop = () => vi.fn<(...args: unknown[]) => void>();

interface MockOpts {
  v25: boolean;
  sourceReturn?: boolean; // what setSliceSourceImage(HDR) returns
  encodeBytes?: number; // what encode() returns
  hasControlThreading?: boolean; // whether the encoder exposes controlThreading (default true)
}

function mockModule({ v25, sourceReturn, encodeBytes = 8, hasControlThreading = true }: MockOpts) {
  const hdrCalls: unknown[][] = [];
  const ldrCalls: unknown[][] = [];
  const threadCalls: unknown[][] = [];

  class BasisEncoder {
    setSliceSourceImage(...args: unknown[]) {
      ldrCalls.push(args);
      return sourceReturn;
    }
    setSliceSourceImageHDR(...args: unknown[]) {
      hdrCalls.push(args);
      return sourceReturn;
    }
    encode(out: Uint8Array) {
      for (let i = 0; i < encodeBytes; i++) out[i] = i + 1;
      return encodeBytes;
    }
    delete() {}
  }
  // controlThreading exists on BOTH real builds; omit only to exercise the
  // typeof guard for a hypothetical older custom wasm.
  if (hasControlThreading) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- prototype patched for the mock
    (BasisEncoder.prototype as unknown as Record<string, unknown>).controlThreading = (...args: unknown[]) =>
      void threadCalls.push(args);
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- prototype patched for the mock
  const proto = BasisEncoder.prototype as unknown as Record<string, unknown>;
  for (const name of ALWAYS_METHODS) proto[name] = noop();
  if (v25) {
    // v2.5 sentinel + renamed setters used by applyInputOptions.
    proto.setETC1SCompressionLevel = noop();
    proto.setNormalMapPreset = noop();
    proto.setKTX2AndBasisSRGBTransferFunc = noop();
  }

  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- deliberate module mock
  const module = { BasisEncoder, initializeBasis: noop() } as unknown as IBasisModule;
  return { module, hdrCalls, ldrCalls, threadCalls };
}

function decoderFor(width: number, height: number) {
  return async () => ({ width, height, data: new Uint8Array(width * height * 4) });
}

describe("HDR nit-multiplier arg is generation-gated", () => {
  test("v2.5 passes 7 args (with nit multiplier 100)", async () => {
    const { module, hdrCalls } = mockModule({ v25: true });
    await encodeWithModule(module, new Uint8Array(4), { isHDR: true, imageType: "hdr" });
    expect(hdrCalls).toHaveLength(1);
    expect(hdrCalls[0]).toHaveLength(7);
    expect(hdrCalls[0][6]).toBe(100);
  });

  test("legacy passes 6 args (no nit multiplier)", async () => {
    const { module, hdrCalls } = mockModule({ v25: false });
    await encodeWithModule(module, new Uint8Array(4), { isHDR: true, imageType: "hdr" });
    expect(hdrCalls[0]).toHaveLength(6);
  });
});

describe("source-setter return check", () => {
  test("throws when the setter returns false (v2.5)", async () => {
    const { module } = mockModule({ v25: true, sourceReturn: false });
    await expect(encodeWithModule(module, new Uint8Array(4), { imageDecoder: decoderFor(8, 8) })).rejects.toThrow(
      /setSliceSourceImage failed/
    );
  });

  test("legacy void return is not treated as failure", async () => {
    const { module } = mockModule({ v25: false, sourceReturn: undefined });
    const out = await encodeWithModule(module, new Uint8Array(4), { imageDecoder: decoderFor(8, 8) });
    expect(out.byteLength).toBe(8);
  });
});

describe("v2.5 source-texel ceiling", () => {
  test("rejects > 12 Mpix on v2.5 before encoding", async () => {
    const { module } = mockModule({ v25: true, sourceReturn: true });
    // 4096x4096 = 16.78 Mpix > 12 Mpix.
    await expect(encodeWithModule(module, new Uint8Array(4), { imageDecoder: decoderFor(4096, 4096) })).rejects.toThrow(
      /exceed the encoder limit/
    );
  });

  test("legacy does not enforce the ceiling", async () => {
    const { module } = mockModule({ v25: false, sourceReturn: undefined });
    const out = await encodeWithModule(module, new Uint8Array(4), { imageDecoder: decoderFor(4096, 4096) });
    expect(out.byteLength).toBe(8);
  });

  test("v2.5 allows inputs within the ceiling", async () => {
    const { module } = mockModule({ v25: true, sourceReturn: true });
    const out = await encodeWithModule(module, new Uint8Array(4), { imageDecoder: decoderFor(2048, 2048) });
    expect(out.byteLength).toBe(8);
  });
});

describe("threaded compression (controlThreading enablement)", () => {
  test("not called without useThreads", async () => {
    const { module, threadCalls } = mockModule({ v25: true, sourceReturn: true });
    await encodeWithModule(module, new Uint8Array(4), { imageDecoder: decoderFor(64, 64) });
    expect(threadCalls).toHaveLength(0);
  });

  test("called with the requested extra-thread count when useThreads", async () => {
    const { module, threadCalls } = mockModule({ v25: true, sourceReturn: true });
    await encodeWithModule(module, new Uint8Array(4), {
      imageDecoder: decoderFor(64, 64),
      useThreads: true,
      numThreads: 4
    });
    expect(threadCalls).toEqual([[true, 4]]);
  });

  test("numThreads is clamped to the pool size (8)", async () => {
    const { module, threadCalls } = mockModule({ v25: true, sourceReturn: true });
    await encodeWithModule(module, new Uint8Array(4), {
      imageDecoder: decoderFor(64, 64),
      useThreads: true,
      numThreads: 100
    });
    expect(threadCalls).toEqual([[true, 8]]);
  });

  test("numThreads 0 disables threading (not called)", async () => {
    const { module, threadCalls } = mockModule({ v25: true, sourceReturn: true });
    await encodeWithModule(module, new Uint8Array(4), {
      imageDecoder: decoderFor(64, 64),
      useThreads: true,
      numThreads: 0
    });
    expect(threadCalls).toHaveLength(0);
  });

  test("no-op and no throw when the encoder lacks controlThreading (older custom wasm)", async () => {
    const { module } = mockModule({ v25: true, sourceReturn: true, hasControlThreading: false });
    const out = await encodeWithModule(module, new Uint8Array(4), {
      imageDecoder: decoderFor(64, 64),
      useThreads: true,
      numThreads: 4
    });
    expect(out.byteLength).toBe(8);
  });
});
