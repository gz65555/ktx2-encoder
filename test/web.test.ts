import { expect, test, vi } from "vitest";
import { read } from "ktx-parse";
import { CubeBufferData, encodeToKTX2 } from "../src/web";
import { browserEncoder, fetchWasmBinary } from "../src/web/BrowserBasisEncoder";

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

test("falls back to the CDN when the bundled WASM cannot be loaded", async () => {
  const fetchMock = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response(null, { status: 404 }))
    .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3])));
  const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
  const fallbackUrl = "https://mdn.alipayobjects.com/rms/afts/file/A*r7D4SKbksYcAAAAAAAAAAAAAARQnAQ/basis_encoder.wasm";
  try {
    expect(new Uint8Array(await fetchWasmBinary("/bundled.wasm", fallbackUrl))).toEqual(new Uint8Array([1, 2, 3]));
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/bundled.wasm");
    expect(fetchMock).toHaveBeenNthCalledWith(2, fallbackUrl);
  } finally {
    fetchMock.mockRestore();
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
    kvData: { testKey: "testValue" }
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
    generateMipmap: true
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
      generateMipmap: false
    });
    // TODO: check the result
    expect(result).toBeDefined();
  });
});
