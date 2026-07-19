import { expect, test, vi } from "vitest";
import { read } from "ktx-parse";
import { CubeBufferData, encodeToKTX2 } from "../src/web";
import { BrowserBasisEncoder, browserEncoder, fetchWasmBinary } from "../src/web/BrowserBasisEncoder";

test("uastc", async () => {
  const buffer = await fetch("/tests/DuckCM.png").then((res) => res.arrayBuffer());
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: true,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    wasmUrl: "/basis_encoder.wasm"
  });

  const resultBuffer = await fetch("/tests/DuckCM-uastc.ktx2").then((res) => res.arrayBuffer());
  expect(result).toEqual(new Uint8Array(resultBuffer));
  expect(result.buffer.byteLength).toBe(result.byteLength);
});

test("warns when deprecated jsUrl is provided", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  try {
    await browserEncoder.init({ jsUrl: "/custom-basis-encoder.js" });
    expect(warn).toHaveBeenCalledWith(
      "The jsUrl option is deprecated and ignored. The bundled Basis encoder module is always used."
    );
  } finally {
    warn.mockRestore();
  }
});

test("throws with the URL and status when the WASM cannot be loaded (no CDN fallback)", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 404 }));
  try {
    await expect(fetchWasmBinary("/missing.wasm")).rejects.toThrow(
      "Failed to fetch basis_encoder.wasm from /missing.wasm: 404"
    );
    // No second request: the fallback is gone.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/missing.wasm");
  } finally {
    fetchMock.mockRestore();
  }
});

test("retries module initialization after a failure", async () => {
  const encoder = new BrowserBasisEncoder();
  const fetchMock = vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Temporary network failure"));

  await expect(encoder.init({ wasmUrl: "/basis_encoder.wasm" })).rejects.toThrow("Temporary network failure");
  fetchMock.mockRestore();
  await expect(encoder.init({ wasmUrl: "/basis_encoder.wasm" })).resolves.toBeDefined();
});

test("warns and reuses the module when wasmUrl changes", async () => {
  const encoder = new BrowserBasisEncoder();
  const firstModule = await encoder.init({ wasmUrl: "/basis_encoder.wasm" });
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  try {
    const secondModule = await encoder.init({ wasmUrl: "/another-basis-encoder.wasm" });
    expect(secondModule).toBe(firstModule);
    expect(warn).toHaveBeenCalledWith(
      "[ktx2-encoder] init() is already using /basis_encoder.wasm; ignoring different wasmUrl " +
        "/another-basis-encoder.wasm. Create a new BrowserBasisEncoder instance to use another URL."
    );
  } finally {
    warn.mockRestore();
  }
});

test("kvData", async () => {
  const buffer = await fetch("/tests/DuckCM.png").then((res) => res.arrayBuffer());
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: true,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    kvData: { testKey: "testValue" },
    wasmUrl: "/basis_encoder.wasm"
  });

  expect(result.buffer.byteLength).toBe(result.byteLength);
  expect(read(result).keyValue.testKey).toEqual(new TextEncoder().encode("testValue\0"));
});

test("etc1s", async () => {
  const buffer = await fetch("/tests/DuckCM.png").then((res) => res.arrayBuffer());
  const result = await encodeToKTX2(new Uint8Array(buffer), {
    isUASTC: false,
    enableDebug: false,
    qualityLevel: 230,
    generateMipmap: true,
    wasmUrl: "/basis_encoder.wasm"
  });

  const resultBuffer = await fetch("/tests/DuckCM-etc1s.ktx2").then((res) => res.arrayBuffer());
  expect(result).toEqual(new Uint8Array(resultBuffer));
});

test("textureCube", async () => {
  await Promise.all([
    fetch("/tests/cubemap/posx.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/negx.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/posy.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/negy.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/posz.jpg").then((res) => res.arrayBuffer()),
    fetch("/tests/cubemap/negz.jpg").then((res) => res.arrayBuffer())
  ]).then(async (buffers) => {
    const cubeData: CubeBufferData = [
      new Uint8Array(buffers[0]),
      new Uint8Array(buffers[1]),
      new Uint8Array(buffers[2]),
      new Uint8Array(buffers[3]),
      new Uint8Array(buffers[4]),
      new Uint8Array(buffers[5])
    ];
    const result = await encodeToKTX2(cubeData, {
      isUASTC: false,
      enableDebug: false,
      qualityLevel: 230,
      generateMipmap: false,
      wasmUrl: "/basis_encoder.wasm"
    });
    // TODO: check the result
    expect(result).toBeDefined();
  });
});
